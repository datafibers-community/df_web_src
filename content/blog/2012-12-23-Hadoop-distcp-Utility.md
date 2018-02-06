---
layout: post
uri: /posts/116
permalink: /posts/116/index.html
title: Hadoop distcp Utility
category: Blog
tag: hadoop
description: 
disqus: true 
lang: en
---
Hadoop distcp create a map only job to copy data across clusters <br><br>


Copy the weblogs folder from cluster A to cluster B:

    hadoop distcp hdfs://namenodeA/data/weblogs hdfs://namenodeB/data/weblogs
Copy the weblogs folder from cluster A to cluster B, overwriting any existing files:

    hadoop distcp –overwrite hdfs://namenodeA/data/weblogs \
		hdfs://namenodeB/data/weblogs

Synchronize the weblogs folder between cluster A and cluster B:

    hadoop distcp –update hdfs://namenodeA/data/weblogs \
		hdfs://namenodeB/data/weblogs

Spefify number of mapper used

    hadoop distcp –m 10 hdfs://namenodeA/data/weblogs \
		hdfs://namenodeB/data/weblogs

While copying between two clusters that are running different versions of Hadoop, it is generally recommended to use HftpFileSystem as the source. HftpFileSystem is a read-only filesystem. The distcp command has to be run from the destination server. In the below command, port is defined by the `dfs.http.address` property in the `hdfs-site.xml` configuration file.
    
    hadoop distcp hftp://namenodeA:port/data/weblogs 
		hdfs://namenodeB/data/weblogs


