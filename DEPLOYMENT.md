# eGov Portal - Deployment Guide

This guide will help you deploy the eGov Portal smart contracts and configure the frontend application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Running Tests](#running-tests)
- [Deploying to Sepolia Testnet](#deploying-to-sepolia-testnet)
- [Frontend Configuration](#frontend-configuration)
- [Verifying Contracts](#verifying-contracts)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- Node.js (v18 or higher)
- npm or yarn
- MetaMask browser extension
- Git

### Required Accounts

- MetaMask wallet with private key
- Infura account (for RPC endpoints) - [Sign up here](https://infura.io/)
- Etherscan API key (for contract verification) - [Get here](https://etherscan.io/apis)

---

## Local Development Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/myst9811/E-governance-portal.git
cd egov-portal

# Install blockchain dependencies
cd blockchain
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

#### Blockchain Configuration

Copy the example environment file:

```bash
cd blockchain
cp .env.example .env
```

Edit `blockchain/.env` and add your credentials:

```env
# Your wallet private key (64 hex characters, no 0x prefix)
PRIVATE_KEY=your_64_character_private_key_here

# Sepolia Testnet RPC URL
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Polygon Mumbai Testnet RPC URL (deprecated, use Amoy)
POLYGON_RPC_URL=https://polygon-mumbai.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Etherscan API Key
ETHERSCAN_API_KEY=your_etherscan_api_key

# PolygonScan API Key
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

**⚠️ SECURITY WARNING**: Never commit your `.env` file to version control!

---

## Running Tests

### Run All Tests

```bash
cd blockchain
npx hardhat test
```

### Run Tests with Gas Report

```bash
REPORT_GAS=true npx hardhat test
```

### Run Specific Test File

```bash
npx hardhat test test/Identity.test.js
npx hardhat test test/Certificates.test.js
npx hardhat test test/Voting.test.js
npx hardhat test test/ServiceRequests.test.js
```

### Expected Output

All 93 tests should pass:

- ✓ Identity Contract: 14 tests
- ✓ Certificates Contract: 20 tests
- ✓ Voting Contract: 24 tests
- ✓ ServiceRequests Contract: 26 tests
- ✓ Lock Contract: 9 tests (example)

---

## Deploying to Local Hardhat Network

### 1. Start Local Hardhat Node (Optional)

In one terminal:

```bash
cd blockchain
npx hardhat node
```

This starts a local Ethereum node at `http://127.0.0.1:8545` with 20 pre-funded accounts.

### 2. Deploy Contracts

In another terminal:

```bash
cd blockchain
npx hardhat run scripts/deploy-all.js --network hardhat
```

### Expected Output

```
Starting deployment of all contracts...

Deploying contracts with account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Account balance: 10000000000000000000000

✓ Identity contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
✓ Certificates contract deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
✓ Voting contract deployed to: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
✓ ServiceRequests contract deployed to: 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9

✓ All contracts deployed successfully!
```

---

## Deploying to Sepolia Testnet

### 1. Get Sepolia ETH

Your wallet needs Sepolia testnet ETH for deployment. Get free testnet ETH from:

- [Alchemy Sepolia Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)

You'll need at least **0.1 Sepolia ETH** for deployment.

### 2. Verify Configuration

Ensure your `blockchain/.env` has:

- Valid 64-character private key
- Sepolia RPC URL
- Etherscan API key

### 3. Deploy to Sepolia

```bash
cd blockchain
npx hardhat run scripts/deploy-sepolia.js --network sepolia
```

### 4. Save Contract Addresses

The deployment script will output contract addresses. **Save these!** You'll need them for frontend configuration.

Example output:

```
SEPOLIA DEPLOYMENT SUMMARY
======================================================================
Identity Contract:          0x1234567890123456789012345678901234567890
Certificates Contract:      0x2345678901234567890123456789012345678901
Voting Contract:            0x3456789012345678901234567890123456789012
ServiceRequests Contract:   0x4567890123456789012345678901234567890123
======================================================================
```

---

## Frontend Configuration

### 1. Configure Contract Addresses

Copy the example environment file:

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env` with your deployed contract addresses:

**For Local Development:**

```env
VITE_IDENTITY_CONTRACT=0x5FbDB2315678afecb367f032d93F642f64180aa3
VITE_CERTIFICATES_CONTRACT=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
VITE_VOTING_CONTRACT=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
VITE_SERVICE_REQUESTS_CONTRACT=0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
VITE_INFURA_KEY=your_infura_project_id
```

**For Sepolia Testnet:**
Replace with the addresses from your Sepolia deployment.

### 2. Run Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 3. Connect MetaMask

1. Open the application in your browser
2. Click "Connect Wallet"
3. Approve the connection in MetaMask
4. Ensure you're on the correct network (Localhost or Sepolia)

---

## Verifying Contracts

After deploying to Sepolia, verify your contracts on Etherscan:

```bash
cd blockchain

# Verify Identity Contract
npx hardhat verify --network sepolia <IDENTITY_CONTRACT_ADDRESS>

# Verify Certificates Contract
npx hardhat verify --network sepolia <CERTIFICATES_CONTRACT_ADDRESS>

# Verify Voting Contract
npx hardhat verify --network sepolia <VOTING_CONTRACT_ADDRESS>

# Verify ServiceRequests Contract
npx hardhat verify --network sepolia <SERVICE_REQUESTS_CONTRACT_ADDRESS>
```

After verification, your contract source code will be visible on Etherscan.

---

## Contract Gas Costs

Estimated gas costs for main operations (based on tests):

| Operation              | Gas Cost   | Estimated USD (at 50 gwei, $2000 ETH) |
| ---------------------- | ---------- | ------------------------------------- |
| Deploy Identity        | ~980,000   | ~$1.96                                |
| Deploy Certificates    | ~1,144,000 | ~$2.29                                |
| Deploy Voting          | ~1,782,000 | ~$3.56                                |
| Deploy ServiceRequests | ~1,512,000 | ~$3.02                                |
| Register Citizen       | ~120,626   | ~$0.24                                |
| Verify Citizen         | ~50,120    | ~$0.10                                |
| Issue Certificate      | ~162,702   | ~$0.33                                |
| Create Vote            | ~234,229   | ~$0.47                                |
| Cast Vote              | ~76,077    | ~$0.15                                |
| Submit Service Request | ~180,143   | ~$0.36                                |

**Total Deployment Cost: ~$10.83**

---

## Troubleshooting

### Issue: "Invalid account: private key too short"

**Solution**: Ensure your private key in `blockchain/.env` is exactly 64 hexadecimal characters (no 0x prefix).

```env
# ❌ Wrong
PRIVATE_KEY=0x123abc...

# ❌ Wrong
PRIVATE_KEY=your_private_key_here

# ✓ Correct
PRIVATE_KEY=1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

### Issue: "Insufficient funds for intrinsic transaction cost"

**Solution**: Your wallet needs more Sepolia ETH. Get testnet ETH from a faucet (see [Deploying to Sepolia](#deploying-to-sepolia-testnet)).

### Issue: "Contract not found" in frontend

**Solution**:

1. Check that contract addresses in `frontend/.env` match your deployment
2. Ensure MetaMask is connected to the correct network
3. Check browser console for detailed errors

### Issue: Tests failing

**Solution**:

```bash
# Clean and recompile
cd blockchain
npx hardhat clean
npx hardhat compile
npx hardhat test
```

### Issue: "Network mismatch" in MetaMask

**Solution**:

1. Click the network selector in MetaMask
2. Select the correct network (Localhost 8545 or Sepolia)
3. For local development, add the Hardhat network manually:
   - Network Name: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency Symbol: ETH

---

## Next Steps

After successful deployment:

1. **Test Core Features**:

   - Register as a citizen
   - Request certificate issuance (admin only)
   - Participate in voting
   - Submit service requests

2. **Admin Setup**:

   - The deployer address becomes the admin
   - Use admin functions to verify citizens, issue certificates, approve requests

3. **UI Development**:

   - Build certificate management page
   - Create voting interface
   - Implement admin dashboard

4. **Production Deployment**:
   - Deploy to Ethereum mainnet or Polygon mainnet
   - Use hardware wallet for admin functions
   - Implement proper access control
   - Conduct security audit

---

## Useful Commands

```bash
# Blockchain commands
cd blockchain
npx hardhat compile           # Compile contracts
npx hardhat test              # Run tests
npx hardhat clean             # Clean artifacts
npx hardhat node              # Start local node
npx hardhat console           # Open Hardhat console

# Frontend commands
cd frontend
npm run dev                   # Start dev server
npm run build                 # Build for production
npm run preview               # Preview production build
npm run lint                  # Run ESLint

# Git commands
git status                    # Check repository status
git add .                     # Stage changes
git commit -m "message"       # Commit changes
git push                      # Push to remote
```

---

## Support

- **Documentation**: Check the project README files
- **Issues**: Report bugs at https://github.com/myst9811/E-governance-portal/issues
- **Hardhat Docs**: https://hardhat.org/docs
- **Ethers.js Docs**: https://docs.ethers.org/v6/

---

**Last Updated**: 2025-01-29
