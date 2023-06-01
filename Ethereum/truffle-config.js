const HDWalletProvider = require("@truffle/hdwallet-provider");
const fs = require("fs");
const mnemonic = fs.readFileSync(".secret").toString().trim();
const projectId = "b106fe1ebfab4b47b6ea399af4fb6474";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
    matic: {
      provider: () =>
        new HDWalletProvider(mnemonic, `https://rpc-mumbai.maticvigil.com`),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    kovan: {
      networkCheckTimeout: 10000,
      provider: () => {
        return new HDWalletProvider(
          mnemonic,
          `wss://kovan.infura.io/ws/v3/${projectId}`
        );
      },
      network_id: "42",
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.4",
    },
  },
};

// const HDWalletProvider = require("@truffle/hdwallet-provider");
// const fs = require("fs");
// const mnemonic = fs.readFileSync(".secret").toString().trim();

// module.exports = {
//   networks: {
//     development: {
//       host: "127.0.0.1", // Localhost (default: none)
//       port: 8545, // Standard Ethereum port (default: none)
//       network_id: "*", // Any network (default: none)
//     },
//     matic: {
//       provider: () =>
//         new HDWalletProvider(mnemonic, `https://rpc-mumbai.maticvigil.com`),
//       network_id: 80001,
//       confirmations: 2,
//       timeoutBlocks: 200,
//       skipDryRun: true,
//     },
//   },

//   // Set default mocha options here, use special reporters etc.
//   mocha: {
//     // timeout: 100000
//   },

//   // Configure your compilers
//   compilers: {
//     solc: {
//       version: "0.8.4",
//     },
//   },
// };

// module.exports = {
//   // contracts_build_directory: "./pages/contracts",
//   networks: {
//     development: {
//       host: "127.0.0.1", // Localhost (default: none)
//       port: 8545, // Standard Ethereum port (default: none)
//       network_id: "*", // Any network (default: none)
//     },
//   },

//   compilers: {
//     solc: {
//       version: "^0.8.11",
//       optimizer: {
//         enabled: true,
//         runs: 200,
//       },
//     },
//   },

//   mocha: {},
// };
