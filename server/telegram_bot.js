const { Telegraf } = require('telegraf');
const { ethers, Wallet } = require('ethers');
const dbconn = require('../server/classes/inc.dbconn');
const dbobj = new dbconn();
(async () => await dbobj.connect())();

require('dotenv').config({ path: './.env' });


const bot = new Telegraf(process.env.BOT_TOKEN);
const img_path = __dirname + '/';
const start = {
    inline_keyboard: [
        [{ text: 'Lets get started.', callback_data: 'start' }],
        // [{ text: 'Button 2', callback_data: 'button2' }],
    ],
};
const Email_usage = {
    inline_keyboard: [
        [{ text: 'YES', callback_data: '/email' }],
        // [{ text: 'Button 2', callback_data: 'button2' }],
    ],
};
const refresh_balance = {
    inline_keyboard: [
        [{ text: '✅ Deposit', callback_data: '/deposit' }, { text: '🔄 Refresh Balance', callback_data: '/balance' }],
        // [{ text: 'Refresh Balance', callback_data: '/balance' }],
        // [{ text: 'Button 2', callback_data: 'button2' }],
    ],
};
bot.start(async (ctx) => {
    let check_user = await dbobj.db.collection('app_user_accounts').find({ tid: ctx.update.message.from.id }).toArray();
    if (check_user.length == 0) {
        // console.log(JSON.stringify(ctx));
        let tid = ctx.update.message.from.id;
        let name = ctx.update.message.from.first_name;
        let user_id = await create_gid(dbobj);
        let user = {
            user_id: user_id,
            avatar: Math.round(Math.random() * 6) + 1,
            tid: tid,
            name: name,
            validated: 0,
            email: '',
            wallet: '',
            privateKey: '',
            step: 1,
            stat: 'A',
            crd_on: new Date() // 1-new user 2-got email from user 3-user accepted terms and conditions,wallet created for user 4-user ready to play game
        }
        console.log(user);
        await dbobj.db.collection('app_user_accounts').insertOne(user);
        await ctx.replyWithPhoto({ source: img_path + 'welcome.png' })
        ctx.reply('Hello! Welcome to XO Game.', { reply_markup: JSON.stringify(start) });
    } else {
        switch (check_user[0].step) {
            case 1:
                ctx.reply('So adventurer, what is your email to log in with?');
                break;
            case 2:
                ctx.reply('<b>' + check_user[0].email + '</b>', { parse_mode: 'HTML' })
                ctx.reply('This email-id will be used for all of transactions.', { reply_markup: JSON.stringify(Email_usage) })
                break;
            case 3:
                await ctx.replyWithPhoto({ source: img_path + 'wallet.webp' });
                await ctx.reply('💰 Your ETH Wallet......');
                await ctx.reply(`<code>${check_user[0].wallet}</code>`, {
                    parse_mode: "HTML",
                });

                await ctx.reply(`<i>Once deposited, you can easily withdraw. You can send <b>MAINNET ETH</b> or <b>BASE ETH</b> directly to your address and hit Refresh Balance</i>`, {
                    parse_mode: "HTML",
                });

                await ctx.reply(`• 💪 Balance:<pre>0.0 ETH</pre>\n• 📥 Please deposit at least 0.033 ETH at: https://xo-game-site.onrender.com\n• 👍 Of this, 0.01 ETH is used for the name.The remainder you can immediately withdraw.\n\n🔥 You will be able to recharge your wallet to start your <b>XO Game</b> journey.`, {
                    parse_mode: "HTML",
                    reply_markup: JSON.stringify(refresh_balance)
                });


                //                 • 💪 Balance:
                //                 0.0 ETH
                // • 📥 Please deposit at least 0.033 ETH at: https://ethxy.com/deposit/254835 
                // • 👍 Of this, 0.01 ETH is used for the name.The remainder you can immediately withdraw.
                // • 🔑 Deposit code: 254835 

                // 🔥 You will be able to reserve your first character name and start your EthXY journey.
                // Once deposited, you can easily withdraw. You can send MAINNET ETH or BASE ETH directly to your address and hit "Refresh Balance"
                //await ctx.reply(`\nHere is your wallet address ${check_user[0].wallet}.\n\nBalance : 0\n\n Transfer 0.02 ETH to this wallet address to play game`, { reply_markup: JSON.stringify(refresh_balance) });
                ctx.replyWithGame('xoxo', { reply_markup: JSON.stringify({ g: 'xoox' }) });
                break;
            default:
                break;
        }
    }
    // ctx.replyWithGame('xoxo', { reply_markup: { g: 'xoox' } });
    // ctx.callbackQuery()
    // ctx.answerCbQuery('ok')
})
bot.on('callback_query', async (ctx) => {
    // console.log(JSON.stringify(ctx));
    let query = ctx.update.callback_query.data;
    ctx.update.callback_query.data
    if (query === 'start') {
        ctx.reply('So adventurer, what is your email to log in with?');
    }

    if (query === '/email') {

        // await ctx.replyWithPhoto({ source: img_path+'treasure.jpeg' });
        await ctx.replyWithPhoto({ source: img_path + 'wallet.webp' });
        ctx.reply('💰 Creating ETH Wallet......');
        let wallet_details = await generateWallet();
        await dbobj.db.collection('app_user_accounts').updateOne({ tid: ctx.update.callback_query.from.id }, { $set: { validated: 1, step: 3, wallet: wallet_details.address, privateKey: wallet_details.privateKey } })
        setTimeout(async () => {
            // await ctx.reply('💰 Your ETH Wallet......');
            // await ctx.reply(`\nHere is your wallet address ${wallet_details.address}.\n\nBalance : 0 ETH\n\n Please deposit at least 0.02 ETH to this wallet to play game`, { reply_markup: JSON.stringify(refresh_balance) });
            await ctx.reply(`<code>${wallet_details.address}</code>`, {
                parse_mode: "HTML",
            });

            await ctx.reply(`<i>Once deposited, you can easily withdraw. You can send <b>MAINNET ETH</b> or <b>BASE ETH</b> directly to your address and hit Refresh Balance</i>`, {
                parse_mode: "HTML",
            });

            await ctx.reply(`• 💪 Balance:<pre>0.0 ETH</pre>\n• 📥 Please deposit at least 0.033 ETH at: https://xo-game-site.onrender.com\n• 👍 Of this, 0.01 ETH is used for the name.The remainder you can immediately withdraw.\n\n🔥 You will be able to recharge your wallet to start your <b>XO Game</b> journey.`, {
                parse_mode: "HTML",
                reply_markup: JSON.stringify(refresh_balance)
            });
            ctx.replyWithGame('xoxo', { reply_markup: { g: 'xoox' } });
        }, 3000);
    }
    if (ctx.update.callback_query.message.game) {
        if (ctx.update.callback_query.message.game.title === 'XO Game') {
            let check_user = await dbobj.db.collection('app_user_accounts').find({ tid: ctx.update.callback_query.from.id }).toArray();
            if (check_user.length > 0) {
                await bot.telegram.answerGameQuery(ctx.callbackQuery.id, 'https://xo-game-site.onrender.com/telegram/index.html?id=' + check_user[0].user_id);
            }
        }
    }
    // await ctx.telegram.answerCbQuery(ctx.callbackQuery.id);
    // await ctx.answerCbQuery()
    // ctx.reply('ok')
})
bot.on('message', async (ctx) => {
    let email = ctx.update.message.text
    if (isValidEmail(email)) {

        await dbobj.db.collection('app_user_accounts').updateOne({ tid: ctx.update.message.from.id }, { $set: { email: email, step: 2 } });
        ctx.reply('<b>' + ctx.update.message.text + '</b>', { parse_mode: 'HTML' })
        ctx.reply('This email-id will be used for all of transactions.', { reply_markup: JSON.stringify(Email_usage) })
    } else {
        let check_user = await dbobj.db.collection('app_user_accounts').find({ tid: ctx.update.message.from.id }).toArray();
        console.log(check_user);
        if (check_user.length > 0) {
            switch (check_user[0].step) {
                case 1:
                    ctx.reply('So adventurer, what is your email to log in with?');
                    break;
                case 2:
                    ctx.reply('<b>' + check_user[0].email + '</b>', { parse_mode: 'HTML' })
                    ctx.reply('This email-id will be used for all of transactions.', { reply_markup: JSON.stringify(Email_usage) })
                    break;
                case 3:
                    // await ctx.reply(`\nHere is your wallet address ${check_user[0].wallet}.\n\nBalance : 0\n\n Transfer 0.02 ETH to this wallet address to play game`, { reply_markup: JSON.stringify(refresh_balance) });
                    await ctx.replyWithPhoto({ source: img_path + 'wallet.webp' });
                    await ctx.reply('💰 Your ETH Wallet......');
                    await ctx.reply(`<code>${check_user[0].wallet}</code>`, {
                        parse_mode: "HTML",
                    });

                    await ctx.reply(`<i>Once deposited, you can easily withdraw. You can send <b>MAINNET ETH</b> or <b>BASE ETH</b> directly to your address and hit Refresh Balance</i>`, {
                        parse_mode: "HTML",
                    });

                    await ctx.reply(`• 💪 Balance:<pre>0.0 ETH</pre>\n• 📥 Please deposit at least 0.033 ETH at: https://xo-game-site.onrender.com\n• 👍 Of this, 0.01 ETH is used for the name.The remainder you can immediately withdraw.\n\n🔥 You will be able to recharge your wallet to start your <b>XO Game</b> journey.`, {
                        parse_mode: "HTML",
                        reply_markup: JSON.stringify(refresh_balance)
                    });
                    ctx.replyWithGame('xoxo', { reply_markup: { g: 'xoox' } });
                    break;
                default:
                    break;
            }
        }
    }
})
// bot.command('playxogame', (ctx) => {
//     console.log(ctx);
// })
bot.launch();
function isValidEmail(email) {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
async function generateWallet() {
    const wallet = Wallet.createRandom();

    // Save the wallet details to a file or database for future use
    const walletData = {
        privateKey: wallet.privateKey,
        address: wallet.address,
    };

    return walletData;
}
function generate_gid(length) {
    const str_result = 'ABCDEFGHJKLMNPQRSTUVWXYZ1234567890zxcvbnmasdfghjklqwertyuiop';
    var gid = '';
    for (let i = 0; i < length; i++) {
        gid = gid + (str_result.charAt(Math.floor(Math.random() * str_result.length)))
    }
    return gid
}
async function create_gid(dbobj) {
    let condition = true
    while (condition) {
        var gid = generate_gid(16);
        var find_gid = await dbobj.db.collection('app_user_accounts').find({ gid: gid }).toArray();
        if (find_gid.length != 0) {
            condition = true
        } else {
            condition = false
        }
    }
    return gid;
}