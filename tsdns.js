"use strict";
var net = require('net');
var sqlite3 = require('sqlite3').verbose();
const url = require('url');
var db = new sqlite3.Database('./tsdns.sqlite');
var sockets = [];

var tsdns = net.createServer(function (socket) {
        sockets.push(socket);
        var writeEnd = function(message) {
            socket.write(message, function() {
                socket.end();
            });
        };
        var freeTimeout = setTimeout(function() {
           writeEnd('404');
        }, 60000);
        socket.on('data', function(data) {
            var domain = data.toString().replace(/\r|\n/g, '');
            var ds = domain.split('.');
            //var str = "test.example.com";
            //var pat = "*.example.com";
            //
            //pat = '^'+pat.replace(/\./g, '\\.').replace(/\*/g,'.*')+'$';
            //console.log(!!str.match(pat)); 
            for(var i=0,len=ds.length; i<len;i++){
                console.log(ds[i]);
                db.all("SELECT * FROM zones WHERE zone=?",domain, function(err, rows){
                    if( err ){
                        console.log(err);
                    }else{
                        if( rows.length ){
                           writeEnd(rows[0].target);
                        }else{
                           writeEnd('404');
                        }
                   }
                });
          }
           
        });
        
        
        socket.on('close', function() {
            for (var i in sockets) {
                if (sockets[i] === socket) {
                    sockets.splice(i, 1);
                }
            }
        })
        socket.on('error', function(error) {});
    });
    tsdns.on('close', function() {
        db.close();
    })

module.exports = tsdns;
