// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract Point is ERC20("TicTacToe Points", "TTTP"), Ownable {
    
    function mint(address to, uint amount) public onlyOwner {
        _mint(to, amount);
    }
    
}