const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const { expectRevert, expectEvent } = require('@openzeppelin/test-helpers');

class ArbitrageTestHelper {
    constructor(flashLoanArbitrage, dai, usdc, usdt) {
        this.flashLoanArbitrage = flashLoanArbitrage;
        this.dai = dai;
        this.usdc = usdc;
        this.usdt = usdt;
    }

    async getTokenBalance(token, address) {
        return await token.balanceOf(address);
    }

    async approveTokens(owner, amount) {
        await this.dai.approve(this.flashLoanArbitrage.address, amount, { from: owner });
    }

    async executeArbitrage(owner, tokenIn, tokenOut, amount) {
        return await this.flashLoanArbitrage.executeArbitrage(
            tokenIn,
            tokenOut,
            amount,
            { from: owner }
        );
    }

    async calculateProfit(initialBalance, finalBalance) {
        return finalBalance.sub(initialBalance);
    }

    async verifyArbitrageExecution(tx, tokenIn, tokenOut, amount) {
        expectEvent(tx, 'ArbitrageExecuted', {
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            amount: amount
        });
    }

    async verifyTokenWithdrawal(tx, token, amount) {
        expectEvent(tx, 'TokensWithdrawn', {
            token: token,
            amount: amount
        });
    }

    async verifyPause(tx, account) {
        expectEvent(tx, 'Paused', { account: account });
    }

    async verifyUnpause(tx, account) {
        expectEvent(tx, 'Unpaused', { account: account });
    }

    async verifyFailedArbitrage(owner, tokenIn, tokenOut, amount, errorMessage) {
        await expectRevert(
            this.executeArbitrage(owner, tokenIn, tokenOut, amount),
            errorMessage
        );
    }

    async verifyGasOptimization(tx1, tx2) {
        const gasDiff = Math.abs(tx1.receipt.gasUsed - tx2.receipt.gasUsed);
        assert(gasDiff < 1000, "Gas usage should be consistent");
        return {
            firstTxGas: tx1.receipt.gasUsed,
            secondTxGas: tx2.receipt.gasUsed,
            gasDifference: gasDiff
        };
    }

    async logBalances(owner, message = "") {
        const daiBalance = await this.getTokenBalance(this.dai, owner);
        const usdcBalance = await this.getTokenBalance(this.usdc, owner);
        const usdtBalance = await this.getTokenBalance(this.usdt, owner);

        console.log(`\n${message} Balances:`);
        console.log("DAI:", web3.utils.fromWei(daiBalance));
        console.log("USDC:", web3.utils.fromWei(usdcBalance));
        console.log("USDT:", web3.utils.fromWei(usdtBalance));
    }

    async logGasUsage(tx, message = "") {
        console.log(`\n${message} Gas Usage:`, tx.receipt.gasUsed);
    }

    async logProfit(profit, message = "") {
        console.log(`\n${message} Profit:`, web3.utils.fromWei(profit), "DAI");
    }
}

module.exports = ArbitrageTestHelper; 