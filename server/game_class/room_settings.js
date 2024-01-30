module.exports = class Settings {
	constructor() {
		this.roomid = this.unique_id();
		this.combinations = [
			['', '', ''],
			['', '', ''],
			['', '', ''],
		];
		this.grid_size = 100;
		this.result_data = {};
		this.players = {};
		this.symbols = ["X", "O"];
		this.max_players = 2;
		this.game_state = '';
		this.userAddress = {};
	}
	unique_id() {
		var result = "";
		var characters =
			Date.now().toString() +
			// "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" +
			"0123456789"
		Date.now().toString();
		var charactersLength = characters.length;
		for (var i = 0; i < 4; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return parseInt(result);
	}

	get_rowand_column(x, y) {
		const column = Math.floor(x / this.grid_size);
		const row = Math.floor(y / this.grid_size);
		return { row, column };
	}

	checkWinner(board) {
		// Check rows
		for (let i = 0; i < 3; i++) {
			if (
				board[i][0] !== '' &&
				board[i][0] === board[i][1] &&
				board[i][0] === board[i][2]
			) {
				return board[i][0]; // Return the winner ('X' or 'O')
			}
		}

		// Check columns
		for (let i = 0; i < 3; i++) {
			if (
				board[0][i] !== '' &&
				board[0][i] === board[1][i] &&
				board[0][i] === board[2][i]
			) {
				return board[0][i]; // Return the winner ('X' or 'O')
			}
		}

		// Check diagonals
		if (
			board[0][0] !== '' &&
			board[0][0] === board[1][1] &&
			board[0][0] === board[2][2]
		) {
			return board[0][0]; // Return the winner ('X' or 'O')
		}

		if (
			board[0][2] !== '' &&
			board[0][2] === board[1][1] &&
			board[0][2] === board[2][0]
		) {
			return board[0][2]; // Return the winner ('X' or 'O')
		}
		if (this.checkDraw(board)) {
			return 'draw';
		}
		// If no winner is found
		return null;
	}
	checkDraw(board) {
		for (let row = 0; row < board.length; row++) {
			for (let col = 0; col < board[row].length; col++) {
				if (board[row][col] === '') {
					return false; // If any cell is empty, it's not a draw
				}
			}
		}
		return true; // All cells are filled, it's a draw
	}

}


