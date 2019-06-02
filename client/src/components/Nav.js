var React = require('react');
var NavLink = require('react-router-dom').NavLink;

function Nav () {
  return(
    <div className="nav">
      <div className="l-constrain">
        <ul className='nav__links'>
          <li>
            <NavLink exact activeClassName='active' to='/'>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink  to='/ultimate-bravery'>
              Ultimate Bravery
            </NavLink>
          </li>
          <li>
            <NavLink  to='/team-generator'>
              Team Generator
            </NavLink>
          </li>
          <li>
            <NavLink  to='/update'>
              Update
            </NavLink>
          </li>
        </ul>
        <div className="nav__social">
          <ul>
            <li><a target="_blank" href="https://github.com/cannedyeti"><i className="fa fa-github" aria-hidden="true"></i></a></li>
            <li><a target="_blank" href="https://twitter.com/CannedYeti"><i className="fa fa-twitter" aria-hidden="true"></i></a></li>
            <li><a target="_blank" href="http://connorthedev.com"><i className="fa fa-at" aria-hidden="true"></i></a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Nav;
