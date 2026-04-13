---
title: 002编写一个locust文件
---
# 编写一个locust文件

现在，让我们来看一个更完整/更实际的例子，展示你的测试可能是什么样的：

```python
import time
from locust import HttpUser, task, between

class QuickstartUser(HttpUser):
    wait_time = between(1, 5)

    @task
    def hello_world(self):
        self.client.get("/hello")
        self.client.get("/world")

    @task(3)
    def view_items(self):
        for item_id in range(10):
            self.client.get(f"/item?id={item_id}", name="/item")
            time.sleep(1)

    def on_start(self):
        self.client.post("/login", json={"username":"foo", "password":"bar"})
```

我们来逐步分析它

```python
import time  
from locust import HttpUser, task, between
```

locust文件只是一个普通的Python模块，它可以从其他文件或包中导入代码。

```python
class QuickstartUser(HttpUser):
```

在这里，我们定义了一个用于模拟的用户的类。它继承自HttpUser，后者为每个用户提供了一个client属性，这个属性是HttpSession的一个实例，可用于向我们要进行负载测试的目标系统发起HTTP请求。当测试开始时，locust将为它模拟的每个用户创建这个类的一个实例，并且每个用户将在他们自己的green gevent线程中运行。

为了使一个文件成为有效的locust文件，它必须至少包含一个从User类继承的类。

```python
wait_time = between(1, 5)
```

我们的类定义了一个wait_time，它会让模拟的用户在每次任务（见下文）执行后等待1到5秒。更多信息请参见wait_time属性。

```python
@task  
def hello_world(self):  
    self.client.get("/hello")  
    self.client.get("/world")
```

使用@task装饰器的方法是你的locust文件的核心。对于每个运行的User，Locust都会创建一个greenlet（一个协程或“微线程”），这个greenlet会调用这些方法。任务中的代码是顺序执行的（它就是普通的Python代码），因此直到接收到/hello的响应后，才会调用/world。

```python
@task
def hello_world(self):
    ...

@task(3)
def view_items(self):
    ...
```

我们已经通过用@task装饰两个方法声明了两个任务，其中一个任务被赋予了更高的权重（3）。当我们的QuickstartUser运行时，它会从已声明的任务中选择一个——在这个例子中，是hello_world或view_items——并执行它。任务的选择是随机的，但你可以给它们分配不同的权重。上述配置将使Locust选择view_items的可能性是选择hello_world的三倍。当一个任务执行完成后，用户将按照指定的等待时间（在这种情况下是1到5秒）进行休眠。然后它会选择一个新的任务。

请注意，只有用@task装饰的方法才会被选择，所以你可以按你喜欢的方式定义自己的内部辅助方法。

```python
self.client.get("/hello")
```

self.client属性使得可以通过Locust记录HTTP调用成为可能。有关如何发送其他类型的请求、验证响应等的信息，请参阅使用HTTP客户端。

注意

HttpUser不是一个真正的浏览器，因此它不会解析HTML响应来加载资源或渲染页面。但它会跟踪cookies。

```python
@task(3)
def view_items(self):
    for item_id in range(10):
        self.client.get(f"/item?id={item_id}", name="/item")
        time.sleep(1)
```

在view_items任务中，我们通过使用变量查询参数加载了10个不同的URL。由于Locust的统计信息是基于URL分组的，因此为了不获得10个单独的条目，我们使用name参数将所有这些请求分组到一个名为"/item"的条目下。

```python
def on_start(self):
    self.client.post("/login", json={"username":"foo", "password":"bar"})
```

此外，我们还声明了一个on_start方法。每个模拟用户开始运行时都会调用具有此名称的方法。更多信息请参见on_start和on_stop方法。

# 自动生成locustfile

你可以使用har2locust根据浏览器记录（HAR文件）生成locustfiles。

这对于不习惯手动编写locustfiles的初学者来说特别有用。

