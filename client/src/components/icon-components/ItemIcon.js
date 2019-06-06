const React = require('react');

class ItemIcon extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    var imgUrl = `http://ddragon.leagueoflegends.com/cdn/${this.props.patch}/img/item/${this.props.data.image.full}`;
    return (
      <div className="item__image">
        <img 
        src={imgUrl} 
        alt={this.props.data.name}
        />
      </div>
    )
  }
}
export default ItemIcon;