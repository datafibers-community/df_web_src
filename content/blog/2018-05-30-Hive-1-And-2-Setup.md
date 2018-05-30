+++
title = "Run Hive 1 and 2 Together"
date = "2018-05-30T13:50:46+02:00"
tags = ["hive"]
categories = ["article"]
banner = "/img/banners/hive2.png"
+++
## Overview
The latest HDP 2.6.x has both Hive version 1 and 2 installed together. However, it does not allow user to run hive version to command directly, but only use beeline.
The [lab_dev](https://github.com/datafibers/lab_env) repository here provides an demo virtual box image to have both Hive version configured properly.

## Conf. Changes
The trick thing to make both hive version working is do not add any setting in the .profile anymore. See below, I comments out all pervious hive settings.

```
$cat .profile
...
export HADOOP_USER_CLASSPATH_FIRST=true
export HADOOP_CONF_DIR="/mnt/etc/hadoop"
export HADOOP_LOG_DIR="/mnt/logs"
export HADOOP_HOME="/opt/hadoop"
# export HIVE_CONF_DIR="/mnt/etc/hive2"
# export HIVE_HOME="/opt/hive2" 
# To run two version of hive, comment hive setting out here and use hive-env.sh for instead since setting here has the highest privilige

PATH="$HADOOP_HOME/bin:$PATH"
PATH="$HADOOP_HOME/sbin:$PATH"
# PATH="$HIVE_HOME/bin:$PATH"
```

For instead, we use ```hive-env.sh``` in each hive installation folder to make each individual hive working.
```
cat /opt/hive/conf/hive-env.sh
export HIVE_HOME=/opt/hive
export HIVE_CONF_DIR=/opt/hive/conf
```

```
cat /opt/hive2/conf/hive-env.sh
export HIVE_HOME=/opt/hive2
export HIVE_CONF_DIR=/opt/hive2/conf
```

For the ```hive-site.xml```, for need make sure following properties are set.

* **hive.server2.thrift.port**: set to 10000 for hive1 and 10500 for hive2
* **hive.metastore.port**: set to 9083 for hive1 and 9085 for hive2. And also update **```hive.metastore.uris```**.

The sample of configuration files (```hive-env.sh``` and ```hive-site.xml```) can be found [here](https://github.com/datafibers/lab_env/tree/master/etc) in the hive1 and hive2 folder.

Then, we need to create the metadata store in relational database, such as MySQL. The create the schema using the schema tools in hive2 installation folder, since hive2 metastore
will be compatible with hive1.

## Install Steps
After we download the hive1 and hive2 jar, unzip them to ```/opt/hive1``` nad ```/opt/hive2``` folder respectively.
```
# Create metastore database
mysql -u root --password="mypassword" -f -e "DROP DATABASE IF EXISTS metastore;"
mysql -u root --password="mypassword" -f -e "CREATE DATABASE IF NOT EXISTS metastore;"
mysql -u root --password="mypassword" -e "GRANT ALL PRIVILEGES ON metastore.* TO 'hive'@'localhost' IDENTIFIED BY 'mypassword'; FLUSH PRIVILEGES;"

# Copy database jdbc driver file
ln -sfn /usr/share/java/mysql-connector-java.jar /opt/hive2/lib/mysql-connector-java.jar
ln -sfn /usr/share/java/mysql-connector-java.jar /opt/hive/lib/mysql-connector-java.jar

# Copy our configuration files (```hive-env.sh``` and ```hive-site.xml```) in place    
cp /mnt/etc/hive2/* /opt/hive2/conf/
cp /mnt/etc/hive/* /opt/hive/conf/
chown -R vagrant:vagrant /opt/hive/conf/*
chown -R vagrant:vagrant /opt/hive2/conf/*

# Use schema tool in the hive2 installation
/opt/hive2/bin/schematool -dbType mysql -initSchema 
```	

## Start and Verify Service
In order to start Hive, start Hadoop first. Then use below commands to start both hive1 and hive2 service.
```
/opt/hive/bin/hive --service metastore 1>> /mnt/logs/metastore.log 2>> /mnt/logs/metastore.log &
/opt/hive/bin/hive --service hiveserver2 1>> /mnt/logs/hiveserver2.log 2>> /mnt/logs/hiveserver2.log &
/opt/hive2/bin/hive --service metastore 1>> /mnt/logs/metastore_h2.log 2>> /mnt/logs/metastore_h2.log &
/opt/hive2/bin/hive --service hiveserver2 1>> /mnt/logs/hiveserver2_h2.log 2>> /mnt/logs/hiveserver2_h2.log &
```

Once all hive services are started, we can use ```beeline``` or ```hive``` to connect to hive.
```
# connect to hive 1
beeline -u "jdbc:hive2://localhost:10000" 
/opt/hive/bin/hive

# connect to hive 2
beeline -u "jdbc:hive2://localhost:10500" 
/opt/hive2/bin/hive
```