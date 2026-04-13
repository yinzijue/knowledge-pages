---
title: 003docker命令
---
# 前言

许多批量操作都需要先过滤出操作对象，然后再执行命令。这就需要将一个docker命令的输出作为另一个docker命令的输入，docker中使用$符号连接两个命令。

```bash
$ docker rm $(docker ps -a -q) # 静默删除所有已停止的容器，返回docker的id
```

# 容器生命周期&状态查询

## docker run

### 概述

用于创建一个新的容器并运行。

### 命令语法

```bash
$ docker run [OPTIONS] image [COMMAND][ARG...]
```

### 命令参数

#### -a

指定标准输入输出内容类型，可选STDIN/STDOUT/STDERR三项。

#### -d

后台运行容器，执行后返回容器ID。

#### -e

设置环境变量，格式为 -e key="value"

#### -i

以交互模式运行容器，通常与-t同时使用

#### -m

设置容器使用内存的最大值

#### --name="nginx_ib"

为容器指定一个名称

#### -P

容器内部端口随机映射到主机端口

#### -p

指定端口映射，格式为 主机端口:容器端口

#### -t

为容器分配一个伪终端，例如sh、bash等，通常与-i同时使用。

#### -v

容器内部地址映射，格式为 主机路径:容器路径

### 命令实例

```bash
$ docker run -d  nginx #后台运行nginx
```

```bash
$ docker run -e GS_PASSWORD=Enmo@123 enmotech/opengauss:lastest #设置opengauss默认密码
```

```bash
$ docker run -it nginx bash # 使用bash终端以交互方式运行nginx
```

```bash
$ docker run -P -d nginx:latest #使用镜像nginx后台启动一个容器，并将容器的80端口映射到主机的随机端口
```

```bash
$ docker run -p 3306:3306 -d mysql #使用镜像MySQL后台启动一个容器，并将容器的3306端口映射到主机的3306端口
```

```bash
$ docker run -v /data:/data -d nginx:latest #后台运行一个nginx容器，将容器的data目录映射到主机的data目录
```

## docker start/restart/stop

### 概述

用于启动/重启/停止一个容器，支持批量操作。

### 命令语法

```bash
$ docker start [OPTIONS] CONTAINER1 CONTAINER2 CONTAINER3 # 启动3个容器
$ docker restart [OPTIONS] CONTAINER1 CONTAINER2 CONTAINER3 # 重启3个容器
$ docker stop [OPTIONS] CONTAINER1 CONTAINER2 CONTAINER3 # 停止3个容器
```

### 命令参数

暂无

### 命令实例

同命令语法

## docker kill

### 概述

强制停止正在运行中的容器，支持批量操作，通常在stop命令无效时使用。

### 命令语法

```bash
$ docker kill [OPTIONS] CONTAINER1 CONTAINER2 CONTAINER3 # 杀掉3个容器
```

### 命令参数

暂无

### 命令实例

同命令语法

## docker rm

### 概述

删除一个或多个容器，支持批量操作。

### 命令语法

```bash
docker rm [OPTIONS] CONTAINER1 CONTAINER2 CONTAINER3 # 删除
```

### 命令参数

-v

删除与容器关联的卷

### 命令实例

```bash
docker rm -v nginx # 删除容器nginx，并删除容器挂载的数据卷
```

## docker pause/unpause

### 概述

暂停/恢复容器中的所有进程,支持批量操作

### 命令语法

```bash
$ docker pause CONTAINER [CONTAINER...]  #暂停对应容器
$ docker unpause CONTAINER [CONTAINER...] #恢复对应容器
```

### 命令参数

暂无

### 命令实例

同命令语法

## docker create

### 概述

创建一个容器，但不启动它。

### 命令语法

```bash
$ docker create [OPTIONS] IMAGE [COMMAND] [ARG...]
```

### 命令参数

