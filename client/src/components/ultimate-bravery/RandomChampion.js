import React, { Component } from 'react';


class RandomChampion extends Component {
  constructor() {
    super();
    this.state = {

    };
  }

  componentDidMount() {
  }

  render() {
    var imgUrl = 'http://ddragon.leagueoflegends.com/cdn/' + this.props.patch + '/img/champion/' + this.props.id + '.png';
    return (
      <div className="random-champion"> 
        <div className="champion__image">
            <img 
            src={imgUrl} 
            alt={this.props.id}
            />
        </div>

      </div>
    );
  }
}

export default RandomChampion;