>[!note]+ 
>har2locust仍然处于测试阶段。它可能并不总是能生成正确的locustfiles（性能测试脚本文件），并且其界面可能会在不同版本之间发生变化。

# User类

用户类代表您系统中的一种用户/场景。当您进行测试运行时，您指定要模拟的并发用户数量，Locust将为每个用户创建一个实例。您可以向这些类/实例添加任何您喜欢的属性，但其中一些属性对Locust具有特殊意义：

## wait_time属性

用户的wait_time方法使得在每个任务执行后引入延迟变得容易。如果未指定wait_time，则一个任务完成后会立即执行下一个任务。

- constant：固定时间量
- between：在最小值和最大值之间的随机时间

例如，要让每个用户在每次任务执行后等待0.5到10秒之间的时间：

```python
from locust import User, task, between  
  
class MyUser(User):  
    @task  
    def my_task(self):  
        print("executing my_task")  
  
    wait_time = between(0.5, 10)
```

- constant_throughput：一个自适应时间，确保任务（最多）每秒运行X次。
- constant_pacing：一个自适应时间，确保任务（最多）每X秒运行一次（它是constant_throughput的数学倒数）。

>[!note]+
例如，如果您希望Locust在峰值负载下每秒运行500个任务迭代，您可以使用wait_time = constant_throughput(0.1)和5000个用户。
等待时间只能限制吞吐量，不能通过启动新用户来达到目标。因此，在我们的示例中，如果任务迭代的时间超过10秒，则吞吐量将小于500。
等待时间是在任务执行后应用的，因此如果您有高启动率/加速，在加速期间可能会超过您的目标。
等待时间适用于任务，而不是请求。例如，如果您指定wait_time = constant_throughput(2)并在任务中发出两个请求，则每个用户的请求率/每秒请求数（RPS）将是4。

还可以直接在类上声明自己的wait_time方法。例如，以下用户类会在第一次等待一秒，第二次等待两秒，第三次等待三秒，依此类推。
```python
class MyUser(User):
    last_wait_time = 0

    def wait_time(self):
        self.last_wait_time += 1
        return self.last_wait_time

    ...
```

## weight 和 fixed_count 属性

如果文件中存在多个用户类，并且没有在命令行上指定用户类，Locust 将为每个用户类生成等量的用户实例。您也可以通过在命令行参数中传递它们来指定从同一个 locust 文件中使用哪些用户类：

```python
$ locust -f locust_file.py WebUser MobileUser
```

如果你希望模拟某一类型的用户数量多于另一种类型的用户，你可以在这些类上设置weight属性。下面的代码将使Locust生成WebUser的数量是MobileUser的3倍：

```python
class WebUser(User):  
    weight = 3  
    # ... 其他代码  
  
class MobileUser(User):  
    weight = 1  
    # ... 其他代码
```

此外，你还可以设置fixed_count属性。在这种情况下，weight属性将被忽略，只会生成确切数量的用户。这些用户在任何常规、带权重的用户之前生成。在下面的例子中，只会生成一个AdminUser实例，以便以更准确的请求计数控制进行某些特定工作，而不受总用户数量的影响。

```python
class AdminUser(User):  
    wait_time = constant(600)  # 600秒（10分钟）的等待时间  
    fixed_count = 1  
  
    @task  
    def restart_app(self):  
        # ... 重启应用的代码  
  
class WebUser(User):  
    # ... 其他代码
```

## host 属性

host属性是你想要测试的主机的URL前缀（例如：https://google.com）。它会自动添加到请求中，所以你可以做self.client.get("/")这样的请求。

你可以在Locust的Web UI中或在命令行上使用--host选项来覆盖这个值。

## tasks 属性

用户类可以使用@task装饰器将任务声明为类下的方法，但也可以使用tasks属性来指定任务，下面将更详细地描述这一点。

## environment 属性

一个引用，指向运行用户的环境。使用它来与环境或其中包含的运行器进行交互。例如，要从任务方法中停止运行器：

