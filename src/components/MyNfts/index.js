import React, { useEffect, useState, useContext } from "react";
import { Box, Button } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import { ethers } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import MetaMaskExtensionModel from "../../components/MetaMaskExtensionModel";
import AppContext from "../../AppContext";

import { marketplaceAddress } from "../../config";
import NFTMarketplace from "../../../Ethereum/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";

import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles({
  filters: { backgroundColor: "#f0f0f0" },
  main: {
    backgroundColor: "#14141F",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // justifyContent: "center",
    height: "100vh",
  },
  inputColor: {
    color: "white",
    // This matches the specificity of the default styles at https://github.com/mui-org/material-ui/blob/v4.11.3/packages/material-ui-lab/src/Autocomplete/Autocomplete.js#L90
    '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
      // Default left padding is 6px
      paddingLeft: 26,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "green",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "red",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "purple",
    },
  },
});

export default function MyAssets() {
  // array of nfts
  const router = useRouter();
  const classes = useStyles();
  const [nfts, setNFts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  // metamask extension check model
  const [openMetamaskExt, setOpenMetamaskExt] = useState(false);
  const handleOpenMetamaskExt = () => setOpenMetamaskExt(true);
  const handleCloseMetamaskExt = () => setOpenMetamaskExt(false);

  //Metamask Wallet checking
  const value = useContext(AppContext);
  var { metamaskinstalled } = value.state;

  useEffect(() => {
    if (!metamaskinstalled) {
      handleOpenMetamaskExt();
    } else {
      loadNFTs();
    }
  }, [metamaskinstalled]);

  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketplaceContract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );
    const data = await marketplaceContract.fetchMyNFTs();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenURI = await marketplaceContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenURI);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
          tokenURI,
        };
        return item;
      })
    );
    setNFts(items);
    setLoadingState("loaded");
  }

  function listNFT(nft) {
    router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`);
  }

  if (loadingState === "loaded" && !nfts.length)
    return <h1>You do not own any NFTs currently!</h1>;

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item md={12} xs={12} className={classes.main} sx={{ mt: 2 }}>
          <h1>MY NFT COLLECTION</h1>
          <Grid container spacing={2} sx={{ p: 5 }}>
            {!nfts.length ? (
              <>
                <Grid item sm={12} sx={{ mt: 15 }}>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                  </Box>
                </Grid>
              </>
            ) : (
              <>
                {nfts.map((nft, i) => {
                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                      <Card sx={{ maxWidth: 345 }}>
                        <CardActionArea>
                          <CardMedia
                            component="img"
                            height="250"
                            image={nft.image}
                            alt="green iguana"
                          />
                          <CardContent sx={{ backgroundColor: "lightgray" }}>
                            <Box sx={{ display: "flex" }}>
                              <Typography
                                sx={{ flexGrow: 1 }}
                                gutterBottom
                                variant="h6"
                                component="div"
                              >
                                {nft.name}
                              </Typography>
                              <Typography
                                sx={{ color: "red" }}
                                gutterBottom
                                variant="h6"
                                component="div"
                              >
                                {nft.price} ETH
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex" }}>
                              <Typography
                                sx={{ flexGrow: 1, mt: 1 }}
                                gutterBottom
                                component="div"
                              >
                                {nft.description}
                              </Typography>
                              <Button
                                variant="contained"
                                onClick={() => listNFT(nft)}
                              >
                                ReSell
                              </Button>
                            </Box>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  );
                })}
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
      <MetaMaskExtensionModel
        openMetamaskExt={openMetamaskExt}
        handleCloseMetamaskExt={handleCloseMetamaskExt}
      ></MetaMaskExtensionModel>
    </div>
  );
}

// /* pages/my-nfts.js */
// import { ethers } from "ethers";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import Web3Modal from "web3modal";
// import { useRouter } from "next/router";

// import { marketplaceAddress } from "../../config";

// import NFTMarketplace from "../../../Ethereum/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";

// export default function MyAssets() {
//   const [nfts, setNfts] = useState([]);
//   const [loadingState, setLoadingState] = useState("not-loaded");
//   const router = useRouter();
//   useEffect(() => {
//     loadNFTs();
//   }, []);
//   async function loadNFTs() {
//     const web3Modal = new Web3Modal({
//       network: "mainnet",
//       cacheProvider: true,
//     });
//     const connection = await web3Modal.connect();
//     const provider = new ethers.providers.Web3Provider(connection);
//     const signer = provider.getSigner();

//     const marketplaceContract = new ethers.Contract(
//       marketplaceAddress,
//       NFTMarketplace.abi,
//       signer
//     );
//     const data = await marketplaceContract.fetchMyNFTs();

//     const items = await Promise.all(
//       data.map(async (i) => {
//         const tokenURI = await marketplaceContract.tokenURI(i.tokenId);
//         const meta = await axios.get(tokenURI);
//         let price = ethers.utils.formatUnits(i.price.toString(), "ether");
//         let item = {
//           price,
//           tokenId: i.tokenId.toNumber(),
//           seller: i.seller,
//           owner: i.owner,
//           image: meta.data.image,
//           tokenURI,
//         };
//         return item;
//       })
//     );
//     setNfts(items);
//     setLoadingState("loaded");
//   }
//   function listNFT(nft) {
//     router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`);
//   }
//   if (loadingState === "loaded" && !nfts.length)
//     return <h1 className='py-10 px-20 text-3xl'>No NFTs owned</h1>;
//   return (
//     <div className='flex justify-center'>
//       <div className='p-4'>
//         <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
//           {nfts.map((nft, i) => (
//             <div key={i} className='border shadow rounded-xl overflow-hidden'>
//               <img src={nft.image} alt='pic' className='rounded' />
//               <div className='p-4 bg-black'>
//                 <p className='text-2xl font-bold text-white'>
//                   Price - {nft.price} Eth
//                 </p>
//                 <button
//                   className='mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded'
//                   onClick={() => listNFT(nft)}
//                 >
//                   List
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
/////////////////////////////////////////////
// import React, { useEffect, useState, useContext } from "react";
// import { Box, Button } from "@mui/material";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import CardMedia from "@mui/material/CardMedia";
// import Typography from "@mui/material/Typography";
// import { CardActionArea } from "@mui/material";
// import Grid from "@mui/material/Grid";
// import Stack from "@mui/material/Stack";
// import CircularProgress from "@mui/material/CircularProgress";
// import { ethers } from "ethers";
// import axios from "axios";
// import Web3Modal from "web3modal";
// import MetaMaskExtensionModel from "../../components/MetaMaskExtensionModel";
// import AppContext from "../../AppContext";
// import makeStyles from "@mui/styles/makeStyles";
// import BasicModalReSell from "../../components/ResellNftModel";
// import { useRouter } from "next/router";

