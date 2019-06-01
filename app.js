const secrets = require('./secrets');
const express = require('express');
const mysql = require('mysql');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();
var async = require("async");
//let secretVar = secrets.secrets();

const app = express();

// Serve static assets if in prod
if(process.env.NODE_ENV == 'production') {
  // set static folder
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}

const port = process.env.PORT || 5000;

console.log('dirname', __dirname)
console.log('env what', process.env.NODE_ENV)
console.log('env pw', process.env.DB_PASSWORD)
console.log('env db', process.env.PORT)

const LEAGUE_VERSION_API = 'https://ddragon.leagueoflegends.com/api/versions.json';

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'corn',
  password : 'Merlin!3',
  database : 'corn_league_db'
});

connection.connect(function(err){
    if(err){
        console.log('Error connecting to Db', err);
        return;
    }

    console.log('Connection established');
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api/db', (req, res) => {
  var query1 = "SELECT * FROM champions ORDER BY id DESC LIMIT 1";
  var query2 = "SELECT * FROM items ORDER BY id DESC LIMIT 1";
  var query3 = "SELECT * FROM patch ORDER BY id DESC LIMIT 1"
  var return_data = {}; 
  async.parallel([
    function(parallel_done) {
        connection.query(query1, {}, function(err, results) {
            if (err) return parallel_done(err);
            return_data.champions = results[0];
            parallel_done();
        });
    },
    function(parallel_done) {
        connection.query(query2, {}, function(err, results) {
            if (err) return parallel_done(err);
            return_data.items = results[0];
            parallel_done();
        });
    },
    function(parallel_done) {
      connection.query(query3, {}, function(err, results) {
          if (err) return parallel_done(err);
          return_data.patch = results[0];
          parallel_done();
      });
    }
    ], function(err) {
          if (err) console.log(err);
          res.json(return_data);
    });
})

app.get('/update', (req, res) => {
  console.log("pre async")
  fetch(LEAGUE_VERSION_API)
    .then(res => res.json())
    .then(p => {
      var patch = p[0];
      console.log('patch', patch)
      var obj = {
        'patch': patch
      }
      connection.query('SELECT * FROM patch ORDER BY id DESC LIMIT 1', function (error, results, fields) {
        console.log('pre error ln 90')
        if (error) throw error;
        if (!results[0] || patch != results[0].patch) {
          var qStr = 'INSERT INTO patch (patch) VALUES ("'+ patch +'")'
          connection.query(qStr, (err, results, fields) => {
            if (err) throw err;
            console.log("patch inserted");
          })
        }
      });
      connection.query('SELECT * FROM champions ORDER BY id DESC LIMIT 1', (err, results, fields) => {
        if (err) throw error;
        if(results[0]) {
          var r = JSON.parse(results[0].data);
        }
        if (results[0] && r.version == patch) {
          obj.champs = r;
        } else {
          var champApi = `http://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/champion.json`;
          fetch(champApi)
            .then(res => res.json())
            .then(c => {
              obj.champs = c;
              // console.log(JSON.stringify(c));
              var qChampStr = "INSERT INTO champions (data) VALUES ("+ mysql.escape(JSON.stringify(c)) +")"
              connection.query(qChampStr, (err, results, fields) => {
                if (err) throw err;
                console.log("champData inserted");
              })
            })
        }
      });
      connection.query('SELECT * FROM items ORDER BY id DESC LIMIT 1' , (err, results, fields) => {
        if (err) throw error;
        if (results[0]) {
          var r = JSON.parse(results[0].data);
          obj.items = r;
          obj = JSON.stringify(obj);
          res.json(obj);
        } else {
          var itemApi = `http://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/item.json`;
          fetch(itemApi)
            .then(res => res.json())
            .then(items => {
              obj.items = JSON.stringify(items);
              var qItemStr = "INSERT INTO items (data) VALUES ("+ mysql.escape(JSON.stringify(items)) +")"
              connection.query(qItemStr, (err, results, fields) => {
                if (err) throw err;
                console.log("itemData inserted");
              })
              obj = JSON.stringify(obj);
              res.json(obj);
            })
        }
      })
    })
})


app.listen(port, () => `Server running on port ${port}`);
