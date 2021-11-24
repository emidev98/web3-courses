const routes = module.exports = require("next-routes")();

routes
    .add("/", "/index")
    .add("/campaigns/new", "/campaigns/new")
    .add("/campaigns/:address", "/campaigns/campaign")

module.exports = routes;