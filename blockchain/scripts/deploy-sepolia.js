const hre = require("hardhat");

async function main() {
  console.log("Starting deployment to Sepolia testnet...\n");

  // Check if we're on the correct network
  const network = await ethers.provider.getNetwork();
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId.toString());

  if (network.chainId !== 11155111n) {
    console.error("\n❌ Error: This script is for Sepolia testnet only!");
    console.error("Please run with: npx hardhat run scripts/deploy-sepolia.js --network sepolia");
    process.exit(1);
  }

  // Get the deployer's address
  const [deployer] = await ethers.getSigners();
  console.log("\nDeploying contracts with account:", deployer.address);

  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  if (balance === 0n) {
    console.error("\n❌ Error: Account has no ETH!");
    console.error("Please fund your account with Sepolia ETH from a faucet:");
    console.error("- https://sepoliafaucet.com/");
    console.error("- https://www.alchemy.com/faucets/ethereum-sepolia");
    process.exit(1);
  }

  console.log("\nDeploying contracts...\n");

  // Deploy Identity contract
  console.log("1. Deploying Identity contract...");
  const Identity = await ethers.getContractFactory("Identity");
  const identity = await Identity.deploy();
  await identity.waitForDeployment();
  const identityAddress = await identity.getAddress();
  console.log("   ✓ Identity deployed to:", identityAddress);

  // Deploy Certificates contract
  console.log("\n2. Deploying Certificates contract...");
  const Certificates = await ethers.getContractFactory("Certificates");
  const certificates = await Certificates.deploy();
  await certificates.waitForDeployment();
  const certificatesAddress = await certificates.getAddress();
  console.log("   ✓ Certificates deployed to:", certificatesAddress);

  // Deploy Voting contract
  console.log("\n3. Deploying Voting contract...");
  const Voting = await ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();
  await voting.waitForDeployment();
  const votingAddress = await voting.getAddress();
  console.log("   ✓ Voting deployed to:", votingAddress);

  // Deploy ServiceRequests contract
  console.log("\n4. Deploying ServiceRequests contract...");
  const ServiceRequests = await ethers.getContractFactory("ServiceRequests");
  const serviceRequests = await ServiceRequests.deploy();
  await serviceRequests.waitForDeployment();
  const serviceRequestsAddress = await serviceRequests.getAddress();
  console.log("   ✓ ServiceRequests deployed to:", serviceRequestsAddress);

  // Summary
  console.log("\n" + "=".repeat(70));
  console.log("SEPOLIA DEPLOYMENT SUMMARY");
  console.log("=".repeat(70));
  console.log("Identity Contract:         ", identityAddress);
  console.log("Certificates Contract:     ", certificatesAddress);
  console.log("Voting Contract:           ", votingAddress);
  console.log("ServiceRequests Contract:  ", serviceRequestsAddress);
  console.log("=".repeat(70));

  console.log("\n✓ All contracts deployed to Sepolia testnet!");
  
  console.log("\nVerify contracts on Etherscan:");
  console.log("npx hardhat verify --network sepolia " + identityAddress);
  console.log("npx hardhat verify --network sepolia " + certificatesAddress);
  console.log("npx hardhat verify --network sepolia " + votingAddress);
  console.log("npx hardhat verify --network sepolia " + serviceRequestsAddress);

  console.log("\nUpdate frontend/.env:");
  console.log("VITE_IDENTITY_CONTRACT=" + identityAddress);
  console.log("VITE_CERTIFICATES_CONTRACT=" + certificatesAddress);
  console.log("VITE_VOTING_CONTRACT=" + votingAddress);
  console.log("VITE_SERVICE_REQUESTS_CONTRACT=" + serviceRequestsAddress);

  console.log("\nView on Etherscan:");
  console.log("https://sepolia.etherscan.io/address/" + identityAddress);
  console.log("https://sepolia.etherscan.io/address/" + certificatesAddress);
  console.log("https://sepolia.etherscan.io/address/" + votingAddress);
  console.log("https://sepolia.etherscan.io/address/" + serviceRequestsAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
