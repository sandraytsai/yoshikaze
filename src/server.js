var express = require('express');
var fs = require('fs');
var bparse = require('body-parser');
var app = express();
var stripe = require("stripe")(
    "sk_test_qd7h93Qls4fUFHzviUgYAIe5"
);

var DATABASE = {
    users: {}
};

app.use(express.static('static'));
app.use(bparse.urlencoded({
    extended: false
}));
app.use(bparse.json());

// serve index.html
app.get('/', function(req, res) {
    fs.readFile('./static/html/index.html', function(err, page) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.write(page);
        res.end();
    });
});

// sign up a new user
app.post('/signup', function(req, res) {
    // read from body
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

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

// make payment
app.post('/payment', function(req, res) {
    // get token
    var token_id = req.body.token_id;

    // create the charge in stripe
    stripe.charges.create({
        "source": token_id,
        "currency": "USD",
        "amount": 999
    }, function(err, charge) {
        console.log(err, charge);
        res.status(200).send("Successfully charged");
    });
});

app.listen(3000, function() {
    console.log('listening on port 3000');
});
