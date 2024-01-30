class TelegramBot {
	constructor() {
		this.bot_key = "6831890439:AAEla79IC5GbPRavBwn7-OuvDFuVuuVy7cA";
		this.telegraf = require('telegraf').Telegraf;
		this.bot = new this.telegraf(this.bot_key);
		this.bot.launch();
	}

	async
}