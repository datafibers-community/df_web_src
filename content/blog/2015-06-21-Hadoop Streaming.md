---
title: Hadoop Streaming
layout: post
guid: urn:uuid:04aadc1c-8153-42ec-8c45-201506211422
category: 
  - Blog
tags:
  - hadoop
---
![](/images/hadoopstream.jpg)
#### 1. Streaming Overview

Hadoop Streaming is a generic API which allows writing Mappers and Reduces in any language. 

* Develop MapReduce jobs in practically any language
* Uses Unix Streams as communication mechanism between Hadoop and your code
* Any language that can read standard input and write are supported

Few good use-cases:

* Text processing - scripting languages do well in text analysis
* Utilities and/or expertise in languages other than Java


#### 2. Process Flow

Below is how streaming processing

* Map input passed over standard input
* Map processes input line-by-line
* Map writes output to standard output - Key-value separate by tab
* Reduce input passed over standard input
  * Same as mapper output – key-value pairs separated by tab
  * Input is sorted by key
* Reduce writes output to standard output
   
!["avatar"](/images/hadoopstreaming.png)

#### 3. Example of mapper

**mapper.py**  

```
#!/usr/bin/env python 
import sys 
# mapper.py 
# input comes from STDIN (standard input) 
for line in sys.stdin: 
# remove leading and trailing white space 
line = line.strip() 
# split the line into words 
words = line.split() 
# increase counters for word in words: 
# write the results to STDOUT (standard output); 
# what we output here will be the input for the 
# Reduce step, i.e. the input for reducer.py 
# tab-delimited; the trivial word count is 1 
for word in words
print '%s\t%s' % (word, 1) 
```

#### 4. Example of reducer

**reducer.py**  

```
#!/usr/bin/env python
#reducer.py
import sys

current_word = None
current_count = 0
word = None

# input comes from STDIN
for line in sys.stdin:
    # remove leading and trailing white space
    line = line.strip()

    # parse the input we got from mapper.py
    word, count = line.split('\t', 1)

    # convert count (currently a string) to int
    try:
        count = int(count)
    except ValueError:
        # count was not a number, so silently ignore/discard this line
        continue

    # this IF-switch works because Hadoop sorts map output by key before passed to the reducer
    if current_word == word:
        current_count += count
    else:
        if current_word:
            # write result to STDOUT
            print '%s\t%s' % (current_word, current_count)
        current_count = count
        current_word = word

# do not forget to output the last word if needed!
if current_word == word:
    print '%s\t%s' % (current_word, current_count)  
```

#### 5. Run the job

* Test in local mode from Linux pipe
   
```
$ cat testText.txt | mapper.py | sort | reducer.py
a 1
h 1
i 4
s 1
t 5
v 1
```

* Run in the cluster

```
hadoop/yarn jar $HADOOP_HOME/share/hadoop/tools/lib/hadoop-streaming-*.jar \
-D mapred.job.name="Count Job via Streaming" \
-files $HADOOP_SAMPLES_SRC/scripts/mapper.py, $HADOOP_SAMPLES_SRC/scripts/reducer.py \
-input /training/input/hamlet.txt \
-output /training/output/ \
-mapper mapper.py \
-combiner reducer.py \
-reducer reducer.py
```

