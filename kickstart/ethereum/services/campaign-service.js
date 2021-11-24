import web3 from '../web3';
import Campaign from '../build/Campaign.json';

class CampaignService {

    static getCamping = (address) => {
        const contractInterface = JSON.parse(Campaign.interface);
        return new web3.eth.Contract(contractInterface, address);
    }
}

export default CampaignService;