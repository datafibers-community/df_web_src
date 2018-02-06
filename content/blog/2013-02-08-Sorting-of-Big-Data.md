---
layout: post
title: Sorting of Big Data
category: Blog
tag: hadoop
---
If you want to sort big data set by keys, there are following ways to do that global sort (sorting on single keys)

* by mapreduce scripts: get sample of data to find out data ranges by keys; sort data by each map; send them to different reduce according to data ranges. The code in P162@Hadoop In Practice gives a sample of this.

* by Pig: pig's "order by" support this perfectly

* by Hive: you need to set reducer to 1 before using hive's order by. Hope, it will have such improvement soon.

<br>
If you want to sort big data set by keys then by values, there are following ways to do that secondary sort

* by mapreduce script: Make the key a composite of the natural key and the natural value. The sort comparator should order by the composite key, that is, the natural key and natural value. The partitioner and grouping comparator for the composite key should consider only the natural key for partitioning and grouping. The code in P278@Hadoop: The Definite Guide 3ed gives a sample of this.

* by Pig or hive's "order by" support this perfectly</li>

* by Hadoop streaming see the code in P281@Hadoop: The Definite Guide 3ed</li>
    	
		hadoop jar $HADOOP_INSTALL/contrib/streaming/hadoop-*-streaming.jar \
     	-D stream.num.map.output.key.fields=2 \
     	-D mapred.text.key.partitioner.options=-k1,1 \ 
     	-D mapred.output.key.comparator.class=\ 
     	org.apache.hadoop.mapred.lib.KeyFieldBasedComparator \ 
     	-D mapred.text.key.comparator.options="-k1n -k2nr"</strong> \ 
     	-input input/ncdc/all \ 
     	-output output_secondarysort_streaming \ 
     	-mapper ch08/src/main/python/secondary_sort_map.py \ 
     	-partitioner org.apache.hadoop.mapred.lib.KeyFieldBasedPartitioner \ 
     	-reducer ch08/src/main/python/secondary_sort_reduce.py \ 
     	-file ch08/src/main/python/secondary_sort_map.py \ 
     	-file ch08/src/main/python/secondary_sort_reduce.py 

The specification __`mapred.text.key.partitioner.options`__ configures the partitioner. The value -k1,1 instructs the partitioner to use only the first field of the key, where fields are assumed to be separated by a string defined by the __`map.output.key.field.separator`__ property (a tab character by default).

Hadoop provides KeyFieldBasedComparator, which is ideal for this purpose. The comparison order is defined by a specification that is like the one used for GNU sort. It is set using the __`mapred.text.key.comparator.options`__ property. The value __"-k1n -k2nr"__ used in this example means __“sort by the first field in numerical order, then by the second field in reverse numerical order.”__ Like its partitioner cousin, __`KeyFieldBasedPartitioner`__, it uses the separator defined by the __`map.output.key.field.separator`__ to split a key into fields.

Another example from <a href="http://hadoop.apache.org/docs/r0.18.3/streaming.html#More+usage+examples">Apache</a></p>
    
    hadoop  jar $HADOOP_HOME/hadoop-streaming.jar \
    -input myInputDirs \
    -output myOutputDir \
    -mapper org.apache.hadoop.mapred.lib.IdentityMapper \
    -reducer org.apache.hadoop.mapred.lib.IdentityReducer \
    -partitioner org.apache.hadoop.mapred.lib.KeyFieldBasedPartitioner \
    -jobconf stream.map.output.field.separator=. \
    -jobconf stream.num.map.output.key.fields=4 \
    -jobconf map.output.key.field.separator=. \
    -jobconf num.key.fields.for.partition=2 \
    -jobconf mapred.reduce.tasks=12</pre>

Here, __`-jobconf stream.map.output.field.separator=.`__ and __`-jobconf stream.num.map.output.key.fields=4`__ are as explained in previous example. The two variables are used by streaming to identify the key/value pair of mapper.

The map output keys of the above Map/Reduce job normally have four fields separated by __`"."`__. However, the Map/Reduce framework will partition the map outputs by the first two fields of the keys using the __`-jobconf num.key.fields.for.partition=2`__ option. Here, __`-jobconf map.output.key.field.separator=.`__ specifies the separator for the partition. This guarantees that all the key/value pairs with the same first two fields in the keys will be partitioned into the same reducer.

This is effectively equivalent to specifying the first two fields as the primary key and the next two fields as the secondary. The primary key is used for partitioning, and the combination of the primary and secondary keys is used for sorting.


