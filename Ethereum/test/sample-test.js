/** For HASHToken Contract */
describe("NFTMarket", function () {
  it("Should create and execute market sales", async function () {
    /* deploy the marketplace */
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    const nftMarketplace = await NFTMarketplace.deploy();
    await nftMarketplace.deployed();

    let listingPrice = await nftMarketplace.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits("1", "ether");

    /* create two tokens */
    await nftMarketplace.mintToken(
      "https://www.mytokenlocation.com",
      auctionPrice,
      { value: listingPrice }
    );
    await nftMarketplace.mintToken(
      "https://www.mytokenlocation2.com",
      auctionPrice,
      { value: listingPrice }
    );

    const [_, buyerAddress] = await ethers.getSigners();

    /* execute sale of token to another user */
    await nftMarketplace
      .connect(buyerAddress)
      .createMarketSale(1, { value: auctionPrice });

    /* resell a token */
    await nftMarketplace
      .connect(buyerAddress)
      .resellToken(1, auctionPrice, { value: listingPrice });

    /* query for and return the unsold items */
    items = await nftMarketplace.fetchMarketTokens();
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await nftMarketplace.tokenURI(i.tokenId);
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri,
        };
        return item;
      })
    );
    console.log("items: ", items);
  });
});

/** For old contracts */
// const { expect } = require("chai");
// const { ethers } = require("hardhat");
// describe("HASHMarket", function () {
//   it("Should mint and trade NFTs", async function () {
//     // test to receive contract addresses
//     const Market = await ethers.getContractFactory("HASHMarket");
//     const market = await Market.deploy();
//     await market.deployed();
//     const marketAddress = market.address;

//     const NFT = await ethers.getContractFactory("NFT");
//     const nft = await NFT.deploy(marketAddress);
//     await nft.deployed();
//     const nftContractAddress = nft.address;

//     // test to receive listing price and auction price
//     let listingPrice = await market.getListingPrice();
//     listingPrice = listingPrice.toString();

//     const auctionPrice = ethers.utils.parseUnits("100", "ether");

//     // test for minting
//     await nft.mintToken("https-t1");
//     await nft.mintToken("https-t2");

//     await market.makeMarketItem(nftContractAddress, 1, auctionPrice, {
//       value: listingPrice,
//     });
//     await market.makeMarketItem(nftContractAddress, 2, auctionPrice, {
//       value: listingPrice,
//     });

//     // test for different addresses from different users - test accounts
//     // return an array of however many addresses
//     const [_, buyerAddress] = await ethers.getSigners();

//     // create a market sale with address, id and price
//     await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, {
//       value: auctionPrice,
//     });

//     let items = await market.fetchMarketTokens();

//     items = await Promise.all(
//       items.map(async (i) => {
//         // get the uri of the value

//         const tokenUri = await nft.tokenURI(i.tokenId);
//         let item = {
//           price: i.price.toString(),
//           tokenId: i.tokenId.toString(),
//           seller: i.seller,
//           owner: i.owner,
//           tokenUri,
//         };
//         return item;
//       })
//     );

//     // test out all the items
//     console.log("items", items);
//   });
// });
