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
let db = new sqlite3.Database('../moderari.db',(err) => {
    if (err) {console.log(err)}
});
if (config.debug == true) { 
    if (fs.existsSync('../moderari.db')) { // If Database exsists
        // fs.unlink('../moderari.db');
        // console.log("database removed")
        db.run(`DROP TABLE server`)
        db.run(`DROP TABLE users`)
        console.log('servers, users table removed');
    }
}
/**
 * CREATE TABLES
 */
db.serialize(function() { 
    db.run(`CREATE TABLE IF NOT EXISTS server (
        id INT UNIQUE NOT NULL, 
        server_name VARCHAR NOT NULL,
        available INT NOT NULL,
        icon_url VARCHAR,
        created_at VARCHAR,
        region VARCHAR,
        verification_level INT, 
        owner_id INT NOT NULL,
        owner_name VARCHAR NOT NULL,
        channels VARCHAR,
        users
    )`, (err) => rhandler(err));

    db.run(`CREATE TABLE IF NOT EXISTS news (
        id INT UNIQUE NOT NULL, 
        author VARCHAR NOT NULL,
        created_at VARCHAR NOT NULL,
        title VARCHAR NOT NULL,
        description VARCHAR,
        categories VARCHAR
    )`, (err) => rhandler(err));

    db.run(`CREATE TABLE IF NOT EXISTS users (
        id VARCHAR UNIQUE NOT NULL, 
        username VARCHAR NOT NULL,
        secure_token VARCHAR UNIQUE NOT NULL,
        server VARCHAR NOT NULL,
        verified_at,
        verified INT NOT NULL,
        email_verified INT NOT NULL,
        avatar VARCHAR,
        email VARCHAR,
        discriminator INT,
        language VARCHAR,
        mfa_enabled INT,
        flags INT,
        roles,
        ip,
        is_admin INT
    )`, (err) => rhandler(err));

    db.run(`CREATE TABLE IF NOT EXISTS roles (
        id VARCHAR UNIQUE NOT NULL, 
        name VARCHAR UNIQUE NOT NULL,
        level INT NOT NULL,
        users
    )`, (err) => rhandler(err));
});