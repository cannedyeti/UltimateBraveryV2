//const secrets = require('./secrets');
require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const path = require('path');
const fetch = require('node-fetch');
const botFile = require('./client/src/discord/bot');
var async = require("async");
var bodyParser = require('body-parser');
var history = require('connect-history-api-fallback');
//let secretVar = secrets.secrets();

// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const app = express();
const pw = process.env.REACT_APP_DB_PASSWORD;
const datab = process.env.REACT_APP_DB_NAME;
const user = process.env.REACT_APP_DB_USER;
const env = process.env.REACT_APP_NODE_ENV;
const cors = require('cors');

console.log('env', process.env.REACT_APP_DB_PASSWORD, process.env.REACT_APP_DB_NAME, process.env.REACT_APP_DB_USER, process.env.REACT_APP_NODE_ENV )

app.use(cors());
app.use(bodyParser.json())
// app.use(history());

// Serve static assets if in prod
if(env == 'production') {
  console.log('in production!')
	app.use(express.static(path.join(__dirname, 'client/build')));
}

const port = process.env.PORT || 5000;

const LEAGUE_VERSION_API = 'https://ddragon.leagueoflegends.com/api/versions.json';

// Functions 



// End functions

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : user,
  password : pw,
  database : datab
});

connection.connect(function(err){
    if(err){
        console.log('Error connecting to Db', err);
        return;
    }
    console.log('Connection established');
});

app.post('/players', (req, res) => {
  var obj = botFile.getPlayers(req);
  res.send(obj)
});

app.post('/discord', (req, res) => {
  var data = req.body;
  var discord = data.discord;
  var teams = data.teams;
  
  const teamsEmbed = new Discord.RichEmbed()
    .setTitle('10s Teams')
    .setURL('http://krue-simulator.com/team-generator')
    .addField(teams[0].name, teams[0].players.join('\n'), true)
    .addField(teams[1].name, teams[1].players.join('\n'), true)
  client.channels.get(discord['id']).send(teamsEmbed)
});

app.get('/db', (req, res) => {
  var query1 = "SELECT * FROM champions ORDER BY id DESC LIMIT 1";
  var query2 = "SELECT * FROM items ORDER BY id DESC LIMIT 1";
  var query3 = "SELECT * FROM patch ORDER BY id DESC LIMIT 1";
  var query4 = "SELECT * FROM runes ORDER BY id DESC LIMIT 1";
  var query5 = "SELECT * FROM summonerspells ORDER BY id DESC LIMIT 1";
  console.log('App get DB');
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
    },
    function(parallel_done) {
      connection.query(query4, {}, function(err, results) {
          if (err) return parallel_done(err);
          return_data.runes = results[0];
          parallel_done();
      });
    },
    function(parallel_done) {
      connection.query(query5, {}, function(err, results) {
          if (err) return parallel_done(err);
          return_data.summs = results[0];
          parallel_done();
      });
    }
    ], function(err) {
          if (err) console.log(err);
          res.json(return_data);
    });
});

app.get('/updatedb', (req, res) => {
  console.log('App get Update');
  fetch(LEAGUE_VERSION_API)
    .then(res => res.json())
    .then(p => {
      var patch = p[0];
      console.log('patch', patch)
      var obj = {
        'patch': patch
      }
      connection.query('SELECT * FROM patch ORDER BY id DESC LIMIT 1', function (error, results, fields) {
        if (error) throw error;
        if (!results[0] || patch != results[0].patch) {
          var qStr = 'INSERT INTO patch (patch) VALUES ("'+ patch +'")'
          connection.query(qStr, (err, results, fields) => {
            if (err) throw err;
            console.log("patch inserted");
          })
        }
      }); //end conn
      // CHAMPIONS API
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
              var qChampStr = "INSERT INTO champions (data) VALUES ("+ mysql.escape(JSON.stringify(c)) +")"
              connection.query(qChampStr, (err, results, fields) => {
                if (err) throw err;
                console.log("champData inserted");
              })
            })
        }
      }); // end conn
      // ITEMS API
      connection.query('SELECT * FROM items ORDER BY id DESC LIMIT 1' , (err, results, fields) => {
        if (err) throw error;
        if (results[0]) {
          var r = JSON.parse(results[0].data);
        }
        if (results[0] && r.version == patch) {
          obj.items = r;
          console.log('items data already in db');
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
            })
        }
      }); //end conn
      var runesQ = `SELECT * FROM runes WHERE version='${patch}'`;
      connection.query(runesQ, (err, results, fields) => {
        if (err) throw error;
        if (results[0]) {
          var r = JSON.parse(results[0].data);
        }
        if (results[0] && results[0].version == patch) {
          obj.runes = r;
          console.log('runes data already in db');
        } else {
          var runeApi = `http://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/runesReforged.json`;
          fetch(runeApi)
            .then(res => res.json())
            .then(runes => {
              obj.runes = JSON.stringify(runes);
              var qRuneStr = "INSERT INTO runes (data, version) VALUES ("+ mysql.escape(JSON.stringify(runes)) +", " + mysql.escape(patch) + ")"
              connection.query(qRuneStr, (err, results, fields) => {
                if (err) throw err;
                console.log("runeData inserted");
              })
              obj = JSON.stringify(obj);
            })
        }
      }); //end conn
      connection.query('SELECT * FROM summonerspells ORDER BY id DESC LIMIT 1' , (err, results, fields) => {
        if (err) throw error;
        if (results[0]) {
          var r = JSON.parse(results[0].data);
        }
        if (results[0] && r.version == patch) {
          obj.summs = r;
          obj = JSON.stringify(obj);
          console.log('summoner spell data already in db');
          res.json(obj);
        } else {
          var summonerApi = `http://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/summoner.json`;
          fetch(summonerApi)
            .then(res => res.json())
            .then(summs => {
              obj.summs = JSON.stringify(summs);
              var qSumsStr = "INSERT INTO summonerspells (data) VALUES ("+ mysql.escape(JSON.stringify(summs)) +")"
              connection.query(qSumsStr, (err, results, fields) => {
                if (err) throw err;
                console.log("summoner spell data inserted");
              })
              obj = JSON.stringify(obj);
              res.json(obj);
            })
        }
      }); //end conn
    })
});

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '/client/build/index.html'), function(err) {
    if (err) {
      console.log('oops')
      res.status(500).send(err)
    }
  })
})


app.listen(port, () => console.log(`Server running on port ${port}`));
