import web3 from "./web3";
import CampaignFactory from './build/CampaignFactory.json';

const factoryInstance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0xfE807020a8911A9D0C8De0E183DB3AC088e17579'
);

export default factoryInstance;