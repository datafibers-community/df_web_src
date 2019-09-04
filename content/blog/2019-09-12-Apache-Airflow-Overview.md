+++
title = "Apache Airflow Overview"
date = "2019-09-12T13:50:46+02:00"
tags = ["big data"]
categories = ["artical"]
banner = "/img/banners/kafka.jpg"
+++

### What is Airflow?
Airflow is a platform to programmaticaly author, schedule and monitor workflows or data pipelines, which acts as Directed Acyclic Graph (DAG) with multiple tasks which can be executed independently. Airflow DAGs are composed of Tasks. The project joined the Apache Software Foundation’s incubation program in 2016.

* A workflow (data-pipeline) management system developed by Airbnb
* A framework to define tasks & dependencies in python
* Executing, scheduling, distributing tasks accross worker nodes.
* View of present and past runs, logging feature
* Extensible through plugins
* Nice UI, possibility to define REST interface
* Interact well with database
* Used by more than 200 companies: Airbnb, Yahoo, Paypal, Intel, Stripe,…

### What makes Airflow great?

* Can handle upstream/downstream dependencies gracefully (Example: upstream missing tables)
* Easy to reprocess historical jobs by date, or re-run for specific intervals
* Jobs can pass parameters to other jobs downstream
* Handle errors and failures gracefully. Automatically retry when a task fails.
* Ease of deployment of workflow changes (continuous integration)
* Integrations with a lot of infrastructure (Hive, Presto, Druid, AWS, Google cloud, etc)
* Data sensors to trigger a DAG when data arrives
* Job testing through airflow itself
* Accessibility of log files and other meta-data through the web GUI
* Implement trigger rules for tasks
* Monitoring all jobs status in real time + Email alerts
* Community support