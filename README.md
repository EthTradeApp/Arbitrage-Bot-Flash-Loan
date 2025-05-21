# Flash Loan Arbitrage Project

This project demonstrates a decentralized finance (DeFi) arbitrage strategy using flash loans. It leverages three major protocols: Aave (for flash loans), Uniswap V3 (for token swaps), and Curve (for stablecoin swaps). The workflow is fully automated and atomic, ensuring that all steps succeed or the transaction is reverted.

---

## Concept

- **Flash Loan**: Instantly borrow assets without collateral, provided the loan is repaid within the same transaction.
- **Arbitrage**: Take advantage of price differences between decentralized exchanges to make a profit.
- **Atomicity**: All operations (borrowing, swapping, repaying) happen in a single transaction.

---

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

---

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

---

## Maintenance

- **Upgrade Protocol Addresses**: If any DeFi protocol upgrades or changes addresses, update the contract parameters accordingly.
- **Monitor Gas Costs**: Arbitrage opportunities are sensitive to gas fees. Monitor and optimize for efficiency.
- **Security**: Only the contract owner can initiate sensitive operations. Regularly audit and monitor for vulnerabilities.

---

## Contact

For questions, support, or collaboration, please reach out to the project maintainer:

- **Email**: nigel.russell.luck@gmail.com
- **Telegram**: [Lambró Méllon](https://t.me/lambro_mellon)
- **X**: [Nigel Russell](https://x.com/nigelrussell93)

---

## Disclaimer

This project is for educational and research purposes only. Use at your own risk. DeFi protocols are complex and may have risks including loss of funds.

---

