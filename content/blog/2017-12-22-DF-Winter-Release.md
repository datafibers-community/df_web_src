+++
title = "2017 Winter Release"
date = "2017-12-22T13:50:46+02:00"
tags = ["datafibers"]
categories = ["release"]
banner = "/img/banners/df_release.jpg"
+++

![alt text](/img/banners/df_release.jpg "Logo Title Text 1")
## Summary
Before christmas, DataFibers has completed the winter release, which has more than 40+ changes requests applied. In this release, DataFibers is featured with first demo combined both data landing and transforming in real time with new web interface. In addition, the preview version of batch processing (by spark) is ready.

## Details
Below is the list of key changes in this release.

* New Web admin UI released using ReactJs based AOR. More powerful and more beautiful.
* Improved Connect Import completeness
* Completed basic demo by using df to build real-time data pipeline for the dashboard in 10 min.
* Certified and tested Hive/JDBC/Stock API connectors
* Added topic data preview especially for data in DataFibers queue
* Added more task/job operation, such as pause and restart, in service and web ui
* Added feature to run batch SQL using Spark and Livy
* Added feature to stream back batch result to Queue
* Default value is provided in the UI for better user experience
* Confluent is upgraded to v3.3.2. Vertx is updated to v3.5.2. Flink is updated to v1.3.2
* Changed Flink job submission from java API to rest API to achieve non-blocking
* Couple of improvement on dfops command as well as sandbox update command

