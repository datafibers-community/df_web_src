+++
title = "Flink Windows Explained"
date = "2019-10-05T19:50:46+02:00"
tags = ["flink"]
categories = ["article"]
banner = "/img/banners/flink_logo.jpg"
+++

## Overview
Apache Flink supports data analysis over specific ranges in terms of windows. It supports two ways to create windows, **time** and **count**. Time window defines windows by specific time range. Count window defines windows by specifc number of envents.

In addition, there are two windows time attributes.

* size: how long the window itsef last
* interval: how long between windows

Whenever the window size = interval, this type of windows are called **tumbling-window**. It is so called tumbling because it looks like rolling without overlaping. Whenever the window size > interval, this type of windows are called **sliding-window**. It is so called sliding because it looks like ice sliding with overlap. Whenever the window size < interval, this type of windows are not useful since it loses data, such as telling the traffic statistics within the past 3 seconds for every 5 seconds (2 seconds' data are lost). 

If we consider the combination between time/count and size/interval, there are following four valid windows in Apache Flink.

* **time-tumbling-window** is coded like ```timeWindow(Time.seconds(5))```
* **time-sliding-window** is coded like ```timeWindow(Time.seconds(5), Time.seconds(3))```
* **count-tumbling-window** is coded like ```countWindow(5)```
* **count-sliding-window** is coded like ```countWindow(5,3)```

Flink supports dividing windows by keys over stream wondows as shown clearly in below chart.

<p align="center"><img src="/img/banners/flink_wondows.png" width="800"></p>

## Session Window
It is quite often we want report events in active period of time or gap, like regular **Session Window** does. Below is a sample code with Flink DataStream API.

```
// Stream of (userId, buyCnts)
val buyCnts: DataStream[(Int, Int)] = ...
    
val sessionCnts: DataStream[(Int, Int)] = vehicleCnts
    .keyBy(0)
    // session window based on a 30 seconds session gap interval 
    .window(ProcessingTimeSessionWindows.withGap(Time.seconds(30)))
    .sum(1)
```

## Tumbling Count Window
For example, we want to report every 100 customers events. Whenever there are 100 events in a windows, we start calculation, like what **Tumbling Count Window** does. Below is a sample code with Flink DataStream API.

```
// Stream of (userId, buyCnts)
val buyCnts: DataStream[(Int, Int)] = ...

val tumblingCnts: DataStream[(Int, Int)] = buyCnts
  // key stream by userId
  .keyBy(0)
  // tumbling count window of 100 elements size
  .countWindow(100)
  // compute the buyCnt sum 
  .sum(1)
```

## Sliding Time Window
For example, we can calculate the customer purchase within one minute and we do such calculation ever 30 seconds, like what **Sliding Time Window** does. In this type of window, one event could belong to multiple windows. Below is a sample code with Flink DataStream API.

```
val slidingCnts: DataStream[(Int, Int)] = buyCnts
  .keyBy(0) 
  .timeWindow(Time.minutes(1), Time.seconds(30))
  .sum(1)
```

## Tumbling Time Window
For example, when we want to know the total customer purchase within one minute, we need to divide the purchase events for every minite, like what **Tumbling Time Window** does. In this type of window, each event only belongs to one window. Below is a sample code with Flink DataStream API.

```
// Stream of (userId, buyCnts)
val counts: DataStream[(Int, Int)] = ...
val tumblingCnts: DataStream[(Int, Int)] = counts
  // key by userId
  .keyBy(0) 
  // One minute Tumbling Time Window
  .timeWindow(Time.minutes(1))
  // calculate the sum
  .sum(1) 
```

## Summary
In a word, the Apache Flink window defines a collection over infinitive stream. This collection could be based on time and events count and both. Flink DataStream provides simple API for winodow definition and operations.

## Reference
1. [Kafka Stream Windows](https://github.com/datafibers/simple_stream/tree/master/df_stream_kafka)