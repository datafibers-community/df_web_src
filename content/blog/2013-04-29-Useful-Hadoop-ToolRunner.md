---
layout: post
title: Useful Hadoop ToolRunner
category: Blog
tag: hadoop
---
Developers are pissed off with following things quite often:

* When you write job configuration in the code of map and reduce, you need to repack everything if there changes on paramenters
* You need to write java code to add files in DistributedCache
* When you depend on 3rd party jar or files, you hold code them in java code

All of these can be resolved using ToolRunner (it runs tools) by `implements Tool` so that you code could take input of configuration from args. Actually ToolRunner hide GenericOptionsParser, which parce the command line input parameters, in its run (this is not static method) method.

    bin/hadoop jar MyJob.jar com.xxx.MyJobDriver 
    -D mapred.reduce.tasks=5 \
    -files ./dict.conf  \
    -libjars lib/commons-beanutils-1.8.3.jar,lib/commons-digester-2.1.jar

The ToolRunner class will automatically handle the following generic Hadoop arguments:

* -conf: Takes a path to a parameter configuration file.
* -fs: Used to specify the host port of the NameNode
* -jt: Used to specify the host port of the JobTracker
* -D: Used to specify Hadoop key/value properties which will be added to the job configuration. 

__Note__: There is space after -D to make difference from JVM `-Dproperty = value` system properties, which comes form `java.lang.System`.

Most of time we also `extends Configured` class for the purpose of accessing `getConf()`, `getClass()` local method so that you do not need to create configuration objects by hard coding class name.

    public class WordCount extends Configured implements Tool {

        @Override
         public int run(String[] arg0) throws Exception {
            Job job = new Job();
            job.setJarByClass(getClass());
            Configuration conf = getConf();
            FileSystem fs = FileSystem.get(conf);
        }

        public static void main(String[] args) throws Exception {
            int res = ToolRunner.run(new Configuration(),new WordCount(),args);
            System.exit(res);
        }
    }


