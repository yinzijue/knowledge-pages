---
title: 007关于python中的lambda表达式
---
# 关于python中的lambda表达式
在python中有两种函数：一种是def定义的函数，另一种是lambda函数，也就是大家常说的匿名函数。

# 语法

```python
lambda argument_list:expression
```

- 其中argument_list是参数列表，例如a,b a=1,b=2, \*args, \**kwargs
- expression是一个关于参数的表达式，表达式中出现的参数需要在参数列表中有定义，且表达式必须是**单行**的。

# 使用

```python
>>>a = [1,2,3,4]
>>>b = [5,6,7,8]
>>>print(list(map(lambda x,y:x+y,a,b)))
```

```python
>>>a=[('b',3),('a',2),('d',4),('c',1)]
>>>sorted(a,key = lambda x:x[0])            # 按元组第一个元素排序
>>>sorted(b,key = lambda x:x[1])			# 按元组第一个元素排序
```