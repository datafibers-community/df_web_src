---
title: Moving to the Spark 
layout: post
guid: urn:uuid:04aadc1c-8153-42ec-8c45-201501230930
category: Blog
tags:
  - hadoop
  - spark
  - bigdata
---
It has been a while that the blog is now updated since 2014 is a ready busy year. After I almost completed my first book recently, I think it is the right time to start new journey in big data for real time processing.

Big data ecosystem has great changes over the past two years. The speed of big data processing becomes the hot topic over the past year. When Hadoop enter the area of Yarn, it becomes more like a distribute computing infrastructure. Lots of computing frameworks which are better designed and faster than MapReduce start adaption on top of Yarn and catch more attentions on their improvements over MapReduce computing. Two stars of real time big data processing are storm and spark.

<a href="https://storm.apache.org/" target="_blank"><img src="/images/storm_logo.png" width="350" height="400" alt="avatar" align ="left" /></a><a href="http://spark.apache.org/" target="_blank"><img src="/images/spark_logo.png" width="350" height="400" alt="avatar" align ="right" /></a>

Big data ecosystem has great changes over the past two years. The speed of big data processing becomes the hot topic over the past year. When Hadoop enter the area of YARN, it becomes more like a distribute computing infrastructure. Lots of computing frameworks which are better designed and faster than MapReduce start adaption on top of Yarn and catch more attentions on their improvements over MapReduce computing. Two star of real time big data processing is Storm and Spark.

Comparing to Spark, Storm has longer history and sub-seconds latency, while Spark has offered feature for both real-time streaming and batching. Even the streaming feature is only production aware since 2013, it did catch lots of attention. As for me, I'll go for Spark next for the following 3 reasons.

* Ecosystem 
Spark has wide support on the big data infrastructure on Yarn. That is very important since lots of big data projects start from Hadoop. There is [Storm Over Yarn](https://github.com/yahoo/storm-yarn), which is still in progress. To switch to a new platform is not easier than adaption and migration. Spark now also has formed its ecosystem with a stack of high-level tools including Spark SQL, MLlib for machine learning, GraphX, and Spark Streaming. You can combine these libraries seamlessly in the same application.

* Scala and SQL 
Compare with Storm, Spark is built on Scala, which is more interested to me than Clojure used to write Storm. In addition, Spark SQL and Hive Over Spark are avaliable as SQL interface for Spark. This will attract lots of SQL and Hive users. But, Storm has no such support natively.
There is a commerical product called [sqlstream](http://www.sqlstream.com/downloads/) and an open source [Squall](https://github.com/epfldata/squall/wiki) from EPFL DATA.

* Supporting
Storm is the streaming solution in the Hortonworks Hadoop Data Platform. Spark Streaming is in both MapR's distribution and Cloudera's Enterprise data platform. In addition, Databricks is a company that provides support for the Spark.

Here is a fair [blog post](http://xinhstechblog.blogspot.ca/2014/06/storm-vs-spark-streaming-side-by-side.html) to compare the two.

Will Spark十Tachyon十HDFS十YARN be the future??
  

 
