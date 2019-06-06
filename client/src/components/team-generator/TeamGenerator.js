import TeamInput from './TeamInput';
import TeamName from './TeamName';
import ShuffledTeam from './ShuffledTeam';
const React = require('react');
var NavLink = require('react-router-dom').NavLink;

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
        players: []
      };
      this.randomizeTeams = this.randomizeTeams.bind(this);
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
                players: []
            })
            setTimeout(()=> {
                this.setState({
                    teamOne: teamArr[0].value || 'Team One',
                    teamTwo: teamArr[1].value || 'Team Two',
                    message: 'Randomized',
                    players: playersArr
                })
            },1)
        } else {
            this.setState({
                teamOne: teamArr[0].value || 'Team One',
                teamTwo: teamArr[1].value || 'Team Two',
                message: 'Randomized',
                players: playersArr
            })
        }
    } else {
        this.setState({
            message: 'You need 10 players!',
            teamOne: null,
            teamTwo: null,
            players: []
        })
    }
  }

  render() {
    return (
      <div className="team-generator">
        <div className="content__title">Team Generator</div>
        <div className="input-container">
            <div className="team-input-container">
                <TeamInput cName="input input--team" placeholder="Team One" />
                <TeamInput cName="input input--team" placeholder="Team Two" />
            </div>
            <div className="player-input-container">
                <TeamInput cName="input input--player" placeholder="Player One" />
                <TeamInput cName="input input--player" placeholder="Player Two" />
                <TeamInput cName="input input--player" placeholder="Player Three" />
                <TeamInput cName="input input--player" placeholder="Player Four" />
                <TeamInput cName="input input--player" placeholder="Player Five" />
                <TeamInput cName="input input--player" placeholder="Player Six" />
                <TeamInput cName="input input--player" placeholder="Player Seven" />
                <TeamInput cName="input input--player" placeholder="Player Eight" />
                <TeamInput cName="input input--player" placeholder="Player Nine" />
                <TeamInput cName="input input--player" placeholder="Player Ten" />
            </div>
            <button onClick={this.randomizeTeams} className="button button--randomize">Randomize</button>
        </div>
        {this.state.message ? this.state.message : null}
        <div className="team-output-container">
            {this.state.teamOne ?
                <div className="team-container">
                    <TeamName name={this.state.teamOne} />
                    <ShuffledTeam players={this.state.players.slice(0,5)} />
                </div>
            : null }
            {this.state.teamTwo ?
                <div className="team-container">
                    <TeamName name={this.state.teamTwo} />
                    <ShuffledTeam players={this.state.players.slice(5,10)} />
                </div>
            : null}
        </div>
      </div>
    )
  }
}
export default TeamGenerator;