const hre = require("hardhat");

async function main() {
  console.log("Starting deployment of all contracts...\n");

  // Get the deployer's address
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString(), "\n");

  // Deploy Identity contract
  console.log("Deploying Identity contract...");
  const Identity = await ethers.getContractFactory("Identity");
  const identity = await Identity.deploy();
  await identity.waitForDeployment();
  const identityAddress = await identity.getAddress();
  console.log("✓ Identity contract deployed to:", identityAddress);

  // Deploy Certificates contract
  console.log("\nDeploying Certificates contract...");
  const Certificates = await ethers.getContractFactory("Certificates");
  const certificates = await Certificates.deploy();
  await certificates.waitForDeployment();
  const certificatesAddress = await certificates.getAddress();
  console.log("✓ Certificates contract deployed to:", certificatesAddress);

  // Deploy Voting contract
  console.log("\nDeploying Voting contract...");
  const Voting = await ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();
  await voting.waitForDeployment();
  const votingAddress = await voting.getAddress();
  console.log("✓ Voting contract deployed to:", votingAddress);

  // Deploy ServiceRequests contract
  console.log("\nDeploying ServiceRequests contract...");
  const ServiceRequests = await ethers.getContractFactory("ServiceRequests");
  const serviceRequests = await ServiceRequests.deploy();
  await serviceRequests.waitForDeployment();
  const serviceRequestsAddress = await serviceRequests.getAddress();
  console.log("✓ ServiceRequests contract deployed to:", serviceRequestsAddress);

  // Summary
  console.log("\n" + "=".repeat(70));
  console.log("DEPLOYMENT SUMMARY");
  console.log("=".repeat(70));
  console.log("Identity Contract:         ", identityAddress);
  console.log("Certificates Contract:     ", certificatesAddress);
  console.log("Voting Contract:           ", votingAddress);
  console.log("ServiceRequests Contract:  ", serviceRequestsAddress);
  console.log("=".repeat(70));

  console.log("\n✓ All contracts deployed successfully!");
  console.log("\nNext steps:");
  console.log("1. Copy the contract addresses above");
  console.log("2. Update frontend/.env with these addresses:");
  console.log("   VITE_IDENTITY_CONTRACT=" + identityAddress);
  console.log("   VITE_CERTIFICATES_CONTRACT=" + certificatesAddress);
  console.log("   VITE_VOTING_CONTRACT=" + votingAddress);
  console.log("   VITE_SERVICE_REQUESTS_CONTRACT=" + serviceRequestsAddress);
  console.log("\n3. Update frontend/src/contractConfig.ts with the new addresses");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