同[docker run](https://www.yuque.com/yinzijue/sei7tg/qwy04lzp33eznv2r#HmsSH)

### 命令实例

同[docker run](https://www.yuque.com/yinzijue/sei7tg/qwy04lzp33eznv2r#glOl4)

## docker exec

### 概述

在正在运行的容器中执行命令，常用于进入容器。

### 命令语法

```bash
docker exec [OPTIONS] CONTAINER COMMAND [ARG...]
```

### 命令参数

#### -d

分离模式，即后台运行

#### -i

交互模式运行

#### -t

分配一个伪终端，通常与-i合用。

### 命令实例

```bash
$ docker exec -it nginx01 bash # 使用bash终端以交互模式进入容器nginx01
```

# 本地镜像命令

## docker build

### 概述

使用dockerfile构建新的镜像，该dockerfile可以在本地的特定路径下，或者网络上的特定路径。若未

### 命令语法

```bash
$ docker build [OPTIONS] PATH|URL|- 
```

## docker save

### 概述

使将指定镜像保存成tar归档文件,支持批量操作。

### 命令语法

```bash
$ docker save [OPTIONS] IMAGE1 IMAGE2 ...
```

### 命令参数

#### -o string

输出到文件,string为一个文件的路径

### 命令实例

```bash
$ docker save -o  /opt/mysql.tar mysql:1.2
```

## docker load

### 概述

从一个归档文件或者标准输入中载入镜像，该镜像不会被加载到镜像仓库。

### 命令语法

```bash
$ docker load [OPTIONS]
```

### 命令参数

#### -i string

指定要导入的文件,string是一个可用的文件路径

#### -q

精简输出信息

### 命令实例

```bash
$ docker load -i /opt/registry.tar #从tar文件中载入镜像
$ docker save registry | docker load # 从标准输入中载入镜像
```

## docker import

### 概述

从归档文件中导入内容用以创建文件系统镜像

### 命令语法

```bash
$ docker import [OPTIONS] file|URL|- [REPOSITORY[:TAG]]
```

### 命令参数

#### -c list

指定要导入的文件,string是一个可用的文件路径

#### -q

精简输出信息

### 命令实例

```bash
$ docker import /opt/mysql.tar mysql:oem #从tar文件中导入镜像mysql，定义标签为oem
$ cat /opt/mysql.tar | docker import - mysql:oem #从标准输入中读取数据导入为镜像
```

## docker images

### 概述

列出本地镜像。注意和**docker image**区分开来：docker images只用于呈现本地镜像，而docker image则用于管理镜像。

### 命令语法

```bash
$ docker images [OPTIONS] [REPOSITORY[:TAG]] #列出特定仓库的镜像
```

### 命令参数

#### -a

列出包含中间镜像在内的所有镜像，默认情况下中间镜像是隐藏的。

**中间镜像**(intermediate images)：在docker build的过程中，为了加速镜像构建、重复利用资源，docker会利用中间层镜像，这些镜像的repository和tag都为none。

这里需要将中间镜像和虚悬镜像(dangling iamges)区分开来：

- 中间镜像通常是其他镜像的依赖，删除时需谨慎，可能会导致上层镜像丢失依赖而出错。而删除那些依赖中间镜像的镜像后，中间镜像也被自动删除了；
- 虚悬景象则通常是一些无效的镜像，可以通过特定命令过滤出来然后删除。

#### --format

以特定格式呈现查询结果，例如json等。

#### --no-trunc

显示完整的镜像信息，常用于查看

#### -q

只显示镜像ID

### 命令实例

```bash
$ docker images debian --format json # 以json格式展示所有仓库为debian的镜像
```

## docker rmi

### 概述

删除本地镜像，支持批量操作。

### 命令语法

```bash
$ docker rmi [OPTIONS] IMAGE1 IMAGE2 IMAGE3
```

### 命令参数

#### -f

强制删除

### 命令实例

```bash
$ docker rmi -f debian # 强制删除镜像debian
```

## docker tag

### 概述

创建一个目标镜像，该镜像具有新标签，但仍然指向其源镜像。可以通过镜像ID来判断两者实质是同一个镜像。

### 命令语法

```bash
$ docker tag source_image:tag target_image:new_tag
```

### 命令参数

无

### 命令实例

```bash
$ docker tag debian:1.0 debian1.5
```

## docker history

### 概述

用于查看一个指定镜像的历史。

### 命令语法

```bash
$ docker history [OPTIONS] IMAGE
```

### 命令参数

#### --format

格式化输出，支持table,table TEMPLATE,json和TEMPLATE

-H

文件大小和日期可读性

#### -q

只显示镜像ID

### 命令实例

```bash
$ docker history mysql --no-trunc  # 查看镜像mysql完整历史
```

# 容器命令

## docker ps

### 概述

列出容器

### 命令语法

```bash
$ docker ps [OPTIONS]
```

### 命令参数

#### -a

显示所有容器，包含未运行的

#### -f

按条件过滤输出

#### -n

显示最新创建的n个容器

#### -l

显示最新创建的容器(包含所有状态)

#### -q

只显示容器ID

#### -s

显示文件总大小

#### --no-trunc

完整显示

### 命令实例

```bash
$ docker ps -a -s -n 3
```

## docker inspect

### 概述

返回docker对象的低级信息,支持批量查看

### 命令语法

```bash
$ docker inspect [OPTIONS] NAME|ID [NAME|ID]
```

### 命令参数

#### -f

格式化输出

#### -s

若该命令的对象是一个容器，则显示文件总大小。

#### --type string

为指定类型返回json

### 命令实例

```bash
$ docker inspect mysql:5.6
```

## docker top

### 概述

显示容器中正在运行的进程。容器运行时不一定有命令终端和top命令，使用desktop可以直接在宿主机上查看容器内进程。

### 命令语法

```bash
$ docker top CONTAINER [ps OPTIONS]
```

### 命令参数

无

### 命令实例

```bash
# 查看所有运行容器的进程
$ for i in  `docker ps |grep Up|awk '{print $1}'`;do echo \ &&docker top $i; done
```

## docker logs

### 概述

获取容器日志

### 命令语法

```bash
$ docker logs [OPTIONS] CONTAINER
```

### 命令参数

#### -f

持续跟踪日志

#### -n

限制日志输出行数

#### -t

显示时间戳

#### --since

显示特定时间之后的日志

### 命令实例

```bash
$ docker logs -f -n 10 -t --since 2021-02-15 nginx
```

## docker export

### 概述

将指定容器的文件系统导出为一个tar归档文件。

docker save & docker export

- docker save的操作对象是镜像，包含镜像的元数据和所有层，常用于不同主机之间迁移镜像或备份到本地；
- docker export 的操作对象是容器，导出内容是容器的文件系统，常用于快速备份或转移容器

### 命令语法

```bash
$ docker export [OPTIONS] CONTAINER
```

### 命令参数

#### -o string

将输入内容写入一个文件而非标准输出。

### 命令实例

```bash
$ docker export -o mysql-`date+%Y%m%d`.tar a404c6c174a2 #按日期保存容器
```

## docker events

### 概述

从服务器获取实时事件

### 命令语法

```bash
$ docker events [OPTIONS]
```

### 命令参数

#### -f

按条件过滤事件

#### --format

格式化输出

#### --since

显示指定时间之后的事件

#### --until

显示指定时间之前的事件

### 命令实例

```bash
$ docker events -f "image"="mysql" --since="2021-02-05"
```

## docker port

### 概述

列出容器的所有端口映射或者查看容器特定的端口映射

### 命令语法

```bash
$ docker port CONTAINER [PRIVATE_PORT[/PROTO]]
```

### 命令参数

无

### 命令实例

```bash
$ docker port mysql 3306
```

## docker stats

### 概述

实时显示docker容器资源使用情况统计

### 命令语法

```bash
$ docker stats [OPTIONS] [CONTAINER...]
```

### 命令参数

#### -a

显示所有容器，包含未运行的

#### --format string

格式化输出，string可选表、表模板、json、预设go模板

#### --no-stream

显示当前状态后直接退出，不再实时显示

#### --no-trunc

输出无截断

### 命令实例

```bash
$ docker stats nginx --no-stream --format "{{json .}}" # 以json格式输出
```

输出内容解析：

- CONTAINER ID/NAME:容器ID/名称
- CPU%:CPU使用率
- MEM USAGE/LIMIT:当前占用内存以及可用总容量
- MEM %:内存占用率
- NET I/O:容器通过网络接口发送和接收的数据量
- BLOCK I/O:容器从主机块设备上读取和写入的数据量
- PIDS:容器创建的进程数或线程数

## docker wait

### 概述

阻塞一个或多个容器直至其停止，然后打印出退出码

### 命令语法

```bash
$ docker wait CONTAINER [CONTAINER...]
```

### 命令参数

无

### 命令实例

同命令语法

# 仓库命令

## docker login/logout

### 概述

登入/登出一个镜像仓库，若未指定，则默认为官方仓库docker hub

### 命令语法

```bash
$ docker login/logout [OPTIONS] [SERVER]
```

### 命令参数

#### -u

登录用户名

#### -p

登录密码

### 命令实例

```bash
$ docker login -u username -p password repository
```

## docker pull

### 概述

从镜像仓库中拉取镜像或**更新**指定镜像

### 命令语法

```bash
$ docker pull [OPTIONS] NAME[:TAG|@DIGEST]
```

### 命令参数

#### -a

拉取镜像的所有标签版本

### 命令实例

```bash
$ docker pull -a mysql
```

## docker push

### 概述

将本地镜像上传到镜像仓库(需要先登录到镜像仓库)

### 命令语法

```bash
$ docker push [OPTIONS] NAME[:TAG]
```

### 命令参数

同[docker pull](https://www.yuque.com/yinzijue/sei7tg/qwy04lzp33eznv2r#G35jE)

### 命令实例

```bash
$ docker push mysql:oem
```

## docker search

### 概述

从docker hub中检索镜像

### 命令语法

```bash
$ docker search [OPTIONS] TERM
```

### 命令参数

#### -f conditions

按条件过滤搜索结果，例如stars=10即列出收藏数不小于10的镜像

#### --limit int

限制搜索结果数

### 命令实例

```bash
$ docker search -f stars=15000 --limit 10 mysql #返回10条收藏数不小于15000的MySQL镜像
```

# 其他命令

## rootfs

### cp

#### 概述

在容器和本地文件系统之间拷贝文件/文件夹。

#### 命令语法

```bash
$ docker cp [OPTIONS] CONTAINER:SRC_PATH DEST_PATH|-
$ docker cp [OPTIONS] SRC_PATH|- CONTAINER:DEST_PATH
```

#### 命令参数

##### -L

#### 命令实例

```bash
$ docker cp /home/user/demo.txt container_id:/app/ #从主机复制到容器container_id
$ echo "hello world!"|docker cp - container_id:/app/output.txt #将标准输入拷贝到容器的文件中
```

### diff

#### 概述

查看容器中的文件/文件夹的更改

#### 命令语法

```bash
docker diff CONTAINER
```

#### 命令参数

无

#### 命令实例

同命令语法

## 查看信息

### docker info

查看docker系统信息，包括镜像数和容器数

### docker version

显示docker版本信息

# DockerFile指令

|   |   |   |
|---|---|---|
|0|FROM|指定基础镜像，用于后续的指令构建。|
|1|LABEL|添加镜像的元数据，使用键值对的形式。|
|2|RUN|在构建过程中在镜像中执行命令。|
|3|CMD|指定容器创建时的默认命令。（可以被覆盖）|
|4|ENTRYPOINT|设置容器创建时的主要命令。（不可被覆盖）|
|5|EXPOSE|声明容器运行时监听的特定网络端口。|
|6|ENV|在容器内部设置环境变量。|
|7|ADD|将文件、目录或远程URL复制到镜像中。|
|8|COPY|将文件或目录复制到镜像中。|
|9|VOLUME|为容器创建挂载点或声明卷。|
|10|WORKDIR|设置后续指令的工作目录。|
|11|USER|指定后续指令的用户上下文。|
|12|ARG|定义在构建过程中传递给构建器的变量，可使用 "docker build" 命令设置。|
|13|ONBUILD|当该镜像被用作另一个构建过程的基础时，添加触发器。|
|14|STOPSIGNAL|设置发送给容器以退出的系统调用信号。|
|15|HEALTHCHECK|定义周期性检查容器健康状态的命令。|
|16|SHELL|覆盖Docker中默认的shell，用于RUN、CMD和ENTRYPOINT指令。|

## RUN vs CMD vs ENTRYPOINT

### RUN

RUN指令用于构建镜像时执行命令，并将执行结果保存在镜像中。其通常用于安装软件包、设置环境变量、创建文件或目录等操作。

### CMD & ENTRYPOINT

#### 相同点

- 二者都是用于指定容器启动时默认运行的命令，例如容器启动时默认执行top命令
- 都支持exec模式和shell模式的写法(shell模式下，容器中的1号进程不是任务进程，而是终端进程，例如bash、sh)

#### 不同点# 前言

许多批量操作都需要先过滤出操作对象，然后再执行命令。这就需要将一个docker命令的输出作为另一个docker命令的输入，docker中使用$符号连接两个命令。

```bash
$ docker rm $(docker ps -a -q) # 静默删除所有已停止的容器，返回docker的id
```

# 容器生命周期&状态查询

## docker run

### 概述

用于创建一个新的容器并运行。

### 命令语法

```bash
$ docker run [OPTIONS] image [COMMAND][ARG...]
```

### 命令参数

#### -a

指定标准输入输出内容类型，可选STDIN/STDOUT/STDERR三项。

#### -d

后台运行容器，执行后返回容器ID。

#### -e

设置环境变量，格式为 -e key="value"

#### -i

以交互模式运行容器，通常与-t同时使用

#### -m

设置容器使用内存的最大值

#### --name="nginx_ib"

为容器指定一个名称

#### -P

容器内部端口随机映射到主机端口

#### -p

指定端口映射，格式为 主机端口:容器端口

#### -t

为容器分配一个伪终端，例如sh、bash等，通常与-i同时使用。

#### -v

容器内部地址映射，格式为 主机路径:容器路径

### 命令实例

```bash
$ docker run -d  nginx #后台运行nginx
```

```bash
$ docker run -e GS_PASSWORD=Enmo@123 enmotech/opengauss:lastest #设置opengauss默认密码
```

```bash
$ docker run -it nginx bash # 使用bash终端以交互方式运行nginx
```

```bash
$ docker run -P -d nginx:latest #使用镜像nginx后台启动一个容器，并将容器的80端口映射到主机的随机端口
```

```bash
$ docker run -p 3306:3306 -d mysql #使用镜像MySQL后台启动一个容器，并将容器的3306端口映射到主机的3306端口
```

```bash
$ docker run -v /data:/data -d nginx:latest #后台运行一个nginx容器，将容器的data目录映射到主机的data目录
```

## docker start/restart/stop

### 概述

用于启动/重启/停止一个容器，支持批量操作。

### 命令语法

```bash
$ docker start [OPTIONS] CONTAINER1 CONTAINER2 CONTAINER3 # 启动3个容器
$ docker restart [OPTIONS] CONTAINER1 CONTAINER2 CONTAINER3 # 重启3个容器
$ docker stop [OPTIONS] CONTAINER1 CONTAINER2 CONTAINER3 # 停止3个容器
```

### 命令参数

暂无

### 命令实例

同命令语法

## docker kill

### 概述

强制停止正在运行中的容器，支持批量操作，通常在stop命令无效时使用。

### 命令语法

```bash
$ docker kill [OPTIONS] CONTAINER1 CONTAINER2 CONTAINER3 # 杀掉3个容器
```

### 命令参数

暂无

### 命令实例

同命令语法

## docker rm

### 概述

删除一个或多个容器，支持批量操作。

### 命令语法

```bash
docker rm [OPTIONS] CONTAINER1 CONTAINER2 CONTAINER3 # 删除
```

### 命令参数

-v

删除与容器关联的卷

### 命令实例

```bash
docker rm -v nginx # 删除容器nginx，并删除容器挂载的数据卷
```

## docker pause/unpause

### 概述

暂停/恢复容器中的所有进程,支持批量操作

### 命令语法

```bash
$ docker pause CONTAINER [CONTAINER...]  #暂停对应容器
$ docker unpause CONTAINER [CONTAINER...] #恢复对应容器
```

### 命令参数

暂无

### 命令实例

同命令语法

## docker create

### 概述

创建一个容器，但不启动它。

### 命令语法

```bash
$ docker create [OPTIONS] IMAGE [COMMAND] [ARG...]
```

### 命令参数

同[docker run](https://www.yuque.com/yinzijue/sei7tg/qwy04lzp33eznv2r#HmsSH)

### 命令实例

同[docker run](https://www.yuque.com/yinzijue/sei7tg/qwy04lzp33eznv2r#glOl4)

## docker exec

### 概述

在正在运行的容器中执行命令，常用于进入容器。

### 命令语法

```bash
docker exec [OPTIONS] CONTAINER COMMAND [ARG...]
```

### 命令参数

#### -d

分离模式，即后台运行

#### -i

交互模式运行

#### -t

分配一个伪终端，通常与-i合用。

### 命令实例

```bash
$ docker exec -it nginx01 bash # 使用bash终端以交互模式进入容器nginx01
```

# 本地镜像命令

## docker build

### 概述

使用dockerfile构建新的镜像，该dockerfile可以在本地的特定路径下，或者网络上的特定路径。若未

### 命令语法

```bash
$ docker build [OPTIONS] PATH|URL|- 
```

## docker save

### 概述

使将指定镜像保存成tar归档文件,支持批量操作。

### 命令语法

```bash
$ docker save [OPTIONS] IMAGE1 IMAGE2 ...
```

### 命令参数

#### -o string

输出到文件,string为一个文件的路径

### 命令实例

```bash
$ docker save -o  /opt/mysql.tar mysql:1.2
```

## docker load

### 概述

从一个归档文件或者标准输入中载入镜像，该镜像不会被加载到镜像仓库。

### 命令语法

```bash
$ docker load [OPTIONS]
```

### 命令参数

#### -i string

指定要导入的文件,string是一个可用的文件路径

#### -q

精简输出信息

### 命令实例

```bash
$ docker load -i /opt/registry.tar #从tar文件中载入镜像
$ docker save registry | docker load # 从标准输入中载入镜像
```

## docker import

### 概述

从归档文件中导入内容用以创建文件系统镜像

### 命令语法

```bash
$ docker import [OPTIONS] file|URL|- [REPOSITORY[:TAG]]
```

### 命令参数

#### -c list

指定要导入的文件,string是一个可用的文件路径

#### -q

精简输出信息

### 命令实例

```bash
$ docker import /opt/mysql.tar mysql:oem #从tar文件中导入镜像mysql，定义标签为oem
$ cat /opt/mysql.tar | docker import - mysql:oem #从标准输入中读取数据导入为镜像
```

## docker images

### 概述

列出本地镜像。注意和**docker image**区分开来：docker images只用于呈现本地镜像，而docker image则用于管理镜像。

### 命令语法

```bash
$ docker images [OPTIONS] [REPOSITORY[:TAG]] #列出特定仓库的镜像
```

### 命令参数

#### -a

列出包含中间镜像在内的所有镜像，默认情况下中间镜像是隐藏的。

**中间镜像**(intermediate images)：在docker build的过程中，为了加速镜像构建、重复利用资源，docker会利用中间层镜像，这些镜像的repository和tag都为none。

这里需要将中间镜像和虚悬镜像(dangling iamges)区分开来：

- 中间镜像通常是其他镜像的依赖，删除时需谨慎，可能会导致上层镜像丢失依赖而出错。而删除那些依赖中间镜像的镜像后，中间镜像也被自动删除了；
- 虚悬景象则通常是一些无效的镜像，可以通过特定命令过滤出来然后删除。

#### --format

以特定格式呈现查询结果，例如json等。

#### --no-trunc

显示完整的镜像信息，常用于查看

#### -q

只显示镜像ID

### 命令实例

```bash
$ docker images debian --format json # 以json格式展示所有仓库为debian的镜像
```

## docker rmi

### 概述

删除本地镜像，支持批量操作。

### 命令语法

```bash
$ docker rmi [OPTIONS] IMAGE1 IMAGE2 IMAGE3
```

### 命令参数

#### -f

强制删除

### 命令实例

```bash
$ docker rmi -f debian # 强制删除镜像debian
```

## docker tag

### 概述

创建一个目标镜像，该镜像具有新标签，但仍然指向其源镜像。可以通过镜像ID来判断两者实质是同一个镜像。

### 命令语法

```bash
$ docker tag source_image:tag target_image:new_tag
```

### 命令参数

无

### 命令实例

```bash
$ docker tag debian:1.0 debian1.5
```

## docker history

### 概述

用于查看一个指定镜像的历史。

### 命令语法

```bash
$ docker history [OPTIONS] IMAGE
```

### 命令参数

#### --format

格式化输出，支持table,table TEMPLATE,json和TEMPLATE

-H

文件大小和日期可读性

#### -q

只显示镜像ID

### 命令实例

```bash
$ docker history mysql --no-trunc  # 查看镜像mysql完整历史
```

# 容器命令

## docker ps

### 概述

列出容器

### 命令语法

```bash
$ docker ps [OPTIONS]
```

### 命令参数

#### -a

显示所有容器，包含未运行的

#### -f

按条件过滤输出

#### -n

显示最新创建的n个容器

#### -l

显示最新创建的容器(包含所有状态)

#### -q

只显示容器ID

#### -s

显示文件总大小

#### --no-trunc

完整显示

### 命令实例

```bash
$ docker ps -a -s -n 3
```

## docker inspect

### 概述

返回docker对象的低级信息,支持批量查看

### 命令语法

```bash
$ docker inspect [OPTIONS] NAME|ID [NAME|ID]
```

### 命令参数

#### -f

格式化输出

#### -s

若该命令的对象是一个容器，则显示文件总大小。

#### --type string

为指定类型返回json

### 命令实例

```bash
$ docker inspect mysql:5.6
```

## docker top

### 概述

显示容器中正在运行的进程。容器运行时不一定有命令终端和top命令，使用desktop可以直接在宿主机上查看容器内进程。

### 命令语法

```bash
$ docker top CONTAINER [ps OPTIONS]
```

### 命令参数

无

### 命令实例

```bash
# 查看所有运行容器的进程
$ for i in  `docker ps |grep Up|awk '{print $1}'`;do echo \ &&docker top $i; done
```

## docker logs

### 概述

获取容器日志

### 命令语法

```bash
$ docker logs [OPTIONS] CONTAINER
```

### 命令参数

#### -f

持续跟踪日志

#### -n

限制日志输出行数

#### -t

显示时间戳

#### --since

显示特定时间之后的日志

### 命令实例

```bash
$ docker logs -f -n 10 -t --since 2021-02-15 nginx
```

## docker export

### 概述

将指定容器的文件系统导出为一个tar归档文件。

docker save & docker export

- docker save的操作对象是镜像，包含镜像的元数据和所有层，常用于不同主机之间迁移镜像或备份到本地；
- docker export 的操作对象是容器，导出内容是容器的文件系统，常用于快速备份或转移容器

### 命令语法

```bash
$ docker export [OPTIONS] CONTAINER
```

### 命令参数

#### -o string

将输入内容写入一个文件而非标准输出。

### 命令实例

```bash
$ docker export -o mysql-`date+%Y%m%d`.tar a404c6c174a2 #按日期保存容器
```

## docker events

### 概述

从服务器获取实时事件

### 命令语法

```bash
$ docker events [OPTIONS]
```

### 命令参数

#### -f

按条件过滤事件

#### --format

格式化输出

#### --since

显示指定时间之后的事件

#### --until

显示指定时间之前的事件

### 命令实例

```bash
$ docker events -f "image"="mysql" --since="2021-02-05"
```

## docker port

### 概述

列出容器的所有端口映射或者查看容器特定的端口映射

### 命令语法

```bash
$ docker port CONTAINER [PRIVATE_PORT[/PROTO]]
```

### 命令参数

无

### 命令实例

```bash
$ docker port mysql 3306
```

## docker stats

### 概述

实时显示docker容器资源使用情况统计

### 命令语法

```bash
$ docker stats [OPTIONS] [CONTAINER...]
```

### 命令参数

#### -a

显示所有容器，包含未运行的

#### --format string

格式化输出，string可选表、表模板、json、预设go模板

#### --no-stream

显示当前状态后直接退出，不再实时显示

#### --no-trunc

输出无截断

### 命令实例

```bash
$ docker stats nginx --no-stream --format "{{json .}}" # 以json格式输出
```

输出内容解析：

- CONTAINER ID/NAME:容器ID/名称
- CPU%:CPU使用率
- MEM USAGE/LIMIT:当前占用内存以及可用总容量
- MEM %:内存占用率
- NET I/O:容器通过网络接口发送和接收的数据量
- BLOCK I/O:容器从主机块设备上读取和写入的数据量
- PIDS:容器创建的进程数或线程数

## docker wait

### 概述

阻塞一个或多个容器直至其停止，然后打印出退出码

### 命令语法

```bash
$ docker wait CONTAINER [CONTAINER...]
```

### 命令参数

无

### 命令实例

同命令语法

# 仓库命令

## docker login/logout

### 概述

登入/登出一个镜像仓库，若未指定，则默认为官方仓库docker hub

### 命令语法

```bash
$ docker login/logout [OPTIONS] [SERVER]
```

### 命令参数

#### -u

登录用户名

#### -p

登录密码

### 命令实例

```bash
$ docker login -u username -p password repository
```

## docker pull

### 概述

从镜像仓库中拉取镜像或**更新**指定镜像

### 命令语法

```bash
$ docker pull [OPTIONS] NAME[:TAG|@DIGEST]
```

### 命令参数

#### -a

拉取镜像的所有标签版本

### 命令实例

```bash
$ docker pull -a mysql
```

## docker push

### 概述

将本地镜像上传到镜像仓库(需要先登录到镜像仓库)

### 命令语法

```bash
$ docker push [OPTIONS] NAME[:TAG]
```

### 命令参数

同[docker pull](https://www.yuque.com/yinzijue/sei7tg/qwy04lzp33eznv2r#G35jE)

### 命令实例

```bash
$ docker push mysql:oem
```

## docker search

### 概述

从docker hub中检索镜像

### 命令语法

```bash
$ docker search [OPTIONS] TERM
```

### 命令参数

#### -f conditions

按条件过滤搜索结果，例如stars=10即列出收藏数不小于10的镜像

#### --limit int

限制搜索结果数

### 命令实例

```bash
$ docker search -f stars=15000 --limit 10 mysql #返回10条收藏数不小于15000的MySQL镜像
```

# 其他命令

## rootfs

### cp

#### 概述

在容器和本地文件系统之间拷贝文件/文件夹。

#### 命令语法

```bash
$ docker cp [OPTIONS] CONTAINER:SRC_PATH DEST_PATH|-
$ docker cp [OPTIONS] SRC_PATH|- CONTAINER:DEST_PATH
```

#### 命令参数

##### -L

#### 命令实例

```bash
$ docker cp /home/user/demo.txt container_id:/app/ #从主机复制到容器container_id
$ echo "hello world!"|docker cp - container_id:/app/output.txt #将标准输入拷贝到容器的文件中
```

### diff

#### 概述

查看容器中的文件/文件夹的更改

#### 命令语法

```bash
docker diff CONTAINER
```

#### 命令参数

无

#### 命令实例

同命令语法

## 查看信息

### docker info

查看docker系统信息，包括镜像数和容器数

### docker version

显示docker版本信息

# DockerFile指令

|   |   |   |
|---|---|---|
|0|FROM|指定基础镜像，用于后续的指令构建。|
|1|LABEL|添加镜像的元数据，使用键值对的形式。|
|2|RUN|在构建过程中在镜像中执行命令。|
|3|CMD|指定容器创建时的默认命令。（可以被覆盖）|
|4|ENTRYPOINT|设置容器创建时的主要命令。（不可被覆盖）|
|5|EXPOSE|声明容器运行时监听的特定网络端口。|
|6|ENV|在容器内部设置环境变量。|
|7|ADD|将文件、目录或远程URL复制到镜像中。|
|8|COPY|将文件或目录复制到镜像中。|
|9|VOLUME|为容器创建挂载点或声明卷。|
|10|WORKDIR|设置后续指令的工作目录。|
|11|USER|指定后续指令的用户上下文。|
|12|ARG|定义在构建过程中传递给构建器的变量，可使用 "docker build" 命令设置。|
|13|ONBUILD|当该镜像被用作另一个构建过程的基础时，添加触发器。|
|14|STOPSIGNAL|设置发送给容器以退出的系统调用信号。|
|15|HEALTHCHECK|定义周期性检查容器健康状态的命令。|
|16|SHELL|覆盖Docker中默认的shell，用于RUN、CMD和ENTRYPOINT指令。|

## RUN vs CMD vs ENTRYPOINT

### RUN

RUN指令用于构建镜像时执行命令，并将执行结果保存在镜像中。其通常用于安装软件包、设置环境变量、创建文件或目录等操作。

### CMD & ENTRYPOINT

#### 相同点

- 二者都是用于指定容器启动时默认运行的命令，例如容器启动时默认执行top命令
- 都支持exec模式和shell模式的写法(shell模式下，容器中的1号进程不是任务进程，而是终端进程，例如bash、sh)

#### 不同点