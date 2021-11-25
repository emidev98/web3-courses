const routes = module.exports = require("next-routes")();

routes
    .add("/", "/index")
    .add("/campaigns/new", "/campaigns/NewCampaign")
    .add("/campaigns/:address", "/campaigns/Campaign")

module.exports = routes;