```python
self.environment.runner.quit()
```

如果在单机Locust实例上运行，这将停止整个运行。如果在工作节点上运行，它将停止该特定节点。

## on_start 和 on_stop 方法

用户（和TaskSets）可以声明on_start方法和/或on_stop方法。一个用户在开始运行时调用其on_start方法，并在停止运行时调用其on_stop方法。对于TaskSet，当模拟用户开始执行该TaskSet时调用on_start方法，当模拟用户停止执行该TaskSet（当调用interrupt()或用户被杀死时）时调用on_stop方法。

# 任务

当负载测试开始时，会为每个模拟用户创建一个用户类的实例，并在它们自己的greenlet中开始运行。这些用户运行时选择任务来执行，休眠一段时间，然后选择新任务，依此类推。

## @task 装饰器

为用户添加任务的最简单方法是使用task装饰器。

```python
from locust import User, task, constant  
  
class MyUser(User):  
    wait_time = constant(1)  
  
    @task  
    def my_task(self):  
        print("用户实例 (%r) 正在执行 my_task" % self)
```

@task接受一个可选的weight参数，用于指定任务的执行比率。在以下示例中，task2被选中的概率是task1的两倍：

```python
from locust import User, task, between  
  
class MyUser(User):  
    wait_time = between(5, 15)  
  
    @task(3)  
    def task1(self):  
        pass  
  
    @task(6)  
    def task2(self):  
        pass
```

## tasks 属性

定义用户任务的另一种方法是设置tasks属性。

tasks属性要么是一个任务列表，要么是一个<Task : int>字典，其中Task是Python可调用对象或TaskSet类。如果任务是一个普通的Python函数，它们接收一个参数，即执行该任务的用户实例。

以下是一个将用户任务声明为普通Python函数的示例：
```python
from locust  import  User, constant
def my_task(user):
    pass
class MyUser(User):
    tasks = [my_task]
    wait_time = constant(1)
```

如果tasks属性被指定为一个列表，每次需要执行任务时，都会从tasks属性中随机选择一个任务。然而，如果tasks是一个字典——以可调用对象作为键，整数作为值——那么将要执行的任务会随机选择，但整数值会作为比率。因此，对于一个如下所示的任务：

```python
{my_task: 3, another_task: 1}
```

my_task被执行的可能性是another_task的三倍。

在内部，上述字典实际上会被扩展成一个列表（并更新tasks属性），如下所示：

```python
[my_task, my_task, my_task, another_task]
```

然后，Python的random.choice()函数会被用来从列表中随机选择任务。

## @tag 装饰器

通过使用@tag装饰器为任务打标签，你可以通过--tags和--exclude-tags参数在测试期间选择性地执行特定任务。考虑以下示例：

```python
from locust import User, constant, task, tag  
  
class MyUser(User):  
    wait_time = constant(1)  
  
    @tag('tag1')  
    @task  
    def task1(self):  
        pass  
  
    @tag('tag1', 'tag2')  
    @task  
    def task2(self):  
        pass  
  
    @tag('tag3')  
    @task  
    def task3(self):  
        pass  
  
    @task  
    def task4(self):  
        pass
```

如果你使用--tags tag1启动这个测试，那么在测试期间只会执行task1和task2。如果你使用--tags tag2 tag3启动，那么只会执行task2和task3。

--exclude-tags的工作方式完全相反。因此，如果你使用--exclude-tags tag3启动测试，那么只会执行task1、task2和task4。排除总是优先于包含，所以如果一个任务有你包含的一个标签和你排除的一个标签，那么它不会被执行。

# 事件

如果你希望在测试过程中运行一些设置代码，通常将其放在你的locustfile的模块级别就足够了，但有时你需要在运行过程中的特定时间执行某些操作。为了满足这种需求，Locust提供了事件钩子。

## test_start 和 test_stop

