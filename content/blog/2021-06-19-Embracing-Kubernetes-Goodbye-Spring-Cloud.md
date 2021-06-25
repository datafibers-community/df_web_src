+++
title = "Embracing Kubernetes, Goodbye Spring Cloud"
date = "2021-06-19T10:17:46+02:00"
tags = ["k8s"]
categories = ["digest"]
banner = "/img/banners/k8s01.png"
+++
---
I believe many developers, after familiarizing themselves with microservices, realized that they thought they had successfully built a microservices architecture empired with Spring Cloud. But after the popular of kubernetes (K8S), they were curious and exciting of creating the cloud native microservices serivces.

## The Era of Spring Boot and Cloud
In October 2012, Mike Youngstrom created a feature request in Spring Jira to support a containerless web application architecture in the Spring Framework. He suggested configuring web container services inside the Spring container guided by the main method. This requirement led to the development of the Spring Boot project that started in early 2013. in April 2014, Spring Boot 1.0.0 was released. Since then, a number of smaller versions of Spring Boot have started to appear.
The simplicity of Spring boot allows java developers to quickly apply it to projects at scale. Spring boot is arguably one of the fastest ways to develop RESTful microservices based web applications in Java. It is also well suited for docker container deployment and rapid prototyping. All the way to Spring Cloud from Spring, the first big companies that selected it built a complete microservices ecosystem early on, and many solutions are open source, and many pitfalls have been stepped through quite steadily. For many small and medium-sized companies that want to use microservices architecture, it is definitely the best time to enter the market and use the Spring Cloud stack directly.

## The Era of Kubernetes
But when K8S was introduced, things start changing. Although Java ecosystem of Spring Cloud is by far the most complete microservices framework, basically satisfying all microservices architecture requirements, it makes most architecture closely tide to Java. Especially after Oracel Java start charging money for upgrade and mainteanance, many company are looking for alternatives of Java. In addition, the performance of Java make it not the best of choice for high performance applications which becomes more and more common senarios in this era. As result, some companys give up Java and others stick to Java because they have to.

Now, K8S is 7 years and it becomes more mature and popular. It becomes one of most popular open source project in the planent and backed by so many great companies, such as Google and Redhat. When we put the original Spring Cloud-based services into K8S, we found out there are many overlape mechanisms offered by K8S and Spring cloud. Although SPring Could tries their best to integrate and merge it using https://github.com/spring-cloud/spring-cloud-kubernetes, it is quite clear developers now have more chioce to move out from Java stack freely.

Let's have a quick look what's offered in Spring Cloud can be replaced by K8S.

* Service Discovery
Spring Cloud's classic solutions: Netflix Eureka, Alibaba Nacos, Hashicorp. the main principle is to register your own services when they are deployed, so that other services can retrieve them.
```
spring.cloud.service-registry.auto-registration.enabled
@EnableDiscoveryClient(autoRegister=false)
```
However, in K8S, the registration and querying of services is handled by the native Service component, whose connection name is implemented using internal DNS. This means that we have to connect the service discovery function to the K8S Service mechanism. To achieve this, the solution provides a DiscoveryClient component that allows cloud-based applications to easily query other services. With Kubernetes native service discovery, the service can be tracked by Istio and will be under the control of Service Mesh in the future.

* Configuration Management
In Spring Cloud, we can use spring cloudc config service. On the other hand, Kubernetes ConfigMap and Secret are available, and are often paired with Vault to manage sensitive configurations. K8S solution provides ConfigMapPropertySource and SecretsPropertySource to access ConfigMap and Secret on Kubernetes.

* Load Balancing & Circuit Breaker
Spring Cloud's original solution: Netflix Ribbon and Hystrix, but in K8S there is Service implementation of load balancing and Istio can implement fusion breaker, developers only need to focus on crud. Since load balancing and fusion breaker will rely on service discovery mechanism, so Ribbon and Hytrix's original functionality fails in the K8S native environment. There is some mention in the solution about Ribbon integration with Kubernetes native environment implementation, but the relevant link has disappeared and should be dropped. So it is recommended to avoid using client-side load balancing and fusers.

* Service Implementation
Compared to the service implemention, Spring Boot make the code implemention so easy, but the Spring it can only use Java. The K8S ecosystem has been developed and designed to be more versatile and extensive, and some of the features of the Spring Cloud components are also integrated and considered and extended in Kubernetes. By using K8S, developers now have more chocie to implement micro-service in the cloud with cloud efficient programming language, such as golang, rust, etc. As result, your service architecture has not to be tied to the specific language or stack.
<p align="center"><img src="/img/banners/k8s_spring_02.png" width="800"></p>

<p align="center"><img src="/img/banners/k8s_spring.png" width="800"></p>

## Summary
With the populrity of K8S, more and more company are moving to building native cloud micro-service with golang and K8S. I believe if NetFlex were nowadays for doing the same thing, they will not create Eruka. Althougt we can certainly ignore K8S native components altogether and adopt Spring Boot and Spring Cloud solutions completely or using K8S only as a tool and platform for deploying applications, it is equite clear that in the near future, Service Mesh and its generic Cloud Native technology development will be derailed from Spring Cloud and deeply integrated with our applications.