const sqlite3 = require('sqlite3');

let db = new sqlite3.Database('../moderari.db',(err) => {rhandler(err)});

module.exports.user_login = (discord_profile, callback) => {
    // console.log(discord_profile);
    db.serialize(() => {
        db.get(`SELECT id, username, secure_token, server, avatar, discriminator, language, email, verified, is_admin FROM users WHERE id = ?`, discord_profile.id,(err, row) => {
            if (row) {
                console.log(row);
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
            } else {
                let err = 'Not a user';
                callback(err, null);
            }
        })
        return callback()
    });
}
module.exports.new_ip = (id, ip) => {
    ip = ip.toString();
    db.serialize(() => {
        db.get("SELECT ip FROM users WHERE id = ?", id, (err, row) => {
            if (row) {
                if (row.ip === null) { // If no ip yet create array
                    db.run("UPDATE users SET ip = ? WHERE id = ?", [JSON.stringify([ip]), id], (err, row) => {
                        rhandler(err);
                    });
                } else {
                    let new_ip = true;
                    row.ip = JSON.parse(row.ip); // Make JSON object an array
                    for (i in row.ip) { //is array ()
                        if (row.ip[i] == ip) { //IP already in DB
                            new_ip = false;
                        }
                    }
                    if (new_ip) { // If new IP
                        db.run("UPDATE users SET ip = ? WHERE id = ?", [row.ip.push(ip), id], (err, row) => {
                            rhandler(err);
                        });
                    }
                }
            }
        })
    })
}


let rhandler = (err) => {
    if (err) {
        console.log(`\x1b[31m%s\x1b[0m`, '[SQL ERROR] ' + err.toString());
    }
}