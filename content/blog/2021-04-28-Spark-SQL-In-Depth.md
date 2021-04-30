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

        val spark = SparkSession.builder().config(conf).master("local[1]").enableHiveSupport()
        						.getOrCreate()

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
Logging is very important for development and troubleshooting. In this section, we'll look into detais of logs when a spark job is running. We set the logging level as INFO so that we can discover more details.

### Loading Log Config
Once the application starts, the log configuration is loaded.
```
SLF4J: Class path contains multiple SLF4J bindings.
SLF4J: Found binding in [jar:file:/C:/opt/apache-maven-3.6.1/repository/org/slf4j/slf4j-log4j12/1.7.30/slf4j-log4j12-1.7.30.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: Found binding in [jar:file:/C:/opt/apache-maven-3.6.1/repository/org/slf4j/slf4j-simple/1.7.25/slf4j-simple-1.7.25.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: See http://www.slf4j.org/codes.html#multiple_bindings for an explanation.
SLF4J: Actual binding is of type [org.slf4j.impl.Log4jLoggerFactory]
log4j:WARN No appenders could be found for logger (org.apache.hadoop.hive.conf.HiveConf).
log4j:WARN Please initialize the log4j system properly.
log4j:WARN See http://logging.apache.org/log4j/1.2/faq.html#noconfig for more info.
Using Spark's default log4j profile: org/apache/spark/log4j-defaults.properties
```
Unless you provide your own log4j.property, or else Spark use its own settings from jar.

### Submitting Spark Job
Usually the Spark job is submitted to the cluster. When we run it in IDE, Spark uses JVM thread to simulate a cluster to run the job. ResourceUtils is used to load spark.driver.

```
21/04/23 16:54:51 INFO SparkContext: Running Spark version 3.1.1
21/04/23 16:54:51 INFO ResourceUtils: ==============================================================
21/04/23 16:54:51 INFO ResourceUtils: No custom resources configured for spark.driver.
21/04/23 16:54:51 INFO ResourceUtils: ==============================================================
21/04/23 16:54:51 INFO SparkContext: Submitted application: b72a567f-bba5-47c2-871a-1ae5db3e4352
```

### Loading Default Executors Setting
Below logging is to describe the resources used by the executors. Since we do not clearly specify the settings for executers, the default one is used which is an executor with one core and 1gb memory. Every task uses one vcore, one executor task.

```
21/04/23 16:54:51 INFO ResourceProfile: Default ResourceProfile created, executor resources: Map(cores -> name: cores, amount: 1, script: , vendor: , memory -> name: memory, amount: 1024, script: , vendor: , offHeap -> name: offHeap, amount: 0, script: , vendor: ), task resources: Map(cpus -> name: cpus, amount: 1.0)
21/04/23 16:54:51 INFO ResourceProfile: Limiting resource is cpu
21/04/23 16:54:51 INFO ResourceProfileManager: Added ResourceProfile id: 0
```

Note: the ResourceProfile id is 0. ResourceProfile is used to load executor settings.

### Verifying Access Control
Spark Kubernetes Security is by default disabled. SecurityManager is used to deal with Kebrous authentication.

```
21/04/23 16:54:52 INFO SecurityManager: Changing view acls to: USA,hdfs
21/04/23 16:54:52 INFO SecurityManager: Changing modify acls to: USA,hdfs
21/04/23 16:54:52 INFO SecurityManager: Changing view acls groups to: 
21/04/23 16:54:52 INFO SecurityManager: Changing modify acls groups to: 
21/04/23 16:54:52 INFO SecurityManager: SecurityManager: authentication disabled; ui acls disabled; users  with view permissions: Set(USA, hdfs); groups with view permissions: Set(); users  with modify permissions: Set(USA, hdfs); groups with modify permissions: Set()
```

### Starting Spark Core Services
Next, the MapOutputTracker, BlockManagerMaste, BlockManagerMasterEndpoint,  and OutputCommitCoordinator are registered. Then, starts the Spark UI and Netty service for data transmission。

Key components:

* SparkEnv - Spark running environment.
* SparkUI - Spark web ui.
* NettyBlockTransferService - Use Netty to send data.

```
21/04/23 16:54:55 INFO SparkEnv: Registering MapOutputTracker
21/04/23 16:54:55 INFO SparkEnv: Registering BlockManagerMaster
21/04/23 16:54:55 INFO BlockManagerMasterEndpoint: Using org.apache.spark.storage.DefaultTopologyMapper for getting topology information
21/04/23 16:54:55 INFO BlockManagerMasterEndpoint: BlockManagerMasterEndpoint up
21/04/23 16:54:55 INFO SparkEnv: Registering BlockManagerMasterHeartbeat
21/04/23 16:54:55 INFO DiskBlockManager: Created local directory at C:\Users\China\AppData\Local\Temp\blockmgr-89e66659-c81c-4922-85b0-dbcb38570c81
21/04/23 16:54:56 INFO MemoryStore: MemoryStore started with capacity 4.1 GiB
21/04/23 16:54:56 INFO SparkEnv: Registering OutputCommitCoordinator
21/04/23 16:54:56 INFO Utils: Successfully started service 'SparkUI' on port 4040.
21/04/23 16:54:56 INFO SparkUI: Bound SparkUI to 0.0.0.0, and started at http://admin:4040
21/04/23 16:54:56 INFO Executor: Starting executor ID driver on host admin
21/04/23 16:54:56 INFO Utils: Successfully started service 'org.apache.spark.network.netty.NettyBlockTransferService' on port 57484.
21/04/23 16:54:56 INFO NettyBlockTransferService: Server created on admin:57484

```

