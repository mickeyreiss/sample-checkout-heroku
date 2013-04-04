

# Overview

This is a sample merchant server implementation that serves as a bridge between the Braintree and Venmo Touch iOS SDK and the Braintree Gateway.

It's built with node and designed to be run on heroku.

We have an instance running at http://sample-checkout.herokuapp.com/ 

This instnace provides the backend for our Sample Checkout iOS App, which you can find [here as part of the braintree-ios Xcode project](https://github.com/braintree/braintree-ios/tree/master/braintree/SampleCheckout)

# Dependencies

For the sake of simplicity, node libraries are bundled in `node_modules`.

# Environment

You *must* set a few environment variables with your Braintree merchant settings.  If you plan to run on heroku, set the following:

    heroku config:set BT_MERCHANT_ID=your_merchant_id
    heroku config:set BT_PUBLIC_KEY=your_public_key
    heroku config:set BT_PRIVATE_KEY=your_private_key


# Running

To run this server locally, you can set environment variables from the command line:

    cd heroku-sample-checkout
    env NODE_PATH=./  \
    BT_MERCHANT_ID=your_merchant_id \
    BT_PUBLIC_KEY=your_public_key \
    BT_PRIVATE_KEY=your_private_key \
    node sample-checkout.js


