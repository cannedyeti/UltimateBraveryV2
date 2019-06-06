import React, { Component } from 'react';
import ChampionIcon from './ChampionIcon';

class ChampionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
        champions: this.props.champions,
        items: this.props.items,
        patch: this.props.patch,
        champIdArray: []
    };
    this.changeChamp = this.changeChamp.bind(this);
  }

  changeChamp(champId) {
    var array = this.state.champIdArray || [];
    if(array.includes(champId)) {
      var remove = array.indexOf(champId)
      array.splice(remove,1);
      this.props.getChamp(array)
      this.setState({
        champIdArray: array
      })
    } else if (!array.includes(champId)) {
      var newArr = array.concat(champId);
      this.props.getChamp(newArr)
      this.setState({
        champIdArray: newArr
      })
    }
  }

  componentDidMount() {
  }

  render() {
    var champIds = []
    for (var c in this.state.champions.data) {
      champIds.push(this.state.champions.data[c].id)
    }
    var currentChamps = this.state.champIdArray;
    return (
      <div className="champion-list">
        <div className="champion-list__button-container">
          <button 
            className="button"
            onClick={() => {
              this.props.getChamp(champIds)
              this.setState({
                champIdArray: champIds
              })
            }}><span>Select All Champions</span>
          </button>
          <button 
            className="button"
            onClick={() => {
              this.props.getChamp([])
              this.setState({
                champIdArray: []
              })  
            }}><span>Deselect All Champions</span></button>
        </div>
        <div className="champion__container">
          {this.state.champions ? 
            Object.keys(this.state.champions.data).map((keyName, i) => (
              <ChampionIcon onSelect={this.changeChamp} champId={currentChamps} champion={this.state.champions.data[keyName]} patch={this.state.patch} index={i} key={i} />
            ))
            : 
            ''
          }
        </div>
      </div>
    );
  }
}

export default ChampionList;
