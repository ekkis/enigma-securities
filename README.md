 [![npm version](https://badge.fury.io/js/enigma-securities.svg)](https://badge.fury.io/js/enigma-securities)

# Enigma Securities API

A NodeJs library for trading with the Enigma Securities platform

For more information on the firm, please see: https://enigma-securities.io

## Install

The library is available from NpmJs and can be installed in the usual manner:
```
$ npm install enigma-securities
```

## Use

The module exports a factory so that multiple connections can be managed and thus connection objects must be created:
```js
// fetch factory
const Enigma = require('enigma-securities')

// grab credentials from the environment

var {ENIGMA_USERNAME, ENIGMA_PASSWORD} = process.env;

// create a connection object using credentials

const prod = new Enigma(ENIGMA_USERNAME, ENIGMA_PASSWORD)

// to create a connection to the development sandbox

const dev = new Enigma(ENIGMA_USERNAME, ENIGMA_PASSWORD, 'test')

// the constructor will pick up the credentials from the environment
// so you need not specify them

const prod = new Enigma()
const dev = new Enigma('test')
```

## API

The following methods are supported:

### products

Lists the products available in the platform.  The return value is an object with crosses for keys
and product ids for values.  It will generally look like this:
```json
{
   "BTC/EUR": "1",
   "BTC/USD": "2",
   "BTC/CAD": "3"
}
```

### price(id)

Receives the product id to quote and returns spot, bid and ask for the product.  The return object
looks more or less like this:
```json
{
   "base": "BTC",
   "currency": "EUR",
   "spot": "4551.29",
   "bid": "4528.5336",
   "ask": "4574.0465" 
}
```

### buy(id, type, qty)
### sell(id, type, qty)
* id: the product id received from `products`
* type: specifies the metric of the quantity.  can be one of: *fiat* or *crypto*
* qty: the amount for the trade

buy or sell

### trades [intraday]

Returns an array of trades performed for the account.  If a true value is passed to the method,
only intraday trades are returned.  The output looks like this:
```json
[

]
```
## Notes

If credentials are neither provided via the environment, nor explicitly, the factory constructor
will throw an exception on load:

## Testing

A test suite is available and comprises primarily integration tests, so you can use it to make
sure you can reach the platform.  To run, first set the environment variables shown below with
your credentials and then run the tests:
```
$ export ENIGMA_USER=xxxx
$ export ENIGMA_PASS=xxxx
$ npm test
```

## Licence

MIT

## Support

For support post an issue on Github or reach out to me on Telegram. My username is [@ekkis](https://t.me/ekkis)
