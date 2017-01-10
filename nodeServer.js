var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/api/data', processSession);

function processSession (req, res) {
    console.log(req.body);
    var tools = require('./tremila-tools.js');
    fileName = tools.getFileName(req.body);
    console.log("File name: " + fileName);
    tools.loadData('data/' + fileName);
    var specJson = tools.getSpec();
    res.json(specJson);
};

console.log("Listening port 1337 ...");
app.listen(1337);
