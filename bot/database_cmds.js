const config = require('./config.json');
const fs = require('fs');
const sqlite3 = require('sqlite3');
const Discord = require('discord.js');
const generatePassword = require('password-generator');

let rhandler = (err) => {
    if (err) {
        console.log(`\x1b[31m%s\x1b[0m`, '[SQL ERROR] ' + err.toString());
    }
}

let path = '../moderari.db'
let db = new sqlite3.Database('../moderari.db',(err) => {
    if (err) {console.log(err)}
});

module.exports.add_server = (guild) => {
    let channels = []
    guild.channels.map((v) => {
        channels.push(v.id);
    })
    let users = []
    guild.members.map((v) => {
        if (!(v.user.bot)) { // Check if there are no bots
            users.push(v.id);
        }
    })
    users = JSON.stringify(users);
    channels = JSON.stringify(channels);

    db.serialize(() => {
        db.all(`SELECT * FROM server WHERE id = ?`,guild.id, (err, rows) => { rhandler(err);
            if (rows) {
                if (!(rows.length > 0)) {
                    console.log('ADDING SERVER '+guild.name);
                    db.run(`INSERT INTO server (id, server_name, available, icon_url, created_at, region, verification_level, channels, owner_id, owner_name, users) 
                    VALUES (?,?,?,?,?,?,?,?,?,?,?)`,[
                        guild.id,
                        guild.name,
                        guild.available,
                        guild.iconURL,
                        guild.createdAt,
                        guild.region,
                        guild.verificationLevel,
                        channels,
                        guild.ownerID,
                        guild.owner.displayName,
                        users
                    ], (err) => { rhandler(err)});  
                }
            }
        })
    });
}





module.exports.add_server_users = (all_members) => {
    all_members_unique = [];
    for (i in all_members) { // Make sure member list is unique
        let member = all_members[i];
        let allowed = true;
        for (k in all_members_unique) {
            if (member.id == all_members_unique[k].id) {
                allowed = false;
                // console.log('double '+ member.displayName);
            }
        }
        if (allowed && !(member.user.bot)) { // Prevent bot accounts
            // console.log(member.displayName)
            all_members_unique.push(member);
        }
    }
    for (i in all_members_unique) {
        // console.log(all_members_unique[i].displayName);
        let member = all_members_unique[i];
        db.serialize(() => {
            db.all(`SELECT * FROM users WHERE id=?`, member.id,(err, rows) => {
                rhandler(err);
                if (rows) {
                    if (!(rows.length > 0)) {
                        db.get(`SELECT * FROM server`, (err,row) => { 
                            rhandler(err);
                            let server = {}; // SETUP for user server info needed
                            let is_admin = false;
                            if (row) {
                                let guild = row;
                                let user_list = JSON.parse(row.users);
                                for (i in user_list) {
                                    if (user_list[i] == member.id) {
                                        if (guild.owner_id == member.id) { // get owner / is_admin
                                            is_admin = true;
                                        }
                                    }
                                }
                        
                            }
                            
                            console.log('ADDING USER ' + member.id);
                            server = JSON.stringify(server);
                            let secure_token = generatePassword(50, false);
                            db.run(`INSERT INTO users (id, secure_token, server, username, verified, email_verified, is_admin, avatar) 
                            VALUES (?,?,?,?,?,?,?,?)`,[
                                member.id,
                                secure_token,
                                server,
                                member.displayName,
                                false,
                                false,
                                is_admin,
                                member.user.avatarURL
                            ] ,(err) => { rhandler(err)}
                            );
                        })
                    }
                } 
            })   
        });
    }
}
module.exports.remove_server_user = (id) => {
    db.serialize(() => {
        db.run('DELETE FROM users WHERE id=?', id, (err) => {rhandler(err);})
    });
}