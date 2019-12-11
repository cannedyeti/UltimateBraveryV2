const React = require('react');
var NavLink = require('react-router-dom').NavLink;


class Update extends React.Component {
    constructor() {
        super();
        this.state = {
            patch: null
        };
    }
    componentDidMount() {
        fetch('/updatedb')
            .then(res => {
                console.log(res);
                return res.json()
            })
            .then(obj => {
                var data = obj;
                console.log('data', data)
                var p = JSON.parse(data);
                this.setState({
                    patch: p.patch
                })
            });
        }

    render() {
        return (
        <div>
            <h4>Currently updated to patch: {this.state.patch ? this.state.patch : ''}</h4>
        </div>
        )
    }
}
module.exports = Update;
