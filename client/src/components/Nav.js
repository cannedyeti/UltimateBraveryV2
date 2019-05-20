var React = require('react');
var NavLink = require('react-router-dom').NavLink;

function Nav () {
  return(
    <ul className='nav'>
      <li>
        <NavLink exact activeClassName='active' to='/'>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink  to='/champion-list'>
          Ultimate Bravery
        </NavLink>
      </li>
      <li>
        <NavLink  to='/update'>
          Update
        </NavLink>
      </li>
    </ul>
  )
}

export default Nav;
