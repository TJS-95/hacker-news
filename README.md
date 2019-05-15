# node.js开发hacker-news

## express

### 基本使用

```js
var express = require('express');
var app = express();

app.get('/index', function(req, res){
    res.send("ok")
})

app.listen(8888, function(){
    console.log('http://localhost:8888');
})
```

### 路由注册的方式

1. app.METHOD METHOD指的就是请求方式 get post delete ...
   1. 请求方式必须和注册路由的方法名一致
   2. 请求的路径必须和注册路由的路径完全一致
2. app.all
   1. 请求方式不限
   2. 请求的路径必须和注册路由的路径完全一致
3. app.use
   1. 请求方式不限
   2. 请求的路径只要是以注册路由的路径开头即可

```js
app.METHOD("路由路径", function(req, res){

})

app.all("路由路径", function(req, res){

})

app.use("路由路径", function(req, res){

})
```

### req和res新增的属性和方法

#### req

1. req.query  获取get请求参数
2. req.body   获取post请求参数 但是需要配合body-parser使用
3. req.orinalUrl 获取请求的url原始地址 
4. req.path   获取请求的路径  urlObj.pathname
5. req.get(key)  获取请求头中key对应的信息
6. req.params 获取路由参数   /index/:参数名     http://localhost/index/1

### res

1. res.send     给浏览器返回数据，自动调用end，只能调用一次： 能接受anything作为参数，如果是数字作为参数，则会被当做状态码！
2. res.sendFile 给浏览器返回文件
3. res.render   渲染模板返回结果给浏览器 必须进行配置才能使用
4. res.download 给浏览器进行文件下载
5. res.status   设置状态码，可以进行链式编程
6. res.redirect 跳转页面 重定向
7. res.jsonp    返回jsonp格式的数据，需要在请求的时候传递callback参数

### 中间件

#### 什么是中间件

中间件就是一个函数，这个函数有三个参数，req, res, next
req: 请求对象
res: 响应对象
next: 可以用来调用下一个中间件

中间件中必须做如下两件事儿中的一个：

1. 结束响应
2. 调用下一个中间件

#### 中间件可以对照自来水厂的处理流程进行理解，在整个中间件处理流程中，req, res对象是不会变。

### body-parser

1. 作用： 可以用来给req.body设置值，获取post请求参数
2. 使用：

```js
app.use(require('body-parser').urlencoded())
app.use(require('body-parser').json())
```

### 自己实现body-parser

```js
app.use(function(req, res, next){
    var bufferList = [];
    req.on('data', function(chunk){
        bufferList.push(chunk);
    })
    req.on('end', function(){
        var result = Buffer.concat(bufferList);
        result = result.toString();

        if(req.get('content-type').indexOf('json') != -1){
            req.body = JSON.parse(result)
        }else if(req.get('content-type').indexOf('urlencoded') != -1){
            req.body = querystring.parse(result);
        }else{
            req.body = {}
        }

        next();
    })
})
```

### 模板引擎的使用

```js
//1. 设置模板引擎
app.engine('html', require('express-art-template'));

//2. 设置模板文件存放的文件夹路径 （可选的，默认回去views文件夹中查找）
app.set('views', 文件夹路径)

//3. 设置默认的后缀名 (可选的)
app.set('view engine', '文件后缀名')
```

### 静态资源处理

```js
app.use(express.static('静态资源目录路径'))
```



## MongoDB

### 关系型数据库和费关系型数据库

1. 关系型数据库，表和表之间有关系（外键）
2. 非关系型数据，表盒表之间没关系

### 非关系型数据库和关系型数据库的区别

1. 非关系型数据库表和表之间没关联
2. 非关系型数据库，不需要提前创建数据库和表结构
3. 非关系型数据库非常灵活（没有任何限制，表内的数据可以随意存储，没有字段要求）

### 非关系型数据库优势

1. 灵活
2. 效率非常高

### mongodb的安装

#### mongod  数据库服务

负责存储数据的
启动：

1. 创建文件夹 data  data文件夹中要创建db文件夹
2. 使用mongod命令启动数据库 `mongod --dbpath ./data`

#### mongo  命令行操作数据库的工具

负责操作数据库的

启动：
`mongo`

#### 利用mongo进行数据库操作

数据库和集合不需要提前创建，直接使用即可，在存入第一条数据的时候，会自动创建！！！

