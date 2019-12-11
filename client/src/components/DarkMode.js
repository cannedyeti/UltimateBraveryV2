var React = require('react');

// FUNCTIONS

class DarkMode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.switchTheme = this.switchTheme.bind(this);
    }
    switchTheme(e) {
        console.log('changing')
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        else {
            document.documentElement.setAttribute('data-theme', 'light');
        }    
    }
    render() {
      return (
        <div className="theme-switch">
            <label className="theme-switch__checkbox" htmlFor="checkbox">
                <input onChange={this.switchTheme} type="checkbox" id="checkbox" />
                <div className="theme-switch__slider"></div>
            </label>
        </div>
      )
    }
  }
  module.exports = DarkMode;