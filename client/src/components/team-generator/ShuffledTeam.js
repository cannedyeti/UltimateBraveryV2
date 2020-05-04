const React = require('react');

class ShuffledTeam extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
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