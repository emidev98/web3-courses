// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;


contract CampaignFactory {

    Campaign[] public campaigns;
    
    function createCampaign(string memory _id, string memory _title, string memory _description, uint _fundingGoal) public {
        Campaign campaign = new Campaign(_id, _title, _description, _fundingGoal);
        campaigns.push(campaign);
    }
}

contract Campaign {

    enum State { Open, Closed }
    mapping (address => uint) public contribution;
    struct Data {
        string id;
        string title;
        string description;
        address payable author;
        uint fundingGoal;
        State state;
        uint funds;
    }
    Data data;

    event FundsReceived(string id, uint funds);
    event CampaingStateChanged(string id, State newState);
    event CampaignCreated(string id, string title, string description, uint fundingGoal);

    constructor(string memory _id, string memory _title, string memory _description, uint _fundingGoal) {
        data = Data(
            _id, 
            _title, 
            _description, 
            payable(msg.sender),
            _fundingGoal,
            State.Open,
            0
        );
    }

    function fundProject() public payable {
        require(data.state == State.Closed, "Campaign cannot receive funds");
        require(msg.value > 0, "Only positive values can be send");
        
        data.author.transfer(msg.value);
        data.funds += msg.value;
        contribution[msg.sender] += msg.value;
        
        emit FundsReceived(data.id, data.funds);
    }

    function changeProjectState(State newState) public onlyOwner{
        require(data.state != newState, "Campaign state must be different");
        data.state = newState;

        emit CampaingStateChanged(data.id, data.state);
    }

    function getProjectInfo() public view returns (
        string memory,
        string memory,
        string memory,
        address,
        uint,
        State,
        uint
    ){
        return (
            data.id,
            data.title,
            data.description,
            data.author,
            data.fundingGoal,
            data.state,
            data.funds
        );
    }

    modifier onlyOwner() {
        require(msg.sender == data.author, "Only owner can execute this function");
        _;
    }

    modifier onlyPositiveValue() {
        _;
    }
}