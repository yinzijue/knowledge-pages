---
title: 通过更快的HTTP客户端提高性能
---
# 通过更快的HTTP客户端提高性能

Locust的默认HTTP客户端使用python-requests。它提供了一个许多Python开发人员都熟悉的良好API，并且维护得非常好。但是，如果你打算在硬件资源有限的情况下运行高吞吐量的测试，那么它有时可能不够高效。

因此，Locust也提供了FastHttpUser，它使用geventhttpclient代替。FastHttpUser提供了非常相似的API，并且显著减少了CPU时间的使用，有时可以在给定的硬件上将每秒最大请求数提高多达5-6倍。

无法确切说出Locust在你的特定硬件和测试计划下能够处理多少请求，因此你需要进行测试。检查Locust的控制台输出，如果它受到CPU限制，它会发出警告。

在最佳情况下（在while True循环中发送小请求），单个Locust进程（限制在一个CPU核心上）使用FastHttpUser可以达到每秒约16000个请求，而使用HttpUser则可以达到每秒约4000个请求（在2021年的M1 MacBook Pro和Python 3.11上测试）。

对于更大的请求负载，相对改进可能更大，但如果你的测试正在进行与请求无关的CPU密集型操作，则改进可能较小。

当然，在实际情况中，你应该为每个CPU核心运行一个locust进程。

>[!note]+
只要你的负载生成器CPU没有过载，FastHttpUser的响应时间应该与HttpUser几乎相同。它并不会使单个请求更快。


# 如何使用FastHttpUser

只需继承FastHttpUser而不是HttpUser即可：

```python
from locust import task, FastHttpUser

class MyUser(FastHttpUser):
    @task
    def index(self):
        response = self.client.get("/")
```

# 并发

单个FastHttpUser/geventhttpclient会话可以并发运行请求，你只需要为每个请求启动greenlet（协程）即可：

```python
@task
def t(self):
    def concurrent_request(url):
        self.client.get(url)

    pool = gevent.pool.Pool()
    urls = ["/url1", "/url2", "/url3"]
    for url in urls:
        pool.spawn(concurrent_request, url)
    pool.join()
```

>[!note]+
FastHttpUser/geventhttpclient与HttpUser/python-requests非常相似，但有时候也存在一些细微的差异。特别是当你处理客户端库的内部机制时，例如手动管理cookies时，这种差异尤为明显。

# REST

FastHttpUser 提供了一个用于测试 REST/JSON HTTP 接口的 rest 方法。它是 self.client.request 的一个封装，具有以下特点：

- 将 JSON 响应解析为一个名为 js 的字典，并存储在响应对象中。如果响应不是有效的 JSON，则将请求标记为失败。
- 默认将 Content-Type 和 Accept 头部设置为 application/json
- 设置 catch_response=True（因此总是使用 with-block）
- 捕获你在 with-block 中抛出的任何未处理的异常，并将样本标记为失败（而不是立即退出任务而不触发请求事件）

```python
from locust import task, FastHttpUser

class MyUser(FastHttpUser):
    @task
    def t(self):
        with self.rest("POST", "/", json={"foo": 1}) as resp:
            if resp.js is None:
                pass # no need to do anything, already marked as failed
            elif "bar" not in resp.js:
                resp.failure(f"'bar' missing from response {resp.text}")
            elif resp.js["bar"] != 42:
                resp.failure(f"'bar' had an unexpected value: {resp.js['bar']}")
```

完整的示例，请参见 rest.py。它也展示了如何使用继承来为你的 REST API 提供多个请求/测试计划共用的特定行为。

>[!note]+
这个功能是新的，并且其接口/实现的细节可能会在未来的 Locust 版本中发生变化。

# 连接处理

默认情况下，User 会重用相同的 TCP/HTTP 连接（除非它因某种原因断开）。为了更真实地模拟新的浏览器连接到你的应用，可以手动关闭这个连接。

```python
@task
def t(self):
    self.client.client.clientpool.close() # self.client.client is not a typo
    self.client.get("/")                  # Here a new connection will be created
```

# API

## FastHttpUser类

