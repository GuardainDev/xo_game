const express = require('express');
const router = express.Router();
const DB = require('../classes/multiplayer_dboperations');
const db_operations = new DB();

router.post('/', async (req, res) => {
	try {

		let dbobj = res.locals.dbobj;


		let response = {
			status: 'S',
			msg: 'success',
		}
		let leader_board_data = await db_operations.get_leaderboard(dbobj);
		response.leaderboard_data = leader_board_data;
		res.send(response)
	}
	catch (err) {
		console.log(err);
	}
	finally {

	}
})

module.exports = router;