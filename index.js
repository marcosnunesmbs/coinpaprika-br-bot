const env = require('./.env');
const Telegraf  = require('telegraf');
const bot = new Telegraf(env.token);
const CPP = require('./src/cpp.js');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');


const refreshBtn = (c, v) => 
    Extra.markup(Markup.inlineKeyboard([
        Markup.callbackButton('♻️ Atualizar ♻️', `refresh ${c} ${v}`)
    ]))
const refreshSellBtn = (q, b, c , s) => 
    Extra.markup(Markup.inlineKeyboard([
        Markup.callbackButton('♻️ Atualizar ♻️', `refreshSell ${q} ${b} ${c} ${s}`)
    ]))
const refreshBuyBtn = (q, b, c , s) => 
    Extra.markup(Markup.inlineKeyboard([
        Markup.callbackButton('♻️ Atualizar ♻️', `refreshBuy ${q} ${b} ${c} ${s}`)
    ]))
const refreshBrlsellBtn = (q, c, s) => 
    Extra.markup(Markup.inlineKeyboard([
        Markup.callbackButton('♻️ Atualizar ♻️', `refreshBrlsell ${q} ${c} ${s}`)
    ]))
const refreshBrlbuyBtn = (q, c, s) => 
    Extra.markup(Markup.inlineKeyboard([
        Markup.callbackButton('♻️ Atualizar ♻️', `refreshBrlbuy ${q} ${c} ${s}`)
    ]))
const refreshConvert = (q, c, s) => 
    Extra.markup(Markup.inlineKeyboard([
        Markup.callbackButton('♻️ Atualizar ♻️', `refreshConvert ${q} ${c} ${s}`)
    ]))

bot.start(ctx => {
    const from = ctx.update.message.from;
    let message = `
    Seja bem-vindo ao Coinpaprika BR Bot, ${from.first_name}
    \n\nAqui vão alguns comandos disponíveis:
    \n/price <símbolo> [<quantia>] = Retorna a cotação do simbolo escolhido. QUANTIA opcional.
    \n/convert <valor> <base> <cotação> = Retorna a cotação total de uma moeda na cotação determinada.
    \n/buy <quantidade> <base> <cotação> <spread> = Retorna a quantia de moedas a ser compradas com agil para baixo.
    \n/sell <quantidade> <base> <cotação> <spread> = Retorna a quantia de moedas a ser vendida com agil para cima.
    \n/brlbuy <quantidade> <cripto> <spread> = Retorna a quantidade de moedas a serem compradas a partir da quantidade de reais e ágil para baixo.
    \n/brlsell <quantidade> <cripto> <spread> = Retorna a quantidade de moedas a serem vendidas a partir da quantidade de reais e ágil para cima.`
    ctx.reply(message)
})

bot.command('help', ctx => {
    let message = `
    Irei te ajudar.
    \nAqui está a lista de comandos disponíveis:
    \n/price <símbolo> [<quantia>] = Retorna a cotação do simbolo escolhido. QUANTIA opcional.
    \n/convert <valor> <base> <cotação> = Retorna a cotação total de uma moeda na cotação determinada.
    \n/buy <quantidade> <base> <cotação> <spread> = Retorna a quantia de moedas a ser compradas com agil para baixo.
    \n/sell <quantidade> <base> <cotação> <spread> = Retorna a quantia de moedas a ser vendida com agil para cima.
    \n/brlbuy <quantidade> <cripto> <spread> = Retorna a quantidade de moedas a serem compradas a partir da quantidade de reais e ágil para baixo.
    \n/brlsell <quantidade> <cripto> <spread> = Retorna a quantidade de moedas a serem vendidas a partir da quantidade de reais e ágil para cima.`
    ctx.reply(message)
})

bot.command('price', ctx => {
    var props = ctx.message.text.split(" ")
    if (props.length < 2) {
        ctx.reply('Informe o símbolo que deseja após o comando /price')
    } else {
        var value = props[2] ? props[2] : 1
        CPP.getPrice(props[1], value)
            .then(resp => ctx.reply(resp, refreshBtn(props[1], value)))
    }
})

