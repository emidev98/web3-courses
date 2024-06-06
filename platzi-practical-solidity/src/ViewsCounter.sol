// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract ViewsCounter {
    uint256 public views;
    address owner;

    constructor(uint256 initiViews) {
        views = initiViews;
        owner = msg.sender;
    }

    function incrementViews() public onlyOwner {
        views++;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Sender is no the contract owner");
        _;
    }
}
