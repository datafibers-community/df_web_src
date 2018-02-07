+++
title = "Scala Apply Method"
date = "2017-09-15T13:50:46+02:00"
tags = ["scala"]
categories = ["article"]
banner = "/img/banners/apply_scala.jpg"
+++
The apply methods in scala has a nice syntactic sugar. It allows us to define semantics like java array access for an arbitrary class.


For example, we create a class of __RiceCooker__ and its method __cook__ to cook rice. Whenever we need to cook rice, we could call this method.
```
class RiceCooker {
  def cook(cup_of_rice: Rice) = {
    cup_of_rice.isDone = true
    cup_of_rice
  }
}
val my_rice_cooker: RiceCooker = new RiceCooker()
my_rice_cooker.cook(new Rice())
```


Since the main function of __RiceCooker__ is to cook rice, we can always put this cook function in an apply method as follows. As result, we can cook immediately after we put rice in the rice cooker without explicit invoking any methods.
```
class RiceCooker {
  def apply(cup_of_rice: Rice) = {
    cup_of_rice.isDone = true
    cup_of_rice
  }
}
val my_rice_cooker: RiceCooker = new RiceCooker()
my_rice_cooker(new Rice())
```


In addition, we can also move the apply method to the [companion object](http://docs.scala-lang.org/tutorials/tour/singleton-objects.html). As result, the __apply__ method becomes **STATIC**. Then, we can invoke it without creating a new __RiceCooker__ object as below example.
```
object RiceCooker {
  def apply(cup_of_rice: Rice) = {
    cup_of_rice.isDone = true
    cup_of_rice
  }
}
RiceCooker(new Rice())
```


The best practice of using **apply** method in scala is to implement [factory pattern](http://alvinalexander.com/scala/factory-pattern-in-scala-design-patterns). For example, the standard library of List in scala initializes objects using __apply__ method in its companion object instead of using regular __new__ keyword.
```
val a = List(1,2,3,4,5)
```


At the end, I give a comprehensive example of using the __apply__ method in both way as follows.
```
class Test(n :Int) {
val a = Array[Int](n)
def apply(n :Int) = a(n)

/*
 * Scala simply makes a.update(x,y) to a(x)=y with syntactic sugar
 */
def update(n:Int, v:Int) = a(n) = v 
}

object Test {
def apply(n :Int) = new Test(n)
} 

/*
 * Call static apply method in companion object to create an object
 */
val tester = Test(10) 

tester(0) = 1 //This is equal to tester.update(0,1)
/*
 * Call a regular apply method defined in the class
 * println(tester(0)) is equal to println(tester.apply(0))
 */
println(tester(0))
```