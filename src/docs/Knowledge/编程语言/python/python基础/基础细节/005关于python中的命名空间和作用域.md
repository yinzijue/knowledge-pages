---
title: 005关于python中的命名空间和作用域
---
# 命名空间

命名空间是一个名字到对象的映射关系。它提供了在项目中避免名字冲突的一种方法：各个命名空间是独立的，同一个命名空间内不能有重名，但不同的命名空间可以重名且没有任何影响，可以类比计算机系统中文件夹和文件名的关系。

## 命名空间分类

一般有三种命名空间：

- 内置名称：python内置的名称，例如函数名abs、char和异常名称BaseException、Exception等；
- 全局名称：模块中定义的名称，记录了模块的变量，包括函数、类、其他导入的模块、模块级的变量和常量；
- 局部名称：函数中定义的名称，记录了函数的变量，包括函数的参数和局部定义的变量(类中定义的也是)

![[python命名空间]]

命名空间的查找顺序为：局部命名空间→全局命名空间→内置命名空间。

如果最终都找不到目标变量，则放弃查找并引发一个NameError异常。

## 命名空间生命周期

命名空间的生命周期取决于对象的作用域，如果对象执行完成，则该命名空间的生命周期就结束。

因此我们无法从外部命名空间访问内部命名空间的对象。

```python
# 全局名称var1
var1 = 5
def func():
    # 局部名称var2
    var2 = 6
    def inner_func():
        # var3是内部函数的局部名称
        var3 = 7
```

# 作用域

作用域是一个python程序可以直接访问命名空间的正文区域。作用域定义了命名空间中的变量可以在多大范围内起作用。在一个python程序中，直接访问一个变量，会从内到外依次访问所有的作用域直到找到，否则报未定义的错误。

## 作用域分类

- L(Local)：最内层，包含局部变量，比如一个函数/方法的内部；
- E(Enclosing):包含了非局部(non-local)也非全局(non-global)的变量。比如两个嵌套函数，一个函数(或类)A里面有包含了一个函数B，那么对于B中的名称来说A中的作用域就为non-local。
- G(Global):当前脚本的最外层，比如当前模块的全局变量。
- B(Built-in):包含了内建的变量/关键字等，最后才会被搜索。

查找顺序：L→E→G→B。

```python
g_var = 'global'
def outer():
    o_var = 'enclosing'
    def inner():
        l_var = 'local'
```

>[!important] 
>python中只有模块(module)、类(class)和函数(def、lambda)才会引入新的作用域，其他代码块(if/elif/else、try/except、for/while等)是不会引入新的作用域的，这意味着这些语句内定义的变量，外部也可以访问。

```python
if 2>1:
    msg = 'that is true'
print(msg)
```

## 全局变量和局部变量
定义在函数内部的变量拥有一个局部作用域，定义在函数外的拥有全局作用域。

局部变量只有在函数内部访问，而全局变量可以在整个程序范围内访问。

```python
total = 0 #全局变量
def sum(arg1,arg2):
    total = arg1+arg2 #定义在函数内部的局部变量
    print(f'the local variable is {total}')
    return total  
sum(10,20) # 调用函数
# 函数执行完成，局部变量离开作用域，声明周期结束
print(f'the global variable is {total}')
```

## global和nonlocal关键字

当内部作用域想修改外部作用域的变量时，需要用到global或nonlocal关键字。

### 修改全局变量

```python
num = 10
def func():
    num= 100
    return num
func()
print(num)       # 输出num为10,未能修改全局变量
###########################################################
num = 10
def func():
    global num
    num = 100
    return num
func()
print(num)       # 输出num为100,全局变量已被修改
```

### 修改外部函数中的变量

```python
def outer():
    num = 10            # 该区域相对于inner()来说是enclosing环境
    def inner():
        num = 100
        print(num)      # 输出局部变量num为100
    inner()
    print(num)          
outer()                 # 输出外部函数中的局部变量为10,enclosing作用域中的变量未被修改
########################################################################

def outer():
    num = 10            
    def inner():
        nonlocal num
        num = 100
        print(num)      # 输出局部变量num为100
    inner()
    print(num)              
outer()                 # enclosing环境中的变量已被修改
```