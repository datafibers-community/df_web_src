---
layout: post
uri: /posts/109
permalink: /posts/109/index.html
title: Hive Sorting and Ordering
category: Blog
tag: hive
description: 
disqus: true 
lang: en
---
![](/images/hive_sort.jpg)
There are following key words used in Hive to sort data with following difference:

* __ORDER BY (ASC|DESC)__ : This is similar to the traditional SQL operator. Sorted order is maintained across all of the output from every reducer. It performs the global sort using only one reducer, so it takes long time to return result.  The Usage with LIMIT is strongly recommended for order by. When hive.mapred.mode = strict and you do not specify “limit”, there are error out. 

* __SORT BY  (ASC|DESC)__ : This dictates which columns to sort by when ordering reducer input records. That means it complete sort before data sending to reducer. “Sort by” does not perform global sort and only make sure locally sorted in each reducer unless you set mapred.reduce.tasks=1. In this case, it is equal to result of “order by”

* __DISTRIBUTE BY__ : Rows with matching column values will partition to the same reducer. When used alone, it does not guarantee sorted input to the reducer.

* __CLUSTER BY__: This is a shorthand operator to perform = SORT BY + DISTRIBUTE BY operations on a group of columns. And, it is sorted locally in reducer.
