---
title: Hadoop Counter
layout: post
guid: urn:uuid:04aadc1c-8153-42ec-8c45-21d1b06d4fc2
category: Blog
tags:
  - hadoop
---
![](/images/hcounter.png)

hadoop counter is to help developers and users to have overall status of running jobs. There are three type of counters, MapReduce related, File systems related, and job related. The details can be seen from http://master:50030/jobdetails.jsp

Except internal counters, hadoop also offers customize counters. There are two ways to do that.

#### 1. Static Definition
You can use enumiate classs to create counters

    Context context...  
    //Enum class refers to groupName，Enum class type refers to counterName  
    context.getCounter(Enum enum)  

#### 2. Dynamic Definition

    Context context...  
    //Pass groupName and counterName dynamically. 
    //__Hadoop will create it if there is no such counter.__  
    context.getCounter(String groupName,String counterName)  

##### 2.1 Operate Counter
    counter.setValue(long value);//Set initial value
    counter.increment(long incr);//Increase one count
##### 2.2 Fetch Counter

    Job job...  
    job.waitForCompletion(true);  
    Counters counters=job.getCounters();  
    Counter counter=counters.findCounter(Enum enum);//Search Counter  
    long value=counter.getValue();//Fetch Counter 
    
#### 3. Example
Below is an example, class WordCountMap: 
    
    public static class TokenizerMapper   
       extends Mapper<Object, Text, Text, IntWritable>{  
      
    private final static IntWritable one = new IntWritable(1);  
    private Text word = new Text();  
    private final static Logger log = Logger.getLogger(TokenizerMapper.class);  
    private static Counter ct = null;  
      
    public void map(Object key, Text value, Context context  
                    ) throws IOException, InterruptedException {  
        StringTokenizer itr = new StringTokenizer(value.toString());  
        while (itr.hasMoreTokens()) {  
          String name = itr.nextToken();  
          if("test".equals(name)){  
              ct = context.getCounter("TestFinder", "discovrt test");  
              ct.increment(1);  
        }  
        word.set(name);  
        context.write(word, one);  
        }  
        }  
    } 

