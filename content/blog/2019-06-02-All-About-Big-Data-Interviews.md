+++
title = "All About Big Data Interviews"
date = "2019-06-02T13:50:46+02:00"
tags = ["big data"]
categories = ["article"]
banner = "/img/banners/interview.jpg"
+++

Quite often, we got chances to go for big data interviews or interview some candidates. Most of time, we could add some short questions in addition to the white board coding. Here, we collect a few aspects of areas we can focus during the interview or prepaing the coming interviews.

## Small Concept
>**1. What's the reason to use *Dequeue* instead of *Stack* in Java.**

```
Dequeue has the ability to use streams convert to list with keeping LIFO concept applied while stack does not.

Stack<Integer> stack = new Stack<>();
Deque<Integer> deque = new ArrayDeque<>();

stack.push(1);//1 is the top
deque.push(1)//1 is the top
stack.push(2);//2 is the top
deque.push(2);//2 is the top

List<Integer> list1 = strack.stream().collect(Collectors.toList());//[1,2]
List<Integer> list2 = deque.stream().collect(Collectors.toList());//[2,1]
```

## Problem Solving
>**1. You are climbing a stair case. It takes n steps to reach to the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?**

Think about **Fibonacci Number** and/or [dynamic programing](https://leetcode.com/problems/climbing-stairs/solution/).

## Experience
>**1. What's the typical use case of *Redis*?**

Distributed Cache. Also see this [article](https://datafibers-community.github.io/blog/2019/05/20/2019-05-20-use-redis-lock-for-seckill/).

 
