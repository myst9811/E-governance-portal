const hre = require("hardhat");

async function main() {
  const Egov = await hre.ethers.getContractFactory("Egov");
  const egov = await Egov.deploy("Welcome to the E-Governance Portal!");

  await egov.deployed();

  console.log(`✅ Egov contract deployed to: ${egov.address}`);
}

// Run the script and handle errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
