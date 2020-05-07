const env = require('./.env');
const Telegraf  = require('telegraf');
const bot = new Telegraf(env.token);
const CPP = require('./src/cpp.js');

bot.start(ctx => {
    const from = ctx.update.message.from;
    let message = `
    Seja bem-vindo ao Coinpaprika BR Bot, ${from.first_name}
    \n\nAqui vão alguns comandos disponíveis:
    \n/price SÍMBOLO [QUANTIA] = Retorna a cotação do simbolo escolhido. QUANTIA opcional.
    \n/convert VALOR + BASE + COTAÇÃO  = Retorna a cotação total de uma moeda na cotação determinada.
    \n/buy QUANTIDADE + BASE + COTAÇÃO + SPREAD  = Retorna a quantia de moedas a ser compradas com agil para baixo.
    \n/sell QUANTIDADE + BASE + COTAÇÃO + SPREAD  = Retorna a quantia de moedas a ser vendida com agil para cima.
    \n/brlbuy QUANTIDADE DE REAIS + CRIPTO + SPREAD  = Retorna a quantidade de moedas a serem compradas a partir da quantidade de reais e ágil para baixo.
    \n/brlsell QUANTIDADE DE REAIS + CRIPTO + SPREAD  = Retorna a quantidade de moedas a serem vendidas a partir da quantidade de reais e ágil para cima.`
    ctx.reply(message)
})


bot.command('price', ctx => {
    var props = ctx.message.text.split(" ")
    if (props.length < 2) {
        ctx.reply('Informe o símbolo que deseja após o comando /price')
    } else {
        let value = props[2] ? props[2] : 1
        CPP.getPrice(props[1], value)
            .then(resp => ctx.reply(resp))
    }
})

bot.command('sell', ctx => {
    var props = ctx.message.text.split(" ")
    if (props.length < 5) {
        ctx.reply('Informe quantidade, base, cotação e spread que deseja após o comando /sell')
    } else {
        CPP.sellPrice(props[1], props[2], props[3], props[4])
            .then(resp => ctx.reply(resp))
    }
})

bot.command('buy', ctx => {
    var props = ctx.message.text.split(" ")
    if (props.length < 5) {
        ctx.reply('Informe quantidade, base, cotação e spread que deseja após o comando /buy')
    } else {
        CPP.buyPrice(props[1], props[2], props[3], props[4])
            .then(resp => ctx.reply(resp))
    }
})

bot.command('brlsell', ctx => {
    var props = ctx.message.text.split(" ")
    if (props.length < 4) {
        ctx.reply('Informe quantidade em BRL, cripto e spread que deseja após o comando /brlsell')
    } else {
        CPP.brlsell(props[1], props[2], props[3])
            .then(resp => ctx.reply(resp))
    }
})

bot.command('brlbuy', ctx => {
    var props = ctx.message.text.split(" ")
    if (props.length < 4) {
        ctx.reply('Informe quantidade em BRL, cripto e spread que deseja após o comando /brlbuy')
    } else {
        CPP.brlbuy(props[1], props[2], props[3])
            .then(resp => ctx.reply(resp))
    }
})

bot.command('convert', ctx => {
    var props = ctx.message.text.split(" ")
    if (props.length < 4) {
        ctx.reply('Informe o valor, a base e a cotação que deseja após o comando /convert')
    } else {
        CPP.convert(props[1], props[2], props[3])
            .then(resp => ctx.reply(resp))
    }
})
bot.command('help', ctx => {
    let message = `
    Irei te ajudar.
    \nAqui está a lista de comandos disponíveis:
    \n/price SÍMBOLO [QUANTIA] = Retorna a cotação do simbolo escolhido. QUANTIA opcional.
    \n/convert VALOR + BASE + COTAÇÃO  = Retorna a cotação total de uma moeda na cotação determinada.
    \n/buy QUANTIDADE + BASE + COTAÇÃO + SPREAD  = Retorna a quantia de moedas a ser compradas com agil para baixo.
    \n/sell QUANTIDADE + BASE + COTAÇÃO + SPREAD  = Retorna a quantia de moedas a ser vendida com agil para cima.
    \n/brlbuy QUANTIDADE DE REAIS + CRIPTO + SPREAD  = Retorna a quantidade de moedas a serem compradas a partir da quantidade de reais e ágil para baixo.
    \n/brlsell QUANTIDADE DE REAIS + CRIPTO + SPREAD  = Retorna a quantidade de moedas a serem vendidas a partir da quantidade de reais e ágil para cima.`
    ctx.reply(message)
})

bot.startPolling()