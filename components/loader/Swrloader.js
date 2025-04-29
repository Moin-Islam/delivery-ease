import {
  Grid,
  CircularProgress,
  Typography,
  Box,
  Container,
} from "@material-ui/core";
import React from "react";

export const Swrloader = () => {
  return (
    <div style={{ flexGrow: 1 }}>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        style={{
          minHeight: "100vh",
          maxWidth: "100%",
          backgroundColor: "honeydew",
        }}
      >
        <CircularProgress color="primary" />
        <Typography variant="h5">Loading..</Typography>
      </Grid>
    </div>
  );
};
