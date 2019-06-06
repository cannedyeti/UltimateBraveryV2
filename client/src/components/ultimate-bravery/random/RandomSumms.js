import SummonerIcon from '../../icon-components/SummonerIcon';
const React = require('react');

function randomProperty (obj) {
    var keys = Object.keys(obj)
    return obj[keys[ keys.length * Math.random() << 0]];
};

class RandomItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sumOne: null,
      sumTwo: null
    };
    this.randomizeSumms = this.randomizeSumms.bind(this);
  }
  componentDidMount() {
    this.randomizeSumms();
  }
  randomizeSumms() {
    var o = this.props.summsObj.data;
    var sumOne;
    var sumTwo;
    var SRSums =  Object.keys(o).reduce(function(r, e) {
    if(o[e].modes.includes('CLASSIC') || o[e].name == 'Clarity') {
        r[e] = o[e];
    }

        return r;
    }, {});
    if(this.props.smiteBool) {
        sumOne = SRSums['SummonerSmite'];
        delete SRSums.SummonerSmite;
    } else {
        delete SRSums.SummonerSmite;
        sumOne =  randomProperty(SRSums);
        delete SRSums[sumOne.id];
    }
    sumTwo = randomProperty(SRSums);
    this.setState({
        sumOne: sumOne,
        sumTwo: sumTwo
    })
  }
  render() {
    return (
      <div className="summoners">
        {this.state.sumOne ? <SummonerIcon patch={this.props.patch} data={this.state.sumOne} /> : null}
        {this.state.sumTwo ? <SummonerIcon patch={this.props.patch} data={this.state.sumTwo}/> : null}
      </div>
    )
  }
}
export default RandomItems;