+++
title = "All About Big Data Interviews"
date = "2019-06-02T13:50:46+02:00"
tags = ["big data"]
categories = ["article"]
banner = "/img/banners/interview.jpg"
+++

Quite often, we got chances to go for big data interviews or interview some candidates. Most of time, we could add some short questions in addition to the white board coding. Here, we collect a few aspects of areas we can focus during the interview or prepaing the coming interviews.

## Concept
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

>**2. How to implement polymorphism java, ways? **

Use interface, class inheritance and method override, overload.

>**3. What is AOP? **


>**4. List ways to create object in Java **

Use new keyword, reflection, clone, or serilization.


## Problem Solving
>**1. You are climbing a stair case. It takes n steps to reach to the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?**

Think about **Fibonacci Number** and/or [dynamic programing](https://leetcode.com/problems/climbing-stairs/solution/).

>**2. You are trying to put 1000 apples into 10 boxes. No matter how many apples you need, you can always to find couple of boxes which contains the right sum of apples in your demand. How many numbers of apples should be in each box?**

Think about binary to decimal, pow(2, 10) = 1024 > 1000. The number will be 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 486.

## Experience
>**1. What's the typical use case of *Redis*?**

Distributed Cache. Also see this [article](https://datafibers-community.github.io/blog/2019/05/20/2019-05-20-use-redis-lock-for-seckill/).

>**2. String s1=”ab”, String s2=”a”+”b”, String s3=”a”, String s4=”b”, s5=s3+s4, then s5==s2 returns true or false?**

false. During the code compling, the s2 is optimize as ”ab” and keep in constant pool. However, s5 is created in stack which is equal to s5=new String(“ab”);

>**3. Are you farmilar the intern() method in String class?**

intern() will look if there is constant value in the constant pool. If yes, reuse. Or else create a new one in the pool. For example, 
String s1=”aa”; 
String s2=s1.intern(); 
System.out.print(s1==s2);//return true


 
