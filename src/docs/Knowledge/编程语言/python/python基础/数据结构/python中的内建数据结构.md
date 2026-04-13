---
title: python中的内建数据结构
---
# 概述

本文主要讲述四个python中内建的数据结构：序列(列表list和元组tuple)、映射(字典dict)和集合(set)，这四个数据结构比较常用。涉及的内容为各数据结构的概念、创建方式、常用方法(增、删、改、查等)。

# 列表(List)

## 概念

python中的列表是一种有序的、可变的集合(你可以随时添加、修改、删除其中的元素)。它的常见样式形如[1,2,3]，它可以同时容纳不同类型的元素：数字、字符串、列表、字典等，且它支持包含重复的元素。

>[!info]+
>尽管列表支持存放不同类型的元素，但实际运用中，我们常使用它来存放同类项目；

## 创建列表

### []创建

使用英文格式的方括号可以创建一个空的列表，形如: a=[]。当然，你也可以在创建列表的同时对其元素进行初始化： a = [1, "hello",[2],(2,3)]

### 使用list类的构造器

使用list()同样可以创建一个空列表。形如：a=list() 同时，list()可接受一个可迭代对象用于创建一个列表(相当于将这个对象转换为列表)，例如：list("abcd")，输入结果为["a","b","c","d"]; list(range(1,3))，输出结果为[1,2]

### 列表推导式

列表推导式创建列表的方式为：对序列或可迭代对象中的每个元素应用某种操作，用生成的结果创建新的列表。或者用满足特定条件的元素创建子序列。

```python
# 创建0~100之间的平方数列表
squares = [x**2 for x in range(10)]
```

列表推导式的格式可以总结为[expression for statements]

- expression:一个表达式，该表达式支持变量、数据结构、嵌套函数等；
- for statements：一个for语句，其中statements的内容可以是零个或多个for或if子句

```python
# 表达式内容是一个元组
[(x,y) for x in [1,2,3] for y in [3,1,4] if x!=y]

# 表达式内容是一个嵌套函数
>>>from math import pi
>>>[str(round(pi,i)) for i in range(1,6)]

# 嵌套推导式对矩阵进行转置行列
>>> matrix = [
...     [1, 2, 3, 4],
...     [5, 6, 7, 8],
...     [9, 10, 11, 12],
... ]
>>>[[row[i] for row in matrix] for i in range(4)]
```

## 列表的常见方法

### 增

```python
list.append(x)   # 在列表末尾添加一个元素x，相当于 a[len(a):]=[x]
list.extend(iterable) #用一个可迭代对象去扩展列表，相当于a[len(a):]=iterable
list.insert(i,x) # 在指定索引处插入元素，其中i为目标索引，x为待插入元素；
```

示例中的a[len(a):]是列表的一种切片操作，其他的数据结构中也有类似的操作，更多关于切片的信息，可以参阅
>[!summary]-
>![[004关于python中的索引与切片操作]]

### 删

```python
list.remove(x) # 移除列表中第一个值为x的元素，若不存在则引发ValueError
list.pop(i)  # 移除索引为i的元素，该方法会返回被移除的元素；若未指定索引，则移除最后一个元素
list.clear() # 移除列表中的所有元素，相当于del a[:],但list本身仍然存在，为一个空列表
del list[start:end:step] # 按索引移除list中的元素，可以是单个，也可以是切片
```

### 查

```python
"""查询值为x的元素的索引；
其中start和end是可选的，它们会形成一个list的小切片,一旦指定，则在切片范围内查询x的索引；
若未指定切片范围，则默认在整个列表中查询
"""
list.index(x,start,end) 
list.count(x) # 查询值为x的元素在list中出现的次数
```

### 改

```python
 # 对列表进行排序，该方法返回None，排序后列表本身顺序发生变化，key和reverse是可选的
list.sort(*,key = None,reverse=False)
sorted(list) # sorted是python的一个内建方法，可作用于所有可迭代对象，排序后返回一个新的序列；
list.reverse() # 对列表本身的原始顺序进行翻转
list.copy() # 返回list的一个浅拷贝，相当于 a[:]
```

#### 关于sort和sorted

