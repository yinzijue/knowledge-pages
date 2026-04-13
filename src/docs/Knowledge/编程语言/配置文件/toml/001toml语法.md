---
title: 001toml语法
---
# 前言

- toml大小写敏感
- python解析库推荐: tomlkit

# 注释

```toml
# 这是全行注释
key = "value"
key = "another" # 这是行末注释
```

# 键值对

## 值类型

- 字符串
- 整数
- 浮点数
- 布尔值
- 坐标日期时刻
- 各地日期时刻
- 各地日期
- 各地时刻
- 数组
- 内联表

## 键值对规则

```toml
key =    # 不指定值是非法的
first = "Tom" last = "Preston-Werner"   # 键值对后必须换行

################################################################
key = "value" # 裸键是合法的，裸键只能包含ascii字母、ascii数字、下划线和短横线(A-Za-z0-9_-)

###########################################################
点分隔键可以将相近的属性放在一起
name = "Orange"
physical.color = "orange"
physical.shape = "round"
site."google.com" = true
# 以上代码等价于json的如下结构：
# {
#   "name": "Orange",
#   "physical": {
#     "color": "orange",
#     "shape": "round"
#   },
#   "site": {
#     "google.com": true
#   }
# }
```

# 字符串

```toml
str ="这是一个基本字符串"
######################################################################
str1 = """
这是第一行\
这是第二行\
"""            # 这是多行基本字符串,末尾的反斜杠可以去掉无关的空白、换行内容
#######################################################################
# 字面量字符串类似于python中的原始字符串(raw string)它完全抑制了字符串中的转义，所见即所得
str2 ='这是单行字面量字符串'
str3 ='''
这是多行字面量字符串的第一行
这是多行字面量字符串的第二行
'''
```

# 整数

```toml
int1 = 99
int2 = +99
int3 = -99
int4= 0
int5 = 5_349_221  #下划线仅用于增强可读性
int6 = 099  # 纯数字的前导0是非法的

##################################################
hex1 = 0xDEADBEEF
hex2 = 0xdeadbeef # 十六进制大小写不敏感

oct1 = 0o1234567  # 带有数字0和小写字母o的八进制

bin1 = 0b11010110
```

# 浮点数

```toml
flt1 = +1.0
flt2 = -0.01

flt3 = 5e+22
flt4 = -2E-2

flt5 = 6.626e-34

flt6 = .7  # 小数点任意一侧无数字是非法的


sf1 = inf   # 正无穷
sf2 = +inf  # 正无穷
sf3 = -inf  # 负无穷

sf4 = nan # 非数字
sf5 = +nan # 等同于nan
sf6 = -nan
```

# 布尔值

```toml
bool1 = true
bool2 = false
```

# 日期时刻

```toml
odt1 = 1979-05-27T07:32:00Z      # 零时区
odt2 = 1979-05-27T00:32:00-07:00  # 时区偏移
odt3 = 1979-05-27T00:32:00.999999-07:00  # T可以直接用空格替代

####################################################
odt 4 = 1979-05-27T07:32:00 # 无时区偏移
```

# 数组

- 数组内的值可以是混合类型
- 数组可以跨行
- 数组值和逗号间的缩进会被忽略

```toml
integers = [ 1, 2, 3 ]
colors = [ "红", "黄", "绿" ]
nested_array_of_ints = [ [ 1, 2 ], [3, 4, 5] ]
nested_mixed_array = [ [ 1, 2 ], ["a", "b", "c"] ]
string_array = [ "所有的", '字符串', """是相同的""", '''类型''' ]
```

# 表

- 表(也被成为哈希表或**字典**),是键值对的集合
- 表头由独立一行的方括号及内部的值构成
- 自表头起，直至下一个表头或者文件结束，下方的内容都表示这个表的键值对
- 表不保证结果能够保持键值对的指定顺序

```toml
# 等价于json中的:   { "dog": { "tater.man": { "type": { "name": "pug" } } } }
[dog."tater.man"]
type.name = "pug"

# 等价于json中的: {"x": {"y": {"z": {"w": {"key": "value"}}}}}
[x.y.z.w]
key = "value"
```

```toml
# 顶层表开始。
name = "Fido"
breed = "pug"               # 顶层表开始于文档起始处，结束于第一个表头前

# 顶层表结束。
[owner]
name = "Regina Dogman"
member_since = 1999-08-04
```

# 内联表

- 内联表是独立的，因此不能在括号以外的地方为内联表添加键和子表
- 内联表不能被用于向一个已定义的表添加键或子表

```toml
# 以下是内联表,直接用花括号来定义
name = { first = "Tom", last = "Preston-Werner" }
point = { x = 1, y = 2 }
animal = { type.name = "pug" }

#等价于以下基本表：
[name]
first = "Tom"
last = "Preston-Werner"

[point]
x = 1
y = 2

[animal]
type.name = "pug"
```

# 表数组

- 表数组类似json的数组中嵌套对象

```toml
[[products]]
name = "Hammer"
sku = 738594937

[[products]]  # 数组里的空表

[[products]]
name = "Nail"
sku = 284758393

color = "gray"

# 上述表数组等价于json的：
# {
#   "products": [
#     { "name": "Hammer", "sku": 738594937 },
#     { },
#     { "name": "Nail", "sku": 284758393, "color": "gray" }
#   ]
# }
```

- **任何对表数组的引用都指向该数组里最近定义的表元素。**

```toml
[[fruits]]
name = "apple"

[fruits.physical]  # 子表
color = "red"
shape = "round"

[[fruits.varieties]]  # 嵌套表数组
name = "red delicious"

[[fruits.varieties]]
name = "granny smith"

[[fruits]]
name = "banana"

[[fruits.varieties]]
name = "plantain"

# 等价于json的:
#{
#  "fruits": [
#    {
#      "name": "apple",
#      "physical": {
#        "color": "red",
#        "shape": "round"
#      },
#      "varieties": [
#        { "name": "red delicious" },
#        { "name": "granny smith" }
#      ]
#    },
#    {
#      "name": "banana",
#      "varieties": [
#        { "name": "plantain" }
#      ]
#    }
#  ]
#}
```