'use strict';

var express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    app = express(),
    handler = require('./handler/index.js'),
    path = require('path'),
    fs = require('fs-extra'),
    mongodb = require('mongoose'),
    config = require('./config.js'),
    routes = new handler();
require('colors');

//connect to mongodb
mongodb.connect(config['mongodb'], (err, db) => {
    if (err) throw err;
    console.log('[ SYSTEM ] : '.brightGreen + 'Đã kết nối mongodb'.brightWhite);
})


app.use(cors());
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
app.use(express.json({ limit: "50mb", extended: true, parameterLimit: 50000 }))
app.use(bodyParser.json({limit:1024*1024*20, type:'application/json'}));
app.use(bodyParser.urlencoded({extended:true,limit:1024*1024*20,type:'application/x-www-form-urlencoding' }));

routes.getRoutes(app);

app.use(express.static(__dirname + '/Frontend/upload'));

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    if (!fs.existsSync(path.join(__dirname, './cache/data.json'))) {
        fs.writeFileSync(path.join(__dirname, './cache/data.json'), JSON.stringify([]));
    }
    res.render('../FrontEnd/upload/index.ejs');
});

var PORT = 3000 || process.env.PORT;

app.listen(PORT, function () {
    console.log('[ SYSTEM ]: '.brightGreen + ('Server started on port ' + PORT).brightWhite);
});