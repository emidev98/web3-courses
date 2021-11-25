import web3 from '../web3';
import Campaign from '../build/Campaign.json';

class CampaignService {

    campaign = {}
    summary = {}

    static getCamping = (address) => {
        const contractInterface = JSON.parse(Campaign.interface);
        CampaignService.campaign = new web3.eth.Contract(contractInterface, address);
        return CampaignService.campaign;
    }

    static getCampingSummary = async (address) => {
        CampaignService.campaign = await CampaignService.getCamping(address);
        const summary = await CampaignService.campaign.methods.getSummary().call();
        
        CampaignService.summary = {
            campaign: CampaignService.campaign,
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4]
        };

        return CampaignService.summary;
    }
}

export default CampaignService;