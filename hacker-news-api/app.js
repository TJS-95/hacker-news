var express = require('express');
var storage = require('./storage-mongo');
var app = express();
app.use(function(req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","Content-Type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");

    next();
})

app.get("/api/getnewslist", function(req, res, next) {
    storage.getAllNews(function(newsList) {
        res.send({
            errCode: 200,
            msg: "success",
            data: newsList
        });
    })
})

app.get("/api/getnewsdetails", function(req, res, next) {
    storage.getNewsById(req.query.id, function(news) {
        res.send({
            errCode: 200,
            msg: "success",
            data: news
        });
    })
})

app.get("/api/addnews", function(req, res, next) {
    storage.addNews(req.query, function() {
        res.send({
            errCode: 200,
            msg: "添加数据成功"
        })
    })
})
app.listen(8888, function() {
    console.log("http://localhost:8888");
})