import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import axios from "axios";
import Web3Modal from "web3modal";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Image from "next/image";
import makeStyles from "@mui/styles/makeStyles";

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
  },
});

export default function ResellNFT() {
  const [formInput, updateFormInput] = useState({ price: "", image: "" });
  const router = useRouter();
  const { id, tokenURI } = router.query;
  const { image, price } = formInput;
  const classes = useStyles();

  useEffect(() => {
    fetchNFT();
  }, [id]);

  async function fetchNFT() {
    if (!tokenURI) return;
    const meta = await axios.get(tokenURI);
    updateFormInput((state) => ({ ...state, image: meta.data.image }));
  }

  async function listNFTForSale() {
    if (!price) return;
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const priceFormatted = ethers.utils.parseUnits(formInput.price, "ether");
    let contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );
    let listingPrice = await contract.getListingPrice();

    listingPrice = listingPrice.toString();
    let transaction = await contract.resellToken(id, priceFormatted, {
      value: listingPrice,
    });
    await transaction.wait();

    router.push("./NFTsOneCollection");
  }

  return (
    <div className={classes.main}>
      <Typography
        sx={{ mt: 2, mb: 4, textDecoration: "underline" }}
        variant="h4"
      >
        Resale Your NFT
      </Typography>
      <Card sx={{ maxWidth: 500, mb: 4 }}>
        <CardActionArea>
          {image && (
            <CardMedia
              component="img"
              height="350"
              image={image}
              alt="green iguana"
              sx={{ backgroundColor: "#0E1118" }}
            />
          )}
        </CardActionArea>
      </Card>
      <TextField
        label="Asset Price in Eth"
        variant="filled"
        color="success"
        focused
        sx={{ backgroundColor: "white" }}
        onChange={(e) =>
          updateFormInput({ ...formInput, price: e.target.value })
        }
      />
      <Button
        style={{ width: 350, height: 40 }}
        variant="contained"
        color="success"
        onClick={listNFTForSale}
        sx={{ maxWidth: 500, mb: 6, mt: 4 }}
      >
        Re Sale
      </Button>

      <Typography sx={{ mt: 4 }}></Typography>
    </div>
  );
}

// <div className="flex justify-center">
//   <div className="w-1/2 flex flex-col pb-12">
//     <input
//       placeholder="Asset Price in Eth"
//       className="mt-2 border rounded p-4"
//       onChange={(e) =>
//         updateFormInput({ ...formInput, price: e.target.value })
//       }
//     />
//     {image && (
//       <img className="rounded mt-4" width="350" src={image} alt="pic" />
//     )}
//     <button
//       onClick={listNFTForSale}
//       className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
//     >
//       List NFT
//     </button>
//   </div>
// </div>
