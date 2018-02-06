---
layout: post
guid: urn:uuid:0ccb922f-1ea4-4916-ae5e-20130424
title: Hive vs. Pig
category: Blog
tags:
    - hive
    - pig
---
![](http://i.imgur.com/GVXCO1t.jpg)
<p>Both projects are top Apache projects to process data in Hadoop. Here, I try to compare the difference.</p>
<p>Below is picture I found (I cannot find the original link, but there is mirror <a href="http://blog.csdn.net/sony315/article/details/7173835">here</a>)</p>
<p><img src="http://a7l8ig.bay.livefilestore.com/y1pUGvyQ6NonRUzOsJyLxonhejIlKFoCz2SbjlVONqcAk2AU51BuRSTkPWBFBDsw0hpgmfbBwGsLC-WQeBmTA4XAeKPqKul-n9s/pig-vs-hive.png?psid=1" alt="" /></p>
<p>In addition, I am here to share some more difference. To be honest, I prefer pig more. Mapred, Hive, and pig are like Java, ruby, and python.</p>
<p>Pig</p>
<ul>
<li>It is more easy to install pig than hive. Of course, it is mostly on shell interaction.</li>
<li>Pig is more easy to do ETL jobs. For example, you do not need to write separate "Create table" scripts to hold data.</li>
<li>Piggy banks and facebook lib bring more functions.</li>
<li>The "illustrate" function is very good by offering sample data for each steps and each scenario. However, Hive does not support this.</li>
<li>Pig's order by support global sort by multiple reducer. Hive does not. Hive uses only one reducer.</li>
<li>Pig's skew join can handle skewed data easily by lunching 2 mapred (one for sampling, the other one is for reduce side join. to enable, add (using 'skewed') in the end of join statement. Hive does not support this now and working on it.</li>
<li>Pig supports Avro. Hive does not, but will be soon <a href="https://issues.apache.org/jira/browse/HIVE-895">here</a></li>
<li>pig -x local has better performance for unit test since it only runs a localjobrunner (local mapreduce)</li>
<li>Pig's user group: <span style="font-size: 13px;line-height: 19px">Yahoo! 90% of MapReduce is done by pig, </span><span style="font-size: 13px;line-height: 19px">Twitter (80%), </span><span style="font-size: 13px;line-height: 19px">Linkedin, </span><span style="font-size: 13px;line-height: 19px">Salesforce, Nokia, AOL</span></li>
</ul>
<div>Hive</div>
<div>
<ul>
<li>It is SQL like. The learning curve for SQL developer is almost none.</li>
<li>It is supported by Hue which does make it more popular.</li>
<li>Hive has provided more powerful statistics function</li>
<li>Hive can integrate with HBase. You can query HBase data by it. Pig cannot, but can use HBaseStorage() to load data from HBase</li>
<li>Hive's user group: Facebook, CNET, Digg, Last.fm</li>
</ul>
</div>