- sort是**专属于列表**的一个方法，格式形如list.sort()。而sorted是python的一个内建方法，适用于任何可迭代对象，格式形如 sorted(iterable,/,*,key=None,reverse=False);
- 使用sort()方法对列表进行排序，会改变原始列表本身的顺序。而使用sorted()方法则会生成一个列表的复制，对复制进行排序，原始列表顺序不变；
- 对于列表而言，通常sorted()方法比sort()方法方便省事，但如果你不在于原始列表的改变，sort()方法的效率则更高；
- sort()和sorted()都有一个key参数，这个参数通常是一个函数或其他可调用对象，用于在排序前对每个元素进行“预处理”。

```python
# 排序前将字符串全部转换为小写
str1 = sorted("This is a test string from Andrew".split(), key=str.lower)
print(str1)
------------------------------------------------------------------------------------
student_tuples = [
     ('john', 'A', 15),
     ('jane', 'B', 12),
     ('dave', 'B', 10),
]
print(sorted(student_tuples,key=lambda student:student[2])) # 按年龄排序
```

#### 关于浅拷贝和深拷贝

参阅
>[!summary]-
>![[008关于python中的类型和深&浅拷贝]]

# 元组

## 概念

元组是**不可变**序列，通常用于储存易购数据的多项集。它的常见样式形如a =(1,2,3,4)。元组也被用于需要同构数据的不可变序列的情况(例如允许存储到set或dict的实例)。

## 创建元组

- 创建空元组：使用一对圆括号即可，例如：set1 = ()
- **创建仅包含一个元素的元组**：格式形如 a,或(a,)。尽管它看上去有些奇怪，但这样可以避免引起歧义。
- 创建包含多个元素的元组：格式形如 a = 1,2,3 或 a = (1,2,3)
- 使用tuple类的构造器: 格式形如 a = tuple(iterable)，该方法可接受一个可迭代对象用于创建元组，若未指定，则创建一个空的元组。
>[!attention]+
>- 事实上，决定生成元组的因素在于逗号，而圆括号括号是可选的，它只用在生成空元组或避免语法歧义。但仍然建议涉及到元组时都把括号加上，想象一下print(1,2,3)和print((1,2,3))的区别。
>- tuple()中可接收一个可迭代对象，生成的元组中的项与可迭代对象中的项具有相同的顺序；
>- **元组不支持通过推导式创建**。(你可以尝试这么做，看看创建出来的对象是什么类型的)

## 元组的常用方法

前面提到元组是不可变的，因此不能直接对元组的元素进行增、删、改。但元组的元素本身可以是可变对象，可以对其进行增删改操作，例如： t = (1,2,"hello",[3,4,6])的元素中包含了一个列表，可以对列表的元素进行改动，间接“改变”元组。

除此之外，元组也实现了所有一般序列的操作。例如算数运算、比较运算、元素检测、索引取值、切片取值、元素计数、排序(python内置函数)、翻转(python内置函数)等；

```python
tuple.index(element)  # 返回某个元素在元组中第一次出现时对应的索引
tuple.count(element)  # 返回某个元素在元组中出现的次数，若不存在，报ValueError
```

# 集合

集合的基本特征是**无序的、元素不重复**的。它的常见样式形如 basket = {'apple', 'orange', 'pear'}。集合常用于成员检测、**消除重复元素**等。正如它的名字一样，它和数学上的集合概念比较像，也支持合集、交集、差集等数学运算。

>[!important]+
>由于集合是无序的，相较于元素的位置(索引)，集合更侧重于元素是否存在。因而**集合不支持使用索引、切片等访问、修改、删除元素**。

## 创建集合

### 使用构造器

格式形如 s = **set(**iterable**)** 可迭代对象是可选的，未指定时创建一个空的集合；

### 使用{}

格式形如 s ={'apple', 'orange', 'pear'} ;

### 创建空的集合

**创建空集合只能使用构造器，而不能使用{}。事实上，{}是一个空的字典。**

### 推导式

集合支持通过推导式创建，格式形如：

```python
>>>set1 = {x**2 for x in range(1,6)}
>>>set1
```

>[!note]+
>通过观察推导式创建出来的集合，你可以感受到集合的无序。

## 集合常见的方法

### 增

```python
>>>set1 ={a**2 for a in range(1,3)}
>>>set1.add(x) # 增加一个元素x

>>>set1.copy() # 返回集合的一个浅拷贝
```

### 删

```python
>>>set1 ={a**2 for a in range(1,3)}
>>>set1.pop() # 删除集合中的最后一个元素，该方法返回被删除的元素
>>>set1.remove(x) # 删除值为x的元素，若x不存在则抛出异常
>>>set1.discard(x) # 删除值为x的元素，若x不存在，则返回原集合
>>>set1.clear() # 清空集合中的元素
```

