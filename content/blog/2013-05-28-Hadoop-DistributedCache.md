---
layout: post
title: Hadoop DistributedCache
guid: urn:uuid:0ccb922f-1ea4-4916-ae5e-20130528
category: Blog
tag: hadoop
---
### DistributedCache Usage

The usage of DistributedCache is as follows

* Share data files/meta data/binary files among map and reduce tasks
* Add 3rd party packages to the classpath

<br>
### DistributedCache API
#### Basic Files
DistributedCache is actually to add property `mapred.cache.{files|archives}`to the Hadoop Configuraton. In Hadoop 2.0, it changes to `mapreduce.job.cache.{files|archives}`. 

There are two ways to use the DistributedCache though API

    conf.set("mapred.cache.files", "/data/data");
    conf.set("mapred.cache. archives", "/data/data.zip");

Or better (compatible for late version)

    DistributedCache. addCacheFile(URI, Configuration)
    DistributedCache.addArchiveToClassPath(Path, Configuration, FileSystem)

__Note:__ Above codes must put before job initializaion because the cloned Configuration will pass into JobContext during job initialization. Or else, it does not work at all.

After MapReduce 0.21, you need to get cached data from the setup method in map/reduce tasks

    @Override
    protected void setup(Context context) throws IOException,InterruptedException {
        super.setup(context);
        URI[] uris = DistributedCache.getCacheFiles(context.getConfiguration());
        Path[] paths = DistributedCache.getLocalCacheFiles(context.getConfiguration());
        // TODO
    } 
#### Archives Files
For 3rd party archives，you need firstly upload the archives to Hadoop HDFS，then

    DistributedCache.addArchiveToClassPath(new Path("/data/test.jar"), conf);

#### Symlink 
Symlink is a shortcut to files. You need to add `#SymlinkName`at the end of the URI 
For example:

    conf.set("mapred.cache.files", "/data/data#mData");
    conf.set("mapred.cache. archives", "/data/data.zip#mDataZip");
Use the Symlink
1.Tell hadoop to use Symlink    
   
    conf.set("mapred.create.symlink", "yes"); // note, it is "yes"，not "true"
Or better (compatible for late version)
    
    DistributedCache.createSymlink(Configuration)
To use Symlink through API

    @Override
    protected void setup(Context context) throws IOException,
    InterruptedException {
    super.setup(context);
    FileReader reader = new FileReader(new File("mData"));
    BufferedReader bReader = new BufferedReader(reader);
    // TODO
    } 
<br>
### DistributedCache GenericOptionsParser
See another post about ToolRunner and make sure the code implement Tool interface

    bin/hadoop jar MyJob.jar com.xxx.MyJobDriver 
    -D mapred.reduce.tasks=5 \
    -files ./dict.conf  \
    -libjars lib/commons-beanutils-1.8.3.jar,lib/commons-digester-2.1.jar
    -D mapred.create.symlink=yes\
    ...
<br>
### Addition
1. If the cached files are small, you can read them all into memory to have better performance
1. The cached files are read-only. To edit it, you need to recache them again

![Imgur](http://i.imgur.com/TCX1VI7.jpg?1)


