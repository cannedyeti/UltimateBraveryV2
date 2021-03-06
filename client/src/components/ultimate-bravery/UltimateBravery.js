import React, { Component } from 'react';
import ChampionList from '../league-api/ChampionList';
import UserView from './UserView';
const removeNames = ['Enchantment: Warrior', "Enchantment: Cinderhulk", "Enchantment: Runic Echoes", "Enchantment: Bloodrazor", "Spear of Shojin", "Zz'Rot Portal", "Archangel's Staff (Quick Charge)", "Manamune (Quick Charge)", "Rod of Ages (Quick Charge)", "Archangel's Staff", "Manamune"]

class UltimateBravery extends Component {
  constructor() {
    super();
    this.state = {
        champions: '',
        items: '',
        patch: '',
        runes: '',
        summs: '',
        champArr: []
    };
    this.getChampions = this.getChampions.bind(this);
    this.getUltimateBraveryItems = this.getUltimateBraveryItems.bind(this)
  }


  componentDidMount() {
    fetch('/db')
      .then(res => {
          return res.json()
        })
        .then(obj => {
            var i = JSON.parse(obj.items.data);
            return this.getUltimateBraveryItems(i.data, obj);
        }).then(x => {
          this.setState({
            items: x.items,
            champions: JSON.parse(x.champions.data),
            runes: JSON.parse(x.runes.data),
            summs: JSON.parse(x.summs.data),
            patch: x.patch.patch
          })
        })
  }

  getChampions(arr) {
    this.setState({
      champArr: arr
    })
  }

  getUltimateBraveryItems(itemsData, obj){
    var items = itemsData;
    var itemsObj = {
      support: {},
      smite: {},
      boots: {},
      all: {}
    };
    Object.keys(items).reduce(function(r, e) {
      // checking to see if item is on summ rift
      if (items[e].maps['11']) {
        // getting rid of consumables
        if(!items[e].consumed) {
          // getting rid of components remove trinkets remove ornn items removing champ specific items
          if(!items[e].into && !items[e].colloq.includes('Ornn') && !items[e].colloq.includes('ornn') && !items[e].requiredChampion && !items[e].tags.includes('Lane') && !items[e].tags.includes('Consumable') && !items[e].tags.includes('Trinket') && !items[e].name.includes('Siege')){
            // if this is a support item
            if(e == 3069 || e == 3401 || e == 3092) {
              itemsObj.support[e] = items[e]
              // else if it's a smite item
            } else if (items[e].name.includes('Enchantment') && items[e].effect)  {
              itemsObj.smite[e] = items[e]
              // else if it's boots
            } else if (items[e].tags.includes('Boots')) {
              itemsObj.boots[e] = items[e];
            } else if (!removeNames.includes(items[e].name)) {
              itemsObj.all[e] = items[e];
            }
          }
        }
      }
      // return r;
    }, {})
    obj.items = itemsObj;
    return obj;
  }

  render() {
    return (
      <div>
        <div className="content__title">Ultimate Bravery</div>
          <div className="ultimate-bravery">
          <UserView patch={this.state.patch} itemObj={this.state.items} summsObj={this.state.summs} runesObj={this.state.runes} champArr={this.state.champArr} />
          {this.state.champions ? 
              <ChampionList  getChamp={this.getChampions} items={this.state.items} champions={this.state.champions} patch={this.state.patch} />
          :
              null
          }
        </div>
      </div>
    );
  }
}

export default UltimateBravery;
