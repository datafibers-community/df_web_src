---
title: Setup Spark in MAC
layout: post
guid: urn:uuid:04aadc1c-8153-42ec-8c45-201501230930
category: Blog
tags:
  - spark

---
![](/images/sparkmac.jpg)
It is great to see that Brew supports install Spark. It makes installation of Spark quite easier in Mac. I just follow few steps to get my spark instance installed locally.

#### 1. Install brew utility.
 
```
mymac:$ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
==> This script will install:
/usr/local/bin/brew
/usr/local/Library/...
/usr/local/share/man/man1/brew.1
==> The following directories will be made group writable:
/usr/local/.
/usr/local/bin
==> The following directories will have their group set to admin:
/usr/local/.
/usr/local/bin

Press RETURN to continue or any other key to abort
==> /usr/bin/sudo /bin/chmod g+rwx /usr/local/. /usr/local/bin
Password:
==> /usr/bin/sudo /usr/bin/chgrp admin /usr/local/. /usr/local/bin
==> /usr/bin/sudo /bin/mkdir /Library/Caches/Homebrew
==> /usr/bin/sudo /bin/chmod g+rwx /Library/Caches/Homebrew
==> Downloading and installing Homebrew...
remote: Counting objects: 226972, done.
remote: Compressing objects: 100% (59619/59619), done.
remote: Total 226972 (delta 166103), reused 226972 (delta 166103)
Receiving objects: 100% (226972/226972), 52.13 MiB | 1021.00 KiB/s, done.
Resolving deltas: 100% (166103/166103), done.
From https://github.com/Homebrew/homebrew
 * [new branch]      master     -> origin/master
HEAD is now at e58a69c points2grid: update 1.3.0 bottle.
==> Installation successful!
==> Next steps
Run `brew doctor` before you install anything
Run `brew help` to get started
```
#### 2. Install the spark from Brew

```
mymac:$ brew install apache-spark
==> Downloading 
http://d3kbcqa49mib13.cloudfront.net/spark-1.2.0-bin-hadoop2.4.t
############################################################ 100.0% /usr/local/Cellar/apache-spark/1.2.0: 283 files, 234M, built in 24.8 minutes
```

#### 3. Start the spark shell.

```
bash-3.2$ spark-shell
Spark assembly has been built with Hive, including Datanucleus jars on classpath
Using Spark's default log4j profile: org/apache/spark/log4j-defaults.properties
15/01/23 20:21:39 INFO SecurityManager: Changing view acls to: dayongd
15/01/23 20:21:39 INFO SecurityManager: Changing modify acls to: dayongd
15/01/23 20:21:39 INFO SecurityManager: SecurityManager: authentication disabled; ui acls disabled; users with view permissions: Set(dayongd); users with modify permissions: Set(dayongd)
15/01/23 20:21:39 INFO HttpServer: Starting HTTP Server
15/01/23 20:21:39 INFO Utils: Successfully started service 'HTTP class server' on port 56839.
Welcome to
      ____              __
     / __/__  ___ _____/ /__
    _\ \/ _ \/ _ `/ __/  '_/
   /___/ .__/\_,_/_/ /_/\_\   version 1.2.0
      /_/
 
Using Scala version 2.10.4 (Java HotSpot(TM) 64-Bit Server VM, Java 1.7.0_67)
Type in expressions to have them evaluated.
Type :help for more information.
15/01/23 20:21:44 WARN Utils: Your hostname, mymac resolves to a loopback address: 127.0.0.1; using 192.168.3.7 instead (on interface en1)
15/01/23 20:21:44 WARN Utils: Set SPARK_LOCAL_IP if you need to bind to another address
15/01/23 20:21:44 INFO SecurityManager: Changing view acls to: dayongd
15/01/23 20:21:44 INFO SecurityManager: Changing modify acls to: dayongd
15/01/23 20:21:44 INFO SecurityManager: SecurityManager: authentication disabled; ui acls disabled; users with view permissions: Set(dayongd); users with modify permissions: Set(dayongd)
15/01/23 20:21:44 INFO Slf4jLogger: Slf4jLogger started
15/01/23 20:21:44 INFO Remoting: Starting remoting
15/01/23 20:21:45 INFO Remoting: Remoting started; listening on addresses :[akka.tcp://sparkDriver@192.168.3.7:56841]
15/01/23 20:21:45 INFO Utils: Successfully started service 'sparkDriver' on port 56841.
15/01/23 20:21:45 INFO SparkEnv: Registering MapOutputTracker
15/01/23 20:21:45 INFO SparkEnv: Registering BlockManagerMaster
15/01/23 20:21:45 INFO DiskBlockManager: Created local directory at /var/folders/zp/ns8pgfr91yj93hglw1mncph9ytq52s/T/spark-local-201501232021450b71
15/01/23 20:21:45 INFO MemoryStore: MemoryStore started with capacity 265.4 MB
15/01/23 20:21:45 WARN NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
15/01/23 20:21:46 INFO HttpFileServer: HTTP File server directory is /var/folders/zp/ns8pgfr91yj93hglw1mncph9ytq52s/T/spark-e7b15fc0-7c73-4ddb-9c71-ffa1e83f255a
15/01/23 20:21:46 INFO HttpServer: Starting HTTP Server
15/01/23 20:21:46 INFO Utils: Successfully started service 'HTTP file server' on port 56842.
15/01/23 20:21:46 INFO Utils: Successfully started service 'SparkUI' on port 4040.
15/01/23 20:21:46 INFO SparkUI: Started SparkUI at http://192.168.3.7:4040
15/01/23 20:21:46 INFO Executor: Using REPL class URI: http://192.168.3.7:56839
15/01/23 20:21:46 INFO AkkaUtils: Connecting to HeartbeatReceiver: akka.tcp://sparkDriver@192.168.3.7:56841/user/HeartbeatReceiver
15/01/23 20:21:46 INFO NettyBlockTransferService: Server created on 56843
15/01/23 20:21:46 INFO BlockManagerMaster: Trying to register BlockManager
15/01/23 20:21:46 INFO BlockManagerMasterActor: Registering block manager localhost:56843 with 265.4 MB RAM, BlockManagerId(<driver>, localhost, 56843)
15/01/23 20:21:46 INFO BlockManagerMaster: Registered BlockManager
15/01/23 20:21:47 INFO SparkILoop: Created spark context..
Spark context available as sc.
scala>
```
 
### Note: ###
If there is below exception, pls. make sure the local loop address is avaliable in the host file.  

``` 
java.net.UnknownHostException: mymac: mymac: nodename nor servname provided, or not known

```
mymac$ sudo echo "127.0.0.1 mymac" >> /etc/hosts