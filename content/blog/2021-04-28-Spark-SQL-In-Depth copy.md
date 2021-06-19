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
21/04/23 16:54:55 INFO DiskBlockManager: Created local directory at C:\Users\USA\AppData\Local\Temp\blockmgr-89e66659-c81c-4922-85b0-dbcb38570c81
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
21/04/23 16:55:00 INFO SessionState: Created local directory: C:/Users/USA/AppData/Local/Temp/USA/b750e106-5b2f-4c67-8217-8cba7f95aaf4
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

### Broadcasting and Submiting
The next step is to broadcasting variables and submitting the job.
```
21/04/23 16:55:02 INFO MemoryStore: Block broadcast_0 stored as values in memory (estimated size 375.5 KiB, free 4.1 GiB)
21/04/23 16:55:02 INFO MemoryStore: Block broadcast_0_piece0 stored as bytes in memory (estimated size 34.4 KiB, free 4.1 GiB)
21/04/23 16:55:02 INFO BlockManagerInfo: Added broadcast_0_piece0 in memory on admin:57484 (size: 34.4 KiB, free: 4.1 GiB)
21/04/23 16:55:02 INFO SparkContext: Created broadcast 0 from 
21/04/23 16:55:02 INFO FileInputFormat: Total input files to process : 1
21/04/23 16:55:02 INFO SparkContext: Starting job: show at SparkSQL_ResourceTest01.scala:35
```
MemoryStore is component of BlockManager, which operates the data saved in the memory. In above example, broadcast_0 block is added to the memory with size 375KB. In addition, Spark uses Hadoop FileInputFormat to read HDFS files. In the end，SparkContext submits a job.


### DAG Scheduler
Next, DAGScheduler received the job submitted by SparkContext.Then it found the final Stage（named：show at SparkSQL_ResourceTest01.scala:35），and submit the Stage. Since the testing sql is very simple, there is only one stage without other parent stages.

Then，BlockManager's MemoryStore creates the second broadcast and keeps it int he memory. In the end, DAGScheduler gets the job submitted by the stage from the DAG. In summary, the DAGScheduler is to schedule Stage and submit TaskSet.
```
21/04/23 16:55:02 INFO DAGScheduler: Got job 0 (show at SparkSQL_ResourceTest01.scala:35) with 1 output partitions
21/04/23 16:55:02 INFO DAGScheduler: Final stage: ResultStage 0 (show at SparkSQL_ResourceTest01.scala:35)
21/04/23 16:55:02 INFO DAGScheduler: Parents of final stage: List()
21/04/23 16:55:03 INFO DAGScheduler: Missing parents: List()
21/04/23 16:55:03 INFO DAGScheduler: Submitting ResultStage 0 (MapPartitionsRDD[4] at show at SparkSQL_ResourceTest01.scala:35), which has no missing parents
21/04/23 16:55:03 INFO MemoryStore: Block broadcast_1 stored as values in memory (estimated size 9.2 KiB, free 4.1 GiB)
21/04/23 16:55:03 INFO MemoryStore: Block broadcast_1_piece0 stored as bytes in memory (estimated size 4.8 KiB, free 4.1 GiB)
21/04/23 16:55:03 INFO BlockManagerInfo: Added broadcast_1_piece0 in memory on admin:57484 (size: 4.8 KiB, free: 4.1 GiB)
21/04/23 16:55:03 INFO SparkContext: Created broadcast 1 from broadcast at DAGScheduler.scala:1383
21/04/23 16:55:03 INFO DAGScheduler: Submitting 1 missing tasks from ResultStage 0 (MapPartitionsRDD[4] at show at SparkSQL_ResourceTest01.scala:35) (first 15 tasks are for partitions Vector(0))
```

### Task Scheduler
```
21/04/23 16:55:03 INFO TaskSchedulerImpl: Adding task set 0.0 with 1 tasks resource profile 0
21/04/23 16:55:03 INFO TaskSetManager: Starting task 0.0 in stage 0.0 (TID 0) (admin, executor driver, partition 0, ANY, 4530 bytes) taskResourceAssignments Map()
21/04/23 16:55:03 INFO Executor: Running task 0.0 in stage 0.0 (TID 0)
21/04/23 16:55:03 INFO HadoopRDD: Input split: hdfs://node1:8020/user/hive/warehouse/test.db/t_name/000000_0:0+18
```
TaskScheduler firstly added a task set（0.0）and specify using Resource Profile 0, which is previously loaded into ResourceProfile by driver.

Actually，when starting the task 0.0, we are running in local mode in driver and reading a file form hdfs.

```
[hadoop@node2 root]$ hdfs dfs -tail hdfs://node1:8020/user/hive/warehouse/test.db/t_name/000000_0
2021-04-23 18:35:52,783 INFO sasl.SaslDataTransferClient: SASL encryption trust check: localHostTrusted = false, remoteHostTrusted = false
test1
test2
test3
```

### Code Generation and Complete Task
```
21/04/23 16:55:03 INFO CodeGenerator: Code generated in 174.966701 ms
21/04/23 16:55:05 INFO Executor: Finished task 0.0 in stage 0.0 (TID 0). 1402 bytes result sent to driver
21/04/23 16:55:05 INFO TaskSetManager: Finished task 0.0 in stage 0.0 (TID 0) in 2375 ms on admin (executor driver) (1/1)
21/04/23 16:55:05 INFO TaskSchedulerImpl: Removed TaskSet 0.0, whose tasks have all completed, from pool 
21/04/23 16:55:05 INFO DAGScheduler: ResultStage 0 (show at SparkSQL_ResourceTest01.scala:35) finished in 2.482 s
21/04/23 16:55:05 INFO DAGScheduler: Job 0 is finished. Cancelling potential speculative or zombie tasks for this job
21/04/23 16:55:05 INFO TaskSchedulerImpl: Killing all running tasks in stage 0: Stage finished
21/04/23 16:55:05 INFO DAGScheduler: Job 0 finished: show at SparkSQL_ResourceTest01.scala:35, took 2.533098 s
21/04/23 16:55:05 INFO CodeGenerator: Code generated in 11.8474 ms
```
Now, we see there is a CodeGenerator component which is used to generate code and run in Executor. Once TaskSetManagerImpl fuond all task compeleted, it will remove the tasks from the pool. Once all the tasks are completed in the Stage, the TaskScheduler will shut down all task thread and finish the job.

## Summary
From previous, we looked the how Spark working from IDE run and how each component working for job submission and management. In the future blog, we'll look more details in execution plan itself and its optimization.



































