import React, { Component } from 'react';
import ChampionList from '../league-api/ChampionList';
import UserView from './UserView';

class UltimateBravery extends Component {
  constructor() {
    super();
    this.state = {
        champions: '',
        items: '',
        patch: '',
        champArr: []
    };
    this.getChampions = this.getChampions.bind(this);
  }


  componentDidMount() {
    fetch('/api/db')
      .then(res => {
          console.log('UB res', res)
          res.json()
        })
        .then(obj => {
            console.log('object', obj)
            this.setState({
                items: JSON.parse(obj.items.data),
                champions: JSON.parse(obj.champions.data),
                patch: obj.patch.patch
            })
        });
  }

  getChampions(arr) {
    this.setState({
      champArr: arr
    })
  }

  render() {
    if (this.state) {
        console.log("this state", (this.state))
    }
    return (
      <div className="ultimate-bravery">
        <UserView patch={this.state.patch} champArr={this.state.champArr} />
        {this.state.champions ? 
            <ChampionList  getChamp={this.getChampions} items={this.state.items} champions={this.state.champions} patch={this.state.patch} />
        :
            null
        }
      </div>
    );
  }
}

export default UltimateBravery;
