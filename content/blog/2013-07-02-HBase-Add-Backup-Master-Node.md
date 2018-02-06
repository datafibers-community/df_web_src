---
title: Add Backup Master Node in HBase Cluster 
layout: post
guid: urn:uuid:04aadc1c-8153-42ec-8c45-201307020953
category: Blog
tags:
  - hbase
---
<img src="/images/hbase.png" align = "center"  />
How to add a backup master node to the cluster? There are two ways of doing that.

#### In One Way

1. Start the HBase master daemon on the backup master node:
    
        hadoop@master2$ $HBASE_HOME/bin/hbase-daemon.sh start master
From the master log, you will find that the newly started master is waiting to become the next active master:<br>
        >org.apache.hadoop.hbase.master.ActiveMasterManager: Another master is the active
        >master, ip-10-176-201-128.us-west-1.compute.internal,
        >60000,1328878644330; waiting to become the next active master

2. Add the new region server's hostname into the regionservers file, under the $HBASE_HOME/conf directory. For example, to add "slave4" to the cluster, we invoke the following command:

        hadoop@master1$ echo "slave4" >> $HBASE_HOME/conf/regionservers

3. Sync the modified regionservers file across the cluster.
4. Log in to the new server and start the region server daemon there:
        
        hadoop@slave4$ $HBASE_HOME/bin/hbase-daemon.sh start regionserver
5.Optionally, trigger a load balancer manually from HBase Shell to move some regions to the new region server. You can also wait for the next run of the balancer, which runs every five minutes by default.
    
        hbase> balance_switch true
        hbase> balance
<br>

#### In The Other Way

1. Add backup master nodes to the conf/backup-masters file:

        hadoop@master1$ echo "master2" >> $HBASE_HOME/conf/backup-masters`

2. Sync the backup-masters file across the cluster.
3. Start HBase normally; you will find that a backup HBase master will be started at the backup master node:

        hadoop@master1$ $HBASE_HOME/bin/start-hbase.sh`<br>
        >starting master, 
        >logging to /usr/local/hbase/logs/hbase-hadoop-master-master1.out
        >slave2:starting regionserver,
        >logging to /usr/local/hbase/logs/hbase-hadoop-regionserver-slave2.out
        >slave1:starting regionserver,
        >logging to /usr/local/hbase/logs/hbase-hadoop-regionserver-slave1.out 
        >slave3:starting regionserver,
        >logging to /usr/local/hbase/logs/hbase-hadoop-regionserver-slave3.out
        >master2:starting master,
        >logging to /usr/local/hbase/logs/hbase-hadoop-master-master2.out
4. The master log on the backup master indicates that it is a backup master: 

        hadoop@master2$ tail /usr/local/hbase/logs/hbase-hadoop-master-master2.log
        >2012-02-10 23:12:07,016 INFO
        >org.apache.hadoop.hbase.master.ActiveMasterManager: Another master is the active
        >master, ip-10-176-201-128.us-west-1.compute.internal, 
        >60000,1328883123244; waiting to become the next active master