---
title: Rsync for HBase/Hadoop Cluster Deployment 
layout: Post
guid: urn:uuid:04aadc1c-8153-42ec-8c45-201207020953
category: Blog
tags:
  - hbase
  - hadoop  
---
![](/images/rsync.jpg)
Create a simple rsync script to do HBase/Hadoop deployment

1. Create a cluster-deploy.sh script, shown as follows: $ vi cluster-deploy.sh
       
        #!/bin/bash
        # Sync HBASE_HOME across the cluster. Must run on master using HBase owner user.
        HBASE_HOME=/usr/local/hbase/current
        for rs in `cat $HBASE_HOME/conf/regionservers`
        do
           echo "Deploying HBase to $rs:"
           rsync -avz --delete --exclude=logs $HBASE_HOME/
           $rs:$HBASE_HOME/
           echo
           sleep 1
        done
        echo "Done"

2. Run the script as the user who starts Hadoop/HBase on the master node:
       
        hadoop@master1$ chmod +x cluster-deploy.sh
        hadoop@master1$ ./cluster-deploy.sh
        Deploying HBase to slave1:
        sending incremental file list
        ./
        conf/
        conf/hbase-site.xml
        sent 40023 bytes  received 259 bytes  80564.00 bytes/sec
        total size is 55576486  speedup is 1379.69
        Deploying HBase to slave2:
        ...
        Deploying HBase to slave3:
        ...
        Done
<br>

When the cluster becomes larger, you might want to automate the deployment as much as possible, such as OS and user settings for a new node, fetching and deploying the package, and setting files from a central version managed configuration center.

You could try following tools 

* [Pupet](http://www.puppetfans.com/), an IT automation software that helps system administrators manage infrastructure throughout its lifecycle
* [Chef](www.opscode.com), a automation tool and [Chef Cookbook](https://github.com/ueshin/chef-cookbooks)
* [Apache Bigtop](http://incubator.apache.org/bigtop/), a project for the development of packaging and tests of the Hadoop ecosystem.
