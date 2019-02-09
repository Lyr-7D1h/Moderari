const express = require('express');
const sqlite3 = require('sqlite3');
const os = require('os');
const request = require('request');
const discord = require('discord.js');
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
        if (rows.length > 0) {
            res.send(rows);   
        }
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
        if (rows.length > 0) {
            res.send(rows);
        }
    })
    
    setTimeout(() => { 
    if (!res.headersSent) {
        res.send('Nothing found');
        res.status(404);
    }
    }, 2000);
});

/**
 * NEWS
 */
router.get('/news', function(req, res, next) {
    db.all('SELECT * FROM news', (err, rows) => {
        rhandler(err);
        if (rows.length > 0) {
            res.send(rows);
        }
    });
    setTimeout(() => { 
    if (!res.headersSent) {
        res.send('Nothing found');
        res.status(404);
    }
    }, 2000);
});
router.post('/news', function(req,res,next) {
    db.serialize(() => {
        db.all(`SELECT secure_token, is_admin FROM users WHERE id=?`,req.user.id, (err, row) => {
            rhandler(err);
            if(row) {
                if (row.length > 0) {
                    if (req.user.secure_token === row[0].secure_token ) {
                        if (row[0].is_admin) {
                            let date = new Date()
                            categories = req.body.categories.split(' ');
                            db.run(`INSERT INTO news (id, author, created_at, title, description, categories) VALUES (?,?,?,?,?,?)`, [
                                date.getTime(), 
                                req.user.username, 
                                date.toDateString(), 
                                req.body.title, 
                                req.body.description, 
                                JSON.stringify(categories)], 
                            (err) => {rhandler(err)});
                            
                            let embed = new discord.RichEmbed()
                                .setTitle(req.body.title)
                                .setDescription(req.body.description)
                                .setAuthor(req.user.username, req.user.avatar)
                                .setColor('#333')
                                .setFooter(categories)
                                .setURL(`https://moderari.tk/news#${date.getTime()}`);
                            console.log(embed);
                            let webhook = new discord.WebhookClient('539830157368885259', 'r3C3bwsgLOw_4oTnq5KLkHhtY1h93AOymnz6x-0nYL0Igrhx3PUcL0IByqVN4H8kJdX4');
                            let important = false;
                            for (i in categories) {
                                if (categories[i] == "important") {
                                    important = true;
                                }
                            }
                            if (important) { // add everyone tag if important category
                                webhook.send('@everyone', embed);
                            } else {
                                webhook.send(embed);
                            }

                            req.flash('success', 'News form send')
                            res.redirect('/news');
                        }
                    }
                }
            }
        })
    });

    setTimeout(() => { 
        if (!res.headersSent) {
            req.flash('alert', 'News not send')
            res.redirect('/news');
            res.status(404);
        }
    }, 2000);
})
router.post('/news/delete', function(req,res,next) {
    db.serialize(() => {
        db.all(`SELECT secure_token, is_admin FROM users WHERE id=?`,req.user.id, (err, row) => {
            rhandler(err);
            if(row) {
                if (row.length > 0) {
                    console.log(row);
                    if (req.user.secure_token === row[0].secure_token ) { // Check if user is who he is saying he is
                        console.log(row[0].is_admin);
                        if (row[0].is_admin) { //Checking if user is admin
                            db.run(`DELETE FROM news WHERE id=?`,req.body.delete_news, (err) => {rhandler(err)});
    
                            req.flash('success', 'News article deleted')
                            res.redirect('/news');
                        } 
                    }
                }
            }
        })
    });

    setTimeout(() => { 
        if (!res.headersSent) {
            req.flash('alert', 'News article didn\'t delete');
            res.redirect('/news');
            res.status(404);
        }
    }, 2000);
})




let rhandler = (err) => {
    if (err) {
        console.log(`\x1b[31m%s\x1b[0m`, '[SQL ERROR] ' + err.toString());
    }
}

module.exports = router;