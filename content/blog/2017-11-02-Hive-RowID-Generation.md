+++
title = "Hive RowID Generation"
date = "2017-11-01T13:50:46+02:00"
tags = ["hive"]
categories = ["article"]
banner = "/img/banners/big-data-hive.jpg"
+++

![](/img/banners/big-data-hive.jpg)

## Introduction

It is quite often that we need a unique identifier for each single rows in the Apache Hive tables. This is quite useful when you need such columns as surrogate keys in data warehouse, as the primary key for data or use as system nature keys. There are following ways of doing that in Hive.

### ROW_NUMBER()

Hive have a couple of internal functions to achieve this. ROW_NUMBER function, which can generate row number for each partition of data. Although there is no documentation in the official wiki, you can easily find articles regarding use this function to generate row number for the whole table.
```
SELECT ROW_NUMBER() OVER () as row_num FROM table_name
```

However, it is reported in some version of Hive that the function has exceptions when used in views or weird behavior, see here and there. Therefore, it is a quite danger to use this approach right now since your result is unexpected across different version of Hive.

### Java Package

Hive is capable of leveraging Java internal packages naturally. By using Java’s UUID, you can directly generate a UUID number for each row as follows.
```
SELECT regexp_replace(reflect('java.util.UUID','randomUUID'), '-', '') as row_num FROM table_name
```
As UUID generation logic defines, there are chance of collision. However, it is very low chance.

### Hive Mall Ex

Hivemall is a scalable machine learning library that runs on Apache Hive. It has provided a UDF called [RowIdUDF](https://github.com/apache/incubator-hivemall/blob/master/core/src/main/java/hivemall/tools/mapred/RowIdUDF.java). It combines a MapReduce task ID and random number as row.
```
SELECT rowid() as row_num FROM table_name
```

### Hive Virtual Columns

Hive has provided three [virtual columns](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+VirtualColumns) as follows.
```
* INPUT__FILE__NAME: Full URI of a file name in HDFS.
* BLOCK__OFFSET__INSIDE__FILE: Byte offset for the block from beginning of the file.
* ROW__OFFSET__INSIDE__BLOCK: Byte offset for the line within the block.
```
We can always combine three above virtual columns to identify the each line in the table. In addition, we can control the length of this combined value by increasing the number of files (increasing the number of reducers). As result, the offset value becomes smaller for each block. The usage of this approach is as follows. Note, **ROW_OFFSET_INSIDE_BLOCK** is only available for RCFile or SequenceFile format of data.

```
// To enable ROW__OFFSET__INSIDE__BLOCK
SET hive.exec.rowoffset=true; 

SELECT 
// Convert file name as number, such as 000001_0 to 10
concat(cast(regexp_replace(reverse(split(reverse(INPUT__FILE__NAME),'/')[0]),'_','') as int), 
BLOCK__OFFSET__INSIDE__FILE, 
ROW__OFFSET__INSIDE__BLOCK) as row_num
FROM table_name
```

## Conclusion

Before Hive ROW_NUMBER() function issue gets fixed, it is recommended to use either Hivemall rowid() or virtual columns. If you need to control the length of row id, you have to use Hive virtual columns approach.