// import { marketplaceAddress } from "../../config";
// import NFTMarketplace from "../../../Ethereum/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";

// const useStyles = makeStyles({
//   filters: { backgroundColor: "#f0f0f0" },
//   main: {
//     backgroundColor: "#14141F",
//     color: "white",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     // justifyContent: "center",
//     height: "100vh",
//   },
//   inputColor: {
//     color: "white",
//     // This matches the specificity of the default styles at https://github.com/mui-org/material-ui/blob/v4.11.3/packages/material-ui-lab/src/Autocomplete/Autocomplete.js#L90
//     '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
//       // Default left padding is 6px
//       paddingLeft: 26,
//     },
//     "& .MuiOutlinedInput-notchedOutline": {
//       borderColor: "green",
//     },
//     "&:hover .MuiOutlinedInput-notchedOutline": {
//       borderColor: "red",
//     },
//     "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//       borderColor: "purple",
//     },
//   },
// });

// export default function MyAssets() {
//   // array of nfts
//   const router = useRouter();
//   const classes = useStyles();
//   const [nfts, setNFts] = useState([]);
//   const [loadingState, setLoadingState] = useState("not-loaded");

//   // Resell Model
//   const [dataNft, setdataNft] = useState();
//   const [open, setOpen] = useState(false);
//   const handleOpen = (i) => {
//     setOpen(true);
//     setdataNft(nfts[i]);
//   };
//   const handleClose = () => {
//     setOpen(false);
//   };

//   // metamask extension check model
//   const [openMetamaskExt, setOpenMetamaskExt] = useState(false);
//   const handleOpenMetamaskExt = () => setOpenMetamaskExt(true);
//   const handleCloseMetamaskExt = () => setOpenMetamaskExt(false);

