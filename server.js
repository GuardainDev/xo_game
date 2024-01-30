require('dotenv').config();


const port = process.env.PORT;

// API PART
const express = require('express');
const app = express();
const cors = require('cors');
const body_parser = require('body-parser');
const http = require('http').createServer(app);
const apis = require('./server/api_router');
const CONFIG = require('./server/common/inc.config')
const dbconn = require('./server/classes/inc.dbconn');
const dbobj = new dbconn();
(async () => await dbobj.connect())();
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
app.use(cors())

app.use((req, res, next) => {
	res.locals.dbobj = dbobj;
	next();
})


app.get('/', function (req, res) {
	res.sendFile('/var/www/html/onchain_game_poc/site/login.html');
});
app.use('/api', apis.create());

http.listen(port, function () {
	console.log(port + ' Running Successfully....');
})


const io = require('socket.io')(http, { cors: { origin: "*" } });
const Player = require('./server/game_class/player');
const Settings = require('./server/game_class/room_settings');
const DB = require('./server/classes/multiplayer_dboperations');
const db_operations = new DB();
var players_data = {};
var room_settings = {};
var match_pool = new Map();

const ethers = require('ethers');

// Replace with your contract address and ABI
const contractAddress = process.env.CONTRACT_ADDRESS; 
const contractABI = process.env.CONTRACT_ABI;

// Connect to an Ethereum node (you can replace this URL with your preferred node)

let infura_url = process.env.INFURA_URL;
const provider = new ethers.JsonRpcProvider(infura_url);
const privateKey = process.env.ADMIN_ACC_PRIVATE_KEY; const wallet = new ethers.Wallet(privateKey, provider);
// Create a contract instance
const contract = new ethers.Contract(contractAddress, contractABI, wallet);
// Replace 'yourFunctionName' with the actual name of the function you want to call
const functionName = 'winner_reward';




