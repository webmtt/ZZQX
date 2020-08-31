# [郑州人影指挥系统](http://119.3.224.4:8090/dist/#/login?redirect=%2Fmap)


## 1. 安装步骤：

``` bash
# 安装依赖
npm install

# 安装过程可能遇到的问题
# (1) 有些插件无法安装成功;
# (2) 安装很慢国外镜像会很慢;
# 解决方法一般有两种：

# (1) 使用阿里巴巴镜像
npm config set registry http://registry.npm.taobao.org
# (2) 使=用cnpm安装需要的模块
npm install -g cnpm --registry=https://registry.npm.taobao.org

# serve with hot reload at localhost:8080
npm run dev

# 项目打包
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

# 2. 代码提交规范：

每次提交，Commit message 都包括三个部分：Header，Body 和 Footer。

``` bash
<type>(<scope>): <subject>
# 空一行
<body>
# 空一行
<footer>
```

其中，Header 是必需的，Body 和 Footer 可以省略。

## 2.1 Header部分

### 2.1.1 type [必须]
type用于说明 commit 的类别，只允许使用下面7个标识

+ feat：新功能（feature）
+ fix：修补bug
+ docs：文档（documentation）
+ style： 格式（不影响代码运行的变动）
+ refactor：重构（即不是新增功能，也不是修改bug的代码变动）
+ test：增加测试
+ chore：构建过程或辅助工具的变动

### 2.1.2 scope [可选]
scope用于说明 commit 影响的范围，比如数据层、控制层、视图层等等，视项目不同而不同

``` bash
# 例如写controller, view, model这样的简单描述

git commit -m "feat(controller): 增加用户控制器管理用户"
```

### 2.1.3 subject [可选]
subject是 commit 目的的简短描述，不超过 ***72*** 个字符

## 2.2 Body部分
Body 部分是对本次 commit 的详细描述，可以分成多行(注意: body和header之间必须有一个空行)。

```
More detailed explanatory text, if necessary.  Wrap it to 
about 72 characters or so. 

Further paragraphs come after blank lines.

- Bullet points are okay, too
- Use a hanging indent
```

## 2.3 Footer部分
Footer 部分只用于两种情况

### 2.3.1 不兼容变动
如果当前代码与上一个版本不兼容，则 Footer 部分以BREAKING CHANGE开头，后面是对变动的描述、以及变动理由和迁移方法

```
BREAKING CHANGE: isolate scope bindings definition has changed.

    To migrate the code follow the example below:

    Before:

    scope: {
      myAttr: 'attribute',
    }

    After:

    scope: {
      myAttr: '@',
    }

    The removed `inject` wasn't generaly useful for directives so there should be no code using it.
```
### 2.3.2 关闭 Issue
如果当前 commit 针对某个issue，那么可以在 Footer 部分关闭这个 issue

``` bash
Closes #234

# 也可以一次关闭多个

Closes #123, #245, #992
```




For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
