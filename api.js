"use strict";
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('tsdns.sqlite');
var express = require('express');
var app = express();
var config = require('./config.json');

db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS zones (id integer primary key, zone varchar(100),target varchar(50))");
});

app.get('/list', function (req, res) {
  
  if( req.query.api_key == config.api_key ){
    var zone = req.params.zone;
    db.all("SELECT * FROM zones", function(err, rows) {
      res.end('{"result":"success","message":' + JSON.stringify( rows ) + '}');
    });
  }else{
    res.statusCode = 200;
    res.end('{"result":"error","message":"invalid_token"}');
  }

});

app.get('/update', function(req, res){
  if( req.query.api_key == config.api_key ){
    res.statusCode = 200
    var id = req.query.id;
    var zone = req.query.zone;
    var target = req.query.target;
    
    if(!id) {
      res.end('{result:"error", "message":"id_is_empty"}')
    }
    else if(!zone){
      res.end('{"result":"zone_empty"}')
    }
    else if(!target){
      res.end('{"result":"target_empty"}')
    }
    else{
      db.all("SELECT * FROM zones WHERE id=?", id, function(err, row){
        if(row[0]){
          var sql = 'UPDATE zones SET zone = ?, target = ? WHERE id = ?';
          var stmt = db.prepare(sql,zone,target,id);
          stmt.run();
          stmt.finalize();
          res.end('{"result":"success"}');
        }else{
          res.end({"result":"recond_not_found"})
        }
      
      });
    }
  }
});

app.get('/add', function (req, res) {
  if( req.query.api_key == config.api_key ){
    var zone = req.query.zone;
    var target = req.query.target;
    
    db.all("SELECT * FROM zones WHERE zone=?", zone, function(err, row){
      if(row[0]) {
        res.statusCode = 200
        res.end('{"result":"error", "message":"zone_used"}');
        console.log("Zone "+zone + " used")
      }else{
        if(!zone) {
          res.statusCode = 200
          res.end('{result:"error", "message":"zone_is_empty"}')
        }else if(!target){
          res.statusCode = 200
          res.end('{result:"error", "message":"target_is_empty"}')
        }else{
          res.statusCode = 200
          var sql = 'INSERT INTO zones(zone,target) VALUES(?, ?)';
          var stmt = db.prepare(sql,zone,target);
          stmt.run();
          stmt.finalize();
          res.end('{"result":"success"}');
          console.log("Zone "+zone + " created")
        }
      }
    })

  }else{
    res.statusCode = 200;
    res.end('{"result":"error","message":"invalid_token"}');
  }
});

app.get('/del', function (req, res) {
  if( req.query.api_key == config.api_key ){
    var id = req.query.id;
    var zone = req.query.zone;
    if(id){
      db.all("SELECT * FROM zones WHERE id=?", id, function(err, row){
        if(!row[0]) {
          res.statusCode = 200;
          res.end('{"result":"error", "message":"zone_not_found"}');
        }else{
         var sql = "DELETE FROM zones WHERE id =?";
         var stmt = db.prepare(sql,id);
         stmt.run();
         stmt.finalize();
         res.statusCode = 200;
         res.end('{"result":"success"}');
        }
      })
    }else{
      db.all("SELECT * FROM zones WHERE zone=?", zone, function(err, row){
        if(!row[0]) {
          res.statusCode = 200;
          res.end('{"result":"error", "message":"zone_not_found"}');
          console.log("Zone "+zone + " not found")
        }else{
         var sql = "DELETE FROM zones WHERE zone =?";
         var stmt = db.prepare(sql,zone);
         stmt.run();
         stmt.finalize();
         res.statusCode = 200;
         res.end('{"result":"success"}');
         console.log("Zone "+zone + " deleted")
        }
      })
    }
  
  }else{
    res.statusCode = 200;
    res.end('{"result":"error","message":"invalid_token"}');
  }
});

app.get('/get', function (req, res) {
  if( req.query.api_key == config.api_key ){
    var zone = req.query.zone;
    var id = req.query.id;

    if(id){
      db.all("SELECT * FROM zones WHERE id=?",id, function(err, row) {
        res.statusCode = 200;
        res.end('{"result":"success","message":' + JSON.stringify( row ) + '}');
      });
    }else{
      db.all("SELECT * FROM zones WHERE zone=?",zone, function(err, row) {
        res.statusCode = 200;
        res.end('{"result":"success","message":' + JSON.stringify( row ) + '}');
      });
    }
  }else{
    res.statusCode = 200;
    res.end('{"result":"error","message":"invalid_token"}');
  }
});

app.get('*', function(req, res){
  res.end('{"result":"error","message":"action_undefined"}')
})

module.exports = app;
