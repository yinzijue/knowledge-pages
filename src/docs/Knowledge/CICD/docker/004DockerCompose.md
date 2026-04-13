---
title: 004DockerCompose
---
# DockerCompose常用命令
# docker-compose.yml
```yaml
version: "DockerCompose版本号" # 实际应用中通常不指定，防止部分功能因版本问题受影响
services:
  service_name1:              # 一个service是一个基本单位，可以单独启动一个service
	 restart: always
    image: 镜像地址
    container_name: 容器名称
    ports:                    # 支持一次性映射多组端口,格式为host_port:container_port
	  - "8080:8080"
	  - "3306:3306"
    volumes:                  # 挂载卷
      - /host/path:container/path
      - ...
    environment:
      - ENV_VAL1=value1
      - ENV_VAL2=value2
    networks:
     - custom_network    # 连接到自定义的网络
  service_name2:
    ...                  
networks:
  custom_work:
    driver: 网络驱动  
```