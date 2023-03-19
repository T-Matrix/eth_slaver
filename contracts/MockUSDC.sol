// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// https://goerli.etherscan.io/address/0x8e0a936ec7ef23ef2a06bb9cdb628ee6ff29cd7d#code

// USDC 和 USDT 都是 6 位小数

contract MockERC20 is ERC20 {
    
    uint8 internal immutable _decimals;

    constructor(string memory name_, string memory symbol_, uint8 decimals_) ERC20(name_, symbol_) {
        _decimals = decimals_;
    }

    function mint(address usr_, uint256 amount_) public {
        _mint(usr_, amount_);
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }
}
