---
layout: post
title: Hadoop Serialization Framework 
category: Blog
guid: urn:uuid:0ccb922f-1ea4-4916-ae5e-20130506
tag: hadoop
---
Below are some mentioned in Hadoop In Practice and MapReduce Cookbooks

####Where to use serialization

* In order to be used as a value data type of a MapReduce computation, a data type must implement the org.apache.hadoop.io.Writable interface. The Writable interface which defines how Hadoop should serialize and de-serialize the values when transmitting and storing the data.

* In order to be used as a key data type of a MapReduce computation, a data type must implement the org.apache.hadoop.io.WritableComparable<T> interface. 

####Hadoop’s Writable versus Java’s Serializable

* Hadoop’s Writable-based serialization framework provides a more efficient and customized serialization and representation of the data for MapReduce programs than using the general-purpose Java’s native serialization framework.

* As opposed to Java’s serialization, Hadoop’s Writable framework does not write the type name with each object expecting all the clients of the serialized data to be aware of the types used in the serialized data. Omitting the type names makes the serialization process faster and results in compact, random accessible serialized data formats that can be easily interpreted by non-Java clients. 

* Hadoop’s Writable-based serialization also has the ability to reduce the object-creation overhead by reusing the Writable objects, which is not possible with the Java’s native serialization framework.

![](http://i.imgur.com/ltXrqAZ.png)

