require("dotenv").config();

// http://trufflesuite.com/docs/truffle/reference/configuration

/**
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 */

// const HDWalletProvider = require('@truffle/hdwallet-provider');
//
// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  // http://trufflesuite.com/docs/truffle/reference/configuration#networks
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
    },
  },

  // http://trufflesuite.com/docs/truffle/reference/configuration#contracts_directory
  contracts_directory: "./src/eth/contracts/",
  // http://trufflesuite.com/docs/truffle/reference/configuration#contracts_build_directory
  contracts_build_directory: "./src/eth/abis/",
  // http://trufflesuite.com/docs/truffle/reference/configuration#migrations_directory
  migrations_directory: "./src/eth/migrations/",

  test_directory: "./src/eth/test/",

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.10", // Fetch exact version from solc-bin (default: truffle's version)
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};
