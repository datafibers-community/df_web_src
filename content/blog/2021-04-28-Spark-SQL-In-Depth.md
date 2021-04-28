+++
title = "Spark SQL in Depth"
date = "2021-04-28T20:50:46+02:00"
tags = ["spark"]
categories = ["digest"]
banner = "/img/banners/spark_sql_title.png"
+++
---
In this article, we'll look at how Spark SQL working on data queries in depth.

## Checking Execution Plan
### Data Preparing
```
create database if not exists test;

create table if not exists test.t_name (name string);

insert into test.t_name values ('test1'),('test2'),('test3');
```
### Test Code Preparing
Below Scala code is used with testing with blocking at the standard input at the end. In this case, we can see more details from Spark WebUI.
```
    def main(args: Array[String]): Unit = {
        val conf = new SparkConf
        conf.set("spark.hive.enable", "true")
        conf.set("spark.sql.hive.metastore.version","2.3")
        conf.set("spark.sql.hive.metastore.jars","path")
        conf.set("spark.sql.ui.explainMode", "extended") //Show all execution plan

        val spark = SparkSession.builder().config(conf).master("local[1]").enableHiveSupport().getOrCreate()

        spark.sparkContext.setLogLevel("INFO")

        val sql = "select * from test.t_name"

        val df = spark.sql(sql)

        df.show()

        System.in.read()
    }
```
### Analyze Execution Plan
There are four phases for analyzing and excuting the Spark SQL.

1. Parse Logical Plan
1. Analyz Logical Plan
1. Optimize Logical Plan

#### Check Parsed Logical Plan
```
== Parsed Logical Plan ==
GlobalLimit 21
+- LocalLimit 21
   +- Project [cast(name#0 as string) AS name#3]
      +- Project [name#0]
         +- SubqueryAlias spark_catalog.test.t_name
            +- HiveTableRelation [`test`.`t_name`, org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe, Data Cols: [name#0], Partition Cols: []]
```            
The above parsed logical plan includes following information：

* The database name, table name, column name, partition info (we do not have partition defined in this example), and SerDe.
* The alias, spark_catalog.test.t_name
* Query/Scan the column, name#0
* Convert name#0 as String and gives alias name#3
* Add default clause "GlobalLimit 21" by Spark show as default

#### Check Analyzed Logical Plan
```
== Analyzed Logical Plan ==
name: string
GlobalLimit 21
+- LocalLimit 21
   +- Project [cast(name#0 as string) AS name#3]
      +- Project [name#0]
         +- SubqueryAlias spark_catalog.test.t_name
            +- HiveTableRelation [`test`.`t_name`, org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe, Data Cols: [name#0], Partition Cols: []]
```            
In the phase of analyzing logic plan, the only difference is to add a data type for the column name. In the parse sql phase, Spark SQL does not know the data type.

#### Optimized Logical Plan
```
== Optimized Logical Plan ==
GlobalLimit 21
+- LocalLimit 21
   +- HiveTableRelation [`test`.`t_name`, org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe, Data Cols: [name#0], Partition Cols: []]
```   
During the phase of optimized logical plan, the analyzed logical plan is further optimized. As result, there is no type conversion and projection needed for this example. However, the limitation of the rows returned is kept.


#### Physical Plan
```
== Physical Plan ==
CollectLimit 21
+- Scan hive test.t_name [name#0], HiveTableRelation [`test`.`t_name`, org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe, Data Cols: [name#0], Partition Cols: []]
```
Physical Plan is what is actually running in cluster.
<p align="center"><img src="/img/banners/spark_sql_pic01.png" width="400"></p>

## Checking Execution Log
