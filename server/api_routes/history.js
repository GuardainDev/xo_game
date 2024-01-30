const express = require('express');
const router = express.Router();
const DB = require('../classes/multiplayer_dboperations');
const db_operations = new DB();

router.post('/', async (req, res) => {
    try {

        let dbobj = res.locals.dbobj;
        let user_id = req.body.user_id;

        let response = {
            status: 'S',
            msg: 'success',
        }
        let history = await db_operations.get_game_history(dbobj, user_id);
        response.history = history;
        res.send(response)
    }
    catch (err) {
        console.log(err);
    }
    finally {

    }
})

module.exports = router;