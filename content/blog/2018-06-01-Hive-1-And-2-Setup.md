+++
title = "Run Hive 1 and 2 Together"
date = "2018-06-01T13:50:46+02:00"
tags = ["hive"]
categories = ["article"]
banner = "/img/banners/spark.jpg"
+++
<p align="left"><img src="/img/banners/maxmin.jpg" width="400"></p>

Most of time, we need to generate a unique identifier column for dataframe. There are couple of ways doing that as follows.

https://stackoverflow.com/questions/35705038/how-do-i-add-an-persistent-column-of-row-ids-to-spark-dataframe

## Solution 1

The most frequent way of doing it is to to firstly find the MAX of age in each SEX group and do SELF JOIN by matching SEX and the MAX age as follows. This will create two stages of jobs and **NOT** efficient.

```
> SELECT employee.sex_age.sex, employee.sex_age.age, name 
> FROM
> employee JOIN 
> (
> SELECT 
> max(sex_age.age) as max_age, sex_age.sex as sex  
> FROM employee
> GROUP BY sex_age.sex
> ) maxage
> ON employee.sex_age.age = maxage.max_age
> AND employee.sex_age.sex = maxage.sex;
+--------------+------+-------+
| sex_age.sex  | age  | name  |
+--------------+------+-------+
| Female       | 57   | Lucy  |
| Male         | 35   | Will  |
+--------------+------+-------+
2 rows selected (94.043 seconds)
```

Option 1 => Using MontotonicallyIncreasingID or ZipWithUniqueId methods

Create a Dataframe from a parallel collection
Apply a spark dataframe method to generate Unique Ids Monotonically Increasing
import org.apache.spark.sql.functions._ 
val df = sc.parallelize(Seq(("Databricks", 20000), ("Spark", 100000), ("Hadoop", 3000))).toDF("word", "count") 
df.withColumn("uniqueID",monotonicallyIncreasingId).show()
Screen Shot 2016-05-23 at 4.13.37 PM

import org.apache.spark.sql.types.{StructType, StructField, LongType}
val df = sc.parallelize(Seq(("Databricks", 20000), ("Spark", 100000), ("Hadoop", 3000))).toDF("word", "count")
val wcschema = df.schema
val inputRows = df.rdd.zipWithUniqueId.map{
   case (r: Row, id: Long) => Row.fromSeq(id +: r.toSeq)}
val wcID = sqlContext.createDataFrame(inputRows, StructType(StructField("id", LongType, false) +: wcschema.fields))
Screen Shot 2016-05-23 at 4.13.46 PM

Option 2 => Use Row_Number Function

With PartitionBy Column:

val df = sc.parallelize(Seq(("Databricks", 20000), ("Spark", 100000), ("Hadoop", 3000))).toDF("word", "count")
df.createOrReplaceTempView("wordcount")
val tmpTable = sqlContext.sql("select row_number() over (partition by word order by count) as rnk,word,count from wordcount")
tmpTable.show()
Screen Shot 2016-05-23 at 8.12.15 PM

Without PartitionBy Column:

val tmpTable1 = sqlContext.sql("select row_number() over (order by count) as rnk,word,count from wordcount")
tmpTable1.show()
Screen Shot 2016-05-23 at 8.13.09 PM
