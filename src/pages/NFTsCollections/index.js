import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Grid from "@mui/material/Grid";
import Link from "next/link";

import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles({
  homepage: {},
  main: {
    backgroundColor: "#14141F",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: "50px",
    paddingRight: "50px",
  },
});

function NFTsCollections() {
  const collections = [
    {
      name: "GreenPark Sports",
      src: "https://blog.greenparksports.com/content/images/2021/12/Virtue_Drive_logo_06.jpg",
    },
    {
      name: "Gods Unchained",
      src: "https://images.godsunchained.com/misc/gu-cover-photo-1.jpg",
    },
    {
      name: "Guild of Guardians",
      src: "https://gog-art-assets.s3-ap-southeast-2.amazonaws.com/Content/Thumbnails/Heroes/Lia/Thumbnail_Hero_Lia_Base.png",
    },
    {
      name: "Greature Club",
      src: "http://cdn-production.joinhighrise.com/hcc/hcc_collectionimage.png",
    },
    {
      name: "Nuggets",
      src: "https://cdn.niftynuggets.org/assets/icon.png",
    },
    {
      name: "MistoMan",
      src: "https://cryptocollection.s3.ap-northeast-1.amazonaws.com/imx/collection.gif",
    },
    {
      name: "Baby Ape",
      src: "https://bloock.art/icon.jpeg",
    },
  ];

  const classes = useStyles();
  return (
    <div className={classes.main}>
      <h1>All Collections</h1>
      <Grid container spacing={2}>
        {collections.map((e, i) => {
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Link passHref href='/NFTsOneCollection'>
                <Card sx={{ maxWidth: 345 }}>
                  <CardActionArea>
                    <CardMedia
                      component='img'
                      height='300'
                      image={e.src}
                      alt='green iguana'
                    />
                    <CardContent>
                      <Typography gutterBottom variant='h5' component='div'>
                        {e.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}

export default NFTsCollections;
