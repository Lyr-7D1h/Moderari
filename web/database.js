const sqlite3 = require('sqlite3');

let db = new sqlite3.Database('../moderari.db',(err) => {rhandler(err)});

module.exports.user_login = (discord_profile, callback) => {
    // console.log(discord_profile);
    db.serialize(() => {
        db.get(`SELECT * FROM users WHERE id = ${discord_profile.id}`, (err, row) => {
            if (row) {
                if (row.verified === 0) { // First login isn't verified yet
                    console.log('NEW LOGIN')
                    db.run(`UPDATE users SET 
                    verified = ${true},
                    verified_at = '${discord_profile.fetchedAt}',
                    email_verified = ${discord_profile.verified},
                    email = '${discord_profile.email}',
                    discriminator = '${discord_profile.discriminator}',
                    language = '${discord_profile.locale}',
                    mfa_enabled = ${discord_profile.mfa_enabled},
                    flags = ${discord_profile.flags},
                    is_admin = ${false}
                    WHERE id = ${discord_profile.id}`);
                    db.get(`SELECT * FROM users WHERE id = ${discord_profile.id}`, (err, row) => {
                        callback(err,row);
                    })
                } else {
                    callback(err,row);
                }
            }
        })
        return callback()
    });
}


let rhandler = (err) => {
    if (err) {
        console.log(`\x1b[31m%s\x1b[0m`, '[SQL ERROR] ' + err.toString());
    }
}