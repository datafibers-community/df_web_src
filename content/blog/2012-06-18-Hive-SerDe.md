---
layout: post
uri: /posts/111
permalink: /posts/111/index.html
title: Hive SerDe
category: Blog
tag: hive
guid: urn:uuid:0ccb922f-1ea4-4916-ae5e-20130118
---
Unless there are no way to user internal parser, I do not recommend write user defined SerDe. Do not forget that Hive comes with a contrib RegexSerDeclass, which can tokenize your logs/files to resolve most problems:

    CREATE EXTERNAL TABLE logs_20120101 (
    host STRING,
    identity STRING,
    user STRING,
    time STRING,
    request STRING,
    status STRING,
    size STRING)
    ROW FORMAT SERDE 'org.apache.hadoop.hive.contrib.serde2.RegexSerDe'
    WITH SERDEPROPERTIES (
    "input.regex" =
    "([^ ]*) ([^ ]*) ([^ ]*) (-|\\[[^\\]]*\\])([^ \"]*|\"[^\"]*\") 
     (-|[0-9]*) (-|[0-9]*)",
    "output.format.string"="%1$s %2$s %3$s %4$s %5$s %6$s %7$s"
    )
    STORED AS TEXTFILE LOCATION '/data/logs/20120101/';
