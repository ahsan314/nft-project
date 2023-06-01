import React from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";

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

function AboutUs() {
  const classes = useStyles();
  return (
    <div className={classes.main}>
      <Typography sx={{ mt: 2, mb: 2 }} gutterBottom variant="h3">
        About Us
      </Typography>
      <Typography sx={{ mb: 10 }} gutterBottom variant="h5">
        It’s not just our track record, the efficiency of our process and the
        quality of our products. Going beyond the scope, valuing client
        relationship, keeping quality on top of long-term goals is what make us
        HASHMAKER SOLUTIONS.
      </Typography>
      <Paper
        sx={{
          position: "relative",
          backgroundColor: "grey.700",
          color: "#fff",
          mb: 10,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: "rgba(0,0,0,.3)",
          }}
        />
        <Grid container>
          <Grid item md={4}>
            <Box
              sx={{
                position: "relative",
                p: { xs: 3, md: 6 },
                pr: { md: 0 },
              }}
            >
              <Typography
                component="h1"
                variant="h3"
                color="inherit"
                gutterBottom
              >
                Our Culture
              </Typography>
              <Typography variant="h5" color="inherit" paragraph>
                We have big ambitions and we never stop pursuing growth, but we
                still want our team to feel like home for those who are a part
                of it.
              </Typography>
              <Link
                variant="subtitle1"
                href="https://www.hashmakersol.com/about-us/"
              >
                Continue reading…
              </Link>
            </Box>
          </Grid>
          <Grid item md={8} sx={{ p: 5 }}>
            {
              <img
                // style={{ display: "none" }}
                src="https://www.hashmakersol.com/wp-content/themes/understrap-child/img/logo-white.png"
                alt="main image description"
                width={800}
                height={250}
              />
            }
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
export default AboutUs;
