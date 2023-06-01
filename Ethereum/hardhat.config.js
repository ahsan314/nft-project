require("@nomiclabs/hardhat-waffle");
const fs = require("fs");

const projectId = "b106fe1ebfab4b47b6ea399af4fb6474";

const keyData = fs.readFileSync(".privateKey.txt", {
  encoding: "utf-8",
  flag: "r",
});

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
      accounts: [keyData],
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${projectId}`,
      accounts: [keyData],
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${projectId}`,
      accounts: [keyData],
    },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
