var express = require('express');
var fs = require('fs');
var bparse = require('body-parser');
var app = express();

var DATABASE = {
    users: {}
};

app.use(express.static('static'));
app.use(bparse.urlencoded({
    extended: false
}));
app.use(bparse.json());

app.get('/', function(req, res) {
    fs.readFile('./static/html/index.html', function(err, page) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.write(page);
        res.end();
    });
});


app.post('/signup', function(req, res) {
    // read from body
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    // TODO: validate input

    // generate id
    var id = "user_" + Math.random().toString(36).replace("0.", "");

    // store the user
    DATABASE.users[id] = {
        id: id,
        name: name,
        email: email,
        password: password
    };

    // respond with new user info
    res.status(200).send({
        id: id,
        name: name,
        email: email
    }).end();
});

app.post('/payment', function(req, res) {
    var token_id = req.body.token_id;
    hide("#payment");
});



app.listen(3000, function() {
    console.log('listening on port 3000');
});
