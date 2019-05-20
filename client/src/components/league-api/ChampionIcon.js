const React = require('react');


class ChampionIcon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            champion: this.props.champion
        };
    }
    componentDidMount() {
        
    }

    render() {
        var imgUrl = 'http://ddragon.leagueoflegends.com/cdn/' + this.props.patch + '/img/champion/' + this.props.champion.image.full;
        return (
        <div className="champion">
            <img 
            style={this.props.champId.includes(this.props.champion.id) ? {filter: 'grayscale(0%)'} : {filter: 'grayscale(100%)'} }
            src={imgUrl} 
            onClick={this.props.onSelect.bind(null, this.props.champion.id)}
            alt={this.props.champion.name}
            />
        </div>
        )
    }
}
module.exports = ChampionIcon;