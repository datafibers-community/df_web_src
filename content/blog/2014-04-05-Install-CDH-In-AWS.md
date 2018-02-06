---
title: Steps to setup EC2 cluster for Hadoop 
layout: post
guid: urn:uuid:04aadc1c-8153-42ec-8c45-201404041555
category: Blog
tags:
  - hadoop
---
![](/images/ec2.jpg)

1. Get the `Access Key ID` and `Secret Access Key` and store it in a notepad. The keys will be used when creating EC2 instances. If not there, then generate a new set of keys.

1.	Go to the PVC Management console to create VPC with proper subnet since Hadoop nodes need to be in one LAN
 
1.	Go to the EC2 Management console and create a new Key Pair. While creating the keys, the user will be prompted to store a pem key file. This file will be used to login to the EC2 instance later to install the Cloudera Manager.

1.	In the same screen, go to Instances and click on `Launch Instance` to select an EC2 instance to launch. We chose Ubuntu TLS 12 Linux, 2 c3.xlarge nodes with 50G EBS and 1 c3.4xlarge with 100G EBS. (**Note**, EBS has better performance but additonal payment is needed)
 
1.	Select `Create a new Security Group` and open up the minimum ports as follows
            TCP	22	  SSH
            TCP	7180	Cloudera Manager web console
            TCP	7182	Agent heartbeat
            TCP	7183	(optional, Cloudera Manager web console with TLS)
            TCP	7432	Embedded PostgreSQL
            ICMP   ALL	 Ping echo
            TCP	9000	Host inspector
            TCP	8020	Hive
            TCP	50010   Datanodes
            TCP	50020   Datanodes
 
1.	Make sure all the setting are proper and click on `Launch`.
 
1.	It will take a couple of minutes for the EC2 instance to start. The status of the instance should change to `running`. Select the instance and copy the public hostname of the instance which we created.

1.	Use the key which has been downloaded earlier and the public hostname to login to the instance which was created. Password shouldn't be prompted for logging into the instance.

1.	Download the Cloudera Manager installation binaries, change the permissions. Execute the binary to start the installation of Cloudera Manager using sudo.

1.	Click on Three `Next`. The installation will take a couple of minutes.
11.	Once the installation of the Cloudera Manager is complete, the following screen will appear. Click on `OK`.
 
1.	Start Firefox and go to the hostname: 7180 (the hostname has to be replaced) and login to the Cloudera Manager using username/password as admin/admin. Noticed that it takes a couple of seconds the Cloudera Manager for the initialization, so the login page might not appear immediately.

1.	Select Classic Wizard and Click on `Continue`.

1.	Search for private IP address of all nodes and select as cluster nodes, click `Continue`.

1.	Select other user (Ubuntu) and proper private keys before `Continue`.

1.	The install will start from download to installation and follow by the verification

17.	Now the different services will start automatically. Again, this will take a couple of minutes.

18.	Click on the `Services` tab and all the services should be in a Good Health status. From this screen either the individual or all the services can stopped/started.
 
19.	 Click on the Hosts tab to get the list of nodes and their status which should be in Good.

**Note**:

* Need to set the hadoop dfs folder and temp folder to permnant storage in the EC2 so that when you stop and start the Hadoop, the data and configuration are still there

* Proverly configure the firewall ports roles to make install scussfully (You can allow specific local address in VNC and your own public IP to access for all ports)