如果你需要在负载测试的开始或结束时运行一些代码，你应该使用test_start和test_stop事件。你可以在locustfile的模块级别为这些事件设置监听器：

```python
from locust import events  
  
@events.test_start.add_listener  
def on_test_start(environment, **kwargs):  
    print("一个新的测试正在开始")  
  
@events.test_stop.add_listener  
def on_test_stop(environment, **kwargs):  
    print("一个新的测试正在结束")
```

## init

init事件在每个Locust进程开始时触发。这在分布式模式下特别有用，因为每个工作进程（而不是每个用户）都需要一个机会来进行一些初始化。例如，假设你有一些全局状态，这个进程生成的所有用户都需要：

```python
from locust import events  
from locust.runners import MasterRunner  
  
@events.init.add_listener  
def on_locust_init(environment, **kwargs):  
    if isinstance(environment.runner, MasterRunner):  
        print("我在主节点上")  
    else:  
        print("我在一个工作节点或独立节点上")
```

## 其他事件

请查看使用事件钩子扩展Locust以获取其他事件和如何使用它们的更多示例。

# HttpUser 类

HttpUser是最常用的User。它添加了一个client属性，用于发送HTTP请求。

```python
from locust import HttpUser, task, between  
  
class MyUser(HttpUser):  
    wait_time = between(5, 15)  
  
    @task(4)  
    def index(self):  
        self.client.get("/")  
  
    @task(1)  
    def about(self):  
        self.client.get("/about/")
```

## client属性 / HttpSession

client是HttpSession的一个实例。HttpSession是requests.Session的一个子类/包装器，因此它的特性已经被很好地文档化，并且对许多人来说是熟悉的。HttpSession主要添加的是将请求结果报告给Locust（成功/失败，响应时间，响应长度，名称）。

它包含了所有HTTP方法的方法：get, post, put, ...

就像requests.Session一样，HttpSession在请求之间保留cookies，因此它可以很容易地用于登录网站。

_发送一个POST请求，查看响应，并隐式地重用我们在第二个请求中获得的任何会话cookie_

```python
response = self.client.post("/login", {"username":"testuser", "password":"secret"})  
print("响应状态码:", response.status_code)  
print("响应文本:", response.text)  
response = self.client.get("/my-profile")
```

HttpSession捕获由Session抛出的任何requests.RequestException（由连接错误、超时或类似原因引起），而是返回一个设置了status_code为0且content为None的虚拟Response对象。

## 验证响应

如果HTTP响应码是OK（<400），则请求被认为是成功的，但通常对响应进行一些额外的验证是有用的。

你可以通过使用catch_response参数、with语句和对response.failure()的调用来将请求标记为失败。

```python
pwith self.client.get("/", catch_response=True) as response:  
    if response.text  != "Success":  
        response.failure("收到了错误的响应")  
    elif response.elapsed.total_seconds() > 0.5:  
        response.failure("请求耗时太长")
```

你也可以将请求标记为成功，即使响应码是坏的：

```python
with self.client.get("/does_not_exist/", catch_response=True) as response:  
    if response.status_code == 404:  
        response.success()
```

你甚至可以通过抛出异常并在with块外部捕获它来完全避免记录请求。或者，你可以抛出一个Locust异常，如下例所示，并让Locust捕获它。

```python
from locust.exception import RescheduleTask  
...  
with self.client.get("/does_not_exist/", catch_response=True) as response:  
    if response.status_code == 404:  
        raise RescheduleTask()
```

## REST/JSON API

FastHttpUser提供了一个现成的rest方法，但你也可以自己实现：

```python
from json import JSONDecodeError
...
with self.client.post("/", json={"foo": 42, "bar": None}, catch_response=True) as response:
    try:
        if response.json()["greeting"] != "hello":
            response.failure("Did not get expected value in greeting")
    except JSONDecodeError:
        response.failure("Response could not be decoded as JSON")
    except KeyError:
        response.failure("Response did not contain expected key 'greeting'")
```

## 请求分组

