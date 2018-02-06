---
layout: post
title: Hadoop Balancer
category: Blog
guid: urn:uuid:0ccb922f-1ea4-4916-ae5e-20130503
tag: hadoop
---
Whenever the nodes are added to the cluster or lots of data are delete, we need to run Hadoop balancer to balance the data in the datenodes. Or else, the over utilized data nodes will become the bottleneck of the cluster in terms of performance.

    hadoop balancer -threshold <threshold>

__Note:__

* The optional –threshold parameter specifies the percentage of disk capacity leeway to average cluster datanodes utilization. An under-utilized data node is a node whose utilization is less than average utilization – threshold. An over-utilized data node is a node whose utilization is greater than average utilization + threshold. Smaller threshold values will achieve more evenly balanced nodes, but would take more time for the re-balancing. Default threshold value is 10 percent.
* Re-balancing can be stopped by executing the bin/stop-balancer.sh command.
* A summary of the re-balancing will be available at the __`$HADOOP_HOME/logs/hadoop-*-balancer*.out`__ file. 

During the balancing, Hadoop will move the data blocks from high utilized nodes to low utilized ones in a recursive way. In each iterations of recursion, the time is less than 20 min. Then, the system will see the status of data utilization overall to decide whether to jump out of balancing.

__`dfs.balance.bandwidthPerSec`__ can define the bandwidth used by the balancing, default is 1M/second. If your cluster is busy, you should decrease this number. If you cluster is not busy, you can increase this number to speed up balancing. This setting is effective after HDFS restart

