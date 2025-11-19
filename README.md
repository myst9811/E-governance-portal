# eGov Portal 🏛️

A blockchain-based government services platform that makes citizen-government interactions transparent, secure, and actually work.

## What is this?

Think of it as a digital government office that runs on the blockchain. No more lost paperwork, no more wondering if your vote counted, and no more chasing down certificates.

**What you can do:**
- **Get verified** as a citizen with digital identity
- **Receive certificates** that can't be forged or lost
- **Vote** on stuff and see the results in real-time
- **Request services** like permits or licenses

Everything lives on the blockchain, so it's permanent, transparent, and can't be tampered with.

## Tech Stack

**Frontend:**
- React + TypeScript
- TailwindCSS (with dark mode!)
- Vite for blazing fast builds
- Ethers.js for blockchain stuff

**Blockchain:**
- Solidity smart contracts
- Hardhat for development
- Works on Sepolia testnet and local networks

## Getting Started

### Prerequisites
- Node.js installed
- MetaMask wallet extension
- Some test ETH (for testnets)

### Installation

1. **Clone the repo**
   ```bash
   git clone <your-repo-url>
   cd egov-portal
   ```

2. **Install dependencies**
   ```bash
   # Blockchain
   cd blockchain
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Start local blockchain**
   ```bash
   cd blockchain
   npx hardhat node
   ```

4. **Deploy contracts** (in a new terminal)
   ```bash
   cd blockchain
   npx hardhat run scripts/deploy-all.js --network localhost
   ```

5. **Configure frontend**

   Copy the contract addresses from deployment output to `frontend/.env`:
   ```
   VITE_IDENTITY_CONTRACT=0x...
   VITE_CERTIFICATES_CONTRACT=0x...
   VITE_VOTING_CONTRACT=0x...
   VITE_SERVICE_REQUESTS_CONTRACT=0x...
   ```

6. **Run the app**
   ```bash
   cd frontend
   npm run dev
   ```

Visit `http://localhost:5173` and connect your MetaMask wallet!

## Project Structure

```
egov-portal/
├── blockchain/        # Smart contracts and tests
│   ├── contracts/    # Solidity contracts
│   ├── scripts/      # Deployment scripts
│   └── test/         # 93 tests (all passing!)
├── frontend/         # React app
│   ├── src/pages/    # Main pages
│   ├── components/   # UI components
│   └── contractConfig.ts
```

## Features

- ✅ Digital identity registration
- ✅ Certificate issuance and verification
- ✅ Transparent voting system
- ✅ Service request management
- ✅ Admin dashboard
- ✅ Dark mode toggle
- ✅ Mobile responsive

## Testing

```bash
cd blockchain
npx hardhat test
```

All 93 tests should pass ✓

## Deploying to Testnet

Check out `DEPLOYMENT.md` for detailed instructions on deploying to Sepolia or other networks.

## How It Works

1. **Citizens** register and get verified by admins
2. **Admins** can issue certificates, create votes, and approve service requests
3. Everything is stored on the blockchain - no central database
4. All transactions are public and verifiable

## Contributing

Feel free to open issues or submit PRs. This is a work in progress!

## License

MIT (or whatever you prefer)

---

**Built with ❤️ and blockchain**
