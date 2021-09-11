pragma solidity 0.4.17;

contract Lottery {
    address public manager;
    address public winner;
    address[] public players;

    function Lottery() public {
        manager = msg.sender;
    }

    function enter() public payable {
        // Validate that the mimimum amount of eth 
        // send to the Lottery contract in order to
        // participate is 0.01 ether
        require(msg.value > .01 ether);

        players.push(msg.sender);
    }

    function pickWinner() public onlyManagerCanCall{
        uint index = random() % players.length;
        winner = players[index]; 
        winner.transfer(this.balance);
        players = new address[](0);
    }

    function random() private view returns (uint) {
        // Creates an SHA-3 hash based on 
        // block difficulty, current time and players
        return uint(keccak256(block.difficulty, now, players));
    }
    
    // Modifiers are used to to change the behiavour 
    // of a function on a declarative way priory of
    // execution of the code inside the funcion
    modifier onlyManagerCanCall() {
        // Validate that the sender is the manager
        require(msg.sender == manager);
        _;
    }

    function getPlayers() public view returns (address[]) {
        return players;
    }
}