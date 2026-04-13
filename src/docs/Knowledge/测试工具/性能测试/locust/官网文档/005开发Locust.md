---
title: 005开发Locust
---
开发Locust  
你想要为Locust做贡献吗？太棒了！这里有一系列待处理的错误/功能请求。

# 为开发安装Locust

在GitHub上fork Locust项目，然后运行

```bash
$ git clone git://github.com/<YourName>/locust.git  # 克隆仓库  
$ pip3 install -e locust/                           # 以可编辑模式安装
```

现在，在对代码进行更改后，你无需重新安装就可以运行locust命令。

要提交你的更改，请将它们推送到你的仓库中的一个分支，然后在GitHub上打开一个Pull Request（PR）。

如果你安装了pre-commit，那么每次提交前都会自动执行linting和格式检查/修复。

在打开Pull Request之前，请确保所有测试都能通过。如果你正在添加一个新功能，请确保它已被文档化（在docs/*.rst文件中）。

# 测试你的更改

我们使用tox来跨多个Python版本自动化测试：

```bash
$ pip3 install tox  
$ tox
```

要仅运行特定的测试套件或测试，你可以直接调用pytest：

```bash
$ pytest locust/test/test_main.py::DistributedIntegrationTests::test_distributed_tags
```

# 格式化和linting

Locust使用ruff进行格式化和语言分析。如果代码不符合规范，构建将会失败。如果你使用的是VSCode，它会在你保存文件时自动运行ruff。但如果你的编辑器不支持它，你可以手动运行：

```bash
$ pip3 install ruff
$ python -m ruff --fix <file_or_folder_to_be_formatted>
$ python -m ruff format <file_or_folder_to_be_formatted>
```

你可以使用tox来验证整个项目：

```bash
$ tox -e ruff
ruff: install_deps> python -I -m pip install ruff==0.1.13
ruff: commands[0]> ruff check .
ruff: commands[1]> ruff format --check
104 files already formatted
  ruff: OK (1.41=setup[1.39]+cmd[0.01,0.01] seconds)
  congratulations :) (1.47 seconds)
```

# 构建文档

文档源位于docs/目录中。要构建文档，你首先需要安装所需的Python包：

```bash
$ pip3 install -r docs/requirements.txt
```

然后，你可以在本地构建文档，使用：

```bash
$ make build_docs
```

构建完成后，文档应该在docs/_build/index.html中可用。

# 修改Locust的Web UI

现代的Web UI是使用React和Typescript构建的

## 设置

### Node

使用nvm安装node以便轻松地在不同版本间切换

- 复制并运行nvm的安装行（通常以curl/wget开头）
- 验证nvm是否正确安装

```bash
$ nvm --version
```

- 根据locust/webui/package.json中的engines字段安装正确的Node版本

```bash
$ nvm install {version}  
$ nvm alias default {version}
```

### Yarn

- 从Yarn的官方网站安装Yarn（如果可能的话，避免通过Node安装）
- 验证yarn是否正确安装

```bash
$ yarn --version
```

- 接下来，在web目录中安装所有依赖项

```bash
$ cd locust/webui  
$ yarn
```

## 开发

要开发前端，运行yarn dev。这将启动Vite开发服务器，允许你查看和编辑前端，而无需运行Locust web服务器

要在运行Locust实例的同时进行开发，运行yarn dev:watch。这会将静态文件输出到dist目录。Vite将自动检测任何已更改的文件并根据需要重新构建。只需刷新页面即可查看更改

要编译webui，运行yarn build

另外，你还可以使用make命令来构建前端:

```bash
$ make frontend_build
```

## 代码检查

运行 yarn lint 来检测前端项目中的代码风格（lint）错误。运行 yarn lint --fix 将自动修复任何可自动解决的问题。此外，你的集成开发环境（IDE）还可以配置ESLint，以便在保存时解决这些问题。

## 格式化

运行 yarn format 来修复前端项目中的任何格式问题。同样地，你的集成开发环境（IDE）也可以配置为在保存时自动格式化。

## 类型检查

我们在前端项目中使用TypeScript。运行 yarn type-check 来查找任何类型相关的问题。