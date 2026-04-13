---
title: python输入与输出
---
# input输入函数

## 函数原型

input函数的原型为 input(\*args,\*\*kwargs )，用于获取用户的输入内容。其中\*args和\*\*kwargs均表示将任意数量的参数传入函数。区别在于\*args保存方式为元组，而\*\*kwargs保存带有变量名的多余变量，保存方式为字典。传入input函数的内容将作为输入提示显示在标准输出上(控制台、显示器等)，例如：

```python
>>>a = 1
>>>b = 2
>>>input((a, b))
```

## 返回内容

>[!important]+
>input函数会将用户的输入保存为一个**字符串**。它可以接收任何类型的输入(回车除外，按下回车视作输入结束)，但默认都返回一个字符串。如需其他类型的返回内容，例如数字等，则需要额外处理。

>[!attention]+
>python2中使用raw_input()函数在python3中已不再支持；

## 输入的后处理

- **类型转换**：如果希望获取到的输入内容为指定类型，可以使用类型转换int()、str()等方法。
- **去除空格**：如果输入的内容是字符串，又担心有多余的空格，可以调用strip()、rstrip()、lstrip()函数分别去除输入两端、右侧、左侧的空格，例如：

```python
>>>str = input().rstrip()
>>>print(str)
```

- **内容校验**：在很多表单输入中，常常需要内容校验，例如手机号我们希望输入的是纯数字等，这时可以调用**isdigit()** 函数对输入内容进行校验。

## input函数的使用技巧

合理使用input函数还会有意想不到的作用，例如：

- **阻塞或暂停程序**：利用input函数会等待用户输入并且不接受回车作为输入内容的特性，我们可以使用input函数来阻塞或暂停程序，例如：

```python
print("请注意，当前程序已暂停运行...")
input("请按回车继续")
print("程序已恢复运行...")
```

# print输出函数

## 函数原型

print函数的的原型为

```python
print(self, *args, sep=' ', end='\n', file=None)
```

- sep参数:分隔符，默认为一个空格；
- end参数:打印后的结束方式，默认为换行符\n。若不希望输出换行，则可设置end=''。

# 更复杂的输出

在实际的应用中，对输出格式的控制往往不只是打印空格分隔的值，还需要更多方式。关于python的格式化输出，可以参考：
>[!help]-
>![[003关于python中的格式化输出]]
# 读写文件

文件读写是程序交互中的一个重要内容，文件既可以作为程序的输入来源，也可以作为程序的输出载体。在python中，可以创建一个file类的对象来表示一个文件，使用open()以及file类的write()、read()方法可以实现打开文件以及文件读写。

## open()方法

open方法用于打开文件，它会返回一个file object。最常用的参数有两个：open(filename, mode)。

- filename是文件名实参，通常为待打开的文件的路径；
- mode是描述文件的使用方式字符的字符串，常见的有r(只读)、w(只写)、a(追加内容)等，这部分与linux中的命令比较像；

>[!tip]+
>你可以在pycharm中键入open()方法，然后ctrl+左键查看open()方法的更多参数及其取值和含义；

**使用方法**

在使用open()方法打开文件对象时，推荐使用with关键字。子句体结束后，文件会正确关闭，即便触发异常也可以。而且，**使用with相比等效的try-finally 代码块要简短得多**。

```python
with open("C:\\Users\\XXX\\Desktop\\data.txt", encoding='utf-8') as f:
    pass
```

## 文件对象的方法

以下方法的介绍都是基于已创建了**文件对象f**的前提。

### f.read(size)

f.read()方法可用于读取文件内容，它会它会读取一些数据，并返回字符串（文本模式），或字节串对象（在二进制模式下）。size是可选参数，表示读取内容的大小。省略size或size值为负时，读取并返回整个文件内容；

### f.readline()

f.readline()方法用于从文件中读取单行数据，字符串末尾保留换行符，若读取到达文件最后一行，则省略换行符。只要f.readline()返回空字符串，就表示已到达文件末尾。
>[!info]+
>- 若使用open()打开了一个文件并且没有使用with关键字，则应该调用**f.close()** 关闭文件，即可释放文件占用的系统资源；
>- 若调用f.write()时，未使用with关键字，或未调用f.close(),即使程序正常退出，也可能导致f.write()的参数没有完全写入磁盘；
>- 综上，为了一劳永逸，在使用open()方法打开文件对象时，应当尽可能地使用with关键字；

