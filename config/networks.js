module.exports = {
    development: {
        host: "127.0.0.1",
        port: 8545,
        network_id: "*"
    },
    mainnet: {
        host: "mainnet.infura.io/v3/YOUR-PROJECT-ID",
        network_id: 1,
        gas: 5500000,
        gasPrice: 20000000000
    },
    testnet: {
        host: "ropsten.infura.io/v3/YOUR-PROJECT-ID",
        network_id: 3,
        gas: 5500000,
        gasPrice: 20000000000
    }
}; 