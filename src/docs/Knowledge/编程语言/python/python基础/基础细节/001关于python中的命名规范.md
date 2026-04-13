---
title: 001关于python中的命名规范
---
# 模块

- 尽量使用小写字母；
- 首字母保持小写；
- 尽量不要使用下划线(除非多个单词，且数量不多)

```python
import module
```

# 类

- 类名称使用大驼峰命名风格(CamelCase)，首字母大写；
- **私有类**可用一个下划线开头；
- 相关类和顶级函数可以放在同一个模块中，而无需一个模块一个类。

```python
class TemplateClass
pass
-----------------------------------------------
class _PrivateClass
pass
```

# 函数

- 函数名一律小写，如有多个单词，用下划线隔开；
- 私有函数在函数前加一个下划线；

```python
def foo():
    pass
--------------------------------------------------
def run_with_env():
    pass
-----------------------------------------------------
def _private_func():
    pass
```

# 变量

- 变量名尽量小写；
- 多个单词使用下划线隔开；
- 常量名采用全大写形式，支持下划线分隔多个单词；

```python
>>>count = 0
>>>name = 'Jack'
>>>CONNECTION_TIMEOUT = 600
```

# 关于下划线

在前面的命名规范中，我们发现了名称前面的单个下划线的作用——用来标识私有。实际上，在python中，下滑线还有其他约定俗成的用法。

## 单前导下划线

单前导下划线形如 _var，用以标识仅供内部使用，即其他语言中提到的私有。但python中并没有真正的私有，单前导下划线对变量、函数、类的约束仅仅体现在模块导入的形式上。

```python
# module test
def _func():
    print('nothing')
------------------------------------------------------
# module demo
from test import *
_func()                     # NameError: name '_func' is not defined
```

```python
# module test
def _func():
    print('nothing')
------------------------------------------------------
# module demo
from test import _func 
_func()                     # 正常导入时，调用不受影响
```

以上例子表明，在使用通配符方式导入时，解释器会忽略带单前导下划线的内容。这提醒我们要慎用这种导入方式，最佳的实践是明确写明要导入的内容。

## 单末尾下划线

python中有不少关键字，在对自定义的内容进行命名时应当避免使用这些关键字。但有时候一个变量的最合适名称已被关键字占用，想要继续使用该名称，即可在变量名末尾附加一个下划线来解决。

```python
>>>def foo(name,class):         # SyntaxError: invalid syntax
----------------------------------------------------
>>>def foo(name,class_):        # 解决命名冲突
```

## 双前导下划线

双前导下划线一般用于类中，双前导下划线会触发python解释器的名称修饰功能——解释器自动更改变量的名称，以便在类被扩展时避免冲突。若想查看其实际效果，可以借助python内置函数dir()——可以查看对象中所有可访问的属性。

```python
class Template:
    def __init__(self):
        self.__first = 24
        self._second = 25
        self.third = 26


temp = Template()

print(dir(temp))
===============================================================================
"""输出结果为：
['_Template__first', '__class__', '__delattr__', '__dict__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__le__', '__lt__', '__module__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', '__weakref__', '_second', 'third']
"""
```

可以注意到，属性third和_second的行为表现和在类中是一致的，但**__first**被重命名为**_Template__first**。此时若子类想要对该属性进行重写就不能再使用原来的名称了。

```python
class SubTemplate(Template):
    def __init__(self):
        super().__init__()
        # 重写父类属性
        self.third = 3
        self._second = 2
        self.__first = 1


subTemplate = SubTemplate()
print(dir(subTemplate))                 # __first并未出现在属性列表中
print(subTemplate._SubTemplate__first)  # 输出结果为1
print(subTemplate._Template__first)     # 输出结果为24
print(subTemplate.__first)  			# AttributeError: 'SubTemplate' object has no attribute '__first'
```

## 双前导和末尾下划线

具有双前导下划线的变量会触发解释器的名称修饰功能，但被双下划线包围的变量(前后都有双下划线)却不会被修改。

```python
class Template:
    def __init__(self):
        self.__var__ = 3


temp = Template()
print(dir(temp))
======================================================================
"""输出结果为：
['__class__', '__delattr__', '__dict__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__le__', '__lt__', '__module__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', '__var__', '__weakref__']
"""
```

事实上，在python中，被双下划线包围的变量具有特殊含义，常被用作一些特殊用途，示例中用来定义类时用到的__init__()方法便是如此。这样的方法还有一个统一的名称：魔术方法。

因此，在我们的自定义内容中，应当避免使用双前导和末尾下划线。

## 单下划线

单下划线常用来表示某个临时的或无关紧要的变量，功能更类似于一个占位符。在循环、遍历中比较常见。

```python
for _ in range(25):
    print("Nothing happened")
```

## 小结

综上，python中的下划线作用可以概括为以下这张表：

|   |   |   |
|---|---|---|
|模式|举例|含义|
|单前导下划线|_var|命名约定，仅供内部使用，通常不会由python解释器强制执行(通配符导入除外)仅作为对程序员的提示作用。|
|单末尾下划线|var_|按约定使用，避免与python关键字命名冲突。|
|双前导下划线|__var|当在类上下文使用时，触发名称修饰功能，由python解释器强制执行。|
|双前导和末尾下划线|__var__|python语言定义的特殊方法，避免在你自己的属性中使用这种方法。|
|单下划线|_|常作为临时变量或无关紧要的变量。|