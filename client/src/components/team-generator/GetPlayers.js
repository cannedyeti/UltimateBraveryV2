const React = require('react');

class GetPlayers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      channelId: '',
      players: [],
      discordChannel: {}
    };
    this.getPlayers = this.getPlayers.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({channelId: event.target.value});
  }

  sendChannel = () => {
    this.props.giveDiscordChannel(this.state.discordChannel)
  };

  getPlayers() {
    var id = this.state.channelId;
    var data = {
        'channel': id
    }
    fetch('/players', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
      .then(res => {
            return res.json();
        })
        .then(obj => {
            this.props.giveDiscordChannel(obj.discordChannel)
            this.props.getDiscordPlayers(obj.memArr)
            this.setState({
                players: obj.memArr,
                discordChannel: obj.discordChannel
            })  
        })
  }
  render() {
    return (
      <div className="get-players">
        <div classname="get-players__input">
          <input type="text" className='input input--discord' value={this.state.channelId} onChange={this.handleChange} placeholder="Discord Channel Id"/>
          <button onClick={this.getPlayers} className="button button--get-players">Get Players</button>
        </div>
      </div>
    )
  }
}
export default GetPlayers;