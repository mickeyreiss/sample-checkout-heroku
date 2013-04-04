/*
Run from command line:
env NODE_PATH=./ node sample-checkout.js
*/
var express = require('express');
var braintree = require('braintree');

var app = express.createServer();
app.use(express.bodyParser());

/*
If you are using heroku, you can set environment variables by doing:

    heroku config:set BT_MERCHANT_ID=your_merchant_id
    heroku config:set BT_PUBLIC_KEY=your_public_key
    heroku config:set BT_PRIVATE_KEY=your_private_key

If you are running locally or on a unix machine, specify environment
variables from the command line:

    env NODE_PATH=./  \
    BT_MERCHANT_ID=your_merchant_id \
    BT_PUBLIC_KEY=your_public_key \
    BT_PRIVATE_KEY=your_private_key \
    node sample-checkout.js

*/
var braintree_settings = {
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BT_MERCHANT_ID,
  publicKey: process.env.BT_PUBLIC_KEY,
  privateKey: process.env.BT_PRIVATE_KEY
};
console.log(braintree_settings);
var gateway = braintree.connect(braintree_settings);


app.post('/card', function(request, response){

    var cardParams = {
        options:{}
    };
    if (request.param('venmo_sdk_session', null)) {
        cardParams.options.venmo_sdk_session = request.param('venmo_sdk_session', null);
    }

    cardParams.customerId = request.param('customer_id', null);
    var venmo_sdk_payment_method_code = request.param('venmo_sdk_payment_method_code', null);
    if (venmo_sdk_payment_method_code) {
        cardParams.venmoSdkPaymentMethodCode = venmo_sdk_payment_method_code; // NB! In node.js, the param you pass to gateway.creditCard.create must be camelCase not underscore_style (like you would in python/ruby).
    } else {
        cardParams.number = request.param('card_number', null);
        cardParams.expirationMonth = request.param('expiration_month', null);
        cardParams.expirationYear = request.param('expiration_year', null);
        cardParams.cvv = request.param('cvv', null);
    }

    console.log('cardParams');
    console.log(cardParams);
    gateway.creditCard.create(cardParams, function (err, result) {
        onCreateCard(response, cardParams, err, result);
    });

});

// bubble up error from gateway. return true if error did occur
function renderGatewayError(response, err, result) {
    if (err) {
        response.send(JSON.stringify(err));
        return true;
    } else if (!result.success) {
        response.send(JSON.stringify(result));
        return true;
    }
    return false;

}

// Needs `response` so we can bubble up errors from gateway and render them.
// Needs `cardParams` so we can retry create card on success
function onCreateCustomer(response, cardParams, customerError, customerResult) {
    console.log('onCreateCustomer');
    console.log(JSON.stringify(customerError));
    console.log(JSON.stringify(customerResult));
    console.log('--');

    // render error if there was one
    if (renderGatewayError(response, customerError, customerResult)) return; 
    // if we created customer successfully, try creating card again
    gateway.creditCard.create(cardParams, function (err, result) {
        onCreateCard(response, cardParams, err, result);
    });

}

// Needs `response` so we can bubble up errors from gateway and render them.
// Needs `cardParams` so we can extract customerId and create a customer if one does not yet exist
function onCreateCard(response, cardParams, cardError, cardResult) {
    console.log('onCreateCard');
    console.log(JSON.stringify(cardError));
    console.log(JSON.stringify(cardResult));
    console.log('--');

    // create a customer if the customerId is not found, then try creating card again
    if (needToCreateCustomer(cardResult)) {
        gateway.customer.create({id: cardParams.customerId}, function (err, result) {
            onCreateCustomer(response, cardParams, err, result);
        });
        return;
    }
    // render error if there was one
    if (renderGatewayError(response, cardError, cardResult)) return; 
    // render result if there was not an error
    response.send(JSON.stringify(cardResult));
}

// check for error code indicating that we tried to create a card with a customerId that does not exist
function needToCreateCustomer(result) {
    if (result && result.errors && result.errors.errorCollections && result.errors.errorCollections.creditCard && result.errors.errorCollections.creditCard.validationErrors && result.errors.errorCollections.creditCard.validationErrors.customerId && result.errors.errorCollections.creditCard.validationErrors.customerId) {
        var customerIdErrors = result.errors.errorCollections.creditCard.validationErrors.customerId;
        for (var i = 0; i < customerIdErrors.length; i++) {
            if (customerIdErrors[i].code == "91705") {
                console.log("needToCreateCustomer true");
                return true;
            }
            
        }
    }
    return false;
    
}

// run server
var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});
