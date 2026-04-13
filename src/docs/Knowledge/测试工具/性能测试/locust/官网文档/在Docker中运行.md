---
title: 在Docker中运行
---
# 在Docker中运行

官方的 Docker 镜像是 locustio/locust。

你可以像这样使用它（假设 locustfile.py 存在于当前工作目录中）：

```bash
$docker run -p 8089:8089 -v $PWD:/mnt/locust locustio/locust -f /mnt/locust/locustfile.py
```

在 Windows 上，这个命令有时会导致错误。Windows 用户应该尝试使用以下命令代替：

```bash
$ docker run -p 8089:8089 --mount type=bind,source=$pwd,target=/mnt/locust locustio/locust -f /mnt/locust/locustfile.py
```

# Docker 编排

下面是一个示例的 Docker Compose 文件，可以用来启动一个主节点和多个工作节点：

```YAML
version: '3'

services:
  master:
    image: locustio/locust
    ports:
     - "8089:8089"
    volumes:
      - ./:/mnt/locust
    command: -f /mnt/locust/locustfile.py --master -H http://master:8089
  
  worker:
    image: locustio/locust
    volumes:
      - ./:/mnt/locust
    command: -f /mnt/locust/locustfile.py --worker --master-host master
```

上述的 Compose 配置可以使用以下命令来启动一个主节点和4个工作节点：

```bash
$ docker-compose up --scale worker=4
```

# 使用 Docker 镜像作为基础镜像

当你有一些测试脚本依赖于第三方 Python 包时，这是非常常见的。在这些情况下，你可以使用官方的 Locust Docker 镜像作为基础镜像：

```DockerFile
FROM locustio/locust  
RUN pip3 install some-python-package
```

# 使用 Kubernetes 运行 Locust

查看 Locust 的 Wiki 中的 [Extensions](https://github.com/locustio/locust/wiki/Extensions#helm)([https://github.com/locustio/locust/wiki/Extensions#helm](https://github.com/locustio/locust/wiki/Extensions#helm))部分。