import React, { Component } from 'react';
import RandomChampion from './RandomChampion';


class UserView extends Component {
  constructor(props) {
    super(props);
    this.state = {
        selectedChampion: null,
        champArr: this.props.champArr
    };
    this.getChampion = this.getChampion.bind(this);
  }

  getChampion() {
    if(this.state.selectedChampion !== null) {
      this.setState({
        selectedChampion: null
      })
      setTimeout(()=> {
        var arr = this.props.champArr;
        var x = arr[Math.floor(Math.random()*arr.length)];
        console.log(x);
        this.setState({
          selectedChampion: x
        })
      },1)
    } else {
      var arr = this.props.champArr;
      var x = arr[Math.floor(Math.random()*arr.length)];
      this.setState({
        selectedChampion: x
      })
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="user">
        <button onClick={this.getChampion} className="brave-button"><span>Make a mother fucker brave</span></button>
          {!this.state.selectedChampion ? 
                <p>Please select a champion...</p> 
            : 
                <RandomChampion patch={this.props.patch} id={this.state.selectedChampion} />
          }
      </div>
    );
  }
}

export default UserView;
