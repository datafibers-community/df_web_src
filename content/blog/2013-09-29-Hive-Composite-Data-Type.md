---
title: Hive Composite Data Type 
layout: post
guid: urn:uuid:04aadc1c-8153-42ec-8c45-201309291553
category: Blog
tags:
  - hive
---
<img src="/images/hive_fun.jpg" width="960" height="710" align ="center"  />

For now, hive supports following composite data type：

* **map**: (key1, value1, key2, value2, …). Creates a map with the given key/value pairs
* **struct**: (val1, val2, val3, …). Creates a struct with the given field values. Struct field names will be col1, col2, ...
* **named_struct**: (name1, val1, name2, val2, …). Creates a struct with the given field names and values. (as of Hive 0.8.0)
* **array**: (val1, val2, …). Creates an array with the given elements
* **create_union**:(tag, val1, val2, …). Creates a union type with the value that is being pointed to by the tag parameter

Here, I list some difference between map and struct

* For map, the type of key and values is unified. Struct are more flexible
* To access map using array like access ['key']; struct use "." access
* Struct is more like a table while map is more like a array with customized index

Below are samples of their usage

##### 1. Array
Create table using array data type

	01. create table  person(name string,work_locations array<string>)
	02. ROW FORMAT DELIMITED
	03. FIELDS TERMINATED BY '\t'
	04. COLLECTION ITEMS TERMINATED BY ',';

Prepared data as follows

	01. cat person.txt
	02. biansutao beijing,shanghai,tianjin,hangzhou
	03. linan changchu,chengdu,wuhan

Load data
	
	01. LOAD DATA LOCAL INPATH '/home/hadoop/person.txt' OVERWRITE INTO TABLE person;

Query the table
	
	01. hive> select * from person;
	02. biansutao       ["beijing","shanghai","tianjin","hangzhou"]
	03. linan           ["changchu","chengdu","wuhan"]
	04. Time taken: 0.355 seconds
	
	05. hive> select name from person;
	06. linan
	07. biansutao
	08. Time taken: 12.397 seconds
	
	09. hive> select work_locations[0] from person;
	10. changchu
	11. beijing
	12. Time taken: 13.214 seconds
	
	13. hive> select work_locations from person;  
	14. ["changchu","chengdu","wuhan"]
	15. ["beijing","shanghai","tianjin","hangzhou"]
	16. Time taken: 13.755 seconds
	
	17. hive> select work_locations[3] from person;
	18. NULL
	19. hangzhou
	20. Time taken: 12.722 seconds
	
	21. hive> select work_locations[4] from person;
	22. NULL
	23. NULL
	24. Time taken: 15.958 seconds

##### 2. Map  
Create table using array data type

	01. create table score(name string, score map<string,int>)
	02. ROW FORMAT DELIMITED
	03. FIELDS TERMINATED BY '\t'
	04. COLLECTION ITEMS TERMINATED BY ','
	05. MAP KEYS TERMINATED BY ':';
	
Prepared data as follows
	
	01. cat score.txt
	02. biansutao 'math':80,'chinese':89,'english':95
	03. jobs      'chinese':60,'math':80,'english':99

Load data
	
	01. LOAD DATA LOCAL INPATH '/home/hadoop/score.txt' OVERWRITE INTO TABLE score;

Query the table

	01. hive> select * from score;
	02. biansutao       {"math":80,"chinese":89,"english":95}
	03. jobs            {"chinese":60,"math":80,"english":99}
	04. Time taken: 0.665 seconds
	
	05. hive> select name from score;
	06. jobs
	07. biansutao
	08. Time taken: 19.778 seconds
	
	09. hive> select t.score from score t;
	10. {"chinese":60,"math":80,"english":99}
	11. {"math":80,"chinese":89,"english":95}
	12. Time taken: 19.353 seconds
	 
	13. hive> select t.score['chinese'] from score t;
	14. 2660
	15. 2789
	16. Time taken: 13.054 seconds
	
	17. hive> select t.score['english'] from score t;
	18. 3099
	19. 3195
	20. Time taken: 13.769 seconds

##### 3. Struct 
Create table using array data type

	01. create table test(id int,course struct<course:string,score:int>)
	02. ROW FORMAT DELIMITED
	03. FIELDS TERMINATED BY '\t'
	04. COLLECTION ITEMS TERMINATED BY ',';

Prepared data as follows
	
	01. cat test.txt
	02. 1 english,80
	03. 2 math,89
	04. 3 chinese,95

Load data

	01. LOAD DATA LOCAL INPATH '/home/hadoop/test.txt' OVERWRITE INTO TABLE test;

Query the table

	01. hive> select * from test;
	02. OK
	03. 1       {"course":"english","score":80}
	04. 2       {"course":"math","score":89}
	05. 3       {"course":"chinese","score":95}
	06. Time taken: 0.275 seconds

	07. hive> select course from test;
	08. {"course":"english","score":80}
	09. {"course":"math","score":89}
	10. {"course":"chinese","score":95}
	11. Time taken: 44.968 seconds
	
	12. select t.course.course from test t;
	13. english
	14. math
	15. chinese
	16. Time taken: 15.827 seconds
	
	17.hive> select t.course.score from test t;
	18. 3080
	19. 3189
	20. 3295
	21. Time taken: 13.235 seconds  

##### 4. Composite 

	1. LOAD DATA LOCAL INPATH '/home/hadoop/test.txt' OVERWRITE INTO TABLE test;
	2. create table test1(id int,a MAP<STRING,ARRAY<STRING>>)
	3. row format delimited fields terminated by '\t'
	4. collection items terminated by ','
	5. MAP KEYS TERMINATED BY ':';
	6. 1 english:80,90,70
	7. 2 math:89,78,86
	8. 3 chinese:99,100,82
	9. LOAD DATA LOCAL INPATH '/home/hadoop/test1.txt' OVERWRITE INTO TABLE test1;
