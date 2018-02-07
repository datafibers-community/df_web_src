+++
title = "Spark Word Count Tutorial"
date = "2017-07-01T13:50:46+02:00"
tags = ["spark"]
categories = ["tutorial"]
banner = "/img/banners/spark-word-count.png"
+++
![](/img/banners/spark-word-count.png) 

It is quite often to setup Apache Spark development environment through IDE. Since I do not cover much setup IDE details in my Spark course, I am here to give detail steps for developing the well known Spark word count example using scala API in Eclipse.

## Environment
* [Apache Spark v1.6](http://spark.apache.org/downloads.html)
* [Scala 2.10.4](http://www.scala-lang.org/download/2.10.4.html)
* [Eclipse Scala IDE](http://scala-ide.org/download/sdk.html)

## Download Software Needed

* Download the proper scala version and install it
* Download the Eclipse scala IDE from above link

## Create A Scala Project

1. Open Scala Eclipse IDE. From the top menu, choose File-> New -> Project -> Maven project by choosing **Create a simple project (skip archtype selection)**, then choose **Use default Workspace location**.

1. Click **Next** button to go POM setting page and fill **Group Id = ca.sparkera.spark** and **Artifact Id = WordCount**, Then, click **Finish**.

1. Open the **pom.xml** file in eclipse working area and add replace using code here. Save the file, then Eclipse will automatically download the proper jar files and build the work space.

1. Add Scala Nature to this project by right clicking on **project -> configure - > Add Scala Nature**.

1. Update Scala compiler version for Spark by right clicking on **project- > Properties -> Scala Compiler -> Use Project Settings ->Scala Installation Latest 2.10 bundle (dynamic)**.

1. Refeactor source folder **src/main/java to src/main/scala** by **right click -> Refactor -> Rename**. Create a package under this name it as **ca.sparkera.spark**.

1. Create a Scala object under package created above package and name it as WordCount.scala by right clicking on the **package -> New -> Scala Object** and add WordCount as object name.

1. Paste below code as content for WordCount.scala

```
package ca.sparkera.spark
import org.apache.spark.SparkConf  
import org.apache.spark.SparkContext  
import org.apache.spark.SparkContext._

object WordCount {
def main(args: Array[String]) {  
  
    //check proper parameters - optional
    if (args.length < 1) {  
      System.err.println("Usage: <file>")  
      System.exit(1)  
    }   
    
    //Configuration for a Spark application.        
    val conf = new SparkConf()  
    conf.setAppName("SparkWordCount").setMaster("local")  
  
    //Create Spark Context  
    val sc = new SparkContext(conf)  
  
    //Create MappedRDD by reading from HDFS file from path command line parameter  
    val rdd = sc.textFile(args(0))  
  
    //WordCount  
    rdd.flatMap(_.split(" ")).
    map((_, 1)).
    reduceByKey(_ + _).
    map(x => (x._2, x._1)).
    sortByKey(false).
    map(x => (x._2, x._1)).
    saveAsTextFile("SparkWordCountResult")  
  
    //stop context
    sc.stop  
  }  
}
```

## Run the Scala Project
Run the application by right clicking on **WordCount.scala - > Run as -> Run Configurations -> Arguments** and add input file path, such as **/Users/will/Downloads/testdata/**. Check the output files containing word count result from proper place where you can find from console output.
```
s -l /Users/will/workspace/WordCount/SparkWordCountResult
total 1248
-rw-r--r--  1 will  staff       0  1 Jul 16:30 _SUCCESS
-rw-r--r--  1 will  staff   42669  1 Jul 16:30 part-00000
-rw-r--r--  1 will  staff   15600  1 Jul 16:30 part-00001
-rw-r--r--  1 will  staff  129997  1 Jul 16:30 part-00002
-rw-r--r--  1 will  staff  443519  1 Jul 16:30 part-00003
```

## Additional Note
* Without using maven, we can alternatively add the downloaded spark assmeling jar file (at ../spark-1.6.0-bin-hadoop2.6/lib/spark-assembly-1.6.0-hadoop2.6.0.jar) to the scala project build path as external jar libaray.
* In real project, we usually export the above scala code as jar file, copy it to the spark cluster, and submit it using [spark-submit](http://spark.apache.org/docs/latest/submitting-applications.html).
* Share a website to search [maven repositories](http://mvnrepository.com/)
