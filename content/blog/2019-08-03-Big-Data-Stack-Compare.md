+++
title = "Big Data Stack Compare"
date = "2019-08-03T14:53:46+03:00"
tags = ["big data"]
categories = ["article"]
banner = "/img/banners/big_data_stack.jpg"
+++

## 1. Batch Processing
----
### ETL + ELK
ELK stands for Elastisearch, Logstash, Kibana and is a powerful tool for real-time logs analysis. Performance depends on the amount of RAM for the cluster. If the full index is in RAM search will have close to zero latency. This solution also supports storing similar information in one cluster to enhance speed. ELK can be hard to maintain if the index is growing big, but scaling is achieved by adding new nodes. Cost is also reasonable, unfortunately, ELK has very limited SQL capabilities and is build for search rather then data digging. Elasticsearch query language takes some time to master.

### MongoDB connector + BI tool
If your production data lives in MongoDB, it is an easy win might have been a connector that will allow people to query Mongo with SQL. This solution is cheap (free for us as Atlas users), easy to use, but it was not clear how it will scale, as well as how to do transformations of the data along with simple mapping. That seemed to be a good solution for quick MongoDB exploration with SQL, but how that would have helped us to achieve the goal of Ada’s dashboard revamping was not clear.

### Hadoop + Spark + SQL database + BI Tool
This is powerful, scalable, supports SQL digging but close to impossible to implement and maintain for a bunch of people with no experience in it.

### AWS Athena + AWS S3
If you are already using AWS infrastructure so ease of use and maintenance should have been the main advantage of this stack. The disadvantage, however, is the fact that for Ada’s dashboard we still needed a backend SQL database and a way to transfer data there. AWS Athena pricing is based on the amount of scanned data and that implies that you are using it as a tool for data exploration rather than as a SQL API for the backend data source.

### MongoDB + ETL + AWS Redshift + BI Tool
This stack looked like the most suitable one for our needs. Redshift is fairly cheap, scales well and supports SQL. Most of the BI tools support Redshift as a source. The only disadvantage is that Redshift lives on AWS but it can be replaced with PostgreSQL vendor-free solution if required.

## 2. Stream Processing
----
### Flink
Flink is a matured stream processing framework. If your business have stream centric characters, Flink is your best choice.

### Spark Streaming
Whenever you prefer full stack data processing in Spark, it is a good choice. Spark stream is ideal for second to subsecord level streaming processing.

### Kafka
Kafka connect (source and sink) as well as Kafka SQL provide complete solution for simple and quick stream processing. However, for high performance and complex stream processing especially treansformation, Flink is recommended.

### Kinesis
Kinesis and it analytic tools provide simliar functions like Kafka. However, it has data retention limitation and does not support exact once delivery.

 