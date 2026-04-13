---
title: 001yaml语法
---
# 前言

- 大小写敏感
- 使用缩进代表层级关系
- 相同层级的缩进要对齐
- **特殊标记后需要跟一个空格，例如冒号、问号等**
- \# 用来表示注释
- 支持的数据结构有：对象(键值对)、数组、纯量(字符串、数值、布尔等)
- python解析库推荐: ruamel-yaml

# 对象

以键值对形式存在，类似python中的dict。（**冒号后要加一个空格**）

```yaml
key:
  child-key: value
  child-key2: value2
# 上述代码的流式写法  key: {child-key: value,child-key2: value2}

?
  - Detroit Tigers
  - Chicago cubs
: - 2001-07-23

?
  [ New York Yankees,
    Atlanta Braves ]
: [ 2001-07-02, 2001-08-12,
    2001-08-14 ]
# 上述代码表示对象的key是一个数组,问号加一个空格，表示key；冒号加一个空格，表示value
```

# 数组

以英文短横开头的行表示构成一个数组

```yaml
# 解析结果为[a,b,c]
- a
- b
- c 

# 一个复合结构：对象+ 数组
languages:
 - Ruby
 - Perl
 - Python 
websites:
 YAML: yaml.org 
 Ruby: ruby-lang.org 
 Python: python.org 
 Perl: use.perl.org 
 # 上述结构解析结果： {'languages': ['Ruby', 'Perl', 'Python'], 'websites': {'YAML': 'yaml.org', 'Ruby': 'ruby-lang.org', 'Python': 'python.org', 'Perl': 'use.perl.org'}}
```

# 纯量

- 字符串
- 布尔值
- 整数
- 浮点数
- Null
- 时间
- 日期

```yaml
boolean: 
    - TRUE  #true,True都可以
    - FALSE  #false，False都可以
float:
    - 3.14
    - 6.8523015e+5  #可以使用科学计数法
int:
    - 123
    - 0b1010_0111_0100_1010_1110    #二进制表示
null:
    nodeName: 'node'
    parent: ~  #使用~表示null
string:
    - 哈哈
    - 'Hello world'  #可以使用双引号或者单引号包裹特殊字符
    - newline
      newline2    #字符串可以拆成多行，每一行会被转化成一个空格
date:
    - 2018-02-17    #日期必须使用ISO 8601格式，即yyyy-MM-dd
datetime: 
    -  2018-02-17T15:02:31+08:00    #时间使用ISO 8601格式，时间和日期之间使用T连接，最后使用+代表时区
```

# 锚点与引用

```yaml
defaults: &defaults
  adapter:  postgres
  host:     localhost

development:
  database: myapp_development
  <<: *defaults

test:
  database: myapp_test
  <<: *defaults
```

- &：用于建立锚点，其后紧跟变量名，相当于编程中的声明变量
- <<：表示合并到当前数据，支持合并的有对象和列表，不支持纯量
- \* ：表示引用锚点

上述示例相当于：

```yaml
defaults:
  adapter:  postgres
  host:     localhost

development:
  database: myapp_development
  adapter:  postgres
  host:     localhost

test:
  database: myapp_test
  adapter:  postgres
  host:     localhost
```

# 特殊标记

- ---：
- ...: