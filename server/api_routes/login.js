const express = require('express');
const router = express.Router();


router.post('/', async (req, res) => {
    try {
        let data = req.body;
        let email = data.email;
        let password = data.password;
        let dbobj = res.locals.dbobj;
        console.log(data);
        // DB require

        let response = {
            status: 'S',
            msg: 'success'
        }
        if (email && password) {
            let check_user_login = await dbobj.db.collection('app_user_accounts').find({ email_id: email, stat: 'A' }).limit(1).toArray();
            if (check_user_login.length > 0) {
                if (check_user_login[0].password === password) {
                    response.name = check_user_login[0].name;
                    response.user_id = check_user_login[0].user_id;
                    response.avatar = check_user_login[0].avatar;
                } else {
                    response.status = 'E';
                    response.msg = "Incorrect password.";
                }
            }
            else {
                response.status = 'E';
                response.msg = 'Account does not exist.';
            }
        } else {
            response.status = 'E';
            response.msg = "Invalid data";
        }
        console.log(response);
        res.send(response)
    }
    catch (err) {
        console.log(err);
    }
    finally {

    }
})

module.exports = router;