// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract Marketplace is Ownable {
    mapping(uint => uint) higherBid;
    mapping(uint => address) latestBidder;
    IERC721 achievements;
    IERC20 points;

    constructor(address achievementsAddress, address pointsAddress) {
        achievements = IERC721(achievementsAddress);
        points = IERC20(pointsAddress);
    }

    function publish(uint pointId, uint price) public {
        require(higherBid[pointId] == 0, "Token is already on sale");
        require(price > 0);
        require(
            achievements.getApproved(pointId) == address(this),
            "Marketplace is not approved to sell this token"
        );

        higherBid[pointId] = price;
        latestBidder[pointId] = address(0);
    }

    function bid(uint pointId, uint price) public {
        require(higherBid[pointId] > 0, "Token is not on sale");
        require(
            price > higherBid[pointId],
            "Bid must be higher than the current price"
        );
        require(
            points.allowance(msg.sender, address(this)) == price,
            "Insufficient allowance"
        );

        latestBidder[pointId] = msg.sender;
        higherBid[pointId] = price;
    }

    function finalizeBid(uint pointId) public {
        require(higherBid[pointId] > 0, "No bids for this token");
        require(
            points.allowance(latestBidder[pointId], address(this)) >
                higherBid[pointId],
            "You are not the owner of this token"
        );
        require(
            achievements.getApproved(pointId) == address(this),
            "Marketplace is not approved to sell this token"
        );

        points.transferFrom(
            latestBidder[pointId],
            achievements.ownerOf(pointId),
            higherBid[pointId]
        );

        achievements.transferFrom(
            achievements.ownerOf(pointId),
            latestBidder[pointId],
            pointId
        );
        higherBid[pointId] = 0;
    }
}
