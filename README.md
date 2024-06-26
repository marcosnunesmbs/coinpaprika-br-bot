
# CCPBrBot
<p align="center"><img src="src/img/logo.jpg" width="200px"></p>

Este é um bot do Telegram para consultar preços de criptomoedas e outras coisas utilizando a API da [Coinparika](https://coinpaprika.com/pt/).

Click [here](https://t.me/cppbr_bot) to access Telegram Bot.

## Iniciando

> Primeiro: git clone https://github.com/marcosnunesmbs/coinpaprika-br-bot

> Próximo: cd coinpaprika-br-bot

## Configuração

1. Crie um Bot do Telegram e salve o Token com o @BotFather.
 
    1.1. Abra seu Telegram e procure por:  `@BotFather`;
    
    1.2. Digite:  `/newbot`;
    
    1.3.  Defina um `nome` para o seu bot;
    
    1.4.  Defina um `username`
    
    1.5.  Você receberá um `Token`. Salve-o.
    
2. Renomeie o arquivo `.env.example` para `.env`.

3. Defina seu `BOT_TOKEN`.
 
4. Pesquise o nome de usuário do seu bot no Telegram e inicie-o.

5. Junte-se a ele!

# Comandos
> **/price**  \<símbolo\> \<quantia\> = Retorna a cotação do símbolo escolhido. QUANTIA opcional.

```
    /price btc 1
```

> **/convert** \<valor> \<base> \<cotação> = Retorna a cotação total de uma moeda na cotação determinada.

```
    /convert 10 btc usdt
```

> **/buy** \<quantidade> \<base> \<cotação> \<spread> = Retorna a quantia de moedas a ser compradas com agil para baixo.

```
    /buy 10 btc usdt 1
```

> **/sell** \<quantidade> \<base> \<cotação> \<spread> = Retorna a quantia de moedas a ser vendida com agil para cima.

```
    /buy 10 btc usdt 1
```

> **/brlbuy** \<quantidade BRL> CRIPTO \<spread> = Retorna a quantidade de moedas a serem compradas a partir da quantidade de reais e ágil para baixo.

```
    /brlbuy 10 btc 1
```

> **/brlsell** \<quantidade BRL> CRIPTO \<spread> = Retorna a quantidade de moedas a serem vendidas a partir da quantidade de reais e ágil para cima.
```
    /brlsell 10 btc 1
```

> **/help** - Obtenha ajuda.