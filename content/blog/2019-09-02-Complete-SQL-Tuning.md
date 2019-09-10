+++
title = "The Complete SQL Tuning"
date = "2019-09-02T14:53:46+03:00"
tags = ["big data"]
categories = ["article"]
banner = "/img/banners/sql_tuning.jpg"
+++

## SQL Statement (MySQL)

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

1. If possible use columns rather than select * 

1. Use table alias when you have many tables in the query

1. Use temporary tables to deal with complex logic and data transformation.

1. Use **UNION ALL** has more chances to leverage index than using **OR**.

1. For the list of values after **IN**, put the most frequent value in front.

1. Since store procedure is precompiled. It has better performance.

1. Try to use **exists** instead of **select count(1)**. **count(1)** performs better than **count(*)**.

1. Using Index： Index is decided according to query patterns. Most of time, do not create too many indexes on one table (ideally, less than 6). Try to use index as munch as possible. If multiple columns are used in the index, the index will be used only when the first column is used in query condition. Index rebuild should be scheduled and mainteained.　

1. Below queries have proper index created but not being used. 
```
SELECT * FROM record WHERE substrINg(card_no,1,4)=’5378’ (13s) 
SELECT * FROM record WHERE amount/30< 1000 (11s)
SELECT * FROM record WHERE convert(char(10),date,112)=’19991201’ (10s)
``` 

By remove the calclations on the indexed columns, we ensure the index being used and performance becomes better.
```
SELECT * FROM record WHERE card_no like ‘5378%’ (< 1s)
SELECT * FROM record WHERE amount< 1000*30 (< 1s) 
SELECT * FROM record WHERE date= ‘1999/12/01’ (< 1s)
```

1. Bulk insert or update is always the first choice.

1. If possible remove rows before **GROUP BY**. 
Slow: 
```
SELECT JOB, AVG(SAL) FROM EMP GROUP BY JOB HAVING JOB = 'PRESIDENT' OR JOB = 'MANAGER'
``` 
Fast:
``` 
SELECT JOB, AVG(SAL) FROM EMP WHERE JOB = 'PRESIDENT' OR JOB = 'MANAGER' GROUP BY JOB
```

1. Try to use Common Table Expression

1. Trigger ususally brings performance overhead.

1. 索引创建规则： 
表的主键、外键必须有索引； 
数据量超过300的表应该有索引； 
经常与其他表进行连接的表，在连接字段上应该建立索引； 
经常出现在Where子句中的字段，特别是大表的字段，应该建立索引； 
索引应该建在选择性高的字段上； 
索引应该建在小字段上，对于大的文本字段甚至超长字段，不要建索引； 
复合索引的建立需要进行仔细分析，尽量考虑用单字段索引代替； 
正确选择复合索引中的主列字段，一般是选择性较好的字段； 
复合索引的几个字段是否经常同时以AND方式出现在Where子句中？单字段查询是否极少甚至没有？如果是，则可以建立复合索引；否则考虑单字段索引； 
如果复合索引中包含的字段经常单独出现在Where子句中，则分解为多个单字段索引； 
如果复合索引所包含的字段超过3个，那么仔细考虑其必要性，考虑减少复合的字段； 
如果既有单字段索引，又有这几个字段上的复合索引，一般可以删除复合索引； 
频繁进行数据操作的表，不要建立太多的索引； 
删除无用的索引，避免对执行计划造成负面影响； 
表上建立的每个索引都会增加存储开销，索引对于插入、删除、更新操作也会增加处理上的开销。另外，过多的复合索引，在有单字段索引的情况下，一般都是没有存在价值的；相反，还会降低数据增加删除时的性能，特别是对频繁更新的表来说，负面影响更大。 
尽量不要对数据库中某个含有大量重复的值的字段建立索引。

