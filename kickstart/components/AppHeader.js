import React from 'react';
import { Icon, Menu } from 'semantic-ui-react';

class AppMenu extends React.Component {

    render() {
        return (
            <Menu>
                <Menu.Menu position="left">
                    <Menu.Item>DecentryFi Kickstart</Menu.Item>
                </Menu.Menu>

                <Menu.Menu position="right">
                    <Menu.Item>
                        <Icon name='list'/>
                        Campaigns
                    </Menu.Item>
                    <Menu.Item>
                        <Icon name='plus'/>
                        Campaign
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        );
    }
}

export default AppMenu;