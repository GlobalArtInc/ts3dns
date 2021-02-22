"use strict";
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('tsdns.sqlite');
var express = require('express');
var app = express();
var config = require('./config.json');

db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS zones (id integer primary key, zone varchar(100),target varchar(50))");
});

app.get('/', function (req, res) {
    if (req.headers.authorization === config.api_key) {
        db.all("SELECT * FROM zones", function (err, rows) {
            return res.send({response: true, data: rows})
        });
    } else {
        return res.status(401).send({response: false, message: "invalid_token"});
    }

});

app.post('/', (req, res) => {
    if (req.headers.authorization === config.api_key) {
        const zone = req.headers.zone, target = req.headers.target;

        db.all("SELECT * FROM zones WHERE zone=?", zone, function (err, row) {
            if (row.length > 0) {
                return res.status(403).send({response: false, message: 'zone_used'})
            } else {
                if (!zone) {
                    return res.status(400).send({response: false, message: 'zone_is_empty'})
                } else if (!target) {
                    return res.status(400).send({response: false, message: 'target_is_empty'})
                } else {
                    const stmt = db.prepare("INSERT INTO zones(zone,target) VALUES(?, ?)", zone, target);
                    stmt.run();
                    stmt.finalize();
                    return res.send({response: true})
                }
            }
        })

    } else {
        return res.status(401).send({response: false, message: 'incorrect_token'});
    }
})

app.get('/:id', function (req, res) {
    if (req.headers.authorization === config.api_key) {
        const id = req.params.id;

        if (id) {
            db.all("SELECT * FROM zones WHERE id=?", id, function (err, row) {
                if (row.length > 0) {
                    return res.send({response: true, data: row[0]})
                } else {
                    return res.status(404).send({response: false, message: 'not_found'})
                }
            });
        }
    } else {
        return res.status(401).send({response: false, message: 'incorrect_token'});
    }
});

app.put('/:id', function (req, res) {
    if (req.headers.authorization === config.api_key) {
        const id = req.params.id, zone = req.headers.zone, target = req.headers.target;
        db.all("SELECT * FROM zones WHERE id=?", id, function (err, row) {
            if (row[0]) {
                if (!zone) return res.send({response: false, message: 'zone_empty'})
                if (!target) return res.send({response: false, message: 'target_empty'})

                const sql = 'UPDATE zones SET zone = ?, target = ? WHERE id = ?';
                const stmt = db.prepare(sql, zone, target, id);
                stmt.run();
                stmt.finalize();
                return res.send({response: true})
            } else {
                return res.send({response: false, message: 'not_found'})
            }

        });
    } else {
        return res.status(401).send({response: false, message: 'incorrect_token'});
    }
});

app.delete('/:id', (req, res) => {
    if (req.headers.authorization === config.api_key) {
        const id = req.params.id
        db.all("SELECT * FROM zones WHERE id=?", id, function (err, row) {
            if (row.length > 0) {
                const stmt = db.prepare("DELETE FROM zones WHERE id = ?", id);
                stmt.run();
                stmt.finalize();
                return res.send({response: true})
            } else {
                return res.status(404).send({response: false, message: 'not_found'})
            }
        })
    } else {
        return res.status(401).send({response: false, message: 'incorrect_token'});
    }
})

app.get('*', function (req, res) {
    return res.send({response: false})
})

module.exports = app;