//   //Metamask Wallet checking
//   const value = useContext(AppContext);
//   var { metamaskinstalled } = value.state;

//   useEffect(() => {
//     if (!metamaskinstalled) {
//       handleOpenMetamaskExt();
//     } else {
//       loadNFTs();
//     }
//   }, [metamaskinstalled]);

//   async function loadNFTs() {
//     // what we want to load:
//     // we want to get the msg.sender hook up to the signer to display the owner nfts

//     const web3Modal = new Web3Modal();
//     const connection = await web3Modal.connect();
//     const provider = new ethers.providers.Web3Provider(connection);
//     const signer = provider.getSigner();

//     const tokenContract = new ethers.Contract(
//       marketplaceAddress,
//       NFTMarketplace.abi,
//       provider
//     );
//     const marketContract = new ethers.Contract(
//       marketplaceAddress,
//       NFTMarketplace.abi,
//       signer
//     );
//     const data = await marketContract.fetchMyNFTs();

//     const items = await Promise.all(
//       data.map(async (i) => {
//         const tokenUri = await tokenContract.tokenURI(i.tokenId);
//         // we want get the token metadata - json
//         const meta = await axios.get(tokenUri);
//         let price = ethers.utils.formatUnits(i.price.toString(), "ether");
//         let item = {
//           price,
//           tokenId: i.tokenId.toNumber(),
//           seller: i.seller,
//           owner: i.owner,
//           image: meta.data.image,
//           name: meta.data.name,
//           description: meta.data.description,
//         };
//         return item;
//       })
//     );

//     setNFts(items);
//     setLoadingState("loaded");
//   }

//   function listNFT(nft) {
//     router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`);
//   }

//   if (loadingState === "loaded" && !nfts.length)
//     return <h1>You do not own any NFTs currently!</h1>;

//   return (
//     <div>
//       <Grid container spacing={2}>
//         <Grid item md={12} xs={12} className={classes.main} sx={{ mt: 2 }}>
//           <h1>MY NFT COLLECTION</h1>
//           <Grid container spacing={2} sx={{ p: 5 }}>
//             {!nfts.length ? (
//               <>
//                 <Grid item sm={12} sx={{ mt: 15 }}>
//                   <Box sx={{ display: "flex", justifyContent: "center" }}>
//                     <CircularProgress />
//                   </Box>
//                 </Grid>
//               </>
//             ) : (
//               <>
//                 {nfts.map((nft, i) => {
//                   return (
//                     <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
//                       <a onClick={() => handleOpen(i)}>
//                         <Card sx={{ maxWidth: 345 }}>
//                           <CardActionArea>
//                             <CardMedia
//                               component='img'
//                               height='250'
//                               image={nft.image}
//                               alt='green iguana'
//                             />
//                             <CardContent sx={{ backgroundColor: "lightgray" }}>
//                               <Box sx={{ display: "flex" }}>
//                                 <Typography
//                                   sx={{ flexGrow: 1 }}
//                                   gutterBottom
//                                   variant='h6'
//                                   component='div'
//                                 >
//                                   {nft.name}
//                                 </Typography>
//                                 <Typography
//                                   sx={{ color: "red" }}
//                                   gutterBottom
//                                   variant='h6'
//                                   component='div'
//                                 >
//                                   {nft.price} ETH
//                                 </Typography>
//                               </Box>
//                               <Box sx={{ display: "flex" }}>
//                                 <Typography
//                                   sx={{ flexGrow: 1 }}
//                                   gutterBottom
//                                   component='div'
//                                 >
//                                   {nft.description}
//                                 </Typography>
//                               </Box>
//                             </CardContent>
//                           </CardActionArea>
//                         </Card>
//                       </a>
//                     </Grid>
//                   );
//                 })}
//               </>
//             )}
//           </Grid>
//         </Grid>
//         {dataNft ? (
//           <BasicModalReSell
//             ModelOpen={open}
//             ModelClose={handleClose}
//             nftData={dataNft}
//           ></BasicModalReSell>
//         ) : (
//           <Typography>.</Typography>
//         )}
//       </Grid>
//       <MetaMaskExtensionModel
//         openMetamaskExt={openMetamaskExt}
//         handleCloseMetamaskExt={handleCloseMetamaskExt}
//       ></MetaMaskExtensionModel>
//     </div>
//   );
// }
