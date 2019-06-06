import React, { Component } from 'react';
import RandomChampion from './RandomChampion';
import RandomItems from './random/RandomItems';
import RandomSumms from './random/RandomSumms';
const SMITECHANCE = 20; //Out of 100;


class UserView extends Component {
  constructor(props) {
    super(props);
    this.state = {
        selectedChampion: null,
        champArr: this.props.champArr,
        smite: false
    };
    this.getChampion = this.getChampion.bind(this);
    this.setSmite = this.setSmite.bind(this);
  }

  getChampion() {
    if(this.state.selectedChampion !== null) {
      this.setState({
        selectedChampion: null
      })
      setTimeout(()=> {
        var arr = this.props.champArr;
        var x = arr[Math.floor(Math.random()*arr.length)];
        this.setState({
          selectedChampion: x,
          smite: this.setSmite()
        })

      },1)
    } else {
      var arr = this.props.champArr;
      var x = arr[Math.floor(Math.random()*arr.length)];
      this.setState({
        selectedChampion: x,
        smite: this.setSmite()
      })
    }
  }

  setSmite() {
    if(Math.random() * 100 <= SMITECHANCE) {
      return true
    }
    return false;
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="user-view">
        <button onClick={this.getChampion} className="button button--brave"><span>Make a mother fucker brave</span></button>
          {!this.state.selectedChampion ? 
                <p>Please select a champion...</p> 
            : 
                <div>
                  <RandomChampion patch={this.props.patch} id={this.state.selectedChampion} />
                  <RandomSumms summsObj={this.props.summsObj} patch={this.props.patch} smiteBool={this.state.smite} />
                  <RandomItems itemsObj={this.props.itemObj} patch={this.props.patch} smiteBool={this.state.smite} />
                </div>
          }
      </div>
    );
  }
}

export default UserView;
