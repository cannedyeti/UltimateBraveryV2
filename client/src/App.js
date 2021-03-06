import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from "react-router-dom";
import $ from 'jquery';

// Components
import UltimateBravery from './components/ultimate-bravery/UltimateBravery';
import Nav from './components/Nav';
import DarkMode from './components/DarkMode';
import Home from './components/Home';
import Error from './components/Error';
import TeamGenerator from './components/team-generator/TeamGenerator';
import Update from './components/Update';
import './scss/app.scss';

// IMPORT ALL CSS
importAll(require.context('../src/styles/css/', false, /\.(css)$/));
importAll(require.context('../src/scss/', false, /\.(scss)$/));

// VARIABLES
const MAX_IMAGES_ON_TEAM_PICKER = ($(window).width()/128);

// FUNCTIONS
function importAll(r) {
  let images = [];
  r.keys().forEach(
      (item, index) => { 
          images[index] = r(item); 
      });
  return images;
}


class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          {/* <img alt="league-logo" className="league-logo" src={Logo} /> */}
          <Nav />
          <div className="l-constrain">
            <div className="content-container">
              <Switch>
                  <Route exact path='/' component={Home}/>
                  <Route exact path='/ultimate-bravery' component={UltimateBravery} />
                  <Route exact path='/team-generator' component={TeamGenerator} />
                  <Route exact path='/update' component={Update} />
                  {/* <Route exact path='/team-picker' render={(props) => <TeamPicker {...props} active={active} images={arr} />} /> */}
                  <Route component={Error} />
              </Switch>
            </div>
          </div>
          <DarkMode />
          {/* <Footer /> */}
        </div>
      </Router>
    );
  }
}

export default App;
