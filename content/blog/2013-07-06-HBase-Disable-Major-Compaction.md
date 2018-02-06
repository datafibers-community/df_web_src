---
title: Disable Major Compaction in HBase Cluster 
layout: post
guid: urn:uuid:04aadc1c-8153-42ec-8c45-201307061753
category: Blog
tags:
  - hbase
---
<img src="/images/hbase.png" align = "center"  />

HBase consists of multiple regions. While a region may have several Stores, each holds a single column family. An edit first writes to the hosting region store's in-memory space, which is called MemStore. When the size of MemStore reaches a threshold, it is flushed to StoreFiles on HDFS.

As data increases, there may be many StoreFiles on HDFS, which is not good for its performance. Thus, HBase will automatically pick up a couple of the smaller StoreFiles and rewrite them into a bigger one. This process is called minor compaction. For certain situations, or when triggered by a configured interval (once a day by default), major compaction runs automatically. Major compaction will drop the deleted or expired cells and rewrite all the StoreFiles in the Store into a single StoreFile; this usually improves the performance.

However, as major compaction rewrites all of the Stores' data, lots of disk I/O and network traffic might occur during the process. This is not acceptable on a heavy load system. You might want to run it at a lower load time of your system.

The following steps describe how to disable automatic major compaction:
1. Add the following to hbase-site.xml file:
       
        $ vi $HBASE_HOME/conf/hbase-site.xml
        
        <property>
            <name>hbase.hregion.majorcompaction</name>
            <value>0</value>
        </property>
2. Sync the changes across the cluster and restart HBase.

3. With the aforementioned setting, automatic major compaction will be disabled; you will now need to run it explicitly.

4. In order to manually run a major compaction on a particular region through HBase Shell, run the following command:
       
        $ echo "major_compact 'hly_temp,,1327118470453.5ef67f6d2a792fb0bd7
        37863dc00b6a7.'" | $HBASE_HOME/bin/hbase shell
        
        HBase Shell; enter 'help<RETURN>' for list of supported commands.
        Type "exit<RETURN>" to leave the HBase Shell
        Version 0.92.0, r1231986, Tue Jan 17 02:30:24 UTC 2012
        major_compact 'hly_temp,,1327118470453.5ef67f6d2a792fb0bd737863dc00b6a7.'
        0 row(s) in 1.7070 seconds

**Note**: Another approach to invoke major compaction is to use the majorCompact API provided by the org.apache.hadoop.hbase.client.HBaseAdmin class. It is easy to call this API in Java, thus you can manage complex major compaction scheduling from Java.