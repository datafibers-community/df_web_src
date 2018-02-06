---
title: Data Lake Stages 
layout: post
guid: urn:uuid:04aadc1c-8153-42ec-8c45-201502021130
category: Blog
tags:
  - hadoop
  - bigdata
---
<img src="/images/datalake.png" align ="left" /> </br><br/>
Edd has post a very impressive [blog](http://www.forbes.com/sites/edddumbill/2014/01/14/the-data-lake-dream/) about how Hadoop ecosystem influence the data lake in enterprise recently. It discussed about the four following stages when enterprise's data evolution  to the dream of data lake. I also share some of mine as addition.

##### Stage 1 - Life Before Hadoop
![Life Before Hadoop](http://b-i.forbesimg.com/edddumbill/files/2014/01/stage1.png "Life Before Hadoop")

In this stage, the enterprise data architecture has following characteristics.

* Applications stand alone with their databases
* Some applications contribute data to a data warehouse
* Analysts run reporting and analytics in data warehouse

What's more:

* This is a period where typical enterprise data warehouse (EDW) happens. Most of data sets are structured and well-organized. 

##### Stage 2 - Hadoop Is Introduced
![Hadoop Is Introduced](http://b-i.forbesimg.com/edddumbill/files/2014/01/stage2.png "Hadoop Is Introduced")

In this stage, the enterprise data architecture has following characteristics.

* Applications contribute data to Hadoop
* Hadoop runs batch MapReduce jobs
* Hadoop used for ETL into warehouse or analytic databases
* Hadoop data reintroduced into applications

What's more:

* This is a period where typical EDW and hadoop merge happens. Most of data sets are semi-structured and unstructured with structured data. 
* The hot data is more likely injected to EDW since EDW has better support to BI tools and faster response for ad-hoc query.
* Data in Hadoop becomes a center data depository considering the data volume and management cost. Therefore, the EDW also injects its data to the Hadoop. Here is where I disagree with the Edd since I believe it is more like a data exchange (bidirections) instead of single direction in the picture.
* Analytics over Hadoop/Big data starts as data verification, long period statistics, and trending calculations.

##### Stage 3 - Growing The Data Lake
![Growing The Data Lake](http://b-i.forbesimg.com/edddumbill/files/2014/01/stage3.png "Growing The Data Lake")

In this stage, the enterprise data architecture has following characteristics.

* Newly built systems center around Hadoop by default
* Applications use each other’s data via Hadoop
* Interactive use of Hadoop as in-Hadoop databases deployed (e.g. Impala, Greenplum, Spark)
* Hadoop becomes a default data destination, governance and metadata become important
* Data warehouse use becomes the exception, where legacy or special requirements dictate
* External data sources integrated via Hadoop

What's more:

* This is a period where typical EDW being replaced happens. 
* Analytics over Hadoop becomes well accepted in terms of performance and compatibility.
* However, the Hadoop is still playing role of OLAP instead of OLTP

##### Stage 4 - Data Lake And Application Cloud
![Data Lake And Application Cloud](http://b-i.forbesimg.com/edddumbill/files/2014/01/stage4.png "Data Lake And Application Cloud")

In this stage, the enterprise data architecture has following characteristics.

* New applications are built on a Hadoop application platform around the data lake
* Hadoop matures as an elastic distributed data computing platform, for both operational and analytical functions
* Data lake adds security and governance layers
* Data availability increases, application deployment time decreases
* Some apps still have special or legacy needs and execute independently

What's more:

* This is a period where typical Data Oriented Architecture (DOA) starts.
* Hadoop becomes the central, operational, analytical of enterprise data lake.
* Different data lakes can also flow/exchange with each other by data services in terms of **_DATA OCEAN_**