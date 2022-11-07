const TelegramApi = require('node-telegram-bot-api')
const { gameOptions, againOptions } = require('./options')
require('dotenv').config()
const token = process.env.Token;

const bot = new TelegramApi(token, { polling: true })

let currentAns = 0
let failAns = 0
const chats = {}


const startGame = async (chatId) => {
await bot.sendMessage(chatId, 'Now I set riddle number from 1 to 9 and you should guess number')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    return bot.sendMessage(chatId, 'Guess', gameOptions)

}

const start = async () => {

  bot.setMyCommands([
  { command: '/start', description: 'Initial greeting' },
  { command: '/info', description: 'Get info about user' },
   { command: '/game', description: 'Play game' }
])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        try {
            if (text === '/start') {
                  await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/b17/97a/b1797a28-5728-3c1b-bff2-ffb7354bcfc3/2.webp');
  return bot.sendMessage(chatId, `Hello `)
            }
            if (text === '/info') {
  return bot.sendMessage(chatId, `Your name is ${msg.from.first_name} ,  stats win: ${currentAns} , loose: ${failAns}`)
            }
            if (text === '/game') {
                return startGame(chatId);
            }
       return bot.sendMessage(chatId, "I don't understand you");
        } catch (e) {
            return bot.sendMessage(chatId, 'Who are you????????');
        }

    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId)
        }

        if (data == chats[chatId]) {
          await bot.sendMessage(chatId, `You win, you guessed number ${chats[chatId]}`, againOptions);
          await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/6b7/c7f/6b7c7f20-f690-336c-9619-b5706b0e55e6/3.webp')
          currentAns+=1
        } else {
          await bot.sendMessage(chatId, `You loose, bot riddled number ${chats[chatId]}`, againOptions);
          await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/9.webp')
          failAns+=1
        }
    })
}

start()