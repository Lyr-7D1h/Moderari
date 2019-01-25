const sqlite3 = require('sqlite3');

let db = new sqlite3.Database('../moderari.db',(err) => {rhandler(err)});

module.exports.user_login = (discord_profile, callback) => {
    console.log(discord_profile.id);
    db.get(`SELECT * FROM users WHERE id = ${discord_profile.id}`, (err, row) => {
        callback(err,row);
    })
    return callback()
}


let rhandler = (err) => {
    if (err) {
        console.log(`\x1b[31m%s\x1b[0m`, '[SQL ERROR] ' + err.toString());
    }
}