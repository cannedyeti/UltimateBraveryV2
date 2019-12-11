//const secrets = require('./secrets');
require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const path = require('path');
const fetch = require('node-fetch');
var async = require("async");
var bodyParser = require('body-parser');
//let secretVar = secrets.secrets();

// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const app = express();
const pw = process.env.DB_PASSWORD || '1234';
const datab = process.env.DB_NAME || 'league_db';
const user = process.env.DB_USER || 'cpotebnya';
const env = process.env.NODE_ENV || 'local';
const cors = require('cors');

// Discord Bot Test
const Discord = require('discord.js');
const client = new Discord.Client();
const token = 'NjUzNzE5MjczMTQyODc4MjI5.Xe7FvA.GjKxB6JhB9bsPL66mzXmT5wNYcE';
const prefix = '^';
var channel = '';
const memArr = [];

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (!msg.content.startsWith(prefix)) {
    return;
  }
  var content = msg.content.slice(1);
  if (content === 'getPlayers') {
    if (!msg.member.voiceChannel) {
      msg.reply('You must be in a voice channel to do that.');
      return;
    }
    const members = msg.member.voiceChannel.members;
    const memArr = [];
    members.forEach(x => {
      memArr.push(x.user.username);
    })
    console.log(memArr);
  }
});
client.login(token);
// End discord test

app.use(cors());
app.use(bodyParser.json())

// Serve static assets if in prod
if(env == 'production') {
	app.use(express.static(path.join(__dirname, 'client/build')));
}

const port = process.env.PORT || 5000;

const LEAGUE_VERSION_API = 'https://ddragon.leagueoflegends.com/api/versions.json';

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
  var c = req.body.channel;
  var channel = client.channels.get(c);
  const memArr = [];
  const members = channel.members;
  members.forEach(x => {
    memArr.push(x.user.username);
  })
  res.send(memArr)
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


app.listen(port, () => console.log(`Server running on port ${port}`));
