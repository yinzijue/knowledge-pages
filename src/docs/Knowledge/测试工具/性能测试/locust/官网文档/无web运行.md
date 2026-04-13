---
title: 无web运行
---
# 无web UI运行

你可以通过使用 --headless 标志以及 -u/--users 和 -r/--spawn-rate 来运行 Locust，而无需 Web UI：

```bash
locust -f locust_files/my_locust_file.py --headless -u 100 -r 5
[2021-07-24 10:41:10,947] .../INFO/locust.main: No run time limit set, use CTRL+C to interrupt.
[2021-07-24 10:41:10,947] .../INFO/locust.main: Starting Locust 2.27.0
[2021-07-24 10:41:10,949] .../INFO/locust.runners: Ramping to 100 users using a 5.00 spawn rate
Name              # reqs      # fails  |     Avg     Min     Max  Median  |   req/s failures/s
----------------------------------------------------------------------------------------------
GET /hello             1     0(0.00%)  |     115     115     115     115  |    0.00    0.00
GET /world             1     0(0.00%)  |     119     119     119     119  |    0.00    0.00
----------------------------------------------------------------------------------------------
Aggregated             2     0(0.00%)  |     117     115     119     117  |    0.00    0.00

[2021-07-24 10:44:42,484] .../INFO/locust.runners: All users spawned: {"HelloWorldUser": 100} (100 total users)
```

即使在无头（headless）模式下，你也可以在测试运行时更改用户数量。按 w 键增加 1 个用户，或者按 W 键增加 10 个用户。按 s 键移除 1 个用户，或者按 S 键移除 10 个用户。

# 为测试设置时间限制

要为测试指定运行时间，请使用 -t/--run-time：

```bash
$ locust --headless -u 100 --run-time 1h30m
$ locust --headless -u 100 --run-time 60 # default unit is seconds
```

当时间到达时，Locust 将关闭。时间是从测试开始时计算的（而不是从斜坡上升完成时）。

允许任务在关闭时完成其迭代  
默认情况下，Locust 会立即停止你的任务（甚至不等待请求完成）。为了给正在运行的任务一些时间来完成其迭代，请使用 -s/--stop-timeout：

```bash
$ locust --headless --run-time 1h30m --stop-timeout 10s
```

# 无头模式下分布式运行 Locust

如果你想在无头模式下分布式运行 Locust，你应该在启动主节点时指定 --expect-workers 选项，以指定预期连接的工作节点数。然后，它会在达到指定数量的工作节点连接之前等待，再开始测试。

# 控制 Locust 进程的退出代码

默认情况下，如果有任何失败的样本，locust 进程将给出退出代码 1（使用 --exit-code-on-error 来改变这种行为）。

你也可以在测试脚本中手动控制退出代码，通过设置 Environment 实例的 process_exit_code。这在将 Locust 作为自动化/计划测试运行时特别有用，例如作为 CI 管道的一部分。

以下是一个示例，当满足以下条件中的任何一个时，它将设置非零退出代码：

- 超过 1% 的请求失败
- 平均响应时间超过 200 毫秒
- 响应时间的第 95 个百分位数大于 800 毫秒

```python
import logging
from locust import events

@events.quitting.add_listener
def _(environment, **kw):
    if environment.stats.total.fail_ratio > 0.01:
        logging.error("Test failed due to failure ratio > 1%")
        environment.process_exit_code = 1
    elif environment.stats.total.avg_response_time > 200:
        logging.error("Test failed due to average response time ratio > 200 ms")
        environment.process_exit_code = 1
    elif environment.stats.total.get_response_time_percentile(0.95) > 800:
        logging.error("Test failed due to 95th percentile response time > 800 ms")
        environment.process_exit_code = 1
    else:
        environment.process_exit_code = 0
```

请注意，此代码可以放入 locustfile.py 中，或者放入在 locustfile.py 中被导入的任何其他文件中。