### 改

集合无法直接访问元素，因而无法指定一个元素进行修改。但集合支持使用另一个**可迭代对象**对当前集合进行更新，更新结果会去除重复元素。

```python
>>>set1 = set([1, 2, 3, 3])
>>>set1.update({1: 2, 3: 4, 5: 6}) # 使用字典的键来更新当前集合
>>>set1.update((1,2,3,4)) # 使用一个元组来更新当前集合
>>>set1.update(['a','b']) # 使用一个列表来更新当前集合
>>>set1.update('Hello,world') # 使用一个字符串来更新当前集合
```

### 查

>[!important]+
>集合是无序的，因而无法通过索引方式获取其中的元素，也没有键值对形式，只支持遍历。其遍历方式和列表序列等相同。但对于集合中的元素，可以使用**in**关键字来判断集合中是否包含某个元素。

```python
>>>set1 = {x**2 for x in range(4)}
>>>print(1 in set1) # True
>>>print(8 not in set1) # True
```

### 更多集合方法

```python
set1.difference(set2)  #返回一个set1的子集，该子集是set1与set2的差集，set1长度不变
set1.difference_update(set2) #从set1中移除与set2中相同的元素，set1长度会发生变化
```

# 字典

和现实中的字典的形式类似，python中的字典以一种键值对的形式存储数据，你可以通过特定的键获取到特定的值。python中的字典具备以下特征：

- 字典以{}来标识，是一种无序的、不连续的映射类型，通过key-value键值对来存取数据；
- 字典的键(key)必须使用**不可变类型**，且在一个字典中，键(key)必须唯一；

## 创建字典

- 创建空字典：创建空字典可以使用一对空的大括号**{}** 也可以使用构造器**dict()**

```python
>>>dict1 = {}
>>>dict2 = dict()
```

- 使用构造器：使用dict类的构造器dict()可以创建字典，dict()可以接收键值对序列用以构造字典；当关键字是比较简单的字符串时，还可以直接用关键字参数指定键值对；

```python
>>>dict1 = dict([('demo', 1), ('Google', 2), ('Taobao', 3)])
>>>dict1
>>>dict2 = dict(sape=4139, guido=4127, jack=4098)
>>>dict2
```

- 使用字典推导式创建字典：

```python
>>>dict1={x: x ** 2 for x in range(4)}
>>>dict1
```

- fromkeys

## 字典常见的方法

### 增

```python
>>>dict1 = {x: x ** 2 for x in range(4)}
>>>dict1["key"] = value             # 添加键为key的值value
>>>dict1.update(key-value sequence) # 接收一个键值对序列，往字典中添加元素
>>>dict1.copy()                     # 返回一个dict1的浅拷贝
```

### 删

```python
>>>dict1 = {x: x ** 2 for x in range(4)}
>>>dict1.pop(key) # 删除key及其对应value，该方法返回被删除的元素。若key不存在，引发KeyError
>>>del dict1[key] # 删除key及其对应value，若key不存在，引发KeyError
>>>dict1.popitem() # 删除最后一个键值对，该方法返回一个元祖，若字典为空，则引发KeyError
>>>dict1.clear() # 清空字典
```

### 改

```python
>>>dict1 = {x: x ** 2 for x in range(4)}
>>>dict1[key] = value_new # 修改键为key的值value为value_new,若key不存在，则新增键值对
>>>dict1.update(key-value sequence) # 用键值对序列更新字典，若key不存在，则新增
```

>[!important]+
>字典的键无法直接修改，若想修改字典的键，这里推荐一种方式：

```python
>>>dict1 = {x: x ** 2 for x in range(4)}
>>>dict1[new_key]=dict.pop(key) # 删除旧键值对，用新的key接收删除的value
```

### 查

```python
>>>dict1 = {x: x ** 2 for x in range(4)}
>>>dict1.keys() #查询字典的所有键，返回一个包含列表，返回类型为dict_keys
>>>dict1.values() #查询字典的所有值，返回一个包含列表，返回类型为dict_values
>>>dict1.items() #返回一个包含字典所有键和值的元组列表，返回类型为dict_items
>>>dict[key] # 查询key对应的value，若key不存在，则引发KeyError
>>>dict.get(key) #返回key对应的value；若key不存在，则返回none
```