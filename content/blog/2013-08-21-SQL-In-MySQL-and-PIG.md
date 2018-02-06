---
title: SQL in MySQL and Pig Comparision 
layout: post
guid: urn:uuid:04aadc1c-8153-42ec-8c45-201308211753
category: Blog
tags:
  - pig
---
<img src="/images/pigmysql.png" align ="center"  />

Here, it is using Mysql 5.1.x and Pig 0.8 as sample. Two sample files are used as follows. 
##### 00.Prepared Files
cat /tmp/data_file_1
	
	zhangsan      23  1 
	lisi          24  1 
	wangmazi      30  1 
	meinv         18  0 
	dama          55  0 

cat /tmp/data_file_2 

	1      a
	23     bb
	50     ccc
	30     dddd
	66     eeeee 

##### 01.Load Files

	1)Mysql (Need to create the table first).
       CREATE TABLE TMP_TABLE(USER VARCHAR(32),AGE INT,IS_MALE BOOLEAN);
       CREATE TABLE TMP_TABLE_2(AGE INT,OPTIONS VARCHAR(50));   -- 用于Join
       LOAD DATA LOCAL INFILE '/tmp/data_file_1'  INTO TABLE TMP_TABLE ;
       LOAD DATA LOCAL INFILE '/tmp/data_file_2'  INTO TABLE TMP_TABLE_2;

	2)Pig
       tmp_table = LOAD '/tmp/data_file_1' USING PigStorage('\t') 
       AS (user:chararray, age:int,is_male:int);
       tmp_table_2= LOAD '/tmp/data_file_2' USING PigStorage('\t') 
       AS (age:int,options:chararray);

##### 02.Select WHole Table

	1)Mysql
      SELECT * FROM TMP_TABLE;

	2)Pig
      DUMP tmp_table;

##### 03.Select Top N

	1)Mysql
      SELECT * FROM TMP_TABLE LIMIT 50;

	2)Pig
       tmp_table_limit = LIMIT tmp_table 50;
       DUMP tmp_table_limit;
         
##### 04.Select Specific

	1)Mysql
       SELECT USER FROM TMP_TABLE;

	2)Pig
       tmp_table_user = FOREACH tmp_table GENERATE user;
       DUMP tmp_table_user;

##### 05.Alias

    1)Mysql
       SELECT USER AS USER_NAME,AGE AS USER_AGE FROM TMP_TABLE;

    2)Pig
       tmp_table_column_alias = FOREACH tmp_table GENERATE user AS user_name,age AS user_age;
       DUMP tmp_table_column_alias;

##### 06.Ordering

    1)Mysql
       SELECT * FROM TMP_TABLE ORDER BY AGE;

    2)Pig
        tmp_table_order = ORDER tmp_table BY age ASC;
        DUMP tmp_table_order;

##### 07.Condition

    1) Mysql
        SELECT * FROM TMP_TABLE WHERE AGE>20;

    2) Pig
        tmp_table_where = FILTER tmp_table by age > 20;
        DUMP tmp_table_where;

##### 08.Inner Join

    1)Mysql
       SELECT * FROM TMP_TABLE A JOIN TMP_TABLE_2 B ON A.AGE=B.AGE;

    2)Pig
        tmp_table_inner_join = JOIN tmp_table BY age, tmp_table_2 BY age;
        DUMP tmp_table_inner_join;

##### 09.Left Join

	1)Mysql
       SELECT * FROM TMP_TABLE A LEFT JOIN TMP_TABLE_2 B ON A.AGE=B.AGE;

	2)Pig
      tmp_table_left_join = JOIN tmp_table BY age LEFT OUTER, tmp_table_2 BY age;
      DUMP tmp_table_left_join;

##### 10.Right Join

     1)Mysql
        SELECT * FROM TMP_TABLE A RIGHT JOIN TMP_TABLE_2 B ON A.AGE=B.AGE;

     2)Pig
        tmp_table_right_join = JOIN tmp_table BY age RIGHT OUTER,tmp_table_2 BY age;
        DUMP tmp_table_right_join;

##### 11.Full Join

     1)Mysql
        SELECT * FROM TMP_TABLE A  JOIN TMP_TABLE_2 B ON A.AGE=B.AGE
        UNION SELECT * FROM TMP_TABLE A LEFT JOIN TMP_TABLE_2 B ON A.AGE=B.AGE
        UNION SELECT * FROM TMP_TABLE A RIGHT JOIN TMP_TABLE_2 B ON A.AGE=B.AGE;

     2)Pig
        tmp_table_full_join = JOIN tmp_table BY age FULL OUTER,tmp_table_2 BY age;
        DUMP tmp_table_full_join;

##### 12.Cross Join

    1)Mysql
       SELECT * FROM TMP_TABLE,TMP_TABLE_2;

    2)Pig
       tmp_table_cross = CROSS tmp_table,tmp_table_2;
       DUMP tmp_table_cross;

##### 13.GROUP

	1)Mysql
      SELECT * FROM TMP_TABLE GROUP BY IS_MALE;

	2)Pig
      tmp_table_group = GROUP tmp_table BY is_male;
      DUMP tmp_table_group;

##### 14.Counting by group

     1)Mysql
       SELECT IS_MALE,COUNT(*) FROM TMP_TABLE GROUP BY IS_MALE;

     2)Pig
        tmp_table_group_count = GROUP tmp_table BY is_male;
        tmp_table_group_count = FOREACH tmp_table_group_count GENERATE group,COUNT($1);
        DUMP tmp_table_group_count;

##### 15.DISTINCT

     1)MYSQL
        SELECT DISTINCT IS_MALE FROM TMP_TABLE;

     2)Pig
        tmp_table_distinct = FOREACH tmp_table GENERATE is_male;
        tmp_table_distinct = DISTINCT tmp_table_distinct;
        DUMP  tmp_table_distinct;