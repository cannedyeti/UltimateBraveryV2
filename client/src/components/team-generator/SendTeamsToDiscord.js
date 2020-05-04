const React = require('react');

class SendTeamsToDiscord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.sendToDiscord = this.sendToDiscord.bind(this);
  }

  sendToDiscord() {
    var data = {
        discord: this.props.discord,
        teams: this.props.teams
    };
    console.log('data', data)
    fetch('/discord', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        return res;
    })
  }
  render() {
    return (
      <div className="send-to-discord">
        <button onClick={this.sendToDiscord} className="button button--send-to-discord">Post To Discord</button>
      </div>
    )
  }
}
export default SendTeamsToDiscord;