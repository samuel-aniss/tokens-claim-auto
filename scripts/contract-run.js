const { ethers } = require("ethers");
require("dotenv").config(); // Load environment variables

// Configuration
const providerUrl = process.env.PROVIDER_URL; // Use environment variables
const privateKey = process.env.PRIVATE_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS;
const tokenAddress = process.env.TOKEN_ADDRESS;
const recipientAddress = process.env.RECIPIENT_ADDRESS;

// Initialize provider and wallet
const provider = new ethers.JsonRpcProvider(providerUrl);
const wallet = new ethers.Wallet(privateKey, provider);

// Contract ABIs
const contractABI =
  require("./artifacts/contracts/AdvancedTokenAndEthTransfer.sol/AdvancedTokenAndEthTransfer.json").abi;
const tokenABI =
  require("@openzeppelin/contracts/build/contracts/ERC20.json").abi;

// Initialize contracts
const contract = new ethers.Contract(contractAddress, contractABI, wallet);
const token = new ethers.Contract(tokenAddress, tokenABI, wallet);

// Transfer ETH to the contract
async function transferEthToContract(amountInEther) {
  const tx = {
    to: contractAddress,
    value: ethers.parseEther(amountInEther),
  };

  console.log(`Sending ${amountInEther} ETH to the contract...`);
  const sendTx = await wallet.sendTransaction(tx);
  await sendTx.wait();
  console.log(`Transaction hash: ${sendTx.hash}`);
}

// Withdraw ETH from the contract
async function withdrawEthFromContract(recipientAddress, amountInEther) {
  const amountInWei = ethers.parseEther(amountInEther);

  console.log(`Withdrawing ${amountInEther} ETH to ${recipientAddress}...`);
  const withdrawTx = await contract.withdrawEth(recipientAddress, amountInWei);
  await withdrawTx.wait();
  console.log(`Transaction hash: ${withdrawTx.hash}`);
}

// Approve the contract to spend tokens
async function approveTokenSpending(recipientPrivateKey, amountInTokens) {
  const recipientWallet = new ethers.Wallet(recipientPrivateKey, provider);
  const recipientTokenContract = new ethers.Contract(
    tokenAddress,
    tokenABI,
    recipientWallet
  );

  const amountInWei = ethers.parseUnits(amountInTokens, 18);

  console.log(`Approving contract to spend ${amountInTokens} tokens...`);
  const approveTx = await recipientTokenContract.approve(
    contractAddress,
    amountInWei
  );
  await approveTx.wait();
  console.log(`Transaction hash: ${approveTx.hash}`);
}

// Transfer tokens on behalf of the recipient
async function transferTokensOnBehalf(recipientAddress, amountInTokens) {
  const amountInWei = ethers.parseUnits(amountInTokens, 18);

  console.log(
    `Transferring ${amountInTokens} tokens from ${recipientAddress} to owner...`
  );
  const transferTx = await contract.transferTokensOnBehalf(
    tokenAddress,
    recipientAddress,
    amountInWei
  );
  await transferTx.wait();
  console.log(`Transaction hash: ${transferTx.hash}`);
}

// Main function
async function main() {
  try {
    await transferEthToContract("0.001");
    await withdrawEthFromContract(recipientAddress, "0.00005");
    await approveTokenSpending(process.env.RECIPIENT_PRIVATE_KEY, "0.000001");
    await transferTokensOnBehalf(recipientAddress, "0.000001");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the script
main();
