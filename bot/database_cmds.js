const config = require('./config.json');
const fs = require('fs');
const sqlite3 = require('sqlite3');
const Discord = require('discord.js');
const generatePassword = require('password-generator');
const bcrypt = require('bcrypt');

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
    
    let server_name = guild.name.replace(/['"]/g, ""); // No quotes in server name allowed preventing sql injection
    let owner_name = guild.owner.displayName.replace(/['"]/g, /["]/g); // No quotes in owner name allowed preventing sql injection

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
    // console.log(guild.id, server_name)
    db.serialize(() => {
        db.all(`SELECT * FROM servers WHERE id = ${guild.id}`, (err, rows) => { rhandler(err);
            // db.prepare("INSERT INTO servers VALUES (?,?,?,?,?,?,?,?,?,?,?)");
            if (!(rows.length > 0)) {
                console.log('ADDING SERVER '+server_name);
                db.run(`INSERT INTO servers (id, server_name, available, icon_url, created_at, region, verification_level, channels, owner_id, owner_name, users) 
                VALUES (
                    ${guild.id}, 
                    '${server_name}',
                    ${guild.available},
                    '${guild.iconURL}',
                    '${guild.createdAt}',
                    '${guild.region}', 
                    ${guild.verificationLevel}, 
                    '${channels}', 
                    ${guild.ownerID}, 
                    '${owner_name}',
                    '${users}'
                )`, (err) => { rhandler(err)}
                ); 
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
        if (allowed && !(member.user.bot)) {
            // console.log(member.displayName)
            all_members_unique.push(member);
        }
    }
    for (i in all_members_unique) {
        // console.log(all_members_unique[i].displayName);
        let member = all_members_unique[i];
        db.serialize(() => {
            db.all(`SELECT * FROM users WHERE id='${member.id}'`, (err, rows) => {
                rhandler(err);
                if (!(rows.length > 0)) {
                    db.all(`SELECT * FROM servers`, (err,rows) => {
                        rhandler(err);
                        let servers = [];
                        let is_a_owner = false;
                        if (rows.length > 0) {
                            for (i in rows) {
                                let guild = rows[i];
                                let user_list = JSON.parse(rows[i].users);
                                for (i in user_list) {
                                    // console.log(guild);
                                    if (user_list[i] == member.id) {
                                        let is_owner = false;
                                        // console.log(guild.owner_id, member.id);
                                        if (guild.owner_id == member.id) {
                                            is_a_owner = true;
                                            is_owner = true;
                                        }
                                        servers.push({
                                            server_name: guild.server_name,
                                            server_id: guild.id,
                                            is_owner:  is_owner
                                        });
                                    }
                                }
                            }
                        }
                        servers = JSON.stringify(servers);
                        console.log('ADDING USER ' + member.id);
        
                        let secure_token = generatePassword(50, false);
                        // console.log(secure_token);
                        db.run(`INSERT INTO users (id, secure_token, username, servers, verified, email_verified, is_owner, avatar) 
                        VALUES (
                        '${member.id}',
                        '${secure_token}',
                        '${member.displayName}',
                        '${servers}',
                        false,
                        false,
                        ${is_a_owner},
                        '${member.user.avatarURL}'
                        )`, (err) => { rhandler(err)}
                        );
                    })
                } 
                // else {
                //     console.log('Multiple servers '+ member.id);
                // }
            })   
        });
    }
}


// db.serialize(() => {
//     db.all(`SELECT * FROM servers WHERE id=${member.id}`, (err, rows) => {
//         rhandler(err);
//         if (!(rows.length > 0)) { //Make sure you don't add doubles
//             db.all(`SELECT * FROM servers`, (err,rows) => {
//                 rhandler(err);
//                 server = JSON.stringify(servers);
//                 console.log(member.displayName, server);
//                 db.run(`INSERT INTO users (id, username, servers, verified, email_verified) 
//                 VALUES (
//                 '${member.id}',
//                 '${member.displayName}',
//                 '${server}',
//                 false,
//                 false
//                 )`, (err) => { rhandler(err)}
//                 );
//             })
//         } 
//     })   
// });


// db.run(`INSERT INTO servers (id, server_name, available, icon_url, created_at, region, verification_level, channels, owner_id, owner_name, users) 
// VALUES (
//     ${guild.id}, 
//     '${server_name}',
//     ${guild.available},
//     '${guild.iconURL}',
//     '${guild.createdAt}',
//     '${guild.region}', 
//     ${guild.verificationLevel}, 
//     '${channels}', 
//     ${guild.ownerID}, 
//     '${owner_name}',
//     '${users}'
// )`, (err) => { rhandler(err)}
// ); 