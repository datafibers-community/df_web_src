+++
title = "Apache Airflow Overview"
date = "2019-09-15T19:50:46+02:00"
tags = ["big data"]
categories = ["artical"]
banner = "/img/banners/air_flow.jpg"
+++

### What is Airflow?
Airflow is a platform to programmaticaly author, schedule and monitor workflows or data pipelines. It composes Directed Acyclic Graph (DAG) with multiple tasks which can be executed independently. The Airflow scheduler executes the tasks on an array of workers while following the specified dependencies. Rich command line utilities make performing complex surgeries on DAGs a snap. The rich user interface makes it easy to visualize pipelines running in production, monitor progress, and troubleshoot issues when needed. The Airflow project joined the Apache Software Foundation’s incubation program in 2016. Google cloud also provides a cloud service, [CLOUD COMPOSER](https://cloud.google.com/composer/), for people who do not want to host Airflow themselves.

Below is a short summary for the highlights of Airflow.
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

### Airflow Components
#### DAG
Airflow contains DAGs, operators, tasks, and schedules. 

Directed Acyclic Graph (DAG) is a graph that has no cycles and the data in each node flows forward in only one direction. A DAG is a container that is used to organize tasks and set their execution context. In Airflow all workflows are DAGs.

#### Operators
Operators determine what actually gets done. An operator defines an individual task that needs to be performed. There are different types of operators available.
##### Sensors
It is a certain type of operator that will keep running until a certain criteria is met. Example include waiting for a certain time, external file, or upstream data source.
* HdfsSensor: Waits for a file or folder to land in HDFS
* NamedHivePartitionSensor: check whether the most recent partition of a Hive table is available for downstream processing.

##### Operators
It triggers a certain action (e.g. run a bash command, execute a python function, or execute a Hive query, etc)
* BashOperator: executes a bash command
* PythonOperator: calls an arbitrary Python function
* HiveOperator: executes hql code or hive script in a specific Hive database.
* BigQueryOperator: executes Google BigQuery SQL queries in a specific BigQuery database
* SimpleHttpOperator: sends an HTTP request
* EmailOperator: sends an email
* MySqlOperator, SqliteOperator, PostgresOperator, MsSqlOperator, OracleOperator, JdbcOperator: Run a SQL command in different database.

##### Transfers: 
It moves data from one location to another.
* MySqlToHiveTransfer: Moves data from MySql to Hive.
* S3ToRedshiftTransfer: load files from s3 to Redshift

#### Task
Once an operator is instantiated, it is referred to as a “task”. An operator describes a single task in a workflow. Instantiating a task requires providing a unique task_id and DAG container


### Airflow Job Creation
A Airflow job is described by a DAG file, which is basically just a Python script. There are only 5 steps you needed to write an Airflow DAG or workflow.

##### Step 1: Importing modules
Import Python dependencies needed for the workflow
```
from datetime import timedelta

import airflow
from airflow import DAG
from airflow.operators.bash_operator import BashOperator
```

##### Step 2: Default Arguments
Define default and DAG-specific arguments
```
default_args = {
    'owner': 'airflow',    
    'start_date': airflow.utils.dates.days_ago(2),
    # 'end_date': datetime(2018, 12, 30),
    'depends_on_past': False,
    'email': ['airflow@example.com'],
    'email_on_failure': False,
    'email_on_retry': False,
    # If a task fails, retry it once after waiting
    # at least 5 minutes
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
    }
```

##### Step 3: Instantiate a DAG
Give the DAG name, configure the schedule, and set the DAG settings
```
dag = DAG(
    'tutorial',
    default_args=default_args,
    description='A simple tutorial DAG',
	# Do not catch up from old start time
	catchup = False,
    # Continue to run DAG once per day
    schedule_interval=timedelta(days=1),
)
```

##### Step 4: Tasks
The next step is to lay out all the tasks in the workflow.
```
# t1, t2 and t3 are examples of tasks created by instantiating operators
t1 = BashOperator(
    task_id='print_date',
    bash_command='date',
    dag=dag,
)

t2 = BashOperator(
    task_id='sleep',
    depends_on_past=False,
    bash_command='sleep 5',
    dag=dag,
)

templated_command = """
{% for i in range(5) %}
    echo "{{ ds }}"
    echo "{{ macros.ds_add(ds, 7)}}"
    echo "{{ params.my_param }}"
{% endfor %}
"""

t3 = BashOperator(
    task_id='templated',
    depends_on_past=False,
    bash_command=templated_command,
    params={'my_param': 'Parameter I passed in'},
    dag=dag,
)
```

##### Step 5: Setting up Dependencies
Set the dependencies or the order in which the tasks should be executed. Below are a few ways you can define dependencies between them.
```
# This means that t2 will depend on t1
# running successfully to run.
t1.set_downstream(t2)

# similar to above where t3 will depend on t1
t3.set_upstream(t1)
# The bit shift operator can also be
# used to chain operations:
t1 >> t2

# And the upstream dependency with the
# bit shift operator:
t2 << t1
# A list of tasks can also be set as
# dependencies. These operations
# all have the same effect:
t1.set_downstream([t2, t3])
t1 >> [t2, t3]
[t2, t3] << t1
```


### Airflow Variable
Variables are key-value stores in Airflow’s metadata database. It is used to store and retrieve arbitrary content or settings from the metadata database. We should always **restrict the number of Airflow variables in your DAG**.
Since Airflow Variables are stored in Metadata Database, so any call to variables would mean a connection to Metadata DB. Instead of storing a large number of variable in your DAG, which may end up saturating the number of allowed connections to your database. It is recommended you store all your DAG configuration inside a single Airflow variable with JSON value.

You can access the variable in the code as follows.
```
dag_config = Variable.get("example_variables_config", deserialize_json=True)
var1 = dag_config["var1"]
var2 = dag_config["var2"]
var3 = dag_config["var3"]
```
