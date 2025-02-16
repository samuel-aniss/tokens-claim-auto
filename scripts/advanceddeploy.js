const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contract with the account:", deployer.address);

  const AdvancedTokenAndEthTransfer = await hre.ethers.getContractFactory(
    "AdvancedTokenAndEthTransfer"
  );
  const contract = await AdvancedTokenAndEthTransfer.deploy();
  const deployedAddress = await contract.getAddress();

  console.log("Contract deployed to:", deployedAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
