---
title: 003关于python中的格式化输出
---
# f-string

f-string是python3.6引入的一种字符串格式化方法，旨在使格式化操作更便捷，同时提高其效率。

## 简单用法

f-string使用花括号{}来表示被替换的字段，其中直接填入替换内容。在目标字符串前加**f**或者**F**，表示其后的字符串将被格式化输出。

```python
>>>name = 'Jack'
>>>f'Hello,{name}'
```

## 表达式求值与函数调用

f-string的花括号可以填入表达式或调用函数，python会求出其值并填入返回的字符串中。

```python
# 填入表达式
>>>f'3+2 is equal to {3+2}'

# 调用函数
>>>name = 'JACK'
>>>f'My name is {name.lower()}'
```

## 多行f-string

```python
# 多行f-string,需要在每一行字符串前都加上f或F
>>> name = 'Jack'
>>> age = 18
>>> f"Hello!" \
... f"I'm {name}." \
... f"I'm {age}."
"Hello!I'm Jack.I'm 18."
```

## lambda表达式

f-string的花括号中还可以填入lambda表达式，但lambda表达式的冒号**:**会被误认为是表达式与格式描述符之间的分隔符，故为免歧义，需将lambda表达式置于圆括号内。

```python
>>>f'The result is {(lambda x:x**2+1)(2):<+7.2f}'
```
## 关于f-string

更多关于f-string的进阶用法及注意事项，参阅：[PEP标准：如何表示f-string](https://peps.python.org/pep-0498/#how-to-denote-f-strings "如何表示f-string")

# %

在字符串内部，使用%，后面紧跟占位符也可以实现格式化输出。所谓占位符，可以将它看作将要被替代的内容，而占位符的内容也随被替换内容的类型而变化。以下是一些常用的占位符。

|   |   |
|---|---|
|占位符|替换内容|
|d|整数(digital)|
|f|浮点数(float)|
|s|字符串(string)|
|x|十六进制整数(hex)|
|-|左对齐|
|.|小数点后位数|
|0|左边补零|

```python
>>>print('%d'%3.14)	     # 只取整数部分，输出3
>>>print('%f'%3.14)		 # 输出3.14
>>>print('%s' % 3.14)    # 以字符串形式输出3.14
>>>print('%x'%31)        # 输出31的十六进制形式，结果为1f
>>>print('%-2d - %02d' % (3, 1)) # 3以左对齐占两个占位的形式输出，1以右对齐占两个占位的形式，并且前面填零补齐的形式输出
>>>print('%.2f'%3.1415926)	# 输出小数点后2位，结果为3.14
```
# str.format()

## 术语说明

- format()是string模块下的Formatter类的一个方法。str.format()方法通过花括号{}来识别**替换字段**，从而完成格式化；
- **替换字段** 由字段名field name和转换字段conversion field以及格式说明符 format specifier 组成，即一般形式为 **{字段名!转换字段:格式说明符}**。
- 字段名分为**简单字段名**和**复合字段名**；
- 转换字段和格式说明符是可选的。

## 简单字段名

简单字段名有三种写法：

- 省略不写{}

```python
# 省略字段名传递位置参数
>>>print('我叫{}，今年{}岁。'.format('小明', 18)) 

# 花括号个数可以少于位置参数的个数,多余的位置参数被忽略
>>>print('我爱吃{}和{}。'.format('香蕉', '苹果', '大鸭梨'))

# 花括号个数多于位置参数的个数则会报错，索引越界
>>>print('我还吃{}和{}。'.format('西红柿'))
```

- 数字{十进制非负整数}

```python
# 通过数字形式的简单字段名传递位置参数
>>>print('身高{0}，家住{1}。'.format(1.8, '铜锣湾'))

# 数字形式的简单字段名可以重复使用。
>>>print('我爱{0}。\n她今年{1}。\n{0}也爱我。'.format('阿香', 17))

# 所有的位置参数被视作一整个元组,{1}即相当于tuple[1].因此花括号里的整数不能越界。
print('阿香爱吃{1}、{3}和{0}。'.format('榴莲', '臭豆腐', '皮蛋', '鲱鱼罐头', '螺狮粉'))
```

- 变量名{合法的python标识符}

```python
# 使用变量名形式的简单字段名传递关键字参数，关键字参数不受位置限制
>>>print('我大哥是{name}，今年{age}岁。'.format(name='阿飞', age=20))
```

### 简单字段名注意事项

- 混合使用数字形式和变量名形式的字段名，可以同时传递位置参数和关键字参数。
- 关键字参数必须位于位置参数之后。
- 混合使用时可以省略数字。
- **省略字段名** **{}** **不能和数字形式的字段名** **{非负整数}** **同时使用**。

```python
# 数字形式和变量名字混用，同时传递位置参数和关键字参数，数字可省略
>>>print('Today is {},{name} will be back'.format('Monday',name='Jack'))
```

### 使用元组和字典传参

传参时，元组(**传递位置参数**)需要在字典(**传递字典参数**)前面。

```python
# 元组和字典会被分别解包
>>>tup = 'jack',18
>>>dic = {"name":"rose","age":18}
>>>print('His name is {},he is {}.\nHer name is {name},she is {age}'.format(*tup,**dic))
```

## 关于Format()

更多关于str.format()的进阶用法，可以参阅官方文档[format进阶用法](https://docs.python.org/zh-cn/3/library/string.html#format-specification-mini-language "format进阶用法")

