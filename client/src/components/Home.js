const React = require('react');
var NavLink = require('react-router-dom').NavLink;

class Home extends React.Component {
  render() {
    return (
      <div>
        <h4>Now let's go get <NavLink  to='/ultimate-bravery'>brave</NavLink>.</h4>
      </div>
    )
  }
}
module.exports = Home;