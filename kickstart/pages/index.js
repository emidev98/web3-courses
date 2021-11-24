import React from "react";
import { Card } from "semantic-ui-react";
import { Link } from "../routes";
import AppLayout from "../components/AppLayout";
import factory from "../ethereum/factory";

class CampaignIndex extends React.Component {

    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();

        return { campaigns };
    }

    async componentDidMount() {
        console.log(this.props.campaigns)
    }

    renderCampaigns() {
        const items = this.props.campaigns.map( address => {
            return {
                header: address,
                description: <Link route={`/campaigns/${address}`}><a>View Campaign</a></Link>,
                fluid: true
            }
        })
        return <Card.Group items={items}></Card.Group>
    }

    render() {
        return (
            <AppLayout>                
                <h1>Open Kickstarts</h1>
                {this.renderCampaigns()}
            </AppLayout>
        );
    }
}

export default CampaignIndex;