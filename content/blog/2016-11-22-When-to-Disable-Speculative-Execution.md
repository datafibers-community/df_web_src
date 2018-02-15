+++
title = "When to Disable Speculative Execution"
date = "2016-11-22T13:50:46+02:00"
tags = ["hadoop"]
categories = ["article"]
banner = "/img/banners/banner-1.jpg"
+++
## Backgrounds

This is the link from WikiMedia about what’s __[Speculative Execution](http://en.wikipedia.org/wiki/Speculative_execution)__. In Hadoop, the following parameters string are for this settings. And, they are true by default.

    mapred.map.tasks.speculative.execution
    mapred.reduce.tasks.speculative.execution

## When to Disable
Most time, it helps. However, I am here to collect some scenario when we do not need it.

* Of course, when ever your cluster really in shortage of resource or for the purpose of experiment, we can disable them by setting them to false since “SE” really a big resource consumer
* It is generally advisable to turn off ”SE” for mapred jobs that use HBase as a source. Especially for longer running jobs, speculative execution will create duplicate map-tasks which will double-write your data to HBase; this is probably not what you want. In addition, its local data has high priority when you mapred running against resource in HBase. That is to say every task in tasktracker stays closer to the regionserver in the same physical server. The “SE” will create new jobs to access data which may not local. As result, it will make your regionserver overloaded by wasting IO and network resource.
* When moving data using distcp, the source cluster should have speculative execution turned off for map tasks. In the mapredsite.xml configuration file, set mapred.map.tasks.speculative.execution to false. This will prevent any undefined behavior from occurring in the case where a map task fails.

## How to Disable
There are two ways to disable it.
1.Set in mapred-site.xml (recommend for admin and wider user having such request)

    <property>  
             <name>mapred.map.tasks.speculative.execution</name>  
             <value>false</value>  
    </property>  
    <property>  
             <name>mapred.reduce.tasks.speculative.execution</name>  
             <value>false</value>  
    </property>

2.Set in job configuration

        jobconf.set("mapred.map.tasks.speculative.execution",false);

        jobconf.set("mapred.reduce.tasks.speculative.execution",false);

## Issues
__[MAPREDUCE-2062](https://issues.apache.org/jira/browse/MAPREDUCE-2062)__ and __[MAPREDUCE-3895](https://issues.apache.org/jira/browse/MAPREDUCE-3895)__ list some problem on __“SE”__. See if you needs improvements if you have to use.

