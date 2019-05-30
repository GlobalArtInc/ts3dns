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
            var ds = [];
            ds = domain.split('.');
            ds.unshift(domain);
            var success = false;

            for(var i=0,len=ds.length; i<len;i++){
                if(i == 0){
                    db.all("SELECT * FROM zones WHERE zone=?",ds[0], function(err, rows){
                        if( err ){
                            console.log(err);
                        }else{
                            if( rows.length ){
                                return writeEnd(rows[0].target)                            
                            }
                       }
                    });
                    ds.shift();
                }
                else if(success){
                    return writeEnd('404')
                }
                else{
                        var i_d = ds;
                        i_d[i - 1] = i_d[i - 1].replace(i_d[i - 1], "*");
                        domain = i_d.join(".");
                        
                        db.all("SELECT * FROM zones WHERE zone=?",domain, function(err, rows){
                            if( err ){
                                console.log(err);
                            }else{
                                if( rows[0] != undefined){
                                    success = true;
                                    return writeEnd(rows[0].target);
                                }
                           }
                        });
                }
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
