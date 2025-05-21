# Flash Loan Arbitrage Bot

A smart contract-based arbitrage bot that utilizes flash loans to execute profitable trades across different DEXes.

## Project Structure

```
├── contracts/                    # Smart contracts
│   ├── core/                    # Core contracts
│   │   ├── FlashLoanArbitrage.sol
│   │   └── Migrations.sol
│   ├── interfaces/              # Contract interfaces
│   │   ├── IUniswap.sol        # Uniswap V2/V3 interface
│   │   ├── IAave.sol           # Aave flash loan interface
│   │   └── ICurve.sol          # Curve pool interface
│   └── libraries/              # Contract libraries
│       └── Math.sol
├── scripts/                    # Deployment and interaction scripts
│   ├── deploy.js              # Contract deployment script
│   └── interact.js            # Contract interaction script
├── test/                      # Test files
│   ├── unit/                  # Unit tests
│   │   └── FlashLoanArbitrage.test.js
│   └── integration/           # Integration tests
│       └── ArbitrageFlow.test.js
├── config/                    # Configuration files
│   ├── networks.js           # Network configurations
│   └── tokens.js             # Token addresses
├── utils/                     # Utility functions
│   ├── priceFeed.js          # Price feed utilities
│   └── arbitrage.js          # Arbitrage calculation utilities
├── docs/                      # Documentation
│   ├── architecture.md       # System architecture
│   └── setup.md              # Setup guide
├── .env.example              # Example environment variables
├── .gitignore
├── package.json
├── truffle-config.js
└── README.md
```

## Features

- Flash loan integration with Aave
- Arbitrage execution across multiple DEXes (Uniswap, Curve)
- Automated price monitoring
- Gas optimization
- Comprehensive testing suite
- Modular and maintainable architecture

## Prerequisites

- Node.js (v14+)
- Truffle
- Ganache (for local development)
- MetaMask
- Infura account (for network access)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/NS0126/Arbitrage-Bot-Flash-Loan.git
cd Arbitrage-Bot-Flash-Loan
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
   - Add your Infura Project ID
   - Add your private key (for deployment)
   - Configure network settings

## Usage

1. Compile contracts:
```bash
truffle compile
```

2. Run tests:
```bash
truffle test
```

3. Deploy to network:
```bash
truffle migrate --network <network-name>
```

## Testing

- Unit tests: `truffle test ./test/unit`
- Integration tests: `truffle test ./test/integration`

## Architecture

The project follows a modular architecture with clear separation of concerns:

1. **Smart Contracts**
   - Core contracts handle the main arbitrage logic
   - Interfaces define the interaction with external protocols
   - Libraries provide reusable functionality

2. **Configuration**
   - Network settings for different environments
   - Token addresses for supported networks
   - Environment variables for sensitive data

3. **Testing**
   - Unit tests for individual components
   - Integration tests for complete workflows
   - Comprehensive test coverage

## Security

- Flash loan safety checks
- Slippage protection
- Emergency stop functionality
- Gas optimization
- Regular security audits recommended

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

- **Email**: nigel.russell.luck@gmail.com
- **Telegram**: [Lambró Méllon](https://t.me/lambro_mellon)
- **X**: [Nigel Russell](https://x.com/nigelrussell93)

## Disclaimer

This project is for educational and research purposes only. Use at your own risk. DeFi protocols are complex and may have risks including loss of funds.

## Concept

- **Flash Loan**: Instantly borrow assets without collateral, provided the loan is repaid within the same transaction.
- **Arbitrage**: Take advantage of price differences between decentralized exchanges to make a profit.
- **Atomicity**: All operations (borrowing, swapping, repaying) happen in a single transaction.

## Project Workflow

1. **Initiate Flash Loan**  
   The contract owner triggers a function to borrow a specified amount of DAI using a flash loan.

2. **Token Swap on Uniswap**  
   The borrowed DAI is swapped for USDC using Uniswap V3.

3. **Token Swap on Curve**  
   The USDC is then swapped back to DAI using Curve, ideally at a more favorable rate.

4. **Repay Flash Loan**  
   The contract repays the borrowed DAI plus a small premium to the lending protocol.

5. **Profit Extraction**  
   Any remaining DAI after repaying the loan is profit and can be withdrawn by the contract owner.

## How to Execute

1. **Install Dependencies**  
   Make sure you have Node.js, npm, and Truffle installed.

   ```
   npm install
   ```

2. **Compile Contracts**  
   ```
   truffle compile
   ```

3. **Deploy Contracts**  
   Deploy the contracts to your desired Ethereum network (testnet or mainnet fork).

   ```
   truffle migrate
   ```

4. **Configure Arbitrage Parameters**  
   Set the input token (DAI), output token (USDC), and the Curve pool address using the provided setter function.

5. **Fund the Contract**  
   Send a small amount of DAI to the contract to cover any operational needs.

6. **Run Arbitrage**  
   Call the function to initiate the flash loan and execute the arbitrage. This can be done via Truffle console, scripts, or a frontend.

7. **Withdraw Profits**  
   After a successful arbitrage, the owner can withdraw any remaining tokens from the contract.

## Maintenance

- **Upgrade Protocol Addresses**: If any DeFi protocol upgrades or changes addresses, update the contract parameters accordingly.
- **Monitor Gas Costs**: Arbitrage opportunities are sensitive to gas fees. Monitor and optimize for efficiency.
- **Security**: Only the contract owner can initiate sensitive operations. Regularly audit and monitor for vulnerabilities.

