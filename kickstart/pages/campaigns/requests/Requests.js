import React from 'react';
import AppLayout from '../../../components/AppLayout';
import { Input, Form, Button, Message, Grid, Segment, Icon, Menu } from 'semantic-ui-react';
import { Router } from '../../../routes';
import web3 from '../../../ethereum/web3';
import CampaignService from '../../../ethereum/services/CampaignService';
import { Link } from "../../../routes";


class Requests extends React.Component {
    
    static async getInitialProps(props) {
        const address = props.query.address;
        const requests = await CampaignService.getCampingRequests(address);
        console.log(requests)
        return { address, requests };
    }
    

    render() {
        return (    
            <AppLayout>
                <Menu borderless={true}
                    style={{ border: 'none', boxShadow: 'none' }}>
                    <Menu.Menu position="left">
                        <h3>Campaign requests</h3>
                    </Menu.Menu>

                    <Menu.Menu position="right">
                        <Link route={`/campaigns/${this.props.address}/requests/new`}>
                            <Button primary fluid>
                                <Icon name="plus"/>
                                Request
                            </Button>
                        </Link>
                    </Menu.Menu>
                </Menu>

                BuildTable
            </AppLayout>
        );
    };

}

export default Requests; 