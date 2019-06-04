import React from 'react'
import { Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

class NavBar extends React.Component {
    state = {};

    handleItemClick = (e, { name }) =>
        this.setState({ activeItem: name });

    render() {
        const { activeItem } = this.state;
        return (
            <Menu>
                <Menu.Item
                    as={Link} to={'/OpenLRDemo/'}
                    name='OpenLRDemo'
                    active={activeItem === 'OpenLRDemo'}
                    onClick={this.handleItemClick}
                >
                    OpenLR demo page
                </Menu.Item>
                <Menu.Item
                    as={Link} to={'/DiscoveryDemo/'}
                    name='DiscoveryDemo'
                    active={activeItem === 'DiscoveryDemo'}
                    onClick={this.handleItemClick}
                >
                    Dataset discovery demo page
                </Menu.Item>
            </Menu>
        )
    }
}

export default NavBar