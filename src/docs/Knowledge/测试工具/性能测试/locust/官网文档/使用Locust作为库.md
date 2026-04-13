---
title: 使用Locust作为库
---
# 使用Locust作为库

你可以从自己的Python代码中启动负载测试，而不是使用locust命令来运行Locust。

首先，创建一个Environment实例：

```python
from locust.env import Environment  

env = Environment(user_classes=[MyTestUser])
```

然后，可以使用Environment实例的create_local_runner或create_master_runner方法来启动一个Runner实例，这个Runner实例可以用来启动负载测试：

```python
env.create_local_runner()  
env.runner.start(5000, spawn_rate=20)  
env.runner.greenlet.join()
```

另外，你也可以绕过调度和分发逻辑，手动控制生成的用户：

```python
new_users = env.runner.spawn_users({MyUserClass.__name__: 2})  
new_users[1].my_custom_token = "custom-token-2"  
new_users[0].my_custom_token = "custom-token-1"
```

上面的例子仅在单机/本地运行模式下有效，并且是一个实验性特性。一个更常见/更好的方法是使用init或test_start事件钩子来获取/创建令牌列表，并使用on_start和on_stop方法来从列表中读取令牌并将其设置在你的User实例上。

>[!note]+
虽然可以通过这种方式创建locust工作节点（使用create_worker_runner），但这几乎没有什么意义。每个工作节点都需要在单独的Python进程中运行，并且直接与工作节点运行器交互可能会破坏一些东西。只需使用常规的locust --worker ...命令来启动工作节点。

我们还可以使用Environment实例的create_web_ui方法来启动一个Web UI，用于查看统计数据和控制Runner（例如启动和停止负载测试）：

```python
env.create_local_runner()  
env.create_web_ui()  
env.web_ui.greenlet.join()
```

# 完整示例

```python
#!/usr/bin/env python3
from locust import HttpUser, events, task
from locust.env import Environment
from locust.log import setup_logging
from locust.stats import stats_history, stats_printer

import gevent

setup_logging("INFO")


class MyUser(HttpUser):
    host = "https://docs.locust.io"

    @task
    def t(self):
        self.client.get("/")


# setup Environment and Runner
env = Environment(user_classes=[MyUser], events=events)
runner = env.create_local_runner()

# start a WebUI instance
web_ui = env.create_web_ui("127.0.0.1", 8089)

# execute init event handlers (only really needed if you have registered any)
env.events.init.fire(environment=env, runner=runner, web_ui=web_ui)

# start a greenlet that periodically outputs the current stats
gevent.spawn(stats_printer(env.stats))

# start a greenlet that save current stats to history
gevent.spawn(stats_history, env.runner)

# start the test
runner.start(1, spawn_rate=10)

# in 30 seconds stop the runner
gevent.spawn_later(30, runner.quit)

# wait for the greenlets
runner.greenlet.join()

# stop the web server for good measures
web_ui.stop()
```