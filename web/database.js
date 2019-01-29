const sqlite3 = require('sqlite3');

let db = new sqlite3.Database('../moderari.db',(err) => {rhandler(err)});

module.exports.user_login = (discord_profile, callback) => {
    console.log(discord_profile);
    db.serialize(() => {
        db.get(`SELECT * FROM users WHERE id = ?`, discord_profile.id,(err, row) => {
            // console.log(row);
            if (row) {
                if (row.verified === 0) { // First login isn't verified yet
                    console.log('NEW LOGIN')
                    // console.log(typeof discord_profile.id, typeof row.id);
                    db.run(`UPDATE users SET 
                        verified= ?, 
                        verified_at= ?, 
                        email_verified= ?,
                        email= ?, 
                        discriminator= ?, 
                        language= ?, 
                        mfa_enabled= ?, 
                        flags= ?  
                        WHERE id = ?`, [
                        true, 
                        discord_profile.fetchedAt,
                        discord_profile.verified,
                        discord_profile.email,
                        discord_profile.discriminator,
                        discord_profile.locale,
                        discord_profile.mfa_enabled,
                        discord_profile.flags,
                        discord_profile.id
                    ],(err) => {rhandler(err)});
                    db.get(`SELECT * FROM users WHERE id = ?`,discord_profile.id, (err, row) => {
                        callback(err,row);
                    })
                } else {
                    callback(err,row);
                }
            }
            return
        })
        return callback()
    });
}


let rhandler = (err) => {
    if (err) {
        console.log(`\x1b[31m%s\x1b[0m`, '[SQL ERROR] ' + err.toString());
    }
}