---
title: 008关于python中的类型和深&浅拷贝
---
# 从赋值说起

```python
a=2
```

上面是python中非常常见的一个赋值操作。在这个过程中，我们要了解几个概念：变量、对象、引用、类型

在赋值过程中共完成了以下三件事情：

1. 创建一个int类型的对象2；
2. 创建一个名为a的变量名；
3. 建立变量名a与int类型的对象3之间的连接。

这个过程表明了：

- 变量本身没有类型，类型存在于对象中；
- 变量使用前必须赋值，变量首次赋值即被创建，再次赋值将会改变该变量名的值；
- 变量名与对象之间的连接关系我们称之为引用；
- 变量赋值并不是复制了对象，而是对该对象的引用。变量实际上是到对象内存空间的一个指针；

python中的对象有三要素：id,type,value.

- id：唯一标识一个对象；
- type：标识对象的类型；
- value：对象的值。

# 可变对象和不可变对象

了解完python对象的要素，就可以引入python对象的分类了。

- 可变对象：在不改变对象id的前提下，对象的值可以发生改变，我们称这类对象为可变对象；
- 不可变对象：对象的值一旦被改变，id就会发生变化。

在python内置的一些类型中，

- 可变对象:list(列表)、dict(字典)、set(集合)；
- 不可变对象：tuple(元组)、string(字符串)、数字

```python
>>>string1 = 'str1'   #string1指向对象 'str1'
>>>string1 = 'str2'   #string2指向对象 'str2'
>>>id('str1')==id('str2')
```

上面的赋值举例，如果没有了解过变量赋值的本质，很容易误以为是字符串对象本身的值被改变了。

![[不可变对象赋值]]

而对于可变对象来说，

```python
>>>list1 = [3,4,5,6]
>>>id(list1)               #  1572373942016
>>>list1[2]=7              # 列表对象的值发生了变化
>>>list1                   # [3,4,7,6]
>>>id(list1)			   # 1572373942016
```

以上过程可以解释为：

![[可变对象赋值]]

# 浅拷贝和深拷贝

在对可变对象和不可变对象有了基本概念以后，我们就可以来了解python中的浅拷贝和深拷贝了。

在python官方文档的**The Python Standard Library** »**Data Types** »**copy— Shallow and deep copy operations**节点下，描述了为什么需要用到浅拷贝和深拷贝：

>[!note] shallow and deep copy
>**Assignment statements in Python do not copy objects, they create bindings between a target and an object. For collections that are mutable or contain mutable items, a copy is sometimes needed so one can change one copy without changing the other. This module provides generic shallow and deep copy operations (explained below).**


翻译翻译就是：python中的赋值语句并没有复制对象，而是建立了目标和对象之间的连接关系(引用)。但对于一些**可变的**或**包含了可变子项**的集合，有时我们需要复制这些集合以实现修改其中一个时不会影响到另一个。**copy模块**就提供了一种通用手段——浅拷贝和深拷贝操作。

python标准库中有一个copy模块，其中copy.copy()函数用以浅拷贝，copy.deepcopy()用以深拷贝。

## 浅拷贝

官网文档对于浅拷贝的描述：


> [!NOTE] shallow copy
> A _shallow copy_ constructs a new compound object and then (to the extent possible) inserts _references_ into it to the objects found in the original.


翻译翻译就是：浅拷贝会构造一个新的**复合对象**，然后尽可能地把从原始对象中找到的对象引用复制一份，插到新的复合对象中。

网上对这个表述，大多数都将其解释为：对于**复合对象**而言，浅拷贝只拷贝父对象，不会拷贝子对象。

```python
>>>import copy
>>>a = [1,2,3,[5,6],7]
>>>b = copy.copy(a)      # b是a的一份浅拷贝结果
>>>a[3][0]=8             # 修改原始对象中子对象          	
>>>print(b)              # 输出b为[1, 2, 3, [8, 6], 7],也随a变化，意味着变化的部分未被拷贝
>>>a[3] = 9              # 改变原始对象本身
>>>print(b)              # 输出b为[1, 2, 3, [8, 6], 7],b索引3对应的元素并未变成9，意味着该元素有一个备份
```

## 深拷贝

官网文档对于深拷贝的描述：

> [!NOTE] deep copy
>A _deep copy_ constructs a new compound object and then, recursively, inserts _copies_ into it of the objects found in the original.

翻译翻译就是：深拷贝会构造一个新的复合对象，然后递归地从原始对象中查找**对象**，并将其复制一份插入到新的复合对象中。

通俗来说，就是对于复合对象，深拷贝完全拷贝父对象及其所有子对象。

```python
>>>import copy
>>>a = [1,2,3,[5,6],7]
>>>b = copy.deepcopy(a)   # b是a的一份深拷贝结果
>>>a[3][0]=8              # 修改原始对象中的子对象 
>>>print(b)               # 输出b为[1, 2, 3, [5, 6], 7],未随a变化，意味着a中的子对象列表也有一份拷贝
>>>a[3] = 9               # 修改原始对象本身
>>>print(b)               # 输出b为[1, 2, 3, [5, 6], 7]
```

## 浅拷贝 vs 深拷贝

[^1]: 
