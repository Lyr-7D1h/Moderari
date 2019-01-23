const express = require('express');
const sqlite3 = require('sqlite3');
const os = require('os');
var router = express.Router();

const db = new sqlite3.Database('../moderari.db', (err) => {rhandler(err)});

router.get('/', function(req, res, next) {
    res.send(`This is Moderari's API Path, DM if you need details`)
});


router.get('/system', function(req, res, next) {
    let info = {
        "total_mem": os.totalmem(),
        "free_mem": os.freemem(),
        "uptime": os.uptime(),
        "cpu": os.cpus()
    }
    res.send(info)

    setTimeout(() => {
    if (!res.headersSent) {
        res.send('Nothing found');
        res.status(404);
    }
    }, 2000);
});


router.get('/servers', function(req, res, next) {
    db.all('SELECT * FROM servers', (err, rows) => {
        rhandler(err);
        res.send(rows);
    })
    
    setTimeout(() => {
    if (!res.headersSent) {
        res.send('Nothing found');
        res.status(404);
    }
    }, 2000);
});


router.get('/users', function(req, res, next) {
    db.all('SELECT users FROM servers', (err, rows) => {
        rhandler(err);
        res.send(rows);
    })
    
    setTimeout(() => { 
    if (!res.headersSent) {
        res.send('Nothing found');
        res.status(404);
    }
    }, 2000);
});

router.get('/news', function(req, res, next) {
    db.all('SELECT * FROM news', (err, rows) => {
        rhandler(err);
        res.send(rows);
    });
    setTimeout(() => { 
    if (!res.headersSent) {
        res.send('Nothing found');
        res.status(404);
    }
    }, 2000);
});


let rhandler = (err) => {
    if (err) {
        console.log(`\x1b[31m%s\x1b[0m`, '[SQL ERROR] ' + err.toString());
    }
}

module.exports = router;