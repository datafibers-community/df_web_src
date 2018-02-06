---
layout: post
title: Hadoop Split and Block
category: Blog
tag: hadoop
---
There are two confusing concepts in Hadoop, block and split
####Block - A Physical Division
HDFS was designed to hold and manage large amounts of data; a default block size is 64 MB. That means if a 128-MB text file was put in to HDFS, HDFS would divide the file into two blocks (128 MB/64 MB) and distribute the two chunks to the data nodes in the cluster. The main reason to setting proper block size is to balance the load of each map and reduce throughput so that the overall job takes better time to finish. Because the block size is the boundary of number of blocks, so it is a very important setting. The best way to decide the proper size is to understand your data profile (average size, etc) of your business.

To set up the block size, you need to modify/override setting in hdfs-site.xml:

    <property>
        <name>dfs.block.size<name>
        <value>134217728<value>
        <description>Block size<description>
    <property>
__Note__, changing this setting will not affect the block size of any files currently in HDFS. It will only affect the block size of files placed into HDFS after this setting has taken effect. That means you need to reload the data or put new data using "hadoop fs -put" to make setting effective on the data.

By default every block has 3 replications across nodes. It is set by `dfs.replication` in in hdfs-site.xml
<br>
####Split - A Logical Division
When Hadoop submits jobs, it splits the input data logically and process by each Mapper. Split is only a reference. Split has details in `org.apache.hadoop.mapreduce.InputSplit`and rules (how to split) decided by `getSplits()` in class `org.apache.hadoop.mapreduce.Input.FileInputFormat`. By default, the `size of split = block size = 64M`.

For FileInputFormat, TextInputFormat, they read data by lines. Then, one line could be across two split. To aviod mistakes of mapper parcing splits, the reader will read one extra line across split boundary (in next() method). Of couse, reader will skip the first line when continue reading next to aviod dupliate reading. Here is a [reference for more details](http://my.oschina.net/xiangchen/blog/99653).
<br>
####Split - Compare and Summary
Below is summary between split and block

* One split must contain n times of blocks where n is integer and > 0
* A split will not contain blocks from two files or split will not cross file boundaries
* One split is mapping to multiple blocks
* The number of working map tasks (Mapper) are equal to the number of splits

By the way, if something is not split-able, we can consider warrap them into Avro or Sequencefile for instead

<a href="http://i.imgur.com/OuU4CYW.png" target="_blank"><img src="http://i.imgur.com/OuU4CYW.png" width="700" height="330" /></a>
