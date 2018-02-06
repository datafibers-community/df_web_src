---
layout: post
title: Hadoop Job Patterns
category: Blog
guid: urn:uuid:0ccb922f-1ea4-4916-ae5e-20130510
tag: hadoop
---
<img src="http://imgur.com/OWTGVjD.jpg" width="200" height="200" alt="avatar" align ="right"  />

In order to handle complex hadoop jobs, such as DAG, you can use oozie. Here, I am talking about the native support of job handlers in the Hadoop MapReduce framework. The limitation is that it only support no cycle type of job flows

* With Job Config: You can also fire off multiple jobs in parallel by using Job.submit() instead of Job.wait ForCompletion(). The submit method returns immediately to the current thread and runs the job in the background. This allows you to run several jobs at once. Use Job.is Complete(), a nonblocking job completion check, to constantly poll to see whether all of the jobs are complete.
* With Shell Scripting: You can warp jobs to shell scripts to deal with complex through shell environment
* With Job Control: You can wrap your jobs with ControlledJob in org.apache.hadoop.mapreduce.lib.jobcontrol. Doing this is relatively simple: you create your job like you usually would, except you also create a ControlledJob that takes in your Job or Configuration as a parameter, along with a list of its dependencies (other ControlledJobs). Then, you add them one-by-one to the JobControl object, which handles the rest. It support sequence or parallell.
* With Chain MapR: You can use in ChainMapper and ChainReducer in org.apache.hadoop.mapreduce.lib.chain. But it supports pipe type of flow only. That means it does NOT support parallel jobs. But it is more convinient than Job Control above since you do not need to deal with intermediate files generated. It has better performance too since it wraps multiple Mapper classes within a single Map or Reduce tasks instead of create many jobs of map and reduce.
* With Merged Job: If multiple map and reduce pipes read the same data set with same input format, you can put the map logic in one map together with proper tagging to distinguish which map logic it goes to. At the reduce side, parse out the tag and use an if-statement to switch what reducer code actually gets executed. Then, use MultipleOutputs to separate the output for the jobs. From a software engineering perspective, this complicates the code organization, because Job unrelated jobs now share the same code. 
