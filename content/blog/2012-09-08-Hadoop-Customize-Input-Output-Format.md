---
layout: post
uri: /posts/102
permalink: /posts/102/index.html
title: Hadoop Customize Input Output Format
category: Blog
tag: hadoop
description: hadoop
disqus: true
disqus-url: 
lang: en
---
To customize inputformat, we need to do following

*   Create customized *InputFormat class by extending Hadoop inputformat with your own type of class, such as <span style="text-decoration: underline">public class LogFileInputFormat extends FileInputFormat&lt;LongWritable, LogWritable&gt;{...}</span>
*   In above class, override "<span style="text-decoration: underline">public RecordReader&lt;T, T&gt; createRecordReader(InputSplit arg0, TaskAttemptContext arg1) throws IOException, InterruptedException {...}"</span>, which returns customized RecordReader class.
*   In above class, override following one or all if you want to deal with splitable records<span style="text-decoration: underline">List&lt;InputSplit&gt; getSplits(JobContext job)</span> which generate the list of files and make them into FileSplits.
<span style="text-decoration: underline">protected boolean isSplitable(JobContext context, Path filename) </span>which decides if or when records are splitable.
*   Create customized RecordReader class by extending Hadoop RecordReader class, such as, <span style="text-decoration: underline">public class LogFileRecordReader extends RecordReader&lt;LongWritable, LogWritable&gt;{...}</span>
*   In above class override proper methods, such as

<span style="text-decoration: underline">public boolean nextKeyValue() throws IOException, InterruptedException {...}</span>
<span style="text-decoration: underline"> public LongWritable getCurrentKey() throws IOException, InterruptedException {...}</span>
<span style="text-decoration: underline"> public LogWritable getCurrentValue() throws IOException,InterruptedException {...}</span>
<span style="text-decoration: underline"> public float getProgress() throws IOException, InterruptedException {...}</span>
<span style="text-decoration: underline"> public void close() throws IOException {...}</span>

To customize Outputformat, we need to do following

*   Create customized *OutputFormat class by extending Hadoop inputformat with your own type of class, such as <span style="text-decoration: underline">public class LogFileOutputFormat extends FileOutputFormat&lt;LongWritable, LogWritable&gt;{...}</span>
*   In above class, override "<span style="text-decoration: underline">public RecordWriter getRecordWriter(TaskAttemptContext job) throws IOException, InterruptedException {...}</span>"
*   Create customized RecordWriter class by extending Hadoop RecordReader class, such as, extends RecordWriter&lt;T, T&gt;{...}
*   In above class override proper methods, such as

<span style="text-decoration: underline">public void write(TextArrayWritable key, NullWritable value) throws IOException, InterruptedException {...}</span>
<span style="text-decoration: underline"> public synchronized void close(TaskAttemptContext context) throws IOException {...}</span>
