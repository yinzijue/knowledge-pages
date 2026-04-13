---
title: 003linux下的常见操作
---
# 控制台直接启动程序

## 需求分析

以pycharm为例，通常在控制台启动pycharm的做法是找到pycharm.sh所在路径，然后执行**./pycharm.sh**(.表示当前路径，一般在pycharm的bin目录下)。该操作相当于windows直接双击.exe文件，前提是需要时刻清楚文件所在路径。现在希望在控制台的任意位置输入pycharm，即可打开程序。

## 实现思路

将目标程序的路径以**别名**的方式添加到当前shell对应的配置文件中，以下以bash为例，即选取bashrc文件。为安全起见，不建议使用系统级的配置，即/etc/.bashrc；而是使用用户级配置~/.bashrc，只对当前用户生效。

## 实现步骤

- 复制pycharm.sh的完整路径，备用；
- 使用文本工具编辑.bashrc文件，以vim工具为例，命令为

```shell
vim ~/.bashrc
```

- 将pycharm.sh路径以别名方式添加到bashrc文件中，语句为

```shell
#等号左边即为shell中要键入的命令，bash添加一个空格，跟上文件路径
alias pycharm='bash /opt/IDE/pycharm/pycharm-2021.../bin/pycharm.sh' 
```

- 使用source命令使改动生效

```shell
source ~/.bashrc
```

# 全文模糊搜索

```shell
>>> cd /
>>> find / -name '*jenkins*'  # 从根目录开始，检索所有包含Jenkins字样的文件夹名和文件名
```

# 开放端口

```shell
$ su firewall-cmd --zone=public --add-port=443/tcp --permanent
```

# 扩容

# 进程管理

```shell
$ apt install htop  #安装第三方工具
$htop
```
# 查看端口占用
# 共享目录到windows
可以使用samba来实现。
1. 安装samba
```bash
apt install samba
```
2. 修改配置文件smb.conf
```bash
vim /etc/samba/smb.conf
```
```config
[node]     # 分享节点，这个名字会显示在windows分享路径的最外层
	path = your_share_path
public = yes
writable = yes
valid users = root
create mask = 0777
directory mask = 0777
force user = root
force group = root
available = yes
browseable = yes
```
3. 添加samba用户
```bash
smbpasswd user_name -a   # 添加新用户user_name,之后会输入两次密码
```
4. 重启后台服务
```bash
systemctl restart smb
```
# 分区与挂载
```bash
# 查看磁盘设备，一般位于/dev/目录下，磁盘名称通常类似sda、sdb、sdc等
lsblk # 查看磁盘和分区
parted /dev/sdb    # 超过2T时必须使用GPT分区表
mklabel gpt # 创建gpt分区表
# mkpart  [part-type] [fs-type] [start] [end]
# - `part-type`:
#     
#     - 对于 GPT: `primary` (GPT 中没有主/扩展/逻辑的概念，但仍保留此名称)
#         
#     - 对于 MBR: `primary`, `logical`, `extended`
#         
# - `fs-type`: 只是一个标识，不会真正格式化文件系统。可以设为 `ext4`, `xfs`, `fat32`, `linux-swap` 等。
    
# - `start`: 分区的起始位置（例如 `1MiB`）
    
# - `end`: 分区的结束位置（例如 `100GiB` 或 `-1` 表示到磁盘末尾）
mkpart primary xfs 1MiB  100%
mkfs.xfs /dev/sdb1 # 格式化为xfs，也可以是ext4，按需决定
mount  /dev/sdb1  /opt/data   # 将分区临时挂载到目录下
# 在 /etc/fstab文件中设置开机自动挂载
```