const FlashLoanArbitrage = artifacts.require("FlashLoanArbitrage");
const IERC20 = artifacts.require("IERC20");
const ArbitrageTestHelper = require('../helpers/ArbitrageTestHelper');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');

contract("ArbitrageFlow Integration", accounts => {
    const [owner, user] = accounts;
    let flashLoanArbitrage;
    let dai, usdc, usdt;
    let testHelper;
    
    // Contract addresses (testnet)
    const AAVE_LENDING_POOL = "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9";
    const UNISWAP_ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const CURVE_POOL = "0x4eBdF703948ddCEA3B11f675B4D1Fba9d2414A14";
    
    // Token addresses (testnet)
    const DAI_ADDRESS = "0xad6d458402f60fd3bd25163575031acdce07538d";
    const USDC_ADDRESS = "0x110a13fc3efe6a245b50102d2d529b427d3424e6";
    const USDT_ADDRESS = "0x110a13fc3efe6a245b50102d2d529b427d3424e6";

    before(async () => {
        // Deploy the FlashLoanArbitrage contract
        flashLoanArbitrage = await FlashLoanArbitrage.new(
            AAVE_LENDING_POOL,
            UNISWAP_ROUTER,
            CURVE_POOL
        );

        // Initialize token contracts
        dai = await IERC20.at(DAI_ADDRESS);
        usdc = await IERC20.at(USDC_ADDRESS);
        usdt = await IERC20.at(USDT_ADDRESS);

        // Initialize test helper
        testHelper = new ArbitrageTestHelper(flashLoanArbitrage, dai, usdc, usdt);
    });

    describe("Complete Arbitrage Flow", () => {
        it("should execute a complete arbitrage cycle", async () => {
            // 1. Initial Setup
            const initialDaiBalance = await testHelper.getTokenBalance(dai, owner);
            await testHelper.logBalances(owner, "Initial");

            // 2. Approve tokens
            const flashLoanAmount = web3.utils.toWei("1000", "ether"); // 1000 DAI
            await testHelper.approveTokens(owner, flashLoanAmount);

            // 3. Execute arbitrage
            const tx = await testHelper.executeArbitrage(
                owner,
                DAI_ADDRESS,
                USDC_ADDRESS,
                flashLoanAmount
            );

            // 4. Verify events
            await testHelper.verifyArbitrageExecution(tx, DAI_ADDRESS, USDC_ADDRESS, flashLoanAmount);

            // 5. Check final balances
            const finalDaiBalance = await testHelper.getTokenBalance(dai, owner);
            await testHelper.logBalances(owner, "Final");

            // 6. Verify profit
            const profit = await testHelper.calculateProfit(initialDaiBalance, finalDaiBalance);
            await testHelper.logProfit(profit, "Total");
            assert(profit.gt(web3.utils.toBN("0")), "No profit was made");
        });

        it("should handle failed arbitrage gracefully", async () => {
            const flashLoanAmount = web3.utils.toWei("1000000", "ether"); // Unrealistic amount
            
            await testHelper.verifyFailedArbitrage(
                owner,
                DAI_ADDRESS,
                USDC_ADDRESS,
                flashLoanAmount,
                "Flash loan execution failed"
            );
        });

        it("should respect minimum profit threshold", async () => {
            const flashLoanAmount = web3.utils.toWei("1", "ether"); // Small amount
            
            await testHelper.verifyFailedArbitrage(
                owner,
                DAI_ADDRESS,
                USDC_ADDRESS,
                flashLoanAmount,
                "Insufficient profit"
            );
        });
    });

    describe("Emergency Functions", () => {
        it("should allow owner to pause contract", async () => {
            const tx = await flashLoanArbitrage.pause({ from: owner });
            await testHelper.verifyPause(tx, owner);

            await testHelper.verifyFailedArbitrage(
                owner,
                DAI_ADDRESS,
                USDC_ADDRESS,
                web3.utils.toWei("1000", "ether"),
                "Pausable: paused"
            );
        });

        it("should allow owner to unpause contract", async () => {
            const tx = await flashLoanArbitrage.unpause({ from: owner });
            await testHelper.verifyUnpause(tx, owner);
        });
    });

    describe("Token Management", () => {
        it("should allow owner to withdraw tokens", async () => {
            // First execute a successful arbitrage
            const flashLoanAmount = web3.utils.toWei("1000", "ether");
            await testHelper.approveTokens(owner, flashLoanAmount);
            await testHelper.executeArbitrage(
                owner,
                DAI_ADDRESS,
                USDC_ADDRESS,
                flashLoanAmount
            );

            // Get contract balance
            const contractBalance = await testHelper.getTokenBalance(dai, flashLoanArbitrage.address);
            
            // Withdraw tokens
            const tx = await flashLoanArbitrage.withdrawTokens(
                DAI_ADDRESS,
                contractBalance,
                { from: owner }
            );

            await testHelper.verifyTokenWithdrawal(tx, DAI_ADDRESS, contractBalance);

            // Verify contract balance is zero
            const finalContractBalance = await testHelper.getTokenBalance(dai, flashLoanArbitrage.address);
            assert(finalContractBalance.eq(web3.utils.toBN("0")), "Contract balance should be zero");
        });

        it("should prevent non-owners from withdrawing tokens", async () => {
            await testHelper.verifyFailedArbitrage(
                user,
                DAI_ADDRESS,
                web3.utils.toWei("1", "ether"),
                "Ownable: caller is not the owner"
            );
        });
    });

    describe("Gas Optimization", () => {
        it("should optimize gas usage for multiple arbitrage executions", async () => {
            const flashLoanAmount = web3.utils.toWei("1000", "ether");
            await testHelper.approveTokens(owner, flashLoanAmount);

            // Execute multiple arbitrage operations
            const tx1 = await testHelper.executeArbitrage(
                owner,
                DAI_ADDRESS,
                USDC_ADDRESS,
                flashLoanAmount
            );

            const tx2 = await testHelper.executeArbitrage(
                owner,
                DAI_ADDRESS,
                USDC_ADDRESS,
                flashLoanAmount
            );

            // Compare gas usage
            const gasStats = await testHelper.verifyGasOptimization(tx1, tx2);
            await testHelper.logGasUsage(tx1, "First Transaction");
            await testHelper.logGasUsage(tx2, "Second Transaction");
            console.log("Gas Difference:", gasStats.gasDifference);
        });
    });
}); 