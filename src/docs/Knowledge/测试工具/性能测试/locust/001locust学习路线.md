---
mindmap-plugin: basic
title: 001locust学习路线
---

# locust

## 运行模式
-  CLI
    -  \--headless
        -  无UI模式
    -  \-u
        -  指定并发用户数
    -  \-r
        -  每秒产生用户数
    -  \-t
        -  运行时间
-  webUI
    -  \--web-host
        -  指定UI的主机
    -  \--web-port
        -  设置UI的端口
    -  \--class-picker
        -  用户类下拉列表

## 运行参数
-  \-f
    -  指定要运行的python文件，默认值为locustfile.py,多个文件用英文逗号分隔
-  \-H
    -  指定待测接口的主机
-  \--master
-  \--worker
-  \--logfile:
    -  设置日志文件路径，未设置则转到stdout,stderr
-  \-L
    -  \--loglevel：默认为INFO
-  \--csv=

## locustfile
-  UserClass
    -  weight
    -  fixed\_count
    -  host
    -  task
        -  @task
        -  task attribute
        -  @tag
    -  environment
    -  on\_start/on\_stop
-  events
    -  test\_start/test\_stop
    -  init
-  HttpUserClass
    -  client
    -  校验响应
        -  使用with上下文管理器
    -  grouping requests
    -  connection pooling
-  TaskSet

## configuration
-  ~/.locust.conf
-  ./locust.conf

## LoadTestShape
-  自定义测试用户数的加载策略：总数和产生率
-  需要实现tick()方法，用于返回用户数及产生率

## 扩展web
- locust使用flask来提供webUI，因此可以像使用flask那样使用locust

## logging
- locust使用的是python内建的logging框架

## Environment

## wait_time
- between
    - 在区间内取随机等待时间
-  constant
    -  固定等待时间
-  constant\_pacing
    -  任务耗时超过该值立即结束开始下一任务；不超过则等待到该值为止
-  constant\_throughtput：
    -  等待时间上限，常用于负载峰值测试

## 代码示例
- https://github.com/locustio/locust/blob/master/examples