1. mysql查询优化总结：使用慢查询日志去发现慢查询，使用执行计划去判断查询是否正常运行，总是去测试你的查询看看是否他们运行在最佳状态下。久而久之性能总会变化，避免在整个表上使用count(*),它可能锁住整张表，使查询保持一致以便后续相似的查询可以使用查询缓存 
，在适当的情形下使用GROUP BY而不是DISTINCT，在WHERE, GROUP BY和ORDER BY子句中使用有索引的列，保持索引简单,不在多个索引中包含同一个列，有时候MySQL会使用错误的索引,对于这种情况使用USE INDEX，检查使用SQL_MODE=STRICT的问题，对于记录数小于5的索引字段，在UNION的时候使用LIMIT不是是用OR。 
为了 避免在更新前SELECT，使用INSERT ON DUPLICATE KEY或者INSERT IGNORE ,不要用UPDATE去实现，不要使用 MAX,使用索引字段和ORDER BY子句，LIMIT M，N实际上可以减缓查询在某些情况下，有节制地使用，在WHERE子句中使用UNION代替子查询，在重新启动的MySQL，记得来温暖你的数据库，以确保您的数据在内存和查询速度快，考虑持久连接，而不是多个连接，以减少开销，基准查询，包括使用服务器上的负载，有时一个简单的查询可以影响其他查询，当负载增加您的服务器上，使用SHOW PROCESSLIST查看慢的和有问题的查询，在开发环境中产生的镜像数据中 测试的所有可疑的查询。

1. MySQL 备份过程: 
从二级复制服务器上进行备份。在进行备份期间停止复制，以避免在数据依赖和外键约束上出现不一致。彻底停止MySQL，从数据库文件进行备份。 
如果使用 MySQL dump进行备份，请同时备份二进制日志文件 – 确保复制没有中断。不要信任LVM 快照，这很可能产生数据不一致，将来会给你带来麻烦。为了更容易进行单表恢复，以表为单位导出数据 – 如果数据是与其他表隔离的。 
当使用mysqldump时请使用 –opt。在备份之前检查和优化表。为了更快的进行导入，在导入时临时禁用外键约束。 
为了更快的进行导入，在导入时临时禁用唯一性检测。在每一次备份后计算数据库，表以及索引的尺寸，以便更够监控数据尺寸的增长。 
通过自动调度脚本监控复制实例的错误和延迟。定期执行备份。

1. 查询缓冲并不自动处理空格，因此，在写SQL语句时，应尽量减少空格的使用，尤其是在SQL首和尾的空格(因为，查询缓冲并不自动截取首尾空格)。

1. member用mid做標準進行分表方便查询么？一般的业务需求中基本上都是以username为查询依据，正常应当是username做hash取模来分表吧。分表的话 mysql 的partition功能就是干这个的，对代码是透明的； 
在代码层面去实现貌似是不合理的。

1. 我们应该为数据库里的每张表都设置一个ID做为其主键，而且最好的是一个INT型的（推荐使用UNSIGNED），并设置上自动增加的AUTO_INCREMENT标志。

1. 在所有的存储过程和触发器的开始处设置 SET NOCOUNT ON ，在结束时设置 SET NOCOUNT OFF 。 
无需在执行存储过程和触发器的每个语句后向客户端发送 DONE_IN_PROC 消息。

1. MySQL查询可以启用高速查询缓存。这是提高数据库性能的有效Mysql优化方法之一。当同一个查询被执行多次时，从缓存中提取数据和直接从数据库中返回数据快很多。

1. EXPLAIN SELECT 查询用来跟踪查看效果 
使用 EXPLAIN 关键字可以让你知道MySQL是如何处理你的SQL语句的。这可以帮你分析你的查询语句或是表结构的性能瓶颈。EXPLAIN 的查询结果还会告诉你你的索引主键被如何利用的，你的数据表是如何被搜索和排序的……等等，等等。

1. 当只要一行数据时使用 LIMIT 1 
当你查询表的有些时候，你已经知道结果只会有一条结果，但因为你可能需要去fetch游标，或是你也许会去检查返回的记录数。在这种情况下，加上 LIMIT 1 可以增加性能。这样一样，MySQL数据库引擎会在找到一条数据后停止搜索，而不是继续往后查少下一条符合记录的数据。

1. 选择表合适存储引擎： 
myisam: 应用时以读和插入操作为主，只有少量的更新和删除，并且对事务的完整性，并发性要求不是很高的。 
Innodb： 事务处理，以及并发条件下要求数据的一致性。除了插入和查询外，包括很多的更新和删除。（Innodb有效地降低删除和更新导致的锁定）。对于支持事务的InnoDB类型的表来说，影响速度的主要原因是AUTOCOMMIT默认设置是打开的，而且程序没有显式调用BEGIN 开始事务，导致每插入一条都自动提交，严重影响了速度。可以在执行sql前调用begin，多条sql形成一个事物（即使autocommit打开也可以），将大大提高性能。

1. 优化表的数据类型,选择合适的数据类型： 
原则：更小通常更好，简单就好，所有字段都得有默认值,尽量避免null。 
例如：数据库表设计时候更小的占磁盘空间尽可能使用更小的整数类型.(mediumint就比int更合适) 
比如时间字段：datetime和timestamp, datetime占用8个字节，而timestamp占用4个字节，只用了一半，而timestamp表示的范围是1970—2037适合做更新时间 
MySQL可以很好的支持大数据量的存取，但是一般说来，数据库中的表越小，在它上面执行的查询也就会越快。 
因此，在创建表的时候，为了获得更好的性能，我们可以将表中字段的宽度设得尽可能小。例如， 
在定义邮政编码这个字段时，如果将其设置为CHAR(255),显然给数据库增加了不必要的空间， 
甚至使用VARCHAR这种类型也是多余的，因为CHAR(6)就可以很好的完成任务了。同样的，如果可以的话， 
我们应该使用MEDIUMINT而不是BIGIN来定义整型字段。 
应该尽量把字段设置为NOT NULL，这样在将来执行查询的时候，数据库不用去比较NULL值。 
对于某些文本字段，例如“省份”或者“性别”，我们可以将它们定义为ENUM类型。因为在MySQL中，ENUM类型被当作数值型数据来处理， 
而数值型数据被处理起来的速度要比文本类型快得多。这样，我们又可以提高数据库的性能。

1. 字符串数据类型：char，varchar，text选择区别

1. 任何对列的操作都将导致表扫描，它包括数据库函数、计算表达式等等，查询时要尽可能将操作移至等号右边。

## Indexing

1. 应尽量避免在 where 子句中对字段进行 null 值判断，否则将导致引擎放弃使用索引而进行全表扫描，如：select id from t where num is null可以在num上设置默认值0，确保表中num列没有null值，然后这样查询：select id from t where num=0

1. 应尽量避免在 where 子句中使用!=或<>操作符，否则引擎将放弃使用索引而进行全表扫描。

1. 应尽量避免在 where 子句中使用or 来连接条件，否则将导致引擎放弃使用索引而进行全表扫描，如：select id from t where num=10 or num=20可以这样查询：select id from t where num=10 union all select id from t where num=20 和 not in 也要慎用，否则会导致全表扫描，如：select id from t where num in(1,2,3) 对于连续的数值，能用 between 就不要用 in 了：select id from t where num between 1 and 3

1. 临时表并不是不可使用，适当地使用它们可以使某些例程更有效，例如，当需要重复引用大型表或常用表中的某个数据集时。但是，对于一次性事件，最好使用导出表。

1. 在新建临时表时，如果一次性插入数据量很大，那么可以使用 select into 代替 create table，避免造成大量 log ，以提高速度；如果数据量不大，为了缓和系统表的资源，应先create table，然后insert。

1. 如果使用到了临时表，在存储过程的最后务必将所有的临时表显式删除，先 truncate table ，然后 drop table ，这样可以避免系统表的较长时间锁定。

1. 尽量避免使用游标，因为游标的效率较差，如果游标操作的数据超过1万行，那么就应该考虑改写。

1. 使用基于游标的方法或临时表方法之前，应先寻找基于集的解决方案来解决问题，基于集的方法通常更有效。

1. 与临时表一样，游标并不是不可使 用。对小型数据集使用 FAST_FORWARD 游标通常要优于其他逐行处理方法，尤其是在必须引用几个表才能获得所需的数据时。在结果集中包括“合计”的例程通常要比使用游标执行的速度快。如果开发时 间允许，基于游标的方法和基于集的方法都可以尝试一下，看哪一种方法的效果更好。


1. Aviod doing huge transactions.

1. Avoid return too much data to the client side

## Other
MySQL 对于千万级的大表要怎么优化？

第一优化你的sql和索引；MySQL性能优化的最佳20+条经验：http://coolshell.cn/articles/1846.html

第二加缓存，memcached,redis；

第三以上都做了后，还是慢，就做主从复制或主主复制，读写分离

第四如果以上都做了还是慢，不要想着去做切分，mysql自带分区表：http://www.cnblogs.com/zemliu/archive/2013/07/21/3203511.html

第五如果以上都做了，那就先做垂直拆分，其实就是根据你模块的耦合度，将一个大的系统分为多个小的系统，也就是分布式系统；列与列之间关联性不大的时候，垂直切分。

第六才是水平切分，针对数据量大的表，行很多的时候水平切分表，表名取模：http://www.cnblogs.com/sns007/p/5790838.html


 