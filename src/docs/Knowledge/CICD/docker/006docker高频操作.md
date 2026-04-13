---
title: 006docker高频操作
---
# docker换源

官方镜像仓库docker hub速度较慢，甚至出现无法访问的情况。因此换源几乎是一个必会的操作。

对于使用sytemd的系统，通常需要修改**/etc/docker/daemon.json**文件的内容，若该文件不存在，则手动新建。

```json
{"registry-mirrors":["https://quay.mirrors.ustc.edu.cn/"]} //中科大
```