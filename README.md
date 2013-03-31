

# Overview

This is a sample merchant server implementation that serves as a bridge between the Braintree and Venmo Touch iOS SDK and the Braintree Gateway.

It's built with node and designed to be run on heroku.

We have an instance running at

http://sample-checkout.herokuapp.com/

that provides the backend for our Sample Checkout iOS app (TODO: link).


# Dependencies

For the sake of simplicity, node libraries are bundled in `node_modules`.

# Environment

You *must* set a few environment variables with your Braintree merchant settings.  If you plan to run on heroku, set the following:

    heroku config:set BT_MERCHANT_ID=your_merchant_id
    heroku config:set BT_PUBLIC_KEY=your_public_key
    heroku config:set BT_PRIVATE_KEY=your_private_key


If you are running locally or on a unix machine, add environment variables to your `.bash_profile`:

    export BT_MERCHANT_ID=your_merchant_id 
    export BT_PUBLIC_KEY=your_public_key
    export BT_PRIVATE_KEY=your_private_key

or when you run node:

    env BT_MERCHANT_ID=your_merchant_id sample-checkout.js

# Running

I personally find it easiest to store the environment export statements in a `herokue-sample-checkout-settings.sh` file, and run this server locally by doing:

    cd heroku-sample-checkout
    source herokue-sample-checkout-settings.sh
    env NODE_PATH=./ node sample-checkout.js


