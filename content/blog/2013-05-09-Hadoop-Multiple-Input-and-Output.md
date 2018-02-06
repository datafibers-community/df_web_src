---
layout: post
title: Hadoop Multiple Input and Output
category: Blog
guid: urn:uuid:0ccb922f-1ea4-4916-ae5e-20130509
tag: hadoop
---
The following is an example of using multiple inputs (org.apache.hadoop.mapreduce.lib.input.MultipleInputs) with different input formats and different mapper implementations.

* MultipleInputs.addInputPath(job, accessLogPath, TextInputFormat.class, AccessLogMapper.class);
* MultipleInputs.addInputPath(job, userDataPath, TextInputFormat.class, UserDataMapper.class);

**Note**: `static void addInputPath(Job job, Path path, Class<? extends InputFormat> inputFormatClass, Class<? extends Mapper> mapperClass):` Add a Path with a custom InputFormat and Mapper to the list of inputs for the map-reduce job.

Similarly, there is MultipleOutputs to write multiple destinations

* MultipleOutputs.addNamedOutput(job, “text”, TextOutputFormat.class, LongWritable.class, Text.class); //Defines additional single text based output ‘text’ for the job
* MultipleOutputs.addNamedOutput(job, “seq”,   SequenceFileOutputFormat.class,   LongWritable.class, Text.class); //Defines additional sequence-file based output ‘sequence’ for the job

**Note**: `static void addNamedOutput(Job job, String namedOutput, Class<? extends OutputFormat> outputFormatClass, Class<?> keyClass, Class<?> valueClass) :` Adds a named output for the job.