```
1. 查看所有数据库
show databases;

2. 切换数据库
use 数据库名称;

3. 查看当前数据库中所有的集合
show collections;

db指的就是当前正在使用的数据库对象！

增
db.集合名称.insert(对象)
db.集合名称.insertOne(对象)
db.集合名称.insertMany(数组)

删
db.集合名称.deleteOne(条件对象)  如果条件能找到多个对象，则只删除第一个
db.集合名称.deleteMany(条件对象)

改
db.集合名称.updateOne(条件对象，操作对象)  操作对象： {$set: {属性名： 要改的值}}
db.集合名称.updateMany(条件对象，操作对象)

查
db.集合名称.find(条件对象)
```

#### 条件对象

- {属性名： 属性值}     查找指定的属性值为指定的值的内容
- {属性名: {$lt: 值}}  查找指定的属性值小于指定的值的内容
- $gt  大于
- $gte 大于等于
- $lte 小于等于 
- $eq  等于 
- $ne  不等于
- $in  在数组中
- $nin 不在数组中

#### 通过node.js操作数据库

下载mongodb驱动包
npm install mongodb

```js
var MongoClient = require('mongodb').MongoClient;
var connStr = 'mongodb://localhost:27017';

MongoClient.connect(connStr, function(err, client){
    //1. 通过client来获取数据库对象
    var db = client.db(数据库名称);
    //2. 通过数据库对象获取集合对象
    var 集合 = db.collection(集合名称);

    // 增
    集合.insert(要添加的对象, function(err, dbResult){
        // dbResult.result中有两个属性 n: 受影响的行数  ok： 是否成功
    })

    // 删
    集合.deleteOne(条件对象, function(err, dbResult){

    })
    集合.deleteMany(条件对象, function(err, dbResult){

    })

    //改
    集合.updateOne(条件对象, 操作对象, function(err, dbResult){

    })
    集合.updateMany(条件对象, 操作对象, function(err, dbResult){

    })

    // 查
    集合.find(条件对象).toArray(function(err, arr){
        // arr就是最终获取到的数据数组
    })

    //last: 关闭数据库连接
    client.close();
})
```

### 使用mongodb实现了storage模块

mongodb在存储数据的时候，会自动给数据添加一个`_id`属性
这个`_id`属性是`ObjectId`类型, 如果要将一个字符转换成`ObjectId`

```js
// 1. 引入ObjectId
var ObjectId = require('mongodb').ObjectId;
// 2. 通过调用ObjectId来进行转换
ObjectId(id字符串)   //通过id进行数据查询的时候，必须使用这个
```

## 前后端分离的Hacker-News

后端： 只负责提供数据，还要设置cors
前端： 负责静态页面，并且要通过ajax请求数据，并且在浏览器中通过模板引擎进行页面渲染
功能： news列表展示，news详情展示，news添加

### hacker-news

1. 主模块：   负责启动一个http服务器和提供数据接口

   ```
   // 提供数据接口
   app.get("/api/getnewslist", function (req, res, next) {
       storage.getAllNews(function (newsList) {
           res.send({
               errCode: 200,
               msg: "获取列表数据成功",
               data: newsList
           });
       })
   })

   // 启动http服务
   app.listen(8888, function () { 
       console.log('http://localhost:8888')
   })
   ```

2. 数据操作模块： 负责连接数据库Mongodb以及提供数据

   ```
   module.exports = {
       getAllNews: function (callback) { 
           MongoClient.connect(connStr, function (err, client) {
               //1. 获取数据库db对象
               var db = client.db(DBNAME);
               //2. 获取集合对象
               var news = db.collection(COLNAME);

               //3. 获取所有的新闻数据
               news.find().toArray(function (err, arr) {
                   callback(arr);
               })

               //4. 关闭数据库连接
               client.close();
           })
       },
       getNewsById: function (id, callback) { 
           MongoClient.connect(connStr, function (err, client) {
               var db = client.db(DBNAME);
               var news = db.collection(COLNAME);

               // 查询的时候，id是objectid类型，所以需要进行转换
               news.find({ _id: ObjectId(id) }).toArray(function (err, arr) {
                   callback(arr[0]);
               })

               client.close();
           })
       },
       addNews: function (info, callback) { 
           MongoClient.connect(connStr, function (err, client) {
               var db = client.db(DBNAME);
               var news = db.collection(COLNAME);
               news.insertOne(info, function (err, dbResult) {
                   if (dbResult.result.ok == 1) {
                       callback();
                   }
               })

               client.close();
           })
       }
   }
   ```

   ​