### Starting Block Manager
Spark does its own memory management with BlockManager. In this example, the random block management policy is used and it registers on port 57484 which is same to NettyBlockTransfer. In this example, the memory can be used by the BlockManager is 4.1GB.

```
21/04/23 16:54:56 INFO BlockManager: Using org.apache.spark.storage.RandomBlockReplicationPolicy for block replication policy
21/04/23 16:54:56 INFO BlockManagerMaster: Registering BlockManager BlockManagerId(driver, admin, 57484, None)
21/04/23 16:54:56 INFO BlockManagerMasterEndpoint: Registering block manager admin:57484 with 4.1 GiB RAM, BlockManagerId(driver, admin, 57484, None)
21/04/23 16:54:56 INFO BlockManagerMaster: Registered BlockManager BlockManagerId(driver, admin, 57484, None)
21/04/23 16:54:56 INFO BlockManager: Initialized BlockManager: BlockManagerId(driver, admin, 57484, None)
```
<p align="center"><img src="/img/banners/spark_sql_pic02.png" width="400"></p>

### Loading Meta Data
Any SQL engine has to load meta-data to generate execution plan. In this phase, Spark SQL loads meta-data and connects to hive metastore.
```
21/04/23 16:54:56 INFO SharedState: spark.sql.warehouse.dir is not set, but hive.metastore.warehouse.dir is set. Setting spark.sql.warehouse.dir to the value of hive.metastore.warehouse.dir ('hdfs://node1:8020/user/hive/warehouse').
21/04/23 16:54:56 INFO SharedState: Warehouse path is 'hdfs://node1:8020/user/hive/warehouse'.
21/04/23 16:54:57 INFO HiveUtils: Initializing HiveMetastoreConnection version 2.3 using path: 
21/04/23 16:54:59 INFO deprecation: No unit for dfs.client.datanode-restart.timeout(30) assuming SECONDS
21/04/23 16:55:00 INFO SessionState: Created HDFS directory: /tmp/hive/hdfs/b750e106-5b2f-4c67-8217-8cba7f95aaf4
21/04/23 16:55:00 INFO SessionState: Created local directory: C:/Users/China/AppData/Local/Temp/China/b750e106-5b2f-4c67-8217-8cba7f95aaf4
21/04/23 16:55:00 INFO SessionState: Created HDFS directory: /tmp/hive/hdfs/b750e106-5b2f-4c67-8217-8cba7f95aaf4/_tmp_space.db
21/04/23 16:55:00 INFO HiveClientImpl: Warehouse location for Hive client (version 2.3.7) is hdfs://node1:8020/user/hive/warehouse
21/04/23 16:55:00 INFO metastore: Trying to connect to metastore with URI thrift://node1:9083
21/04/23 16:55:00 INFO metastore: Opened a connection to metastore, current connections: 1
21/04/23 16:55:00 INFO JniBasedUnixGroupsMapping: Error getting groups for hdfs: Unknown error.
21/04/23 16:55:00 INFO metastore: Connected to metastore.
21/04/23 16:55:02 INFO SQLStdHiveAccessController: Created SQLStdHiveAccessController for session context : HiveAuthzSessionContext [sessionString=b7503407-5b2f-4c67-6643-8cba7f565aaf4, clientType=HIVECLI]
21/04/23 16:55:02 WARN SessionState: METASTORE_FILTER_HOOK will be ignored, since hive.security.authorization.manager is set to instance of HiveAuthorizerFactory.
21/04/23 16:55:02 INFO metastore: Mestastore configuration hive.metastore.filter.hook changed from org.apache.hadoop.hive.metastore.DefaultMetaStoreFilterHookImpl to org.apache.hadoop.hive.ql.security.authorization.plugin.AuthorizationMetaStoreFilterHook
21/04/23 16:55:02 INFO metastore: Closed a connection to metastore, current connections: 0
21/04/23 16:55:02 INFO metastore: Trying to connect to metastore with URI thrift://node1:9083
21/04/23 16:55:02 INFO metastore: Opened a connection to metastore, current connections: 1
21/04/23 16:55:02 INFO metastore: Connected to metastore.
```

Spark firstly check ```spark.sql.warehouse.dir```, then ```hive.metastore.warehouse.dir``` in the ```hive-site.xml```.

Then，SparkSession creates hdfs tmp folder.
```
[hadoop@node2 root]$ hdfs dfs -ls -R /tmp/hive/hdfs/b750e106-5b2f-4c67-8217-8cba7f95aaf4/
drwx------   - hdfs hadoop          0 2021-04-23 16:55 /tmp/hive/hdfs/b750e106-5b2f-4c67-8217-8cba7f95aaf4/_tmp_space.db
```
In the end，Spark uses thrift RPC to connect to Hive MetaStore Server（thrift://node1:9083).

Note: SessionState keeps the state of all SparkSession.











































