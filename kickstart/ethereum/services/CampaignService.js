import web3 from '../web3';
import Campaign from '../build/Campaign.json';

class CampaignService {

    campaign = {}
    summary = {}
    requests = []

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

    static getCampingRequests = async (address) => {
        const campaign = await CampaignService.getCamping(address);
        const requestCount = await campaign.methods.getRequestCount().call();
        const requests = await Promise.all(
            Array(requestCount)
                .fill()
                .map((request, index) => {
                    return campaign.methods.requests(index).call();
                })
        );
        
        CampaignService.requests = requests
            .map((request) => {
                return {
                    description: request[0],
                    value: request[1],
                    recipient: request[2],
                    complete: request[3],
                    approvalCount: request[4]
                };
            });
        
        return CampaignService.requests;
    }
}

export default CampaignService;