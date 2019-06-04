+++
title = "Use Redish Lock for SecKill"
date = "2019-05-20T13:50:46+02:00"
tags = ["redish"]
categories = ["digest"]
banner = "/img/banners/seckill.jpg"
+++

## What is Seckill?
When associated with online shopping, **"seckill"** refers to the quick sell out of newly-advertised goods. If you look at the transaction record, you will find that each of the transactions is made in seconds. It sounds inconceivable but is the naked truth. This is called **"seckill"**. 

A typical system for seckill has following features.
* A large number of users will be shopping at the same time during the quick sell, and the web site traffic increses dramatically.
* Such sell activity generally has a much larger number of access requests than inventory, and only a small percentage of users can purchase successfully.
* The business process behind is relatively simple by placing an order and reducing the inventory.

## Design Considerations
* **Traffic Control**: Since only a small number of users can purchase successfully, majority requests of purchase traffic is controled and allowing only a small amount of requests to enter the service backend.

* **Peak Cutting**: There will be a large volumn of users for the system, so there will be a very high instantaneous peak at the beginning of the seckill. High peak flow is a very important reason for the crashing the system, so how to turn the instantaneous high flow into a stable flow for a period of time is also an important idea for designing the seckill system. Common methods for achieving peak cutting include techniques such as caching and message middleware.

* **Asynchronous Processing**: The seckill system is a high-concurrency system. The asynchronous processing mode can greatly improve the system concurrency. In fact, asynchronous processing is an implementation of peak cutting.

* **Memory Cache**: The biggest bottleneck of the seckill system is generally database read and write. Since the database read and write depends on the disk IO, the performance sometimes is very low. If some data or business logic can be transferred to the memory, the performance will be much improved.

* **Scalability**: By leveraging the scalabile design, we can leverage dynamic number of nodes in the cluster to meet the requirement for particular user case during pparticular time period.

## Solutions
As mentioned earlier, the key point to achieve seckill system is to control the thread's competition for resources. According to the basic thread knowledge, we can consider following solutions for implementation:
1. The abstraction of seckill at the technical level should be a method. The possible operation in this method is to update the goods in stock to stock-1, add the goods to the user's shopping cart, etc., and should operate the database without considering the cache. Then the simplest and straightforward implementation is to add the synchronized keyword to this method. In general, it is to lock the entire method.
2. Lock the entire method This strategy is simple and convenient, but it seems a bit rough. Can be slightly optimized, only lock the code block of the seckill, such as the part of the database.
3. Since there are concurrency problems, try to make it "not concurrent". Manage all the threads with a queue to make it into a serial operation, naturally there will be no concurrency problems.

The methods described above are all effective, but they are not good. why? The first and second methods are essentially "locked", but the lock granularity is still relatively high. Imagine if two threads execute the seckill method at the same time, the two threads operate on different commodities, which should be possible at the same time from the business. If the first two methods are used, the two threads will also go. Fighting for the same lock is actually unnecessary. The third method also did not solve the problem mentioned above.

