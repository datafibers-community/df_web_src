+++
title = "Constructor - Scala vs. Java"
date = "2017-05-01T13:50:46+02:00"
tags = ["scala"]
categories = ["article"]
banner = "/img/banners/scala-vs-java.png"
+++
<p align="left"><img src="/img/banners/scala-vs-java.png" width="500" /></p>
### 1. Constructor With Parameters
**Java Code**  

```
public class Foo() {  
   public Bar bar;  
   public Foo(Bar bar) {  
       this.bar = bar;  
   }  
}  
```

**Scala Code**

```
class Foo(val bar:Bar)  
```

### 2. Constructor With Private Attribute
**Java Code**  

```
public class Foo() {  
   private final Bar bar;  
   public Foo(Bar bar) {  
       this.bar = bar;  
   }  
}  
```

**Scala Code**

```
class Foo(private val bar:Bar)  
```

### 3. Call _Super_ Constructor
**Java Code**  

```
public class Foo() extends SuperFoo {  
   public Foo(Bar bar) {   
      super(bar);  
   }  
}  
```

**Scala Code**

```
class Foo(bar:Bar) extends SuperFoo(bar) {}
```

### 4. Multiple Constructors
**Java Code**  

```
public class Foo {  
    public Bar bar;  
    public Foo() {   
       this(new Bar());   
    }  
    public Foo(Bar bar) {  
       this. bar = bar;   
    }  
}  
```

**Scala Code**

```
class Foo(val bar:Bar){  
    def this() = this(new Bar)  
}
```

### 5. Methods of _getter_ and _setter_
**Java Code**  

```
public class Foo() {  
   private Bar bar;  
   public Foo(Bar bar) {  
       this.bar = bar;  
   } 
   public Bar getBar() {   
      return bar;   
   }  
   public void setBar(Bar bar) {   
      this.bar = bar;  
   }  
}  
```

**Scala Code**

```
import scala.reflect._  
class Foo(@BeanProperty var bar:Bar)  
```


**Scala Code (Other Way)**

```
import scala.reflect._  
class Foo(aBar:Bar) {  
    @BeanProperty  
    private var bar = aBar  
}  
``` 