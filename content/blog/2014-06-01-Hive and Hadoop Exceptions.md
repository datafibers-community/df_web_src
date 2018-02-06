---
title: Hive and Hadoop Exceptions 
layout: post
category:
 - Blog
tags:
  - hive
  - hadoop
---
![](/images/exceptions.png)

I installed Hive 1.0.0 on Hadoop 1.2.1. When I try to enter the Hive CLI, it reports following exceptions

```
org.apache.hadoop.hive.ql.metadata.HiveException:java.io.IOException:Filesystem closed
```

According to the search [here](http://mail-archives.apache.org/mod_mbox/hadoop-common-user/201207.mbox/%3CCAL=yAAE1mM-JRb=eJGkAtxWQ7AJ3e7WJCT9BhgWq7XDTNxrwfw@mail.gmail.com%3E), the mainly reason for this is that when multiple nodes read HFDS files if one node is offline, it will throw such exception when the other nodes are still reading the data cached. There are two ways to resolve this.

* Turn off JVM reuse

```
<property>
    <name>mapred.job.reuse.jvm.num.tasks</name>
    <value>-1</value>
</property>
```

* Disable caches

```
<property>
    <name>fs.hdfs.impl.disable.cache</name>
    <value>true</value>
</property>
```