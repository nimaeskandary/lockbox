var express = require('express');
var mysql = require('mysql');
var fs = require('fs');
var bodyParser = require("body-parser");
const uuid = require('uuid/v1');
var multer  = require('multer');
var upload = multer({ dest: '../uploads/' });

var app = express();
app.use(express.static("."));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// get connection data from outside project directory
var host = fs.readFileSync('../sql_host.txt','utf8');
var user = fs.readFileSync('../sql_user.txt','utf8');
var password = fs.readFileSync('../sql_password.txt','utf8');
var database = fs.readFileSync('../sql_database.txt','utf8');
var con = mysql.createConnection({
    'host': host,
    'user': user,
    'password': password,
    'database': database
});

con.connect(function (err) {
    if (err) {
        console.log('Error connecting to database');
    }
    else {
        console.log('Database successfully connected');
    }
});

app.listen(8080, function() {
    console.log('LockBox running on port 8080');
});

app.get('/', function (req, res) {
	res.redirect('./views/index.html');
});

app.get('/textForm', function (req, res) {
	res.send(200,
        '<textarea id="text-data" name="textarea" rows="10" cols="50">Write something here</textarea><br>' +
        '<button type="button" id="upload-text">Upload</button>'
    );
});

app.get('/imageForm', function (req, res) {
    res.send(200,
        '<form method="post" action="/imageUpload" enctype="multipart/form-data">' +
        '<label>Select File: &emsp;</label><input type="file" name="image-data" /><br>' +
        '<button type="primary" id="upload-image">Upload</button>' +
        '</form>'
    );
});

app.get('/fileForm', function (req, res) {
    res.send(200,
        '<form method="post" action="/fileUpload" enctype="multipart/form-data">' +
        '<label>Select File: &emsp;</label><input type="file" name="file-data" /><br>' +
        '<button type="primary" id="upload-file">Upload</button>' +
        '</form>'
    );
});

app.get('/getRecord', function (req, res) {
   var id = req.query.id;
   var record = fs.readFileSync('../uploads/' + id);
   res.send(200, record);
});

app.post('/textUpload', function (req, res) {
    var id = uuid();
    var data = req.body;
    data['id'] = id;
    console.dir(data);
    con.query('INSERT INTO lockbox SET ?', data, function(error, response) {
        if (error) {
            res.send(400, 'Error during text upload');
        }
        else {
            // return added entry to user
            con.query('SELECT * FROM lockbox WHERE id = \"' + id + '\"',
                function (error,rows,fields) {
                    if (error) {
                        res.send(400, 'Error during retrieval ');
                    }
                    else {
                        res.send(200, JSON.stringify(rows));
                    }
                })
        }
    });
});

app.post('/fileUpload', upload.single('file-data'), function (req, res) {
    var id = uuid();
    var created = new Date().toISOString().slice(0, 19).replace('T', ' ');

    var old_path = req.file.path;
    var new_path = '../uploads/' + id;
    var fs = require('fs');
    fs.rename(old_path, new_path, function(error) {
        if (error) {
            res.send(400, 'Error during upload');
        }
    });

    var data = {
        id: id,
        type: 'file',
        created: created,
        record: new_path
    };

    con.query('INSERT INTO lockbox SET ?', data, function(error, response) {
        if (error) {
            res.send(400, 'Error during text upload');
        }
        else {
            res.send(200, id);
        }
    });
});

app.post('/imageUpload', upload.single('image-data'), function (req, res) {
    var id = uuid();
    var created = new Date().toISOString().slice(0, 19).replace('T', ' ');

    var old_path = req.file.path;
    var new_path = '../uploads/' + id;
    var fs = require('fs');
    fs.rename(old_path, new_path, function(error) {
        if (error) {
            res.send(400, 'Error during upload');
        }
    });

    var data = {
        id: id,
        type: 'image',
        created: created,
        record: new_path
    };

    con.query('INSERT INTO lockbox SET ?', data, function(error, response) {
        if (error) {
            res.send(400, 'Error during text upload');
        }
        else {
            res.send(200, id);
        }
    });
});
