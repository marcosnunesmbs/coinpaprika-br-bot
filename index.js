require('dotenv/config');
const Telegraf  = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);
const CPP = require('./src/cpp.js');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
var express = require('express')

const refreshBtn = (c, v) => 
    Extra.markup(Markup.inlineKeyboard([
        Markup.callbackButton('♻️ Atualizar ♻️', `refresh ${c} ${parseFloat(v)}`)
    ]))

bot.start(ctx => {
    const from = ctx.update.message.from;
    let message = `
    Seja bem-vindo ao Coinpaprika BR Bot, ${from.first_name}!
    \n\nAqui vão alguns comandos disponíveis:
    \n/price <símbolo> [<quantia>] = Retorna a cotação do simbolo escolhido. QUANTIA opcional.
    \n/convert <valor> <base> <cotação> = Retorna a cotação total de uma moeda na cotação determinada.
    \n/buy <quantidade> <base> <cotação> <spread> = Retorna a quantia de moedas a ser compradas com agil para baixo.
    \n/sell <quantidade> <base> <cotação> <spread> = Retorna a quantia de moedas a ser vendida com agil para cima.
    \n/brlbuy <quantidade> <cripto> <spread> = Retorna a quantidade de moedas a serem compradas a partir da quantidade de reais e ágil para baixo.
    \n/brlsell <quantidade> <cripto> <spread> = Retorna a quantidade de moedas a serem vendidas a partir da quantidade de reais e ágil para cima.`
    ctx.reply(message)
    .catch((err) => console.log(err))
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
    .catch((err) => console.log(err))
})

bot.command('price', ctx => {
    var props = ctx.message.text.split(" ")
    if (props.length < 2) {
        ctx.reply('Informe o símbolo que deseja após o comando /price')
    } else {
        var value = props[2] ? props[2] : 1
        CPP.getPrice(props[1], parseFloat(value))
            .then(resp => ctx.reply(resp.replace(  /\./g, ","), refreshBtn(props[1], parseFloat(value))))
            .catch((err) => console.log(err))
    }
})

bot.command('sell', ctx => {
    var props = ctx.message.text.split(" ")
    if (props.length < 5) {
        ctx.reply('Informe quantidade, base, cotação e spread que deseja após o comando /sell')
    } else {
        CPP.sellPrice(props[1], props[2], props[3], props[4])
            .then(resp => ctx.reply(resp.replace(  /\./g, ",")))
            .catch((err) => console.log(err))
    }
})

bot.command('buy', ctx => {
    var props = ctx.message.text.split(" ")
    if (props.length < 5) {
        ctx.reply('Informe quantidade, base, cotação e spread que deseja após o comando /buy')
    } else {
        CPP.buyPrice(props[1], props[2], props[3], props[4])
            .then(resp => ctx.reply(resp.replace(  /\./g, ",")))
            .catch((err) => console.log(err))
    }
})

bot.command('brlsell', ctx => {
    var props = ctx.message.text.split(" ")
    if (props.length < 4) {
        ctx.reply('Informe quantidade em BRL, cripto e spread que deseja após o comando /brlsell')
    } else {
        CPP.brlsell(props[1], props[2], props[3])
            .then(resp => ctx.reply(resp.replace(  /\./g, ",")))
            .catch((err) => console.log(err))
    }
})

bot.command('brlbuy', ctx => {
    var props = ctx.message.text.split(" ")
    if (props.length < 4) {
        ctx.reply('Informe quantidade em BRL, cripto e spread que deseja após o comando /brlbuy')
    } else {
        CPP.brlbuy(props[1], props[2], props[3])
            .then(resp => ctx.reply(resp.replace(  /\./g, ",")))
            .catch((err) => console.log(err))
    }
})

bot.command('convert', ctx => {
    var props = ctx.message.text.split(" ")
    if (props.length < 4) {
        ctx.reply('Informe o valor, a base e a cotação que deseja após o comando /convert')
    } else {
        CPP.convert(props[1], props[2], props[3])
            .then(resp => ctx.reply(resp.replace(  /\./g, ",")))
            .catch((err) => console.log(err))
    }
})

bot.action(/refresh (\w+) (\w+)/, ctx => {
    var coin = ctx.match[1]
    var amount = ctx.match.input.split(' ')[2]

    CPP.getPrice(coin, parseFloat(amount))
        .then(resp => ctx.editMessageText( resp.replace(  /\./g, ","), refreshBtn(coin, parseFloat(amount)) )
        .catch( () => { return } ) ).catch((err) => console.log(err))
})


bot.startPolling()

var app = express()
app.use(express.json())

app.get('/', function (req, res) {
    res.send('welcome to CPP-BR-BOT!').catch((err) => console.log(err))
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
    console.log(`Our app is running on port ${ PORT }`);
});