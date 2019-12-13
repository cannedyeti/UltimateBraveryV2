const React = require('react');

class GetPlayers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      channelId: '',
      players: []
    };
    this.getPlayers = this.getPlayers.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({channelId: event.target.value});
  }

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
            this.setState({
                players: obj
            })  
        })
  }
  render() {
    return (
      <div className="get-players">
        <input type="text" className='input input--discord' value={this.state.channelId} onChange={this.handleChange} placeholder="Discord Channel Id"/>
        <button onClick={this.getPlayers} className="button button--get-players">Get Players</button>
        <div className="">
            {this.state.players ? 
                this.state.players.map(i => (
                <div key={i}>{i}</div>
                ))
                : 
                ''
            }
        </div>
      </div>
    )
  }
}
export default GetPlayers;