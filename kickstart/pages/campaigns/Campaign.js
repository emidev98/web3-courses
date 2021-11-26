import React from 'react';
import { Button, Card, Grid, Icon, Segment } from 'semantic-ui-react';
import AppLayout from '../../components/AppLayout';
import CampaignContributeFrom from '../../components/CampaignContributeForm';
import CampaignService from '../../ethereum/services/CampaignService';
import web3 from '../../ethereum/web3';
import { Link } from "../../routes";

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
            header: web3.utils.fromWei(minimumContribution, 'ether') + ' (ether)',
            meta: 'Minimum Contribution',
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
            header: web3.utils.fromWei(balance, 'ether') + ' (ether)',
            meta: 'Campaign Balance',
            description: 'Amount of money that the campaign has available to spend.'
        }];

        return <Card.Group itemsPerRow={2} items={items} stackable></Card.Group>
    }

    render() {
        return (
            <AppLayout>
                <h3>Campaign</h3>
                <Grid>
                    <Grid.Column mobile={16} tablet={9} computer={11}>
                        {this.renderCards()}
                    </Grid.Column>

                    <Grid.Column mobile={16} tablet={7} computer={5}>
                        <Segment>
                            <CampaignContributeFrom campaign={this.props.campaign}/>
                        </Segment>
                        <Segment>
                            <Link route={`/campaigns/${this.props.campaign.options.address}/requests`}>
                                <Button primary fluid >
                                    <Icon name="eye"/>
                                    View requests
                                </Button>
                            </Link>
                        </Segment>
                    </Grid.Column>
                </Grid>
            </AppLayout>
        );
    }

}

export default Campaign;