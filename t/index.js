const assert = require('assert').strict
const Enigma = require('../index')

const {ENIGMA_USER, ENIGMA_PASS} = process.env;
if (!ENIGMA_USER || !ENIGMA_PASS)
    throw new Error('No Enigma credentials in environment')

describe('Enigma Securities API', () => {
    var ex = new Enigma(ENIGMA_USER, ENIGMA_PASS, 'test')
    it('Constructor succeeds', () => {
        assert.ok(!!ex)
    })
    it('Niladic constructor', async () => {
        ex = new Enigma()
        var key = await ex.login()
        assert.ok(key)
        assert.equal(key.length, 143)
    })
    it('Bad credentials fail', async () => {
        var err = new Enigma(ENIGMA_USER, 'xx')
        try {
            await err.login()
        }
        catch (e) {
            assert.equal(e.toString(), 'Error: login failed', 'Error message mismatch')
        }
    })
    it('Missing credentials fail', async () => {
        process.env.ENIGMA_USER = undefined
        process.env.ENIGMA_PASS = undefined
        var err = new Enigma()
        try {
            await err.login()
        }
        catch (e) {
            assert.equal(e.toString(), 'Error: login failed', 'Error message mismatch')
        }
    })
    it ('products', async () => {
        var actual = await ex.products()
        var expected = {
            'BTC/EUR': 1,
            'BTC/USD': 2,
            'BTC/CAD': 3
        }
        assert.deepEqual(actual, expected)
    })
    it ('price', async () => {
        var prods = await ex.products()
        var actual = await ex.price(prods['BTC/EUR'])

        for (var prop of 'ask/base/bid/currency/spot'.split('/'))
            assert.ok(!!prop, 'No ' + prop + ' returned')        
        assert.equal(actual.base, 'BTC')
        assert.equal(actual.currency, 'EUR')
        assert.ok(isFloat(actual.spot))
        assert.ok(isFloat(actual.bid))
        assert.ok(isFloat(actual.ask))
    })
    it ('buy', async () => {
        var actual = await ex.buy(1, 'fiat', 100)
        var expected = {}
        assert.deepEqual(actual, expected)
// console.log(actual)
    })
    it ('sell', async () => {
        var actual = await ex.sell(1, 'fiat', 100)
        var expected = {}
        assert.deepEqual(actual, expected)
// console.log(actual)
    })
    it ('trade', async () => {
        var actual = await ex.trade(1, 'sell', 'fiat', 100)
        var expected = {}
        assert.deepEqual(actual, expected)
// console.log(actual)
    })
    it ('trades', async () => {
        var actual = await ex.trades()
        var expected = []
        assert.deepEqual(actual, expected)
    })
})

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}