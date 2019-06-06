import ItemIcon from '../../icon-components/ItemIcon';
const React = require('react');


function randomProperty (obj) {
    var keys = Object.keys(obj)
    return obj[keys[ keys.length * Math.random() << 0]];
};

class RandomItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      randItems: ''
    };
    this.randomizeItems = this.randomizeItems.bind(this);
  }
  componentDidMount() {
    this.randomizeItems();
  }
  randomizeItems() {
      var itemArr = [];
      itemArr.push(randomProperty(this.props.itemsObj.boots));
      if(this.props.smiteBool) {
        itemArr.push(randomProperty(this.props.itemsObj.smite));
        for(var i=0;i<4;i++) {
          itemArr.push(randomProperty(this.props.itemsObj.all));
        }
      } else {
        for(var i=0;i<5;i++) {
          itemArr.push(randomProperty(this.props.itemsObj.all));
        }
      }
      this.setState({
        randItems: itemArr
      })
  }
  render() {
    return (
      <div className="items">
        {this.state.randItems ? 
          this.state.randItems.map((item, i) => (
            <ItemIcon patch={this.props.patch} key={i} data={item} />
          ))
        : 
          ''
        }
      </div>
    )
  }
}
export default RandomItems;