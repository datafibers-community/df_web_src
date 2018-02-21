+++
title = "Naive Bayes Algorithm"
date = "2018-02-10T13:50:46+02:00"
tags = ["spark","machine learning"]
categories = ["article"]
banner = "/img/banners/Thomas_Bayes.png"
+++
## Background
It would be difficult and practically impossible to classify a web page, a document, an email or any other lengthy text notes manually. This is where Naïve Bayes Classifier machine learning algorithm comes to the rescue. A classifier is a function that allocates a population’s element value from one of the available categories. For instance, Spam Filtering is a popular application of Naïve Bayes algorithm. Spam filter here, is a classifier that assigns a label **Spam** or **Not Spam** to all the emails.

Naïve Bayes Classifier is amongst the most popular learning method grouped by similarities, that works on the popular Bayes Theorem of Probability to build machine learning models particularly for disease prediction and document classification. It is a simple classification of words based on Bayes Probability Theorem for subjective analysis of content.

## What is Naive Bayes?
It is a classification technique based on [Bayes’ Theorem](https://en.wikipedia.org/wiki/Bayes%27_theorem) with an assumption of independence among predictors. In simple terms, a Naive Bayes classifier assumes that the presence of a particular feature in a class is unrelated to the presence of any other feature. For example, a fruit may be considered to be an apple if it is red, round, and about 3 inches in diameter. Even if these features depend on each other or upon the existence of the other features, all of these properties independently contribute to the probability that this fruit is an apple and that is why it is known as ‘Naive’.

Naive Bayes model is easy to build and particularly useful for very large data sets. Along with simplicity, Naive Bayes is known to outperform even highly sophisticated classification methods.

Bayes theorem provides a way of calculating posterior probability P(c|x) from P(c), P(x) and P(x|c) as follows.

<p align="center"><img src="https://s3.ap-south-1.amazonaws.com/techleer/204.png" width="400"></p>

* **P(c|x) is the posterior probability of class (c, target) given predictor (x, attributes).**
* **P\(c) is the prior probability of class.**
* **P(x|c) is the likelihood which is the probability of predictor given class.**
* **P(x) is the prior probability of predictor.**

## How it Works for Example
Let’s understand the algorithm from an easiler example. Below is a training data set of weather and corresponding target variable **Play** (suggesting possibilities of playing). Now, we need to classify whether players will play or not based on weather condition. Let’s follow the below **steps** to perform it.
```
+-----------+--------+
| weather   | play ? |
+-----------+--------+
| sunny     | no     |
| overcast  | yes    |
| rainy     | yes    |
| sunny     | yes    |
| sunny     | yes    |
| overcast  | yes    |
| rainy     | no     |
| rainy     | no     |
| sunny     | yes    |
| rainy     | yes    |
| sunny     | no     |
| overcast  | yes    |
| overcast  | yes    |
| rainy     | no     |
+-----------+--------+
```
**Step 1.** Convert the data set into a frequency table
```
+-----------+----+
| weather   | no |
+-----------+----+
| overcast  | 0  |
+-----------+----+
| rainy     | 3  |
+-----------+----+
| sunny     | 2  |
+-----------+----+
| total     | 5  |
+-----------+----+
```

1. Create Likelihood table by finding the probabilities like Overcast probability = 0.29 and probability of playing is 0.64.

1. Now, use Naive Bayesian equation to calculate the posterior probability for each class. The class with the highest posterior probability is the outcome of prediction.

> **Problem: Players will play if weather is sunny. Is this statement is correct?**

We can solve it using above discussed method of posterior probability.

P(Yes | Sunny) = P( Sunny | Yes) * P(Yes) / P (Sunny)

Here we have P (Sunny |Yes) = 3/9 = 0.33, P(Sunny) = 5/14 = 0.36, P( Yes)= 9/14 = 0.64

Now, P (Yes | Sunny) = 0.33 * 0.64 / 0.36 = 0.60, which has higher probability.

Naive Bayes uses a similar method to predict the probability of different class based on various attributes. This algorithm is mostly used in text classification and with problems having multiple classes.
```
> SELECT employee.sex_age.sex, employee.sex_age.age, name 
> FROM
> employee JOIN 
> (
> SELECT 
> max(sex_age.age) as max_age, sex_age.sex as sex  
> FROM employee
> GROUP BY sex_age.sex
> ) maxage
> ON employee.sex_age.age = maxage.max_age
> AND employee.sex_age.sex = maxage.sex;
+--------------+------+-------+
| sex_age.sex  | age  | name  |
+--------------+------+-------+
| Female       | 57   | Lucy  |
| Male         | 35   | Will  |
+--------------+------+-------+
2 rows selected (94.043 seconds)
```

Option 1 => Using MontotonicallyIncreasingID or ZipWithUniqueId methods

Create a Dataframe from a parallel collection
Apply a spark dataframe method to generate Unique Ids Monotonically Increasing
import org.apache.spark.sql.functions._ 
val df = sc.parallelize(Seq(("Databricks", 20000), ("Spark", 100000), ("Hadoop", 3000))).toDF("word", "count") 
df.withColumn("uniqueID",monotonicallyIncreasingId).show()
Screen Shot 2016-05-23 at 4.13.37 PM

import org.apache.spark.sql.types.{StructType, StructField, LongType}
val df = sc.parallelize(Seq(("Databricks", 20000), ("Spark", 100000), ("Hadoop", 3000))).toDF("word", "count")
val wcschema = df.schema
val inputRows = df.rdd.zipWithUniqueId.map{
   case (r: Row, id: Long) => Row.fromSeq(id +: r.toSeq)}
val wcID = sqlContext.createDataFrame(inputRows, StructType(StructField("id", LongType, false) +: wcschema.fields))
Screen Shot 2016-05-23 at 4.13.46 PM

Option 2 => Use Row_Number Function

With PartitionBy Column:

val df = sc.parallelize(Seq(("Databricks", 20000), ("Spark", 100000), ("Hadoop", 3000))).toDF("word", "count")
df.createOrReplaceTempView("wordcount")
val tmpTable = sqlContext.sql("select row_number() over (partition by word order by count) as rnk,word,count from wordcount")
tmpTable.show()
Screen Shot 2016-05-23 at 8.12.15 PM

Without PartitionBy Column:

val tmpTable1 = sqlContext.sql("select row_number() over (order by count) as rnk,word,count from wordcount")
tmpTable1.show()
Screen Shot 2016-05-23 at 8.13.09 PM