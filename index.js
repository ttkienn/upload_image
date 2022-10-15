'use strict';

var express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    app = express(),
    handler = require('./handler/index.js'),
    path = require('path'),
    fs = require('fs-extra'),
    routes = new handler();
require('colors');

routes.getRoutes(app);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

var PORT = 3000 || process.env.PORT;

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/upload', function (req, res) {
    if (!fs.existsSync(path.join(__dirname, './cache/data.json'))) {
        fs.writeFileSync(path.join(__dirname, './cache/data.json'), JSON.stringify([]));
    }
    res.render('../FrontEnd/upload/index.ejs');
});

app.listen(PORT, function () {
    console.log('[ SYSTEM ]: '.brightGreen + ('Server started on port ' + PORT).brightWhite);
});