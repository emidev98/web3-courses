import React from 'react';
import { Card, Grid } from 'semantic-ui-react';
import AppLayout from '../../components/AppLayout';
import CampaignContributeFrom from '../../components/CampaignContributeForm';
import CampaignService from '../../ethereum/services/CampaignService';
import web3 from '../../ethereum/web3';

class Campaign extends React.Component {
    
    static getInitialProps(props) {
        const address = props.query.address;
        return CampaignService.getCampingSummary(address);
    }

    renderCards() {
        const {
            balance,
            manager,
            minimumContribution,
            requestsCount,
            approversCount,
        } = this.props;

        const items = [{
            header: manager,
            meta: 'Address of Manager',
            description: 'The manager created this campaign to request money and build a project.',
            style: {
                overflowWrap: 'break-word'
            }
        },{
            header: web3.utils.fromWei(minimumContribution, 'ether'),
            meta: 'Minimum Contribution (ether)',
            description: 'Amount of minimum contribution you need to join the campign.',
            style: {
                overflowWrap: 'break-word'
            }
        },{
            header: requestsCount,
            meta: 'Number or Requests',
            description: 'Requests tries to withdrow money from the contract but needs the approvals of the contributors.'
        },{
            header: approversCount,
            meta: 'Number of Approvers',
            description: 'Number of people that already donated to this campaign.'
        },{
            header: web3.utils.fromWei(balance, 'ether'),
            meta: 'Campaign Balance (ether)',
            description: 'Amount of money that the campaign has available to spend.'
        }];

        return <Card.Group itemsPerRow={2} items={items} stackable></Card.Group>
    }

    render() {
        return (
            <AppLayout>
                <h3>Campaign</h3>
                <Grid>
                    <Grid.Column mobile={16} tablet={10} computer={12}>
                        {this.renderCards()}
                    </Grid.Column>

                    <Grid.Column mobile={16} tablet={6} computer={4}>
                        <CampaignContributeFrom campaign={this.props.campaign}/>
                    </Grid.Column>
                </Grid>
            </AppLayout>
        );
    }

}

export default Campaign;