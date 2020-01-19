+++
title = "Spark SQL Read/Write HBase"
date = "2020-01-01T20:50:46+02:00"
tags = ["spark"]
categories = ["digest"]
banner = "/img/banners/spark_logo.jpg"
+++
---
Apache Spark and Apache HBase are very commonly used big data frameworks. In many senarios, we need to use Spark to query and analyze the big volumn of data in HBase. Spark has wider support to read data as dataset from many kinds of data source. To read from HBase, Spark provides TableInputFormat, which as following disadvantages.

* There is only on scan triggerred in each task to read from HBase
* TableInputFormat does not support BulkGet
* Cannot leverage the optimization from Spark SQL catalyst

Considering the above points above, there is another choice by using Hortonworks/Cloudera [Apache Spark—Apache HBase Connector](https://github.com/hortonworks-spark/shc) short for (SHC). By using SHC, we can use Spark SQL directly load dataframe data into HBase or query data from HBase. When querying HBase, it leverages the Spark Catalyst for query optimization, such as partition pruning, column pruning, predicate pushdown, data locality, and so on. As a result, the performance using Spark to query HBase has great improvment.
 
Note：SHC also supports writing DataFrame into HBase. However, there is no much performance improvment, so we do not focus on this part. 

### How SHC Improve the Query Performance

SHC mainly uses following ways for performance tuning to narrow down the HBase scanning scops.

#### 1. Convert Rowkey based search to get
As we all know that search using **scan** in HBase is very efficient. If the search condition is RowKey based，we should able to change it using **get**.

For example, with predefined HBase catalog as follows.
```
val catalog = s"""{
  |"table":{"namespace":"default", "name":"iteblog", "tableCoder":"PrimitiveType"},
  |"rowkey":"key",
  |"columns":{
    |"col0":{"cf":"rowkey", "col":"id", "type":"int"},
    |"col1":{"cf":"cf1", "col":"col1", "type":"boolean"},
    |"col2":{"cf":"cf2", "col":"col2", "type":"double"},
    |"col3":{"cf":"cf3", "col":"col3", "type":"float"},
    |"col4":{"cf":"cf4", "col":"col4", "type":"int"},
    |"col5":{"cf":"cf5", "col":"col5", "type":"bigint"},
    |"col6":{"cf":"cf6", "col":"col6", "type":"smallint"},
    |"col7":{"cf":"cf7", "col":"col7", "type":"string"},
    |"col8":{"cf":"cf8", "col":"col8", "type":"tinyint"}
  |}
|}""".stripMargin
```
If we have flollowing search,
```
val df = withCatalog(catalog)
df.createOrReplaceTempView("iteblog_table")
sqlContext.sql("select * from iteblog_table where id = 1")
sqlContext.sql("select * from iteblog_table where id = 1 or id = 2")
sqlContext.sql("select * from iteblog_table where id in (1, 2)")
```
Because the search condition is aginst the RowKey, we can change it using **get** or **BulkGet**. The 1st SQL query is working as follows.
![alt text](https://s.iteblog.com/pic/hbase/shc_get-iteblog.png)
The 2nd and 3rd query are equal. It will convert ```key in (x1, x2, x3..)``` to ```(key == x1) or (key == x2) or ...``` as follows.
![](https://s.iteblog.com/pic/hbase/shc_bulkget-iteblog.png)

if the query has both filtering on RowKey and other columns (see below example), 
```
sqlContext.sql("select id, col6, col8 from iteblog_table where id = 1 and col7 = 'xxx'")
```
it will convert to the following search.
```
val filter = new SingleColumnValueFilter(
              Bytes.toBytes("cf7"), Bytes.toBytes("col7 ")
              CompareOp.EQUAL,
             Bytes.toBytes("xxx"))
 
val g = new Get(Bytes.toBytes(1))
g.addColumn(Bytes.toBytes("cf6"), Bytes.toBytes("col6"))
g.addColumn(Bytes.toBytes("cf8"), Bytes.toBytes("col8"))
g.setFilter(filter)
```
If we have multiple and conditions, it all use**SingleColumnValueFilter** for filtering.
If we have following search/query,
```
sqlContext.sql("select id, col6, col8 from iteblog_table where id = 1 or col7 = 'xxx'")
```
How SHC optimize it? Actually, when filtering on non RowKey, the whole table scan has to be performed. The above query in HSC will get all data from HBase and transfer data to Spark, then filter in Spark. In this case, the performance is limited. Same logic applies to the following query as well.
```
sqlContext.sql("select id, col6, col8 from iteblog_table where id = 1 or col7 <= 'xxx'")
sqlContext.sql("select id, col6, col8 from iteblog_table where id = 1 or col7 >= 'xxx'")
sqlContext.sql("select id, col6, col8 from iteblog_table where col7 = 'xxx'")
```
Obviously, querying in this way is not very effecient. A better way is to push computing to HBase layer using ```SingleColumnValueFilter``` to filter as much as possible before moving data to Spark. In this case, we do not have to transfer lots of data from HBase to Spark.

#### 2. Composition RowKey Optimization
SHC also supports Composition  还支持组合 RowKey 的方式来建表，具体如下：
```
def cat =
  s"""{
     |"table":{"namespace":"default", "name":"iteblog", "tableCoder":"PrimitiveType"},
     |"rowkey":"key1:key2",
     |"columns":{
     |"col00":{"cf":"rowkey", "col":"key1", "type":"string", "length":"6"},
     |"col01":{"cf":"rowkey", "col":"key2", "type":"int"},
     |"col1":{"cf":"cf1", "col":"col1", "type":"boolean"},
     |"col2":{"cf":"cf2", "col":"col2", "type":"double"},
     |"col3":{"cf":"cf3", "col":"col3", "type":"float"},
     |"col4":{"cf":"cf4", "col":"col4", "type":"int"},
     |"col5":{"cf":"cf5", "col":"col5", "type":"bigint"},
     |"col6":{"cf":"cf6", "col":"col6", "type":"smallint"},
     |"col7":{"cf":"cf7", "col":"col7", "type":"string"},
     |"col8":{"cf":"cf8", "col":"col8", "type":"tinyint"}
     |}
     |}""".stripMargin
```

In above example, col00 and col01 combined as rowkey，and col00 at first，col01 at last. For example, col00 ='row002'，col01 = 2，then the composite rowkey is row002\x00\x00\x00\x02。Then when searching Rowkey, how SHC to do optimization? For example, we have following search.

```
df.sqlContext.sql("select col00, col01, col1 from iteblog where col00 = 'row000' and col01 = 0").show()
```

Based on the information above，RowKey is composited with col00 and col01. Then，the above search can concat col00 and col01 to form a RowKey，then convert the search to a **get**. However, SHC converts the above search to a **scan** and **get**. The **scan**'s startRow is row000 and endRow is row000\xff\xff\xff\xff；**get**'s rowkey is row000\xff\xff\xff\xff，then return all data matched the search conditions. In the end, filter in Spark to get the final result. Since SHC is still in development, the solution described above may change.

In SHC, the two query below has the same logic when pushing down to the HBase.
```
df.sqlContext.sql("select col00, col01, col1 from iteblog where col00 = 'row000'").show()
df.sqlContext.sql("select col00, col01, col1 from iteblog where col00 = 'row000' and col01 = 0").show()
```
The only difference is the filtering in Spark. 

#### 2. Scan Optimization
If we have search conditions, such as < or > as follows：
```
df.sqlContext.sql("select col00, col01, col1 from iteblog where col00 > 'row000' and col00 < 'row005'").show()
```
In SHC, this is converted to a **get** and a **scan**. The get's Rowkey is row0005\xff\xff\xff\xff；scan's startRow is row000，endRow is row005\xff\xff\xff\xff，then retun to Spark for fitering.

In summary, SHC can improve the query performance and aviod full table scan. For now this project is merging with [HBase's connectors project](https://github.com/apache/hbase-connectors/) for better improvement.

## Reference
https://www.iteblog.com/archives/2522.html





