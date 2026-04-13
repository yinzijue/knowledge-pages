---
title: 关于git
---
# 基本理论

![[git工作流]]

- Remote Directory:远程仓库
- History:历史记录
- Index/Stage:暂存区(待提交更新区)
- Work Directory:工作区

# 环境配置

## 查看配置

```bash
git config -l   #查看用户环境配置
```

## 提交忽略

```bash
# #开头及空行将被忽略
# *代表任意字符；?代表一个字符；方括号[abc]代表可选范围；大括号{string1,string2}代表可选字符串
# ！代表例外，表示不忽略
# /在首位，表示该目录下的
# /在末尾，表示该路径下内容将被忽略；
```