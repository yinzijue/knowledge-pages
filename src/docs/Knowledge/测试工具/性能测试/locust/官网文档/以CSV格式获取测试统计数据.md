---
title: 以CSV格式获取测试统计数据
---
# 以CSV格式获取测试统计数据

你可能希望通过CSV文件来获取Locust的测试结果。在这种情况下，有两种方法可以实现这一点。

首先，当使用Web UI运行Locust时，你可以在“Download Data”标签下获取CSV文件。

其次，你可以使用一个标志来运行Locust，该标志将定期保存四个CSV文件。这在你计划使用--headless标志以自动化方式运行Locust时特别有用：

```bash
$ locust -f examples/basic.py --csv example --headless -t10m
```

文件将被命名为 example_stats.csv、example_failures.csv、example_exceptions.csv 和 example_stats_history.csv（当使用 --csv example 时）。前两个文件将包含整个测试运行的统计数据和失败情况，每个统计数据条目（URL端点）都有一行和一个汇总行。example_stats_history.csv 将在整个测试运行过程中添加新行，其中包含当前（10秒滑动窗口）的统计数据。默认情况下，只有汇总行会定期添加到历史统计数据中，但如果Locust是用 --csv-full-history 标志启动的，那么每次写入统计数据时（默认情况下每2秒一次），每个统计数据条目（和汇总）的行都会被添加。

如果你希望以更快（或更慢）的频率写入这些文件，你也可以自定义写入频率：

```python
import locust.stats
locust.stats.CSV_STATS_INTERVAL_SEC = 5 # default is 1 second
locust.stats.CSV_STATS_FLUSH_INTERVAL_SEC = 60 # Determines how often the data is flushed to disk, default is 10 seconds
```