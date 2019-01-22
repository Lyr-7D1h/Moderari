const config = require('./config.json');
const fs = require('fs');
const sqlite3 = require('sqlite3');
const Discord = require('discord.js');

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
        channels.push(v);
    })
    let users = []
    guild.members.map((v) => {
        users.push(v);
    })
    

    db.serialize(() => {
        db.all(`SELECT * FROM servers WHERE id = ${guild.id}`, (err, rows) => { rhandler(err);
            if (rows.length > 1) { // REMOVE DUPLICATES
                db.run(`DELETE FROM servers WHERE id = ${guild.id}`, (err) => { rhandler(err)});
                console.log("REMOVING SERVER")
                db.run(`INSERT INTO servers (id, server_name, region, verification_level, channels, owner_id, users) 
                VALUES (${guild.id}, '${guild.name}', "${guild.region}", ${guild.verificationLevel}, '${channels}', ${guild.ownerID}, '${users}')`, (err) => { rhandler(err)});
            } 
            if (!(rows.length == 1)) { // ADD IF DOESN'T YET EXIST
                console.log("ADDING SERVER")
                db.run(`INSERT INTO servers (id, server_name, region, verification_level, channels, owner_id, users) 
                VALUES (${guild.id}, '${guild.name}', "${guild.region}", ${guild.verificationLevel}, '${channels}', ${guild.ownerID}, '${users}')`, (err) => { rhandler(err)});
            }
        })
    });
}