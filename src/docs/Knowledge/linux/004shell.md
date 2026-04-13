---
title: 004shell
---
# shell环境

在shell脚本的起始位置，一般会有类似**#!/bin/bash**的字样，用于告诉系统当前脚本将使用后面的路径指向的解释器运行。#！是约定好的格式。

# 运行shell脚本

有两种方式可以运行shell脚本：1.直接访问脚本文件；2.将脚本作为解释器参数，例如

```shell
/bin/sh test.sh #指定sh作为脚本解释器
```

# shell变量

## 定义变量

定义变量时，变量名不加美元符号，例如：

```shell
your_name="Jack" #定义变量your_name
```
>[!important]+ 
>**变量名和等号之间不能有空格(操作符两边也不能有空格)**
## 使用变量

使用变量时，变量前要加美元符号，符号与变量之间也不能有空格。例如：

```shell
your_name="rose"
echo $your_name
your_name="jack" #已被定义的变量，可以被重新定义
echo $your_name
```

## 变量命名规则

- 命名只能使用英文字母、数字和下划线；
- 首个字符不能以数字开头；
- 不能使用标点符号；
- 不能使用bash里的关键字；

```shell
RUNOOB
LD_LIBRARY_PATH
_var
var2
```

```shell
?var=123
user*name=runoob
```