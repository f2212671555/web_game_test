//express:搭建 webServer

// 1.引入 express 模組
var express = require('express');

var path = require('path');
var mime = require('mime'); //需安裝mime執行命令:npm install mime
var fs = require('fs');

// 2.建立伺服器
var webServer = express();
webServer.use(express.static(__dirname + '/'));

// 2.1 處理 get 請求
webServer.get('/', function (request, response) {
    console.log('收到 get 請求');

    // 傳送給客戶端資料
    response.sendFile(__dirname + "/" + "index.html");
});

webServer.get('/download', function (request, response) {
    console.log('收到 get 請求');

    var file = __dirname + '/resourses/download/images/cat.jpeg';

    var filename = path.basename(file);
    var mimetype = mime.getType(file); //匹配檔案格式

    // 傳送給客戶端資料
    var filestream = fs.createReadStream(file);

    filestream.on('error', function () {
        /*handle error*/
        // response.writeHeader(200,{'Content-Type':'text/html'});
        // response.write(file + "load error!!");
        // response.end();
    });

    response.setHeader('Content-disposition', 'attachment; filename=' + filename);
    response.setHeader('Content-type', mimetype);

    filestream.on('data', function (chunk) {
        response.write(chunk);
    });
    filestream.on('end', function () {
        response.end();
    });
});

webServer.get('/download/:param1/:param2', function (request, response) {
    var param1 = request.params.param1;
    var param2 = request.params.param2;

    console.log('收到 get file請求');

    var file = __dirname + "/resourses/download/"+param1+"/"+param2;

    var filename = path.basename(file);
    var mimetype = mime.getType(file); //匹配檔案格式

    // 傳送給客戶端資料
    var filestream = fs.createReadStream(file);

    filestream.on('error', function () {
        /*handle error*/
        console.log("load:: "+file+" ::fail!!");
        // response.writeHeader(200,{'Content-Type':'text/html'});
        // response.write(file + "load error!!");
        // response.end();
    });

    response.setHeader('Content-disposition', 'attachment; filename=' + filename);
    response.setHeader('Content-type', mimetype);

    filestream.on('data', function (chunk) {
        response.write(chunk);
    });
    filestream.on('end', function () {
        response.end();
    });
});

// 3.監聽，輸入埠號，第二個引數本服務端地址 可以省去
webServer.listen('8080');

console.log('監聽8080')