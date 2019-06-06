const React = require('react');

class SummonerIcon extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    var imgUrl = `http://ddragon.leagueoflegends.com/cdn/${this.props.patch}/img/spell/${this.props.data.image.full}`;
    return (
      <div className="summoner__image">
        <img 
        src={imgUrl} 
        alt={this.props.data.name}
        />
      </div>
    )
  }
}
export default SummonerIcon;