+++
title = "Apache Kafka Producers"
date = "2019-11-02T19:50:46+02:00"
tags = ["kafka"]
categories = ["digest"]
banner = "/img/banners/kafka.jpg"
+++

Kafka producers send records to topics. The records are sometimes referred to as messages.

The producer picks which partition to send a record to per topic. The producer can send records round-robin. The producer could implement priority systems based on sending records to certain partitions based on the priority of the record. Generally speaking, producers send records to a partition based on the record’s key. The default partitioner for Java uses a hash of the record’s key to choose the partition or uses a round-robin strategy if the record has no key. The important concept here is that the producer picks partition. Producers write at their cadence so the order of Records cannot be guaranteed across partitions. The producers get to configure their consistency/durability level (ack=0, ack=all, ack=1), which we will cover later. Producers pick the partition such that Record/messages go to a given partition based on the data. For example, you could have all the events of a certain ‘employeeId’ go to the same partition. If order within a partition is not needed, a ‘Round Robin’ partition strategy can be used, so Records get evenly distributed across partitions.

## Code Examples
Below is a simple producer example with Java client.
```
public class Producer {

    public static void main(String[] args){
        Properties properties = new Properties();
        properties.put("bootstrap.servers", "localhost:9092");
        properties.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        properties.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");

        KafkaProducer kafkaProducer = new KafkaProducer(properties);
        try{
            for(int i = 0; i < 100; i++){
                System.out.println(i);
                kafkaProducer.send(new ProducerRecord("devglan-test", Integer.toString(i), "test message - " + i ));
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            kafkaProducer.close();
        }
    }
}
```