**_class_****FastHttpUser(****_environment_****)**[源码](https://docs.locust.io/en/stable/_modules/locust/contrib/fasthttp.html#FastHttpUser)

FastHttpUser 提供了与 HttpUser 相同的 API，但底层客户端使用的是 geventhttpclient 而不是 python-requests。它在负载生成器上使用的 CPU 资源显著减少，并且在大多数情况下应该可以作为简单的即插即用替代品。

client_pool=None  
HTTP 客户端池的使用。如果没有指定，则每个用户都会创建一个新的池。

concurrency=10  
传递给 FastHttpSession 的参数。描述了 FastHttpSession 允许的同时请求数量。默认为 10。请注意，当提供自定义的 client_pool 时，设置此值没有任何效果，你需要创建自己的 gevent 池来使用它（因为每个 User 只有一个 greenlet）。请查看 test_fasthttp.py 中的 test_client_pool_concurrency 示例。

connection_timeout=60.0  
传递给 FastHttpSession 的参数。

insecure=True  
传递给 FastHttpSession 的参数。默认为 True，表示不进行 SSL 验证。

max_redirects=30  
传递给 FastHttpSession 的参数。

max_retries=0  
传递给 FastHttpSession 的参数。

network_timeout=60.0  
传递给 FastHttpSession 的参数。

rest(method, url, headers=None, **kwargs)[[源码](1)]  
self.client.request 的一个封装，具有以下功能：

将 JSON 响应解析为一个名为 js 的字典，并存储在响应对象中。如果响应不是有效的 JSON，则将请求标记为失败。

默认将 Content-Type 和 Accept 头部设置为 application/json

设置 catch_response=True（因此总是使用 with-block）

捕获在 with-block 内部抛出的任何未处理的异常，并将样本标记为失败（而不是立即退出任务而不触发请求事件）

rest_(method, url, name=None, **kwargs)[[源码](1)]  
一些 REST API 使用时间戳作为查询字符串的一部分（主要是为了突破缓存）。这是一个方便的方法，会自动添加一个 _=<timestamp> 参数。

## FastHttpSession类

**_class_** **FastHttpSession(****_environment_****,** **_base_url_****,** **_user_****,** **_insecure=True_****,** **_client_pool=None_****,** **_ssl_context_factory=None_****,** **_**kwargs_****)**[源码](https://docs.locust.io/en/stable/_modules/locust/contrib/fasthttp.html#FastHttpSession)

get(url, **kwargs)[源码]  
发送一个 GET 请求

head(url, **kwargs)[源码]  
发送一个 HEAD 请求

options(url, **kwargs)[源码]  
发送一个 OPTIONS 请求

patch(url, data=None, **kwargs)[源码]  
发送一个 PATCH 请求（注意：这里的文档可能有误，应该是 PATCH 而不是 POST）

post(url, data=None, **kwargs)[源码]  
发送一个 POST 请求

put(url, data=None, **kwargs)[源码]  
发送一个 PUT 请求

request(method, url, name=None, data=None, catch_response=False, stream=False, headers=None, auth=None, json=None, allow_redirects=True, context={}, **kwargs)[源码]  
发送一个 HTTP 请求，返回 locust.contrib.fasthttp.FastResponse 对象。

参数：

- method – 新 Request 对象的方法。
- url – 将会与已指定的基础主机 URL 拼接的路径。也可以是完整的 URL，如果是完整的 URL，则会直接请求该 URL，忽略基础主机。
- name – （可选）用于在 Locust 的统计信息中作为标签的参数，而不是 URL 路径。这可以用于将不同的 URL 请求合并到 Locust 统计信息的单个条目中。
- catch_response – （可选）布尔参数，如果设置，可以使请求返回一个上下文管理器，用作 with 语句的参数。这将允许根据响应的内容将请求标记为失败，即使响应代码是 ok（2xx）。反之亦然，可以使用 catch_response 捕获请求，然后将其标记为成功，即使响应代码不是（例如 500 或 404）。
- data – （可选）要发送到请求体中的字符串/字节。
- json – （可选）要发送到请求体中的字典。自动将 Content-Type 和 Accept 头部设置为 "application/json"。仅在未设置 data 时使用。
- headers – （可选）与请求一起发送的 HTTP 头部的字典。
- auth – （可选）用于启用基本 HTTP 认证的（用户名，密码）元组。
- stream – （可选）如果设置为 true，则响应体不会被立即消耗，而是可以通过访问 Response 对象上的 stream 属性来消费。将 stream 设置为 True 的另一个副作用是，下载响应内容的时间将不会被计入 Locust 报告的请求时间中。

**_class_****FastResponse(****_ghc_response_****,** **_request=None_****,** **_sent_request=None_****)**[[源码]](https://docs.locust.io/en/stable/_modules/locust/contrib/fasthttp.html#FastResponse)

_**property**_ **content**

在需要时解压缩并缓冲接收到的主体内容。对于大文件请小心！

**headers**

包含响应头部的类字典对象

**json()**[[源码]](https://docs.locust.io/en/stable/_modules/locust/contrib/fasthttp.html#FastResponse.json)

将响应解析为 JSON 并返回一个字典

_**property**_ **text**

返回响应的文本内容，作为解码后的字符串