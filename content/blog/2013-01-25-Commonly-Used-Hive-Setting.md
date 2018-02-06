---
layout: post
uri: /posts/112
permalink: /posts/112/index.html
title: Commonly Used Hive Setting
category: Blog
tag: hive
description: 
disqus: true 
lang: en
---
![](http://www.h-online.com/imgs/43/5/9/1/1/7/7/hive_logo200-16422e15407f1988.png)

I just list very commonly used ones.

Set dynamic partition (a column name)

    SET hive.exec.dynamic.partition=true;

Affect insert rows to save in sampled format

    SET hive.enforce.bucketing = true;

Reduce output compression

    SET hive.exec.compress.output=true;

Map output compression

    SET hive.exec.compress.intermediate = true;

Set codec which need to be installed

    SET mapred.output.compression.codec = 
	 org.apache.hadoop.io.compress.SnappyCodec;
Enable Hive’s automatic join optimization to convert repartition joins to replicated joins (map side join only) if one of the tables is small enough.

    SET hive.auto.convert.join = true;

Below two tells Hive to optimize joins where it sees skewed data. Sets the threshold beyond which a key is considered to be skewed. For skew data, separate join will be created to handle them.

    SET hive.optimize.skewjoin = true; 
     SET hive.skewjoin.key = 100000;

