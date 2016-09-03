function init() {
    net = new Net(window.location.origin);
    handler = StripeCheckout.configure({
        key: 'pk_test_6pRNASCoBOKtIshFeQd4XMUh',
        image: '/images/kittur.svg',
        locale: 'auto',
        token: payment
    });
}

window.onload = init;

state = {
    current_user: {}
};

function show(elem) {
    document.querySelector(elem).style.display = 'block';
}

function hide(elem) {
    document.querySelector(elem).style.display = 'none';
}

function inject(elem, value) {
    document.querySelector(elem).innerHTML = value;
}

function prefill() {
    document.querySelector('#name').value = "Alison Hatter";
    document.querySelector('#email').value = "alisonhatter@gmail.com";
    document.querySelector('#password').value = "apples";
}

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
        hide("#signup");
        show("#payment");
        inject("#users_name", state.current_user.name);
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
    hide("#payment");
    show("#thank_you");

    net.post('/payment', {
        token_id: token.id
    });
}
