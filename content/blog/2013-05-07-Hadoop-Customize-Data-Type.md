---
layout: post
title: Hadoop Customize Data Type
category: Blog
guid: urn:uuid:0ccb922f-1ea4-4916-ae5e-20130507
tags:
    - hadoop
---
#### Customize Data Type - As Value

To create a customized data type used as a **value**, the data type must implement the org.apache.hadoop.io.Writable interface which consists of the two methods, readFields() and write()

*   [void readFields(DataInput in)](http://hadoop.apache.org/docs/current/api/org/apache/hadoop/io/Writable.html#readFields(java.io.DataInput)) : Deserialize the fields of this object from in.
*   [void write(DataOutput out)](http://hadoop.apache.org/docs/current/api/org/apache/hadoop/io/Writable.html#write(java.io.DataOutput) : Serialize the fields of this object to `out`.

**Note**:

*   In case you are adding a custom constructor to your custom Writable class, make sure to retain the default empty constructor.</span>
*   __TextOutputFormat__ uses the toString() method to serialize the key and value types. In case you are using the TextOutputFormat to serialize instances of your custom Writable type, make sure to have a meaningful toString() implementation for your custom Writable data type.
*  While reading the input data, Hadoop may reuse an instance of the Writable class </span><span style="font-size: 13px;line-height: 19px">repeatedly. You should not rely on the existing state of the object when populating it inside the __readFields()__ method.

<br/>

#### Customize Data Type - As Key

To create a customized data type used as a **key**, we need to implement the org.apache.hadoop.io.WritableComparable&lt;T&gt; interface and override following methods.

*   [void readFields(DataInput in)](http://download.oracle.com/javase/6/docs/api/java/io/DataInput.html?is-external=true "class or interface in java.io") : Deserialize the fields of this object from `in`
*   [void write(DataOutput out)](http://download.oracle.com/javase/6/docs/api/java/io/DataOutput.html?is-external=true "class or interface in java.io") : Serialize the fields of this object to `out`
*   [int compareTo(T o)](http://docs.oracle.com/javase/6/docs/api/java/lang/Comparable.html#compareTo(T)) : Compares this object with the specified object for order.</span>
*   int hashCode() : Used by Partitioner to decide which reducer to send the keys</span>

<br/>

#### Customize Data Type - As Value With Different Data Types

To create a customized data type wrapping different types of data together used as a **value**, we need to implement the org.apache.hadoop.io.GenericWritable interface and override following methods

*   protected Class[] getTypes() : Return warped list of Hadoop type classes

