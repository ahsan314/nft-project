const NFTMarketplace = artifacts.require("NFTMarketplace.sol");

module.exports = async function (deployer) {
  deployer.deploy(NFTMarketplace);
};

/** In case to use old contracts ( HASHMarket.sol, NFT.sol) */

// const HASHMarket = artifacts.require("HASHMarket.sol");
// const NFT = artifacts.require("NFT.sol");

// module.exports = async function (deployer) {
//   deployer.deploy(HASHMarket);
//   deployer.deploy(NFT, HASHMarket.address);
// };

// module.exports = function (deployer) {
//   deployer.deploy(HASHMarket).then(function () {
//     return deployer.deploy(NFT, HASHMarket.address);
//   });
// };
