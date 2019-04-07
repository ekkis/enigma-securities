const fetch = require('node-fetch')

module.exports = function(username, password, env = 'prod') {
    var base = 'http://api.enigma-securities.io/crypto'

    const {ENIGMA_USER, ENIGMA_PASS} = process.env;
    if ((username || '').match(/test|prod/i)) {
        env = username
        username = password = undefined
    }
    if (!username) username = ENIGMA_USER;
    if (!password) password = ENIGMA_PASS;
    if (!username || !password)
        throw new Error('Enigma: No credentials supplied')

    function login() {
        return fetch(base + '/user/login', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        })
        .then(res => res.json())
        .then(res => {
            if (res.key) return key = res.key
            else throw new Error(res.message)
        })
    }
    async function get(url) {
        var Authorization = key || await login()
        return fetch(base + url, { headers: {Authorization} })
            .then(res => res.json())
            .then(res => {
                if (res.result === false)
                    throw new Error(res.message)
                return res
            })
    }
    async function post(url, o) {
        var Authorization = key || await login()
        return fetch(base + url, {
            method: 'post',
            headers: {Authorization},
            body: JSON.stringify(o)
        })
        .then(res => res.json())
        .then(res => {
            if (res.result === false)
                throw new Error(res.message)
            return res
        })
    }

    return {
        login,
        products() {
            var r = (acc, v) => {
                var k = v.name + '/' + v.currency_name
                acc[k.toUpperCase()] = v.id
                return acc
            }
            return get('/product').then(res => res.reduce(r, {}))
        },
        price(id) {
            return get('/spot/' + id)
        },
        buy(id, type, qty) {
            return post('/order/new', {
                crypto_product_id: id,
                side_id: 1,
                [type == 'crypto' ? 'quantity' : 'nominal']: qty,
                infra: env
            })
        },
        sell(id, type, qty) {
            return post('/order/new', {
                crypto_product_id: id,
                side_id: 2,
                [type == 'crypto' ? 'quantity' : 'nominal']: qty,
                infra: env
            })
        },
        trades(intraday = false) {
            return get('/order/client/list' + (intraday ? '/true' : ''))
        }
    }
}