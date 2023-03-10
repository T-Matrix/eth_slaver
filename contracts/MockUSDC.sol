// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// etherscan: https://goerli.etherscan.io/address/0xcF18379257eAF734a7d7E1D4068163b3A4b021F8

contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "USDC") {
        _mint(msg.sender, 100*10**18);
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
