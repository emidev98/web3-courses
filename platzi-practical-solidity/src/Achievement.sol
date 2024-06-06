// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract Achievement is ERC721("TicTacToe Achievement","TTTA"), Ownable {
    uint lastIndex;

    function emitAchievement(address user) public onlyOwner returns(uint) {
        uint index = lastIndex + 1;
        _safeMint(user, index);
        return index;
    }
}