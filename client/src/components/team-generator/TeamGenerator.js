import TeamInput from './TeamInput';
import TeamName from './TeamName';
import ShuffledTeam from './ShuffledTeam';
import DiscordUser from './DiscordUser';
import SendTeamsToDiscord from './SendTeamsToDiscord';
import GetPlayers from './GetPlayers';
const React = require('react');
var NavLink = require('react-router-dom').NavLink;
const MAXPLAYERS = 10;

// Shuffle function
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    } 
    return array;
}

class TeamGenerator extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        teamOne: null,
        teamTwo: null,
        message: null,
        teamOnePlayers: null,
        teamTwoPlayers: null,
        discordChannel: null,
        discordPlayers: null,
        discordPlayersPlaying: []
      };
      this.randomizeTeams = this.randomizeTeams.bind(this);
  }
  
  getDiscordChannel = (channel) => {
      this.setState({
          discordChannel: channel
      })
  }

  getDiscordPlayers = (p) => {
    this.setState({
        discordPlayers: p
    })
  }

  updateUsersPlaying = (p) => {
    this.setState({
        discordPlayersPlaying: p
    })
  }

  randomizeTeams() {
    var teamArr = document.getElementsByClassName('input--team');
    var playersArr = [];
    var plArr = document.getElementsByClassName('input--player');
    Object.keys(plArr).forEach((p) => {
        if (plArr[p].value) {
            playersArr.push(plArr[p].value);
        }
    })
    // if we have 10 players, do it
    if(playersArr.length === 10) {
        playersArr = shuffle(playersArr);
        if(this.state.teamOne !== null) {
            this.setState({
                teamOne: null,
                teamTwo: null,
                message: null,
                teamOnePlayers: null,
                teamTwoPlayers: null
            })
            setTimeout(()=> {
                this.setState({
                    teamOne: teamArr[0].value || 'Team One',
                    teamTwo: teamArr[1].value || 'Team Two',
                    message: 'Randomized',
                    teamOnePlayers: playersArr.slice(0,5),
                    teamTwoPlayers: playersArr.slice(5,10)
                })
            },1)
        } else {
            this.setState({
                teamOne: teamArr[0].value || 'Team One',
                teamTwo: teamArr[1].value || 'Team Two',
                message: 'Randomized',
                teamOnePlayers: playersArr.slice(0,5),
                teamTwoPlayers: playersArr.slice(5,10)
            })
        }
    } else {
        this.setState({
            message: 'You need 10 players!',
            teamOne: null,
            teamTwo: null,
            teamOnePlayers: null,
            teamTwoPlayers: null
        })
    }
  }

  render() {
    var data = [{
            'name': this.state.teamOne,
            'players': this.state.teamOnePlayers
        }, {
            'name': this.state.teamTwo,
            'players': this.state.teamTwoPlayers
        }]
    var playersNeeded = MAXPLAYERS - this.state.discordPlayersPlaying.length;
    return (
      <div className="team-generator">
        <div className="content__title">Team Generator</div>
        <GetPlayers getDiscordPlayers={this.getDiscordPlayers} giveDiscordChannel={this.getDiscordChannel} />
        <div className="discord-players">
            {this.state.discordPlayers ? 
                this.state.discordPlayers.map(i => (
                <DiscordUser key={i} name={i} updateUsersPlaying={this.updateUsersPlaying} playersPlaying={this.state.discordPlayersPlaying} />
                ))
                : 
                ''
            }
        </div>
        <div className="team-generator__container">
            <div className="team-generator__input">
                <div className="team-input-container">
                    <TeamInput cName="input input--team" placeholder="Team One" />
                    <TeamInput cName="input input--team" placeholder="Team Two" />
                </div>
                <div className="player-input-container">
                    {this.state.discordPlayersPlaying.map((p, i) => {
                       return ( <TeamInput cName="input input--player" placeholder="Player x" key={i} value={p} /> )
                    })}
                    {[...Array(playersNeeded)].map((p, i) => {
                        return ( <TeamInput cName="input input--player" placeholder={'Player'} /> )
                    })}
                </div>
                <button onClick={this.randomizeTeams} className="button button--randomize">Randomize</button>
            </div>
            <div className="team-generator__output">
                {this.state.message ? this.state.message : null}
                <div className="output__teams">
                    {this.state.teamOne ?
                        <div className="team-container">
                            <TeamName name={this.state.teamOne} />
                            <ShuffledTeam players={this.state.teamOnePlayers} />
                        </div>
                    : null }
                    {this.state.teamTwo ?
                        <div className="team-container">
                            <TeamName name={this.state.teamTwo} />
                            <ShuffledTeam players={this.state.teamTwoPlayers} />
                        </div>
                    : null}
                </div>
            </div>
        </div>
        {this.state.discordChannel && this.state.teamOnePlayers && this.state.teamTwoPlayers ? 
            <SendTeamsToDiscord teams={data} discord={this.state.discordChannel} />
            :
        null }
      </div>
    )
  }
}
export default TeamGenerator;