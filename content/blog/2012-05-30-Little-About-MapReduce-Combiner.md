---
layout: post
uri: /posts/120
permalink: /posts/120/index.html
title: Little About MapReduce Combiner
category: Blog
tag: hadoop
description: 
disqus: true 
lang: en
---
Combiner is used to reduce the number of split shuffling to reducer. It will improve the overall performance obviously. There are following two points to be attention of using it.

* __Your map and reduce can work well without combiner__
Combiner is only for performance improvement, so it does not impact the transformation logic which are coded in mapper and reducer.

* __Combiner does not have to be same to the reducer__

 However, it is quite common for many types of distributed aggregate operations such as sum(), min(), and max() for saving coding efforts. To use reducer as combiner, your computing logic should meet below two characteristic 

 Commutative: The order in which we process the addition operation against the values has no effect on the final result. eg, 1 + 2 + 3 = 3 + 1 + 2.

 Associative: The order in which we apply the addition operation has no effect on the final result. For example, (1 + 2) + 3 = 1 + (2 + 3).

* __Combiners are not guaranteed to run__

 Whether or not the framework invokes your combiner during execution depends on the intermediate spill (a process flushing data to disk from memory buffer) file size from each map output, and is not guaranteed to run for every intermediate key. You can control the spill file threshold when MapReduce tries to combine intermediate values with the configuration property min.num.spills.for.combine
<br>

When does mapreduce triggers combiner? There are 3 below situations:

* In map side when the data is spill from map buffer memory to disk, it will do partition and sorting first then call combiner (if combiner is set) to further pack data

* In map side,when map want to merge spill files together to get final map output files, map will examine the number of spill (default is 3). If it is > 3, then call the combiner before merge files. Or else, map does not call combiner. The setting of “min.num.spill.for.combine” (default 3) can be used to manually change this setting.

* In reduce side when the data is spill from reduce buffer memory to disk (reduce download files from different mapper to buffer of memory first) for reducing, it will also call the combiner function to compress the data written to the file after the call to write overflow spill file.

In summary, whenever the data is flushed to the files (from memory or merge spill), combiner will be called if it is set. The purpose of calling it is to reduce data load volume (use CPU to win more IO improvement) similar to data compression.


