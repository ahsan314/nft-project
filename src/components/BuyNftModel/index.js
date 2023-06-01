import React, { useState, useEffect, useContext } from "react";
import { Box } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import Link from "next/link";
import Modal from "@mui/material/Modal";
import Web3Modal from "web3modal";
import makeStyles from "@mui/styles/makeStyles";
import MetaMaskExtensionModel from "../MetaMaskExtensionModel";
import AppContext from "../../AppContext";
import Image from "next/image";

import { marketplaceAddress } from "../../config";
import NFTMarketplace from "../../../Ethereum/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";

const useStyles = makeStyles({
  homepage: {},
  main: {
    backgroundColor: "#14141F",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: "2%",
    borderRadius: "25px",
  },
});

export default function BasicModal({ ModelOpen, nftData, ModelClose }) {
  const [open, setOpen] = useState(ModelOpen);
  const [loader, setloader] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (ModelOpen) {
      setOpen(true);
    }
  }, [ModelOpen]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    ModelClose();
  };

  ///////////////////////////

  const classes = useStyles();
  const [nftSold, setnftSold] = useState(false);
  const [nftStatus, setnftStatus] = useState("BUY NFT");

  // function to buy nfts for market

  async function buyNFT(nft) {
    setloader(true);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price,
    });
    await transaction.wait();

    setnftSold(true);
    setnftStatus("Sold (Go back to Collection)");
    setloader(false);
    router.push("./NFTsCollections");
    // loadNFTs();
  }

  // metamask extension check model

  const [openMetamaskExt, setOpenMetamaskExt] = React.useState(false);
  const handleOpenMetamaskExt = () => setOpenMetamaskExt(true);
  const handleCloseMetamaskExt = () => setOpenMetamaskExt(false);

  //Metamask Wallet checking
  const value = useContext(AppContext);
  var { metamaskinstalled } = value.state;

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ my: 5, mx: 30 }}
      >
        <div className={classes.main}>
          <Typography sx={{ mt: 2, textDecoration: "underline" }} variant="h4">
            Purchase Your NFT
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={12} md={6}>
              <Card sx={{ maxWidth: 500 }}>
                <CardActionArea>
                  <CardContent
                    sx={{ backgroundColor: "#191E3B", color: "white" }}
                  >
                    <Typography gutterBottom variant="h6" component="div">
                      (Collection Logo)
                    </Typography>
                  </CardContent>
                  <CardMedia
                    component="img"
                    height="350"
                    image={nftData.image}
                    alt="green iguana"
                    sx={{ backgroundColor: "#0E1118" }}
                  />
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={5}>
              <Box sx={{ display: "flex" }}>
                <Typography
                  sx={{ flexGrow: 1 }}
                  gutterBottom
                  variant="h6"
                  component="div"
                >
                  #1234567
                </Typography>
                <Typography
                  sx={{ color: "green", mt: 1, mx: 2 }}
                  gutterBottom
                  variant="h5"
                  component="div"
                >
                  Available
                </Typography>
              </Box>
              <Typography gutterBottom variant="h4" component="div">
                {nftData.name}
              </Typography>
              <Box sx={{ display: "flex" }}>
                <Image
                  height="32px"
                  width="32px"
                  src="https://images.godsunchained.com/misc/gu-sigel.png"
                  alt="Collection Icon"
                />
                <Typography gutterBottom variant="h6" component="div">
                  {nftData.NftCollection}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", mt: 24 }}>
                {/* <Image
                  height="32px"
                  width="32px"
                  src="https://design-system.immutable.com/currency_icons/currency--eth.svg"
                  alt="Collection Icon"
                /> */}
                <Typography
                  sx={{ px: 0 }}
                  gutterBottom
                  variant="h4"
                  component="div"
                >
                  {nftData.price}
                </Typography>
                <Box
                  sx={{ mx: 1 }}
                  style={{
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src="https://tuomodesign.store/wp-content/uploads/2020/12/tuomodesign_ethereum_3d_model_animated.gif"
                    width="40px"
                    height="40px"
                    alt="ethereum"
                  />
                </Box>
                {loader ? (
                  <>
                    <Box sx={{ mx: 13, mt: -18 }}>
                      <CircularProgress />
                      <Typography sx={{ color: "red", mx: -16, mt: 2 }}>
                        Waiting for Your Metamask transaction ...
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <Box></Box>
                )}
              </Box>
              {metamaskinstalled ? (
                <Stack direction="row" spacing={2}>
                  {nftSold ? (
                    <Link passHref href="/NFTsCollections">
                      <Button
                        style={{ width: 500, height: 40 }}
                        variant="contained"
                        color="error"
                      >
                        {nftStatus}
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      style={{ width: 500, height: 40 }}
                      variant="contained"
                      color="success"
                      onClick={() => buyNFT(nftData)}
                    >
                      {nftStatus}
                    </Button>
                  )}
                </Stack>
              ) : (
                <Stack direction="row" spacing={2}>
                  <Button
                    style={{ width: 500, height: 40 }}
                    variant="contained"
                    color="error"
                    onClick={handleOpenMetamaskExt}
                  >
                    Buy NFT
                  </Button>
                </Stack>
              )}
            </Grid>
          </Grid>
          <Typography sx={{ mt: 4 }}></Typography>
        </div>
      </Modal>
      <MetaMaskExtensionModel
        openMetamaskExt={openMetamaskExt}
        handleCloseMetamaskExt={handleCloseMetamaskExt}
      ></MetaMaskExtensionModel>
    </div>
  );
}
