// Discord Bot Test
const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.REACT_APP_DISCORD_TOKEN
const prefix = '^';
var channel = '';
const memArr = [];

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}! This is in botjs`);
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
    console.log(memArr.join(", "));
  }
});
client.login(token);


module.exports = {
    getPlayers: function(req) {
        var c = req.body.channel;
        var channel = client.channels.get(c);
        var primaryTextChannel = channel.guild.channels.filter((c) => {
            if(c.type == 'text' && c.position == 0) {
            return c;
            }
        })
        discordChannel = primaryTextChannel.values().next().value;
        var memArr = [];
        const members = channel.members;
        members.forEach(x => {
            // get either nickname or username
            var name = x.nickname || x.user.username
            memArr.push(name);
        })
        var obj = {
            'memArr': memArr,
            'discordChannel': discordChannel
        } 
        return obj;
    }
};
  