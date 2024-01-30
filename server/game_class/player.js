const { v4: uuidv4, v4 } = require('uuid');
module.exports = class Player {
	constructor() {
		this.name = '';
		this.symbol = '';
		this.id = v4();
		this.roomid = '';
		this.socket_id = '';
		this.is_player = '';
		this.avatar_id = '';
		this.user_id = '';
	}
}