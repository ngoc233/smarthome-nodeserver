var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8000;
var ip = require('ip');
var mysql = require('mysql');
var moment = require('moment');

//connect
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "smarthome"
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to mysql");
});

// make date time
var time = moment();
var date = time.format('YYYY-MM-DD HH:mm:ss');

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});
console.log("Server nodejs chay tai dia chi: " + ip.address() + ":" + port);
 
// app.get('/', function(req, res) { //tạo webserver khi truy nhập đường dẫn "/".
//     res.sendfile(__dirname + '/index.html'); // thì mở nội dung ở file index.html lên
// });

io.on('connection', function (socket) {
    console.log('New client connect');

    // =================== Light ================
    socket.on('light', function(data) {
        console.log(data);
        socket.broadcast.emit('light',data);
    });
    // =================== Fan ================
    socket.on('fan', function(data) {
        console.log(data);
        socket.broadcast.emit('fan',data);
    });

    socket.on('startAuto', function(data) {
        console.log(data);
        socket.broadcast.emit('startAuto',data);
    });
    socket.on('endAuto', function(data) {
        console.log(data);
        socket.broadcast.emit('endAuto',data);
    });
    
    socket.on('disconnect', function () {
        console.log('Client disconnect');
    });

    //save data

    //pump
    socket.on('pump', function (data) {
        console.log(data);
        socket.broadcast.emit('pump',data);
    });

    // nhiệt độ
    socket.on('temperature',function(data)
    {
        var temperature = parseInt(data);
        var sqlTemp = "INSERT INTO temperatures (number,created_at,updated_at) VALUES ("+ temperature + ",'" + date + "','" + date + "')";
        con.query(sqlTemp, function (err, result) {
            if (err) throw err;
            console.log("1 temperature record inserted");
        });

    });
    // độ ẩm không khí
    socket.on('homeHumidity',function(data)
    {
        var homeHumidity = parseInt(data);
        var sqlHome = "INSERT INTO homehumiditys (number,created_at,updated_at) VALUES ("+ homeHumidity + ",'" + date + "','" + date + "')";
        con.query(sqlHome, function (err, result) {
            if (err) throw err;
            console.log("1 homehumidity record inserted");
        });
    });
    // độ ẩm đất
    socket.on('landHumidity',function(data)
    {

        var landHumidity = parseInt(data);
        var sqlLand = "INSERT INTO landhumiditys (number,created_at,updated_at) VALUES ("+ landHumidity + ",'" + date + "','" + date + "')";
        con.query(sqlLand, function (err, result) {
            if (err) throw err;
            console.log("1 landhumidity record inserted");
        });
    });
    // bật đèn
    socket.on('onLight',function(data)
    {

        var sqlLightOn = "INSERT INTO lights (status,type,created_at,updated_at) VALUES ("+ 1 + "," + parseInt(data) + ",'" + date + "','" + date + "')";
        con.query(sqlLightOn, function (err, result) {
            if (err) throw err;
            console.log("lưu data bật đèn" + parseInt(data) );
        });
        
    });
    // tắt đèn
    socket.on('offLight',function(data)
    {
        var sqlLightOff = "INSERT INTO lights (status,type,created_at,updated_at) VALUES ("+ 0 + "," + parseInt(data) + ",'" + date + "','" + date + "')";
        con.query(sqlLightOff, function (err, result) {
            if (err) throw err;
            console.log("lưu data tắt đèn" + parseInt(data) );
        });
        
    });

    //bật quạt
    socket.on('onFan',function(data)
    {
        var sqlFanOn = "INSERT INTO fans (status,type,created_at,updated_at) VALUES ("+ 1 + "," + parseInt(data) + ",'" + date + "','" + date + "')";
        con.query(sqlFanOn, function (err, result) {
            if (err) throw err;
            console.log("lưu data bật quạt" + parseInt(data) );
        });
        
    });
    //tắt quạt
    socket.on('offFan',function(data)
    {

        var sqlFanOff = "INSERT INTO fans (status,type,created_at,updated_at) VALUES ("+ 0 + "," + parseInt(data) + ",'" + date + "','" + date + "')";
        con.query(sqlFanOff, function (err, result) {
            if (err) throw err;
            console.log("lưu data tắt quạt" + parseInt(data) );
        });
        
    });

});

app.use(express.static("public"));
console.log("Đã khởi động socket server");