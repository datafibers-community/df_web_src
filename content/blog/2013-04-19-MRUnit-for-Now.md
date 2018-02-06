---
layout: post
uri: /posts/114
permalink: /posts/114/index.html
title: MRUnit for Now
category: Blog
tag: mapred
description: 
disqus: true 
lang: en
---
![](http://mrunit.apache.org/images/mrunit_logo.png)

Cloudera MRUnit will help with unit testing of mapreduce programming. Below is its support so far.

* The MapDriver and ReduceDriver support only a single key as input, which can make it more cumbersome to test map and reduce logic that requires multiple keys, such as those that cache the input data.
* MRUnit isn’t integrated with unit test frameworks that provide rich error-reporting capabilities for quicker determination of errors.
* The pipeline tests (testing multiple map and reduce jobs) only work with the old MapReduce API, so MapReduce code that uses the new MapReduce API can’t be tested with the pipeline tests.
* There’s no support for testing data serialization, or InputFormat, RecordReader, OutputFormat, or RecordWriter classes.

In conclusion, only MapReduceDriver is good to use for new mapreduce API right now