对于网站来说，拥有包含某种动态参数的URL页面是非常常见的。通常将这些URL在用户的统计信息中组合在一起是有意义的。这可以通过向HttpSession的不同请求方法传递一个name参数来实现。

示例：

```python
# 这些请求的统计信息将被归组到：/blog/?id=[id]  
for i in range(10):  
    self.client.get("/blog?id=%i" % i, name="/blog?id=[id]")
```

可能存在无法向请求函数传递参数的情况，例如，当与包装了Requests会话的库/SDK进行交互时。一种替代的请求分组方式是通过设置client.request_name属性。

```python
# 这些请求的统计信息将被归组到：/blog/?id=[id]  
self.client.request_name = "/blog?id=[id]"  
for i in range(10):  
    self.client.get("/blog?id=%i" % i)  
self.client.request_name = None
```

如果你希望以最小的样板代码（boilerplate）链接多个分组，你可以使用client.rename_request()上下文管理器。

```python
@task  
def multiple_groupings_example(self):  
    # 这些请求的统计信息将被归组到：/blog/?id=[id]  
    with self.client.rename_request("/blog?id=[id]"):  
        for i in range(10):  
            self.client.get("/blog?id=%i" % i)  
  
    # 这些请求的统计信息将被归组到：/article/?id=[id]  
    with self.client.rename_request("/article?id=[id]"):  
        for i in range(10):  
            self.client.get("/article?id=%i" % i)
```

通过使用catch_response并直接访问request_meta，你甚至可以根据响应中的某些内容来重命名请求。

```python
with self.client.get("/", catch_response=True) as resp:  
    resp.request_meta["name"] = resp.json()["name"]
```

## HTTP代理设置

为了提高性能，我们通过将requests.Session的trust_env属性设置为False来配置请求，以便它不会在环境中查找HTTP代理设置。如果你不希望这样做，你可以手动将locust_instance.client.trust_env设置为True。更多详细信息，请参考requests的文档。

## 连接池

由于每个HttpUser都会创建新的HttpSession，因此每个用户实例都有自己的连接池。这与真实用户与Web服务器交互的方式类似。

但是，如果你想在所有用户之间共享连接，你可以使用单个池管理器。为此，请将pool_manager类属性设置为urllib3.PoolManager的实例。

```python
from locust import HttpUser  
from urllib3 import PoolManager  
  
class MyUser(HttpUser):  
    # 所有用户最多将被限制为10个并发连接。  
    pool_manager = PoolManager(maxsize=10, block=True)
```

有关更多配置选项，请参考urllib3的文档。

# TaskSets

TaskSets是组织层次化网站/系统测试的一种方式。你可以在这里了解更多关于它的信息。

# 示例

这里有很多locustfile的示例

# 如何组织你的测试代码

重要的是要记住，locustfile.py只是一个普通的Python模块，由Locust导入。从这个模块中，你可以像在任何Python程序中一样自由地导入其他Python代码。当前工作目录会自动添加到Python的sys.path中，因此可以使用Python的import语句导入工作目录中的任何Python文件/模块/包。

对于小型测试，将所有测试代码保存在单个locustfile.py中应该就可以了，但对于较大的测试套件，你可能希望将代码拆分成多个文件和目录。

当然，你如何组织测试源代码完全取决于你，但我们建议你遵循Python的最佳实践。以下是一个虚构的Locust项目的示例文件结构：

- Project root

	- common/

		- __init__.py
		- auth.py
		- config.py

	- locustfile.py
	- requirements.txt (External Python dependencies is often kept in a requirements.txt)

一个包含多个 locustfile 的项目也可以将它们保存在一个单独的子目录中：

- Project root

	- common/

		- __init__.py
		- auth.py
		- config.py

	- my_locustfiles/

		- api.py
		- website.py

	- requirements.txt

使用上述任何项目结构，你的 locustfile 可以通过以下方式导入公共库：

```python
import common.auth
```