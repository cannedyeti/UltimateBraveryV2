const React = require('react');
var NavLink = require('react-router-dom').NavLink;

class TeamInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.setState({
      value: e.target.value
    })
  }
  render() {
    return (
      <div>
        <input className={this.props.cName} type="text" onChange={this.handleChange} value={this.state.value} placeholder={this.props.placeholder}></input>
      </div>
    )
  }
}
export default TeamInput;