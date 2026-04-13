---
title: 002markdown细节
---
# 前言

- 为了兼容更多的markdown编辑器，建议在markdown标记与正文之间添加**至少一个空格**；
- 大多数支持嵌套的元素，内部元素都建议用**4个空格缩进**；

# 基本

## 标题

最多支持6级标题

```markdown
# 一级标题
## 二级标题
### 三级标题
```

## 段落

段落与段落之间用至少一个空白行分隔

```markdown
这是第一个段落

这是第二个段落
```

## 换行

使用HTML的<br>标签换行

```markdown
遇到标签后即将换行<br>
仍然在同一个段落中
```

## 强调

```markdown
*斜体*
**加粗**
***斜体加粗***
```

## 引用

使用>来标记块引用，引用支持多级嵌套，引用中可以嵌套其他元素

```markdown
>这段将被标识为块引用
>>这是引用中的引用
>># 这是次级引用中的一级标题
>> **这是引用中的加粗**
```

## 列表

- 数字紧跟英文句号实现有序列表，短横实现无序列表
- 列表支持嵌套其他元素，其他元素**需用4个空格缩进**

```markdown
1. 有序列表1
2. 有序列表2
3. 有序列表3
   
```

```markdown
- 无序列表1
- 无序列表2
```

## 代码

- 1个反引号代表标记为代码
- 2个反引号代表代码中的反引号转义
- 3个反引号支持代码语法高亮，在首个3反引号后添加代码类型（部分编辑器为~~~）

````markdown
`import requests`
``code with 反引号``
```json
{
  "key":"value"
}
```
```javascript
let foo(){
}
```
````

分隔线

- 单独一行的3个及以上的*表示分隔线
- 为了提高兼容性，**建议在分隔线前后各加一个空白行**

```markdown
即将遇到分隔线，请注意

***

上面是分割线
```

## 链接

### 常规链接

- 方括号内是显示在正文内的超链接文字
- 圆括号内是超链接地址和标题，标题在鼠标悬停时展示

```markdown
[超链接显示名](超链接地址 "超链接标题")
```

### 邮箱

```markdown
<fake@example.com>
<https://wwww.baidu.com>
```

### 带格式的链接

- 为了提高兼容性，尽量用%20代表空格(尚未看到实际效果，有待验证)

```markdown
这是被强调的链接[***重要***](www.import.com%20"非常重要")
这段代码[`import requests`](www.python.org%20"python代码")包含链接
```

### 引用链接(尚未发现支持的应用)

- 引用链接包含2部分：内联部分(位于正文中)+位于其他位置的链接，类似于正文中标记参考文献，一般放在文章末尾。
- 引用链接的markdown语法为：[正文内容] [链接标签]: <链接地址> ("链接标题")

```markdown
[参考文献1][1]: <https://en.wikipedia.org/wiki/Hobbit#Lifestyle> (Hobbit lifestyles)
```

## 图片

- 普通图片相当于在常规链接前加感叹号；
- 为图片添加链接，则是把图片markdown嵌入链接markdown的方括号中

```markdown
![本地图片](/localpath/example.jpg "图片标题")
[![本地图片](/localpath/example.jpg "图片标题")](www.example.com "点击图片跳转到example")
```

## 转义字符

- 如果要将markdown标记作为普通文本，可以在标记前加反斜杠
- 在HTML实体中，&和<会被自动转义

```markdown
&copy;
```

## 内嵌HTML标签

部分markdown应用程序支持在markdown文档中添加HTML标签，例如直接使用HTML的\<h1>,\<a>等。

# 扩展

## 表格

- 管道符号分隔列
- 3个及以上连字符(-)创建每列的标题
- 在连字符的左侧，右侧或者两侧添加一个冒号，可以实现左对齐，右对齐和居中

```markdown
|title1|title2|title3|
|---|---|
|col1|co2|col3|
```

## 脚注

- 正文内：方括号内添加插入符号和标识符，标识符可以是数字或单词，但不能包含空格和制表符
- 脚注内容：圆括号内添加插入符号和标识符，并用冒号和文本来标识脚注内容
- 脚注不能放在列表、块引号和表中

```markdown
[^这是参考文献1]([^参考文献1:这是参考文献1的脚注内容])
```

## 术语定义

- 部分编辑器支持术语定义，第一行键入术语，下一行键入冒号，后跟一个空格和术语的定义内容

```markdown
First Term
: This is the definition of the first term.

Second Term
: This is one definition of the second term.
: This is another definition of the second term.
```

## 删除线

```markdown
~~删除线~~
```

## 任务列表

部分编辑器支持任务列表

```markdown
[x]任务1
[x]任务2
```

## emoji

直接粘贴，或者表情符号简码。

```markdown
:joy:
```

## 禁用自动网址链接

如果您不希望自动链接URL，则可以通过将URL表示为带反引号的代码来删除该链接。
