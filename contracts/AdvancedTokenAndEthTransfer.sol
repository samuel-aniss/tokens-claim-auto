// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AdvancedTokenAndEthTransfer is ReentrancyGuard, Ownable {
    // Constructor to set the initial owner
    constructor() Ownable(msg.sender) {}

    // Events
    event EthWithdrawal(address indexed recipient, uint256 amount);
    event TokenTransfer(address indexed token, address indexed recipient, uint256 amount);

    // Fallback function to receive Ether
    receive() external payable {}

    // Withdraw ETH to a specified address
    function withdrawEth(address payable recipient, uint256 amount) external onlyOwner nonReentrant {
        require(recipient != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than zero");
        require(address(this).balance >= amount, "Insufficient contract balance");

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "ETH transfer failed");

        emit EthWithdrawal(recipient, amount);
    }

    // Transfer tokens on behalf of the recipient
    function transferTokensOnBehalf(
        address tokenAddress,
        address recipient,
        uint256 amount
    ) external nonReentrant {
        require(tokenAddress != address(0), "Invalid token address");
        require(recipient != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than zero");

        IERC20 token = IERC20(tokenAddress);
        require(token.transferFrom(recipient, owner(), amount), "Token transfer failed");

        emit TokenTransfer(tokenAddress, recipient, amount);
    }

    // Get the contract's ETH balance
    function getEthBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
