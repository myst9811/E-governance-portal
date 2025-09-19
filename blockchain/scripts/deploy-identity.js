const hre = require("hardhat");

async function main() {
  const Identity = await hre.ethers.getContractFactory("Identity");
  const identity = await Identity.deploy();

  // ✅ Correct way in Hardhat v2
  await identity.waitForDeployment();

  console.log(`✅ Identity contract deployed to: ${await identity.getAddress()}`);
  console.log(`🔗 View on Etherscan: https://sepolia.etherscan.io/address/${await identity.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1; 

});
