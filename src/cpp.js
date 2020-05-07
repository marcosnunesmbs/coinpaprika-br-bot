const axios = require('axios')
const coins = require('./coins.json')

var filter  = (symbol) => {
    let obj = coins.find(a=>a.symbol === symbol.toUpperCase())
    return obj ? obj.id : null
}

var CPP = {
    getPrice: (coin, value) => {
        return new Promise(function(resolve, reject) {
            let id = filter(coin)
            axios.get(`https://api.coinpaprika.com/v1/tickers/${id}?quotes=USD,BRL,BTC,GBP,EUR`)
            .then(function (response) {
                resolve(
                `=== Cotação ${value} ${response.data.name} ===\n` + 
                `BRL: R$ ${parseFloat((response.data.quotes.BRL.price * value)).toFixed(8)} (${response.data.quotes.BRL.percent_change_24h}%)\n` +
                `\nUSD: US$ ${parseFloat((response.data.quotes.USD.price * value)).toFixed(8)} (${response.data.quotes.USD.percent_change_24h}%)\n` + 
                `GBP:   £ ${parseFloat((response.data.quotes.GBP.price * value)).toFixed(8)} (${response.data.quotes.GBP.percent_change_24h}%)\n` +
                `EUR:   € ${parseFloat((response.data.quotes.EUR.price * value)).toFixed(8)} (${response.data.quotes.EUR.percent_change_24h}%)\n` +
                `BTC:     ${parseFloat((response.data.quotes.BTC.price * value)).toFixed(8)} (${response.data.quotes.BTC.percent_change_24h}%)\n` +
                `\n\nVolume 24h: US$ ${response.data.quotes.USD.volume_24h}` +
                `\nSuply: ${response.data.circulating_supply}` +
                `\nMax. Suply ${response.data.max_supply}`
                )
            })
            .catch(function (error) {
                resolve('Erro ao encontrar esta moeda. Tente novamente')
            })
        })
    },
    convert: (amount, base, quote) => {
        
        return new Promise(function(resolve, reject) {
            let bc = filter(base)
            let qc = filter(quote)
            axios.get(`https://api.coinpaprika.com/v1/price-converter?base_currency_id=${bc}&quote_currency_id=${qc}&amount=${amount}`)
            .then(function (response) {
                resolve(
                `=== Conversão ${amount} ${base.toUpperCase()}/${quote.toUpperCase()} ===\n` + 
                `${amount} ${base.toUpperCase()} = ${response.data.price} ${quote.toUpperCase()}`
                )
            })
            .catch(function (error) {
                resolve('Erro  na conversão. Tente novamente')
            })
        })
    },

    sellPrice: (amount, base, quote, spread) => {
        
        return new Promise(function(resolve, reject) {
            let bc = filter(base)
            let qc = filter(quote)
            let up = 1 + (spread/100)
            axios.get(`https://api.coinpaprika.com/v1/price-converter?base_currency_id=${bc}&quote_currency_id=${qc}&amount=${amount}`)
            .then(function (response) {
                axios.get(`https://api.coinpaprika.com/v1/tickers/${qc}?quotes=BRL`)
                .then((resp) => {
                    resolve(
                    `=== Venda de ${amount} ${base.toUpperCase()} + ${spread}% ===` + 
                    `\n${quote.toUpperCase()}: ${parseFloat(response.data.price * up).toFixed(8)}`+
                    `\nR$ ${parseFloat((response.data.price * up) * resp.data.quotes.BRL.price).toFixed(2)}`
                    )
                })
                
            })
            .catch(function (error) {
                resolve('Erro  ao calcular. Tente novamente')
            })
        })
    },

    buyPrice: (amount, base, quote, spread) => {
        
        return new Promise(function(resolve, reject) {
            let bc = filter(base)
            let qc = filter(quote)
            let up = 1 - (spread/100)
            axios.get(`https://api.coinpaprika.com/v1/price-converter?base_currency_id=${bc}&quote_currency_id=${qc}&amount=${amount}`)
            .then(function (response) {
                axios.get(`https://api.coinpaprika.com/v1/tickers/${qc}?quotes=BRL`)
                .then((resp) => {
                    resolve(
                    `=== Compra de ${amount} ${base.toUpperCase()} - ${spread}% ===` + 
                    `\n${quote.toUpperCase()}: ${parseFloat(response.data.price * up).toFixed(8)}`+
                    `\nR$ ${parseFloat((response.data.price * up) * resp.data.quotes.BRL.price).toFixed(2)}`
                    )
                })
                
            })
            .catch(function (error) {
                resolve('Erro  ao calcular. Tente novamente')
            })
        })
    },

    brlsell: (amount, cripto, spread) => {
        
        return new Promise(function(resolve, reject) {
            let bc = filter(cripto)
            axios.get(`https://api.coinpaprika.com/v1/tickers/${bc}?quotes=BRL`)
                .then((resp) => {
                    let quote = resp.data.quotes.BRL.price * (1 + (spread/100))
                    let total = amount/quote
                    let coust = resp.data.quotes.BRL.price * total
                    resolve(
                        `=== Venda de R$ ${amount} em ${cripto.toUpperCase()} ===` + 
                        `\nCotação: R$${parseFloat(quote).toFixed(8)}` +
                        `\nTotal: ${parseFloat(total).toFixed(8)} ${cripto.toUpperCase()}` +
                        `\n\nCusto: R$ ${parseFloat(coust).toFixed(2)}`+
                        `\nLucro: R$ ${parseFloat(amount - coust).toFixed(2)}`
                    )
                })
                .catch(function (error) {
                    resolve('Erro  ao calcular. Tente novamente')
                })
        })
    },

    brlbuy: (amount, cripto, spread) => {
        
        return new Promise(function(resolve, reject) {
            let bc = filter(cripto)
            axios.get(`https://api.coinpaprika.com/v1/tickers/${bc}?quotes=BRL`)
                .then((resp) => {
                    let quote = resp.data.quotes.BRL.price * (1 - (spread/100))
                    let total = amount/quote
                    let coust = resp.data.quotes.BRL.price * total
                    resolve(
                        `=== Compra de R$ ${amount} em ${cripto.toUpperCase()} ===` + 
                        `\nCotação: R$${parseFloat(quote).toFixed(8)}` +
                        `\nTotal: ${parseFloat(total).toFixed(8)} ${cripto.toUpperCase()}` +
                        `\n\nEconomia: R$ ${parseFloat(amount - coust).toFixed(2)}`
                    )
                })
                .catch(function (error) {
                    resolve('Erro  ao calcular. Tente novamente')
                })
        })
    }
}

module.exports = CPP