const React = require('react');

class ShuffledTeam extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log('players', this.props.players)
    return (
      <div className="shuffled-team">
        {this.props.players.map((p, i) => {
            return (<div key={p}>{p}</div>)
        })}
      </div>
    )
  }
}
export default ShuffledTeam;