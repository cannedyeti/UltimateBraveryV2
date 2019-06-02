const React = require('react');

class TeamName extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="team__name">
        <h3>{this.props.name}</h3>
      </div>
    )
  }
}
export default TeamName;