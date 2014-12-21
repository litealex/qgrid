var express = require('express'),
    app = express();

app.use(express.static(__dirname));

app.get('/', function (req, res) {
    res.sendFile('index.html');
});


app.listen(3000, function (req, res) {
    console.log('Start server on 3000 port');
});