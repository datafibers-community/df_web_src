+++
title = "The Complete SQL Tuning"
date = "2019-09-02T14:53:46+03:00"
tags = ["big data"]
categories = ["article"]
banner = "/img/banners/sql_tuning.jpg"
+++
The most practice comes for MySQL server, but it applies to other relational database as well.

1. Aviod full table scan and try to create index on the columns used after **where** or **order by**.

1. Aviod check null after **where** clause. You set set null as default value when creating tables. However, mostly we should use not null value or use special value, such as 0 or -1 for instead.

1. Avoid using != or <> after **where**. MySQL can support indexing on <, <=, =, >, >=, BETWEEN,IN, and sometimes LIKE。

1. Avoid using or after **where**. Or else, it causes full table scan rather using index. We can try to use **UNION** for instead. ```select id from t where num=10 union all select id from t where num=20```

1. Avoid using **in** and **not in**. Because it is likely to cause full table scan. If possible, use **between**, such as ```select id from t where num between 1 and 3```

1. Avoid using parameters after **where**, which is likely to cause full table scan.

1. Query ```select id from t where name like ‘%abc%’``` and ```select id from t where name like ‘%abc’``` may cause full table scan. Use ```select id from t where name like ‘abc%’``` to leverage index.

1. Use **exists** instead of **in**, such as ```select num from a where num in(select num from b)``` rewrite as ```select num from a where exists(select 1 from b where num=a.num)```

1. Index can improve the **select** performance. However, it may decrease the performance of **update** and **insert**, which could rebuild the index. Make more considerations when you create more than 6 indexes for one table.

1. Aviod update columns who has cluster index, because the cluster index use records' physical ordering. By updating it, it leads lots of data movement physically. If ou have such kinds of columns requires frequent update, create non-cluster index on it.

1. Use number data type instead of string 

1. Use **varchar/nvarchar** instead of **char/nchar** for saving more storage and improving query performance

1. If possible use columns rather than ```select * ```

1. Use table alias when you have many tables in the query

1. Use temporary tables to deal with complex logic and data transformation.

1. Use **UNION ALL** has more chances to leverage index than using **OR**.

1. For the list of values after **IN**, put the most frequent value in front.

1. Since store procedure is precompiled. It has better performance.

1. Try to use **exists** instead of **select count(1)**. **count(1)** performs better than **count(*)**.

1. Using Index： Index is decided according to query patterns. Most of time, do not create too many indexes on one table (ideally, less than 6). Try to use index as munch as possible. If multiple columns are used in the index, the index will be used only when the first column is used in query condition. Index rebuild should be scheduled and mainteained.　

1. Below queries have proper index created but not being used. 
	```
	SELECT * FROM record WHERE substrINg(card_no, 1, 4)= '5378' (13s) 
	SELECT * FROM record WHERE amount/30 < 1000 (11s)
	SELECT * FROM record WHERE convert(char(10), date, 112)= '19991201' (10s)
	``` 

	By remove the calclations on the indexed columns, we ensure the index being used and performance becomes better.
	```
	SELECT * FROM record WHERE card_no like '5378%' (< 1s)
	SELECT * FROM record WHERE amount < 1000*30 (< 1s) 
	SELECT * FROM record WHERE date = '1999/12/01' (< 1s)
	```

1. Bulk insert or update is always the first choice.

1. If possible remove rows before **GROUP BY**. 
	```
	SELECT JOB, AVG(SAL) FROM EMP GROUP BY JOB HAVING JOB = 'PRESIDENT' OR JOB = 'MANAGER' --slower
	SELECT JOB, AVG(SAL) FROM EMP WHERE JOB = 'PRESIDENT' OR JOB = 'MANAGER' GROUP BY JOB --faster
	```

1. Try to use Common Table Expression (CTE)

1. Trigger ususally brings performance overhead.

1. Usually we add a column, such as IDas PK with INT UNSIGNED and AUTO_INCREMENT.

1. At the begining of store procedures and triggers, add ```SET NOCOUNT ON```. At the end, add ```SET NOCOUNT OFF```. It is not necessary to send **DONE_IN_PROC** message to client after executing each statement.

1. Use cache when the database supports it

1. Use ```EXPLAIN SELECT ...``` to check query execution plan

1. If possible, limit the returned dataset.

1. Best practice to create index 
	* PK and FK should have index created 
	* Table has 300M of data should create index
	* Tables which are frequently used in join should have index on the join condition columns 
	* The colunms are frequently used after **where** or **select** should have index on them
	* Index should be created on the small size columns not on bigger one, such as long text columns 
	* If you have single index columns and multiple columns index on the same set of columns, remove multiple columns index
	* Multiple columns index usually contains no more than 3 columns
	* For tables which have frequently data operations, do not create too many index
	* Remove useless indexes
	* Avoid create index on the columns have many duplications or repeat values.

1. Aviod checking null in where clause since it may cause full table scan instead of using index. Try to set default value for null when you create the table.

1. Aviod using **!=, <>, OR** in where clause since it may cause full table scan instead of using index. 

1. When creating table with huge amount of data, use ```select into``` instead of ```create table``` to avoid generating too much log and improve performance.

1. ```truncate table```, then ```drop table``` to aviod locking system tables for long time.

1. Aviod using cusor because of bad performance especially when you deal with more than 10000 rows. You can use ```while loop``` for instead. If you have to use cusor, consider to use **FAST_FORWARD** cusor.

1. Aviod doing huge transactions.

1. Avoid return too much data to the client side

1. General performace tuning considerations
	* Optimize SQL and Index http://coolshell.cn/articles/1846.html
	* Leverage cache, such as memcached or redis.
	* Master-slave/Master-master replicate. Read and write seperation
	* Use partition tables
	* Vertically split tables according to business
	* Horizontally split tables, such as using moded table name 