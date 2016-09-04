function init() {
    net = new Net(window.location.origin);
    handler = StripeCheckout.configure({
        key: 'pk_test_TfDf48wVeVgbi9OZVAcviFgZ',
        image: '/images/kittur.svg',
        locale: 'auto',
        token: payment
    });
    hide('#signup', 0);
    hide('#payment', 0);
    hide('#thank_you', 0);
}

window.onload = init;

// state of the application
state = {
    current_user: {}
};

function show(id, time) {
    var elem = document.querySelector(id)
    time = time ? time : 1000;
    var p = new Promise(function(resolve, reject) {
        elem.style.opacity = 0;
        elem.style.display = 'block';
        setTimeout(function() {
            elem.style.opacity = 1;
        }, 10);
        setTimeout(function() {
            resolve();
        }, time);
    });
    return p;
}

function hide(id, time) {
    var elem = document.querySelector(id);
    time = time ? time : 1000;
    var p = new Promise(function(resolve, reject) {
        elem.style.opacity = 0;
        setTimeout(function() {
            elem.style.display = 'none';
            resolve();
        }, time);
    });
    return p;
}

function get_kittens() {
    hide('#hero').then(function() {
        show('#signup');
    });
}

function inject(elem, value) {
    document.querySelector(elem).innerHTML = value;
}

function fill(elem, value) {
    document.querySelector(elem).value = value;
}

// prefills the signup form
function prefill() {
    fill('#name', "Alison Hatter");
    fill('#email', "alisonhatter@gmail.com");
    fill('#password', "apples");
}

// signs up the new user, returns their id
function signup() {
    var name = document.querySelector('#name').value;
    var email = document.querySelector('#email').value;
    var password = document.querySelector('#password').value;

    var payload = {
        'name': name,
        'email': email,
        'password': password
    };

    net.post('/signup', payload).then(function(r) {
        state.current_user = {
            'id': r.json.id,
            'name': r.json.name,
            'email': r.json.email
        };

        inject("#users_name_profile", state.current_user.name);
        inject("#users_name_wave", state.current_user.name);

        hide("#signup").then(function() {
            show("#payment");
        });
    });
}

function stripe() {
    handler.open({
        name: 'Kittur',
        description: 'Kittens for life',
        amount: 999,
        email: state.current_user.email
    });
}

function payment(token) {
    hide("#payment").then(function() {
        show("#thank_you");
    });
    net.post('/payment', {
        token_id: token.id
    });
}