bot.command('sell', ctx => {
    var props = ctx.message.text.split(" ")
    if (props.length < 5) {
        ctx.reply('Informe quantidade, base, cotação e spread que deseja após o comando /sell')
    } else {
        CPP.sellPrice(props[1], props[2], props[3], props[4])
            .then(resp => ctx.reply(resp, refreshSellBtn(props[1], props[2], props[3], props[4])))
    }
})

bot.command('buy', ctx => {
    var props = ctx.message.text.split(" ")
    if (props.length < 5) {
        ctx.reply('Informe quantidade, base, cotação e spread que deseja após o comando /buy')
    } else {
        CPP.buyPrice(props[1], props[2], props[3], props[4])
            .then(resp => ctx.reply(resp, refreshBuyBtn(props[1], props[2], props[3], props[4])))
    }
})

bot.command('brlsell', ctx => {
    var props = ctx.message.text.split(" ")
    if (props.length < 4) {
        ctx.reply('Informe quantidade em BRL, cripto e spread que deseja após o comando /brlsell')
    } else {
        CPP.brlsell(props[1], props[2], props[3])
            .then(resp => ctx.reply(resp, refreshBrlsellBtn(props[1], props[2], props[3])))
    }
})

bot.command('brlbuy', ctx => {
    var props = ctx.message.text.split(" ")
    if (props.length < 4) {
        ctx.reply('Informe quantidade em BRL, cripto e spread que deseja após o comando /brlbuy')
    } else {
        CPP.brlbuy(props[1], props[2], props[3])
            .then(resp => ctx.reply(resp, refreshBrlbuyBtn(props[1], props[2], props[3])))
    }
})

bot.command('convert', ctx => {
    var props = ctx.message.text.split(" ")
    if (props.length < 4) {
        ctx.reply('Informe o valor, a base e a cotação que deseja após o comando /convert')
    } else {
        CPP.convert(props[1], props[2], props[3])
            .then(resp => ctx.reply(resp, refreshConvert(props[1], props[2], props[3])))
    }
})

bot.action(/refresh (\w+) (\w+)/, ctx => {
    var coin = ctx.match[1]
    var amount = ctx.match[2]

    CPP.getPrice(coin, amount)
        .then(resp => ctx.editMessageText( resp, refreshBtn(coin, amount) ).catch( function(error){ console.log(error) } ) )
})
bot.action(/refreshSell (\w+) (\w+) (\w+) (\w+)/, ctx => {
    var q = ctx.match[1]
    var b = ctx.match[2]
    var c = ctx.match[3]
    var s = ctx.match[4]

    CPP.sellPrice(q, b, c, s)
        .then(resp => ctx.editMessageText( resp.replace(".", ","), refreshSellBtn(q, b, c, s)).catch( function(error){ console.log(error) } ) )
})

bot.action(/refreshBuy (\w+) (\w+) (\w+) (\w+)/, ctx => {
    var q = ctx.match[1]
    var b = ctx.match[2]
    var c = ctx.match[3]
    var s = ctx.match[4]

    CPP.buyPrice(q, b, c, s)
        .then(resp => ctx.editMessageText( resp.replace(".", ","), refreshBuyBtn(q, b, c, s)).catch( function(error){ console.log(error) } ) )
})

bot.action(/refreshBrlsell (\w+) (\w+) (\w+)/, ctx => {
    var q = ctx.match[1]
    var b = ctx.match[2]
    var c = ctx.match[3]

    CPP.brlsell(q, b, c)
        .then(resp => ctx.editMessageText( resp.replace(".", ","), refreshBrlsellBtn(q, b, c)).catch( function(error){ console.log(error) } ) )
})
bot.action(/refreshBrlbuy (\w+) (\w+) (\w+)/, ctx => {
    var q = ctx.match[1]
    var b = ctx.match[2]
    var c = ctx.match[3]

    CPP.brlbuy(q, b, c)
        .then(resp => ctx.editMessageText( resp.replace(".", ","), refreshBrlbuyBtn(q, b, c)).catch( function(error){ console.log(error) } ) )
})

bot.action(/refreshConvert (\w+) (\w+) (\w+)/, ctx => {
    var q = ctx.match[1]
    var b = ctx.match[2]
    var c = ctx.match[3]

    CPP.convert(q, b, c)
        .then(resp => ctx.editMessageText( resp.replace(".", ","), refreshConvert(q, b, c)).catch( function(error){ console.log(error) } ) )
})

bot.startPolling()