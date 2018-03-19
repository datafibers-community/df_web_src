+++
title = "Hive Get the Max/Min"
date = "2018-02-02T13:50:46+02:00"
tags = ["hive", "spark"]
categories = ["article"]
banner = "/img/banners/maxmin.jpg"
+++
<p align="left"><img src="/img/banners/maxmin.jpg" width="400"></p>

Most of time, we need to find the max or min value of particular columns as well as other columns. For example, we have following _employee_ table.

```
DESC employee;
+---------------+------------------------------+----------+--+
|   col_name    |          data_type           | comment  |
+---------------+------------------------------+----------+--+
| name          | string                       |          |
| work_place    | array<string>                |          |
| gender_age    | struct<gender:string,age:int>|          |
| skills_score  | map<string,int>              |          |
| depart_title  | map<string,array<string>>    |          |
+---------------+------------------------------+----------+--+
5 rows selected (0.186 seconds)

> SELECT name,gender_age.gender AS gender,gender_age.age AS age FROM employee;
+----------+---------+------+
|   name   |  gender | age  |
+----------+---------+------+
| Michael  | Male    | 30   |
| Will     | Male    | 35   |
| Shelley  | Female  | 27   |
| Lucy     | Female  | 57   |
| Steven   | Male    | 30   |
+----------+---------+------+
5 rows selected (75.887 seconds)
```
## Questions

> **Who is oldest of males or females?** 

There are three solutions available.  **Note**, gender_age is a struct.

## Solution 1

The most frequent way of doing it is to to firstly find the MAX of age in each gender group and do SELF JOIN by matching gender and the MAX age as follows. This will create two stages of jobs and **NOT** efficient.

```
> SELECT employee.gender_age.gender, employee.gender_age.age, name 
> FROM
> employee JOIN 
> (
> SELECT 
> max(gender_age.age) as max_age, gender_age.gender as gender  
> FROM employee
> GROUP BY gender_age.gender
> ) maxage
> ON employee.gender_age.age = maxage.max_age
> AND employee.gender_age.gender = maxage.gender;
+--------------+------+-------+
| gender       | age  | name  |
+--------------+------+-------+
| Female       | 57   | Lucy  |
| Male         | 35   | Will  |
+--------------+------+-------+
2 rows selected (94.043 seconds)
```

## Solution 2

Once Hive 0.11.0 introduced analytics functions, we can use ROW_NUMBER to solve the problem as well, but only trigger one MapReduce job.

```
> SELECT gender, age, name
> FROM
> (
> SELECT gender_age.gender AS gender,
> ROW_NUMBER() OVER (PARTITION BY gender_age.gender ORDER BY gender_age.age DESC) AS row_num, 
> gender_age.age as age,name
> FROM employee
> ) t WHERE row_num = 1;
+---------+------+-------+
| gender  | age  | name  |
+---------+------+-------+
| Female  | 57   | Lucy  |
| Male    | 35   | Will  |
+---------+------+-------+
2 rows selected (61.655 seconds)
```

## Solution 3

Actually, there is a better way of doing it as follows through ***MAX/MIN STRUCT*** function added by **[Hive-1128](https://issues.apache.org/jira/browse/HIVE-1128)** since Hive 0.6.0, although it is not documented anywhere in the Hive Wiki.

```
> SELECT gender_age.gender, 
> max(struct(gender_age.age, name)).col1 as age,
> max(struct(gender_age.age, name)).col2 as name
> FROM employee
> GROUP BY gender_age.gender;
+--------------+------+-------+
| gender       | age  | name  |
+--------------+------+-------+
| Female       | 57   | Lucy  |
| Male         | 35   | Will  |
+--------------+------+-------+
2 rows selected (47.659 seconds)
```

The above job only trigger one MapReduce job. We still need to use the *Group By* clause. However, we can use ***MAX/MIN STRUCT*** function to show all other columns in the same line of *MAX/MIN* value. By default, *Group By* clause does not allow columns shown in the *SELECT* list if it is not *Group By* column.

## Summary
The solution 3 is better in terms of performance, query complexity, and version supports at older Hive. The solution 2 is better and powerful since it does not require GROUP BY keywords. In addition, the solutions above are all working in Spark SQL.