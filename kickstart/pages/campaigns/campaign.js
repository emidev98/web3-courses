import React from 'react';
import AppLayout from '../../components/AppLayout';
import CampaignService from '../../ethereum/services/campaign-service';

class Campaign extends React.Component {
    
    static getInitialProps(props) {
        const address = props.query.address;        
        const campaign = CampaignService.getCamping(address);
        return campaign.methods.getSummary().call();
    }

    render() {
        return (
            <AppLayout> 
                {JSON.stringify(this.props)}   
            </AppLayout>
        );
    }

}

export default Campaign;