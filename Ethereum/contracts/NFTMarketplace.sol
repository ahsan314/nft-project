// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// security against transactions for multiple requests
import 'hardhat/console.sol';

contract NFTMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;
    //  number of items minting, number of transactions, tokens that have not been sold
    //  keep track of tokens total number - tokenId
    //  arrays need to know the length - help to keep track for arrays */
    
    // counters allow us to keep track of tokenIds
    Counters.Counter private _tokenIds;
    Counters.Counter private _tokensSold;

    uint256 listingPrice = 0.025 ether;
    //  determine who is the owner of the contract
    //   charge a listing fee so the owner makes a commission

    address payable owner;

    //  tokenId return which MarketToken -  fetch which one it is
    // MarketToken => idToMarketToken
    mapping(uint256 => MarketToken) private idToMarketToken;

    //  structs can act like objects
    // MarketToken
    struct MarketToken {
      uint256 tokenId;
      address payable seller;
      address payable owner;
      uint256 price;
      bool sold;
    }
    
    // listen to events from front end applications 
    // MarketTokenCreated
    event MarketTokenMinted (
      uint256 indexed tokenId,
      address seller,
      address owner,
      uint256 price,
      bool sold
    );

    //OBJ: give the NFT market the ability to transact with tokens or change ownership
    //  setApprovalForAll allows us to do that with contract address 
    constructor() ERC721("HASHMarket", "HMS") {
      //set the owner
      owner = payable(msg.sender);
    }

    //  Updates the listing price of the contract
    function updateListingPrice(uint _listingPrice) public payable {
      require(owner == msg.sender, "Only marketplace owner can update listing price.");
      listingPrice = _listingPrice;
    }

    //  Returns the listing price of the contract
    function getListingPrice() public view returns (uint256) {
      return listingPrice;
    }

    //  Mints a token and lists it in the marketplace
    // createToken     
    function mintToken(string memory tokenURI, uint256 price) public payable returns (uint) {
      _tokenIds.increment();
      uint256 newTokenId = _tokenIds.current();

      _mint(msg.sender, newTokenId);
      // set the token URI: id and url
      _setTokenURI(newTokenId, tokenURI);
      makeMarketToken(newTokenId, price);
      // mint the token and set it for sale - return the id to do so
      return newTokenId;
    }

    //  two functions to interact with contract
    //  1. create a market item to put it up for sale
    //  2. create a market sale for buying and selling between parties 
    // createMarketToken
    function makeMarketToken(
      uint256 tokenId,
      uint256 price
    ) private {
      require(price > 0, "Price must be at least 1 wei");
      require(msg.value == listingPrice, "Price must be equal to listing price");

      // putting it up for sale - bool - no owner 
      idToMarketToken[tokenId] =  MarketToken(
        tokenId,
        payable(msg.sender),
        payable(address(this)),
        price,
        false
      );

      _transfer(msg.sender, address(this), tokenId);
      emit MarketTokenMinted(
        tokenId,
        msg.sender,
        address(this),
        price,
        false
      );
    }

    // allows someone to resell a token they have purchased 
    function resellToken(uint256 itemId, uint256 price) public payable {
      require(idToMarketToken[itemId].owner == msg.sender, "Only item owner can perform this operation");
      require(msg.value == listingPrice, "Price must be equal to listing price");
      idToMarketToken[itemId].sold = false;
      idToMarketToken[itemId].price = price;
      idToMarketToken[itemId].seller = payable(msg.sender);
      idToMarketToken[itemId].owner = payable(address(this));
      _tokensSold.decrement();

      _transfer(msg.sender, address(this), itemId);
    }

    //  Creates the sale of a marketplace item 
    //  Transfers ownership of the item, as well as funds between parties 
    function createMarketSale(
      uint256 itemId
      ) public payable {
      uint price = idToMarketToken[itemId].price;
      address seller = idToMarketToken[itemId].seller;
      require(msg.value == price, "Please submit the asking price in order to complete the purchase");
      idToMarketToken[itemId].owner = payable(msg.sender);
      idToMarketToken[itemId].sold = true;
      idToMarketToken[itemId].seller = payable(address(0));
      _tokensSold.increment();
      _transfer(address(this), msg.sender, itemId);
      payable(owner).transfer(listingPrice);
      //  transfer the amount to the seller
      payable(seller).transfer(msg.value);
    }

    // Returns all unsold market items
    //     fetchMarketItems 
    function fetchMarketTokens() public view returns (MarketToken[] memory) {
      uint itemCount = _tokenIds.current();
      uint unsoldItemCount = _tokenIds.current() - _tokensSold.current();
      uint currentIndex = 0;

      MarketToken[] memory items = new MarketToken[](unsoldItemCount);
      for (uint i = 0; i < itemCount; i++) {
        if (idToMarketToken[i + 1].owner == address(this)) {
          uint currentId = i + 1;
          MarketToken storage currentItem = idToMarketToken[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    // Returns only items that a user has purchased 
    function fetchMyNFTs() public view returns (MarketToken[] memory) {
      uint totalItemCount = _tokenIds.current();
      //  a second counter for each individual user 
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketToken[i + 1].owner == msg.sender) {
          itemCount += 1;
        }
      }
      //  second loop to loop through the amount you have purchased with itemcount
      //       check to see if the owner address is equal to msg.sender 
      MarketToken[] memory items = new MarketToken[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketToken[i + 1].owner == msg.sender) {
          uint currentId = i + 1;
          MarketToken storage currentItem = idToMarketToken[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    //  Returns only items a user has listed
    //     fetchItemListed
    function fetchItemsCreated() public view returns (MarketToken[] memory) {
      //  instead of .owner it will be the .seller 
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketToken[i + 1].seller == msg.sender) {
          itemCount += 1;
        }
      }
      //  second loop to loop through the amount you have purchased with itemcount
      //     check to see if the owner address is equal to msg.sender 
      MarketToken[] memory items = new MarketToken[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketToken[i + 1].seller == msg.sender) {
          uint currentId = i + 1;
          MarketToken storage currentItem = idToMarketToken[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }
}