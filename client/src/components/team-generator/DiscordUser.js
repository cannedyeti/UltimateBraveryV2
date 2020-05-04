const React = require('react');

class DiscordUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        playing: false
    };
    this.addUser = this.addUser.bind(this);
  }

  addUser() {
    var playersPlaying = this.props.playersPlaying;
    
    if(this.state.playing) {
        if (playersPlaying.includes(this.props.name)) {
            playersPlaying.splice(playersPlaying.indexOf(this.props.name), 1);
        }
        this.props.updateUsersPlaying(playersPlaying);
        this.setState({
            playing: false
        })
    } else {
        if (!playersPlaying.includes(this.props.name)) {
            playersPlaying.push(this.props.name);
        }
        this.props.updateUsersPlaying(playersPlaying);
        this.setState({
            playing: true
        })
    }
  }


  render() {
    return (
      <div onClick={this.addUser} className={`discord-user ${this.state.playing ? 'discord-user--is-playing' : ''}  `}>
        {this.props.name}
      </div>
    )
  }
}
export default DiscordUser;