// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// etherscan : https://goerli.etherscan.io/address/0xE96BE05BF5AD8e9701d6EbAf843Cc795df40Ffe5#writeContract

interface WharfInterface {
    
    // event PayEth(address indexed from, uint256 amount, string orderId);
    // event WithdrawEth(address indexed to, uint256 amount, string billId);

    event PayERC20(address indexed from, uint256 amount, string orderId, address indexed tokenAddress);
    event WithdrawERC20(address indexed to, uint256 amount, string billId, address indexed tokenAddress);
    event RefundERC20(address indexed to, uint256 amount, string billId, address indexed tokenAddress);
    
    // orderId 中心化系统订单ID
    // function payEth(string calldata orderId) payable external;
    // amount 提现金额
    // billId 中心化系统结算ID
    // function withdrawEth(uint256 amount, string calldata billId) external;

    // from 支出钱包地址
    // amount 支出金额
    // orderId 中心化系统订单ID 发出事件需要
    // tokenAdress erc20 token 合约地址
    function payERC20(uint256 amount, string calldata orderId, address tokenAddress) external;
    function payERC20From(address from, uint256 amount, string calldata orderId, address tokenAddress) external;

    
    // amount 提现金额
    // currency erc20 合约地址
    // billId 中心化系统结算ID
    function withdrawERC20(uint256 amount, string calldata billId, address tokenAddress) external;

    // frome : 发起退款的账户
    // to : 退款地址
    // amount : 退款金额
    // billId : 账单 Id
    // tokenAdress erc20 token 合约地址
    function refundERC20(address to, uint256 amount, string calldata billId, address tokenAddress) external;
    function refundERC20From(address from, address to, uint256 amount, string calldata billId, address tokenAddress) external;
}

library BeeCheck {
    function containsKey(mapping(address => bool) storage aMap, address aKey) internal view returns (bool) {
        return aMap[aKey];
    }
}

contract BeeWharf is WharfInterface, Ownable {

    using BeeCheck for mapping (address => bool);
    // token address => support ?
    mapping (address => bool) private tokenSupported;
    // token address --> totalBalance ?
    mapping (address => uint256) private totalBalances;

    constructor () {
        // Ethereum USDT
        tokenSupported[0xdAC17F958D2ee523a2206206994597C13D831ec7] = true;
        // Ethereum USDC
        tokenSupported[0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48] = true;
    }

    // 支持新的 token 支付
    function addNewSupportToken(address tokenAddress) external onlyOwner {
        if (tokenSupported.containsKey(tokenAddress) == false) {
            tokenSupported[tokenAddress] = true;
        }
    }

    function balanceOf(address tokenAddress) external view returns (uint256) {
        require(tokenSupported.containsKey(tokenAddress), "Unsurpported token!");
        return totalBalances[tokenAddress];
    }

    // from 支出钱包地址
    // amount 支出金额
    // orderId 中心化系统订单ID 发出事件需要
    // currency erc20 合约地址
    function payERC20(
        uint256 amount, 
        string calldata orderId, 
        address tokenAddress
        ) external {
        this.payERC20From(msg.sender, amount, orderId, tokenAddress);
    }

    function payERC20From(
        address from, 
        uint256 amount, 
        string calldata orderId, 
        address tokenAddress
        ) external {
        require(tokenSupported.containsKey(tokenAddress), "Unsurpported token!");
        require(IERC20(tokenAddress).balanceOf(from) >= amount, "Insufficient balance funds");
        require(IERC20(tokenAddress).transferFrom(from, address(this), amount));
        totalBalances[tokenAddress] += amount;
        emit PayERC20(from, amount, orderId, tokenAddress);
    }

    function withdrawERC20(
        uint256 amount, 
        string calldata billId,
        address tokenAddress
        ) external onlyOwner {
        require(tokenSupported.containsKey(tokenAddress), "Not supported token");
        require(totalBalances[tokenAddress] >= amount, 'Insufficient funds');
        require(IERC20(tokenAddress).transfer(msg.sender, amount));
        totalBalances[tokenAddress] -= amount;
        emit WithdrawERC20(msg.sender, amount, billId, tokenAddress);
    }

    function refundERC20(
        address to, 
        uint256 amount, 
        string calldata billId, 
        address tokenAddress
        ) external onlyOwner {
        this.refundERC20From(address(this), to, amount, billId, tokenAddress);
    }

    function refundERC20From(
        address from, 
        address to, 
        uint256 amount, 
        string calldata billId, 
        address tokenAddress
        ) external onlyOwner {
        require(tokenSupported.containsKey(tokenAddress), "Unsurpported token!");
        require(IERC20(tokenAddress).balanceOf(from) >= amount, "Insufficient balance funds");
        require(IERC20(tokenAddress).transferFrom(from, to, amount));
        if (from == address(this)) {
            totalBalances[tokenAddress] -= amount;
        }
        emit RefundERC20(to, amount, billId, tokenAddress);
    }

}