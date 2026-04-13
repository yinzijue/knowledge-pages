---
title: 002关于python中的引号
---
# 概述

- 在python中，有单引号('')、双引号("")、三引号。其中三引号又有三个单引号(''' ''')和三个双引号(""" """)。它们都可以用来表示一个字符串，通常情况下它们用于同一个字符串时没有区别，例如：

```python
# 以下四个字符串的内容本身没有任何区别
str1='python'
str2="python"
str3='''python'''
str4="""python"""
```

# 单引号和双引号

- 单引号和双引号多数情况下可以相互替换。使用原则上，选择一种风格坚持下去，尽量保持一致性。例如：有些人习惯在描述自然语言时使用双引号，而一些符号类的的字符串则使用单引号，例如：

```python
dict = {'stmt':"Hello,world!"}
```

- 单引号和双引号在描述同一个字符串时通常不会混用。但如果字符串本身就包含单引号或双引号中的一种，混用则**可以避免对引号进行转义**，增加代码的简洁性和可读性，例如在描述I'm a programmer.时：

```python
str = "I'm a programmer"
```

总得来说，当字符串本身包含了单引号或双引号时，可以在外层使用与其不同的引号。当然，以上规则对三引号同样适用。

# 三引号

- 在描述一般字符串上，三引号的使用与单/双引号并无不同，但三引号还有一些其他的特殊使用场景，并且相交于描述一般字符串，三引号在这些场景应用更多。

## 显示多行字符串

- 提到换行输出，我们会第一时间想到转义字符**\n。**当我们的输出内容像诗歌一样有频繁的不规则的换行时，使用三引号是一个非常不错选择。它允许你在**定义**多行字符串时，可以不使用**拼接符**或**转义字符**。同时在**输出**时,三引号会完美地保留原始字符串的格式。例如，输出python之禅：

```python
str = """
The Zen of Python, by Tim Peters
Beautiful is better than ugly.
Explicit is better than implicit.
Simple is better than complex.
Complex is better than complicated.
Flat is better than nested.
Sparse is better than dense.
Readability counts.
Special cases aren't special enough to break the rules.
Although practicality beats purity.
Errors should never pass silently.
Unless explicitly silenced.
In the face of ambiguity, refuse the temptation to guess.
There should be one-- and preferably only one --obvious way to do it.
Although that way may not be obvious at first unless you're Dutch.
Now is better than never.
Although never is often better than *right* now.
If the implementation is hard to explain, it's a bad idea.
If the implementation is easy to explain, it may be a good idea.
Namespaces are one honking great idea -- let's do more of those!
"""
print(str)
```

## 多行注释

- python中的单行注释通常以**#**开始。当注释内容较多时，编译器通常会建议你分行书写。你当然可以多个**#**来进行多行注释，选中要注释掉的内容按下快捷键，的确便捷。但更常用的做法时使用三引号。

```python
"""
这是对以下内容的第一行注释，
这是对以下内容的第二行注释。
"""
str ="..."
```

## 文档字符串(DocStrings)

- 从功能上来讲，文档字符串也是用于解释程序内容的。这点和注释(comments)比较像。但使用习惯上，文档字符串更偏向于对**模块(module)**、**函数(function)**、**类(class)**和**方法(method)**进行**总体介绍**，便于快速了解；而注释则是记录**代码实现的细节**。
- 此外，文档字符串还可以通过**__doc__**属性来获取。

```python
class Example:
    """这是Example类的文档字符串,

        这是Example类的第二行文档字符串
    """
    pass


print(Example.__doc__)
```

### 文档字符串的一些书写建议

- 文档字符串通常书写在模块、类、函数等的第一行；
- 可以使用**r**(格式化)、**u**(unicode字符集)对文档字符串进行处理；
- 多行文档字符串的格式总体为：

- 第一行：一句话的功能描述；
- 第二行：空行
- 第三行：详细描述；
- 末行：空行

- Class 的文档字符串，无论单行多行都要在其后插入空行(为了与属性或方法间隔开)；
- 罗列参数时最好插入空行；
- 第一句话可与起始三元引号同行，也可单独一行，结束引号单独成行；
- 模块或者包应在 __ init__.py 中用简要说名可导出名称的用途；
- **对于方法或函数**，文档字符串应包括：功能概述，入参介绍，返回值，效果，附加效果，可能抛出的异常以及被限制使用的条件；
- **对于类**，文档字符串应包括：功能概述，公共方法，实例变量；
- **对于继承类**，务必用 **override** 和 **extend** 标明是覆盖还是扩展；