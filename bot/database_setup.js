const config = require('./config.json');
const fs = require('fs');
const sqlite3 = require('sqlite3');
// const generatePassword = require('password-generator');
const Discord = require('discord.js');
// const bcrypt = require('bcrypt');

let rhandler = (err) => {
    if (err) {
        console.log(`\x1b[31m%s\x1b[0m`, '[SQL ERROR] ' + err.toString());
    }
}


/**
 * CREATE DATABASE
 */
if (config.debug == true) { 
    if (fs.existsSync('../moderari.db')) {
        fs.unlink('../moderari.db');
        console.log("database removed")
    }
}
let db = new sqlite3.Database('../moderari.db',(err) => {
    if (err) {console.log(err)}
});
/**
 * CREATE TABLES
 */
db.serialize(function() { 
    db.run(`CREATE TABLE IF NOT EXISTS servers (
        id INT NOT NULL, 
        server_name VARCHAR NOT NULL,
        region VARCHAR,
        verification_level INT,
        channels VARCHAR, 
        owner_id INT NOT NULL,
        users VARCHAR
    )`, (err) => rhandler(err));

    // db.run(`CREATE TABLE IF NOT EXISTS guild (server_id VARCHAR NOT NULL, channels VARCHAR, owner_id VARCHAR NOT NULL)`, (err) => rhandler(err));
});