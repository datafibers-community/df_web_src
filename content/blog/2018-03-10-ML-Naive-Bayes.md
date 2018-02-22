+++
title = "Naive Bayes Algorithm"
date = "2018-02-10T13:50:46+02:00"
tags = ["spark","machine learning"]
categories = ["digest"]
banner = "/img/banners/Thomas_Bayes.png"
+++
## Background
It would be difficult and practically impossible to classify a web page, a document, an email or any other lengthy text notes manually. This is where Naïve Bayes Classifier machine learning algorithm comes to the rescue. A classifier is a function that allocates a population’s element value from one of the available categories. For instance, Spam Filtering is a popular application of Naïve Bayes algorithm. Spam filter here, is a classifier that assigns a label **Spam** or **Not Spam** to all the emails.

Naïve Bayes Classifier is amongst the most popular learning method grouped by similarities, that works on the popular Bayes Theorem of Probability to build machine learning models particularly for disease prediction and document classification. It is a simple classification of words based on Bayes Probability Theorem for subjective analysis of content.

## What is Naive Bayes?
It is a classification technique based on [Bayes’ Theorem](https://en.wikipedia.org/wiki/Bayes%27_theorem) with an assumption of independence among predictors/features and requires your features to take on non-negative values.. In simple terms, a Naive Bayes classifier assumes that the presence of a particular feature in a class is unrelated to the presence of any other feature. For example, a fruit may be considered to be an apple if it is red, round, and about 3 inches in diameter. Even if these features depend on each other or upon the existence of the other features, all of these properties independently contribute to the probability that this fruit is an apple and that is why it is known as _**Naive**_.

Naive Bayes model is easy to build and particularly useful for very large data sets. Along with simplicity, Naive Bayes is known to outperform even highly sophisticated classification methods. Bayes theorem provides a way of calculating posterior probability P(c|x) from P\(c), P(x) and P(x|c) as follows.

<p align="center"><img src="https://s3.ap-south-1.amazonaws.com/techleer/204.png" width="400"></p>

* **P(c|x) is the posterior probability of class (c, target) given predictor (x, attributes).**
* **P\(c) is the prior probability of class.**
* **P(x|c) is the likelihood which is the probability of predictor given class.**
* **P(x) is the prior probability of predictor.**

There are three types of Naive Bayes model:

* **[Gaussian](http://scikit-learn.org/stable/modules/naive_bayes.html)**: It is used in classification and it assumes that features follow a normal distribution. This is only supported by scikit learn library.
* **[Multinomial](http://scikit-learn.org/stable/modules/naive_bayes.html)**: It is used for discrete counts. For example, let’s say,  we have a text classification problem. Here we can consider bernoulli trials which is one step further and instead of “word occurring in the document”, we have “count how often word occurs in the document”, you can think of it as “number of times outcome number x_i is observed over the n trials”. This is **default** mode in spark MLLib.
* **[Bernoulli](http://scikit-learn.org/stable/modules/naive_bayes.html)**: The binomial model is useful if your feature vectors are binary (i.e. zeros and ones). One application would be text classification with ‘bag of words’ model where the 1s & 0s are “word occurs in the document” and “word does not occur in the document” respectively. This is also supported by Spark MLLib.

## How it Works for Example
Let’s understand the algorithm from an easiler example. Below is a training data set of weather and corresponding target variable **Play** (suggesting possibilities of playing). Now, we need to classify whether players will play or not based on weather condition.
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
> **Problem: Players will play if weather is sunny. Is this statement is correct?**

Now, use Naive Bayesian equation to calculate the posterior probability for each class. The class with the highest posterior probability is the outcome of prediction. First, convert the data set into a frequency table.
```
+-----------+----+-----+
| weather   | no | yes | 
+-----------+----+-----+
| overcast  | 0  |  4  |
+-----------+----+-----+
| rainy     | 3  |  2  |
+-----------+----+-----+
| sunny     | 2  |  3  |
+-----------+----+-----+
| total     | 5  |  9  |
+-----------+----+-----+
```

We can solve it using above discussed method by calculating the posterior probability.

**P(Yes|Sunny) = P(Sunny|Yes) * P(Yes)/P (Sunny)**

Here, we are able to calculate 

* **P(Sunny|Yes) = 3/9 = 0.33**
* **P(Sunny) = 5/14 = 0.36**
* **P(Yes)= 9/14 = 0.64**

Therefore, **P (Yes|Sunny) = 0.33 * 0.64 / 0.36 = 0.60**, which has higher probability.

## Pros and Cons?
### Pros
* It is easy and fast to predict class of test data set and also performs well in multi class prediction
* When assumption of independence holds, a Naive Bayes classifier performs better compare to other models like logistic regression and you need less training data.
* It perform well in case of categorical input variables compared to numerical variable(s). For numerical variable, normal distribution is assumed (bell curve, which is a strong assumption).
* Naïve Bayes Classifier algorithm performs well when the input variables are categorical.
* A Naïve Bayes classifier converges faster, requiring relatively little training data than other discriminative models like logistic regression, when the Naïve Bayes conditional independence assumption holds.
* With Naïve Bayes Classifier algorithm, it is easier to predict class of the test data set. A good bet for multi class predictions as well.
* Though it requires conditional independence assumption, Naïve Bayes Classifier has presented good performance in various application domains.

### Cons
* If categorical variable has a category (in test data set), which was not observed in training data set, then model will assign a 0 (zero) probability and will be unable to make a prediction. This is often known as “Zero Frequency”. To solve this, we can use the smoothing technique. One of the simplest smoothing techniques is called Laplace estimation.
* On the other side, Naive Bayes is also known as a bad estimator, so the probability outputs from predict_proba are not to be taken too seriously.
* Another limitation of Naive Bayes is the assumption of independent predictors. In real life, it is almost impossible that we get a set of predictors which are completely independent.
 

## Typical Use Cases
* Real time Prediction: Naive Bayes is an eager learning classifier and it is sure fast. Thus, it could be used for making predictions in real time.
* Multi class Prediction: This algorithm is also well known for multi class prediction feature. Here we can predict the probability of multiple classes of target variable.
* Recommendation System: Naive Bayes Classifier and Collaborative Filtering together builds a Recommendation System that uses machine learning and data mining techniques to filter unseen information and predict whether a user would like a given resource or not
* Sentiment Analysis: It is used at Facebook to analyse status updates expressing positive or negative emotions.
* Document Categorization: Google uses document classification to index documents and find relevancy scores i.e. the PageRank. PageRank mechanism considers the pages marked as important in the databases that were parsed and classified using a document classification technique. Naïve Bayes Algorithm is also used for classifying news articles about Technology, Entertainment, Sports, Politics, etc.
* Email Spam Filtering: Google Mail uses Naïve Bayes algorithm to classify your emails as Spam or Not Spam

## Example in Spark


### Reference
1. https://www.analyticsvidhya.com/blog/2017/09/naive-bayes-explained/
1. https://www.dezyre.com/article/top-10-machine-learning-algorithms/202
1. https://www.kdnuggets.com/2017/10/top-10-machine-learning-algorithms-beginners.html
1. https://www.kdnuggets.com/2016/08/10-algorithms-machine-learning-engineers.html