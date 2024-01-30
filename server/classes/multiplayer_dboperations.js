class DBOperations {
	constructor() {

	}
	async get_player_data(player, dbobj) {
		try {
			let query_parameter = { user_id: player.user_id, stat: "A" };
			let projection_parameter = {};
			let player_data = await dbobj.db.collection('app_user_accounts').find(query_parameter).project(projection_parameter).toArray();
			console.log("Player data::", player_data);
			if (player_data.length > 0) {
				player.name = player_data[0].name;
				player.avatar_id = player_data[0].avatar;
			}
		}
		catch (err) {
			console.log(err);
		}
	}


	async update_score(user_id, score, dbobj) {
		try {
			let query_parameter = { user_id: user_id, stat: "A" };
			let check_user_exist = await dbobj.db.collection("app_leader_board").find(query_parameter).toArray();
			console.log("userIid::", user_id);
			console.log("score:::", score)
			console.log("chec kuser data::;", check_user_exist);
			if (check_user_exist.length > 0) {
				let update_parameter = { $inc: { score: score } };
				let update = await dbobj.db.collection("app_leader_board").updateOne(query_parameter, update_parameter);
			}
			else {
				let leaderboard_data = {
					user_id: user_id,
					score: score,
					stat: "A",
				}

				let insert = await dbobj.db.collection("app_leader_board").insertOne(leaderboard_data);
			}
		}
		catch (err) {
			console.log(err);
		}
	}



	async get_leaderboard(dbobj) {
		try {
			let aggregation_query = [
				{ $sort: { score: -1 } },
				{ $limit: 100 },
				{
					$lookup: {
						from: "app_user_accounts",
						localField: "user_id",
						foreignField: "user_id",
						as: "player_data"
					}
				},
				{ $unwind: "$player_data" }
			];
			let leaderboard_data = await dbobj.db.collection("app_leader_board").aggregate(aggregation_query).toArray();
			let result = [];
			let position = 0;
			for (let player of leaderboard_data) {
				position++;

				let obj = {
					avatar: player.player_data.avatar,
					name: player.player_data.name,
					points: player.score,
					position: position,
				}
				result.push(obj);
			}

			return result;
		}
		catch (err) {
			console.log(err);
		}
	}

	async get_game_history(dbobj, user_id) {
		try {
			let history_data = await dbobj.db.collection('game_history').find({ user_id: user_id }).sort({ crd_on: -1 }).project({ _id: 0 }).toArray();
			console.log("History data:::", history_data);
			if (history_data.length > 0) {
				return history_data
			}
		}
		catch (err) {
			console.log(err);
		}

	}
}

// (async function () {
// 	const dbconn = require('./inc.dbconn.js');
// 	const dbobj = new dbconn();
// 	await dbobj.connect();
// 	var db = new DBOperations();
// 	let data = await db.get_leaderboard(dbobj);
// 	console.log("data:::", data);
// })();

module.exports = DBOperations;