# json保存结构化数据

使用文件作为程序的输入或输出可以提高效率，但由于read()方法只返回字符串，对于数字则还需要传递给int()等函数。而如果要保存的是嵌套列表、字典等复杂数据结构时，解析和序列化的操作非常复杂。

json格式通常用于现代应用程序的数据交换(接口入参、返参等)，用户可以利用它方便地将复杂的数据类型保存到文件。

使用json标准模块将数据结构转换为字符串表示形式，这个过程称为序列化(_serializing_)；

反之，从字符串表达式中重建数据的过程称为解序化(_deserializing_ )。

如果你的处理对象是**字符串**，那么json模块分别提供了**json.dumps()**和**json.loads()**两个函数来对json数据进行**编码**和**解码**；

如果你的处理对象是**文件**，那么json模块同样提供了**json.dump()**和**json.load()**两个函数来编码和解码；

>[!tip]+
>初学者看到这两组名字相近的函数可能会搞混，建议按照其用法，记住其中的一组，则剩下的一组自然就记住了。

## 处理字符串

### json.dumps()

在json模块文件中查看dumps函数的原型，如下所示：

```python
def dumps(obj, *, skipkeys=False, ensure_ascii=True, check_circular=True,
        allow_nan=True, cls=None, indent=None, separators=None,
        default=None, sort_keys=False, **kw):
    """Serialize ``obj`` to a JSON formatted ``str``.
```

从函数原型即文档字符串中可以看出，dumps函数是将一个python对象序列化为一个json格式的字符串。

```python
>>> import json
>>> x = [1, 'simple', 'list']
>>> json.dumps(x)
'[1, "simple", "list"]'
```

### json.loads()

```python
def loads(s, *, cls=None, object_hook=None, parse_float=None,
        parse_int=None, parse_constant=None, object_pairs_hook=None, **kw):
    """Deserialize ``s`` (a ``str``, ``bytes`` or ``bytearray`` instance
    containing a JSON document) to a Python object.
```

json.loads()将**s**(一个包含json文档的str、bytes、bytearray实例)反序列化为python对象。若反序列化的数据**s**不是有效的json文档，则引发JSONDecodeError 错误；

```python
>>> import json
>>> x = [1, 'simple', 'list']
>>> json.loads(json.dumps(x))
[1, 'simple', 'list']
```

## 处理文件

### json.dump()

在json模块文件中查看dump函数的原型，如下所示：

```python
def dump(obj, fp, *, skipkeys=False, ensure_ascii=True, check_circular=True,
        allow_nan=True, cls=None, indent=None, separators=None,
        default=None, sort_keys=False, **kw):
    """Serialize ``obj`` as a JSON formatted stream to ``fp`` (a
    ``.write()``-supporting file-like object).
```

对比两者的函数原型，可以发现dump相较于dumps，多了一个入参**fp**。关于fp，官方的描述是：a .write() -supporting file-like object，一个支持.write()的类文件对象。

对dump()函数的功能描述也变成了将一个python对象序列化为一个json流格式的fp。

```python
json.dump(x, f) # f是一个text file对象
```

### json.load()

```python
def load(fp, *, cls=None, object_hook=None, parse_float=None,
        parse_int=None, parse_constant=None, object_pairs_hook=None, **kw):
    """Deserialize ``fp`` (a ``.read()``-supporting file-like object containing
    a JSON document) to a Python object.
```

json.load()将一个**fp**(一个支持.read()并包含了一个json文档的text file文本文档或binary file二进制文件)反序列化为一个python对象。

```python
import json

d = {'details': {'hawk_branch': {'tandem': ['4210bnd72']},
                 'uclif_branch': {'tandem': ['e2nc712nma89', '23s24212', '12338cm82']}}}

with open("C:\\Users\\XXX\\Desktop\\新建文本文档.txt", 'w') as f:
    json.dump(d, f)  

with open("C:\\Users\\XXX\\Desktop\\新建文本文档.txt", 'r') as f:
    var = json.load(f)

print(var)

```