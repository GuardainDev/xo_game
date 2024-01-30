const express = require('express');
const router = express.Router();


router.post('/', async (req, res) => {
    try {
        let data = req.body;
        console.log(data);
        let email = data.email;
        let password = data.password;
        let name = data.name;
        let avatar = data.avatar;
        let dbobj = res.locals.dbobj;
        // DB require 
        let response = {
            status: 'S',
            msg: 'success'
        };
        if (email && password && name && avatar) {
            let user_id = await create_gid(dbobj);
            let insert_obj = {
                email_id: email,
                password: password,
                name: name,
                avatar: avatar,
                user_id: user_id,
                stat: 'A',
                crd_on: new Date()
            };
            response.user_id = user_id;
            let check_email = await dbobj.db.collection('app_user_accounts').find({ email_id: email }).toArray();
            if (check_email.length === 0) {
                await dbobj.db.collection('app_user_accounts').insertOne(insert_obj);
            } else {
                response.status = 'E';
                response.msg = "Mail Id already used.";
            }
        }
        else {
            response.status = 'E';
            response.msg = "Invalid data";
        }
        res.send(response)
    }
    catch (err) {
        console.log(err);
    }
    finally {

    }
})
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
module.exports = router;