So how do you control the lock on a better fine granularity? You can consider setting an exclusive lock for each item, and the string associated with the item ID is uniquely identified. This allows you to mutually exclusively contend for the same item instead of threads. Distributed locks in [Redis](https://redis.io/) can help us solve this problem.

## About Distributed Lock
Distributed locks are a way to control the simultaneous access of shared resources between distributed systems. In distributed systems, it is often necessary to coordinate their actions. If different systems or one host of resources are shared between different hosts of the same system, access to these resources often requires mutual exclusion to prevent mutual interference to ensure consistency. In this case, Use to a distributed lock.

Let's assume a simplest spike scenario: there is a table in the database, the column is the item ID, and the inventory quantity corresponding to the item ID. If the spike is successful, the stock amount of this item is -1. Now suppose there are 1000 threads to kill two items, 500 threads to kill the first item, and 500 threads to kill the second item. Let's explain distributed locks based on this simple business scenario.
Business systems that typically have spike scenarios are complex, carrying a huge amount of traffic and a high amount of concurrency. Such systems often employ a distributed architecture to balance the load. Then these 1000 concurrency will come from different places, commodity inventory is a shared resource, and these 1000 concurrent competing resources, this time we need to manage the mutual exclusion. This is the application of distributed locks.
Key-value storage systems, such as redis, are important tools for implementing distributed locks because of their features.

## Issues
>**What is the operation of redis?** 

Fortunately, redis has provided the jedis client for java applications, and can directly call the jedis API.

>**How to achieve locking?**
 
"Lock" is actually an abstract concept. The abstract concept is changed into a concrete thing. It is a key-value pair stored in redis. The key is uniquely identified by the string associated with the product ID. The value is not important. Because as long as this unique key-value exists, it means that the item is locked.

>**How to release the lock?** 

Since the key-value pair is locked, it is natural to delete the key-value pair in redis.

>**Blocking or non-blocking?** 

The author uses a blocking implementation, if the thread finds that it has been locked, it will poll the lock within a certain time.

>**How to deal with abnormal situations?** 

For example, a thread locks a product, but for various reasons, the operation is not completed (in the above business scenario, the inventory-1 is not written to the database), and naturally no lock is released. In this case, the author adds a lock timeout mechanism. Use redis's expire command to set the timeout period for the key. After the timeout period, redis will automatically delete the key, that is, force release the lock (it can be considered that the timeout release lock is an asynchronous operation, completed by redis, the application only needs to be based on the system. Features set the timeout period).

## Implementations
Let's take a look at some of the basic commands of redis:
```
SETNX key value
```
If the key does not exist, set the key to the string value. In this case, the command is the same as the SET. When the key already exists, no action is taken. SETNX is "SET if Not eXists".
```
Expire KEY seconds
```
Set the expiration time of the key. If the key has expired, it will be automatically deleted.
```
Del KEY
```
Delete key

To go through the implementation code, first let's define the interface for seckill.
```
public interface SeckillInterface {
    //cacheLock annotate the concurrent method
    @CacheLock(lockedPrefix="TEST_PREFIX")
    public void secKill(String userID,@LockedObject Long commidityID);//Simple method for seckill. Since multiple thread could race for the same commidity, LockedObject ahead of the parameter.
}
```

The implementaiton for the seckill method.
```
public class SecKillImpl implements SeckillInterface{
    static Map<Long, Long> inventory ;
    static{
        inventory = new HashMap<>();
        inventory.put(10000001L, 10000l);
        inventory.put(10000002L, 10000l);
    }

    @Override
    public void secKill(String arg1, Long arg2) {
        //demo purpose
        reduceInventory(arg2);
    }
    //Simply simulation, assume the seckill operation is to reduce the inventory.
    public Long reduceInventory(Long commodityId){
        inventory.put(commodityId,inventory.get(commodityId) - 1);
        return inventory.get(commodityId);
    }

}
```

For testing, use 1000 threads for seckill simulation.
```
@Test
public void testSecKill(){
	int threadCount = 1000;
	int splitPoint = 500;
	CountDownLatch endCount = new CountDownLatch(threadCount);
	CountDownLatch beginCount = new CountDownLatch(1);
	SecKillImpl testClass = new SecKillImpl();

	Thread[] threads = new Thread[threadCount];
	//First 500 threads for the 1st stuff
	for(int i= 0;i < splitPoint;i++){
		threads[i] = new Thread(new  Runnable() {
			public void run() {
				try {
					//wait to start
					beginCount.await();
					//call secKill with proxy
					SeckillInterface proxy = 
					(SeckillInterface) Proxy.newProxyInstance(SeckillInterface.class.getClassLoader(), 
						new Class[]{SeckillInterface.class}, new CacheLockInterceptor(testClass));
					proxy.secKill("test", commidityId1);
					endCount.countDown();
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		});
		threads[i].start();

	}
	//Another 500 threads for the 2nd stuff
	for(int i= splitPoint;i < threadCount;i++){
		threads[i] = new Thread(new  Runnable() {
			public void run() {
				try {
					//wait to start
					beginCount.await();
					 //call secKill with proxy
					SeckillInterface proxy = 
					(SeckillInterface) Proxy.newProxyInstance(SeckillInterface.class.getClassLoader(), 
						new Class[]{SeckillInterface.class}, new CacheLockInterceptor(testClass));
					proxy.secKill("test", commidityId2);
					//testClass.testFunc("test", 10000001L);
					endCount.countDown();
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		});
		threads[i].start();

	}


	long startTime = System.currentTimeMillis();
	//start all together
	beginCount.countDown();

	try {
		endCount.await();
		//check result
		System.out.println(SecKillImpl.inventory.get(commidityId1));
		System.out.println(SecKillImpl.inventory.get(commidityId2));
		System.out.println("error count" + CacheLockInterceptor.ERROR_COUNT);
		System.out.println("total cost " + (System.currentTimeMillis() - startTime));
	} catch (InterruptedException e) {
		e.printStackTrace();
	}
}
```

As the result, all inventory decrease 500 for each commidity. Without distributed lock, the inventory could not exactly decrease to 500 sometimes.

## Reference
1. https://blog.csdn.net/yunzhaji3762/article/details/79579318
1. https://blog.csdn.net/u010359884/article/details/50310387 
1. https://blog.csdn.net/shendl/article/details/51092916