io.on('connection', async function (socket) {
	var player = new Player();
	player.socket_id = socket.id;

	if (socket.handshake.headers.user_id) {
		player.user_id = socket.handshake.headers.user_id;
		await db_operations.get_player_data(player, dbobj);
	}
	else {
		socket.disconnect();
		socket.removeAllListeners();
		return false;
	}


	socket.on('register', function (userAddress, callback) {

		// player.name = name;
		// player.avatar_id = parseInt(avatar_id);
		player.userAddress = userAddress;
		players_data[player.id] = player;
		match_pool.set(player.id, player.name);
		if (match_pool.size > 1) {

			match_pool.delete(player.id);

			let match_pool_keys = Array.from(match_pool.keys());
			let get_player = match_pool_keys[0];

			if (players_data[get_player] && players_data[player.id]) {

				match_pool.delete(get_player);
				let settings = new Settings();
				settings.players[player.id] = player;
				settings.players[get_player] = players_data[get_player];
				players_data[get_player].symbol = settings.symbols[0];
				players_data[player.id].symbol = settings.symbols[1];
				settings.result_data[players_data[get_player].symbol] = players_data[get_player].id;
				settings.result_data[players_data[player.id].symbol] = players_data[player.id].id;
				settings.userAddress[players_data[get_player].symbol] = players_data[get_player].userAddress;
				settings.userAddress[players_data[player.id].symbol] = players_data[player.id].userAddress;
				players_data[get_player].roomid = settings.roomid;
				players_data[player.id].roomid = settings.roomid;
				player.roomid = settings.roomid;
				settings.game_state = "game_progress";
				room_settings[settings.roomid] = settings;

				for (let player_id in settings.players) {
					let player_value = settings.players[player_id];
					let nxt_player_socket_ref = io.sockets.sockets.get(player_value.socket_id);
					nxt_player_socket_ref.join(settings.roomid);
					player_value.i_p = 1;
					nxt_player_socket_ref.emit('match_found', player_value);
				}
			}

		}
		callback(player.id);
	});


	socket.on('match_found', function (value) {
		socket.broadcast.to(player.roomid).emit('spawn', player);
	})



	socket.on('disconnect', function (reason) {

		if (room_settings[player.roomid]) {
			if (room_settings[player.roomid].game_state === 'game_progress') {

				delete room_settings[player.roomid].players[player.id];
				let winner_player = Object.values(room_settings[player.roomid].players)[0];

				io.to(winner_player.socket_id).emit("result", winner_player.id, players_data[winner_player.id].name);
				room_settings[player.roomid].game_state = "game_completed";
			}
		}

		delete players_data[player.id];
		match_pool.delete(player.id);
	});


	socket.on('emoji', function (id) {
		socket.broadcast.to(player.roomid).emit('emoji', id);
	});

	socket.on('draw_symbols', async function (x, y) {
		if (room_settings[player.roomid]) {
			let { row, column } = room_settings[player.roomid].get_rowand_column(x, y);
			room_settings[player.roomid].combinations[row][column] = players_data[player.id].symbol;
			let winner = room_settings[player.roomid].checkWinner(room_settings[player.roomid].combinations);
			socket.broadcast.to(player.roomid).emit("draw_symbol", x, y, players_data[player.id].symbol);
			console.log("Draw symbol::", players_data[player.id].symbol);
			if (winner === 'draw') {
				room_settings[player.roomid].game_state = 'draw';
				let player_ids = Object.keys(room_settings[player.roomid].players);
				let smart_contract_data = {
					players: room_settings[player.roomid].userAddress,
					track_data: room_settings[player.roomid].combinations
				}
				gamelogFunction(player.roomid, JSON.stringify(smart_contract_data), dbobj);
				let game_obj = [];
				for (let i = 0; i < player_ids.length; i++) {
					let insert_obj = {
						user_id: players_data[player_ids[i]].user_id,
						room_id: player.roomid,
						hash: 'Pending',
						winner: 'TIE',
						points: CONFIG.POINTS.DRAW,
						crd_on: new Date()
					};

					game_obj.push(insert_obj);

				}
				await dbobj.db.collection('game_history').insertMany(game_obj);

				await db_operations.update_score(players_data[player_ids[0]].user_id, CONFIG.POINTS.DRAW, dbobj);
				await db_operations.update_score(players_data[player_ids[1]].user_id, CONFIG.POINTS.DRAW, dbobj);
				socket.emit("draw", 'draw', CONFIG.POINTS.DRAW);
				socket.broadcast.to(player.roomid).emit("draw", 'draw', CONFIG.POINTS.DRAW);
			}
			if (winner && winner !== 'draw') {
				room_settings[player.roomid].game_state = "game_completed";
				let smart_id = room_settings[player.roomid].userAddress[winner];
				let symbol = winner;

				winner = room_settings[player.roomid].result_data[winner];
				let smart_contract_data = {
					players: room_settings[player.roomid].userAddress,
					track_data: room_settings[player.roomid].combinations
				}


				gamelogFunction(player.roomid, JSON.stringify(smart_contract_data), dbobj);
				let player_ids = Object.keys(room_settings[player.roomid].players);
				let game_obj = [];
				for (let i = 0; i < player_ids.length; i++) {
					let insert_obj = {
						user_id: players_data[player_ids[i]].user_id,
						room_id: player.roomid,
						hash: 'Pending',
						winner: 'LOSE',
						points: 0,
						crd_on: new Date()
					};
					if (winner === player_ids[i]) {
						insert_obj.points = CONFIG.POINTS.WINNER;
						insert_obj.winner = 'WIN';
					}
					game_obj.push(insert_obj);

				}
				await dbobj.db.collection('game_history').insertMany(game_obj);
				await db_operations.update_score(players_data[winner].user_id, CONFIG.POINTS.WINNER, dbobj);
				socket.emit("result", winner, players_data[winner].name, room_settings[player.roomid].combinations, symbol, CONFIG.POINTS.WINNER);
				socket.broadcast.to(player.roomid).emit("result", winner, players_data[winner].name, room_settings[player.roomid].combinations, symbol, CONFIG.POINTS.WINNER);
				// let check = callContractFunction(smart_id);

			}

		}
	})


});



async function callContractFunction(id) {
	try {
		const result = await contract.winner_reward(id);//contract[functionName](id);
	} catch (error) {
		console.error('Error calling contract function:', error);
	}
}

// Interact with your contract (example: call a read-only function)
async function gamelogFunction(roomid, write_value, dbobj) {
	try {
		const result = await contract.add_user_positions(roomid, write_value); // Replace with your function name
		if (result.hash != null) {
			await dbobj.db.collection('game_history').updateMany({ room_id: roomid }, { $set: { hash: result.hash } });

		}
		//return result.hash;
	} catch (error) {
		console.error('Error calling contract function:', error.message);
	}
}





