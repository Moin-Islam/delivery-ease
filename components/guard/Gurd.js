import React from "react";
import Router from "next/router";
import { useRootStore } from "../../models/root-store-provider";
import { observer } from "mobx-react-lite";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid } from "@material-ui/core";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));
const vertical = "top";
const horizontal = "center";
const Gurd = observer(({ children, subject }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const { user } = useRootStore();
  console.log(subject);
  //console.log(subject)
  //console.log(user.has_list_permission(subject))
  // console.log("gurd logstatus-" + user.isLoggedIn);

  if (user.isLoggedIn) {
    const has_permission = user.has_list_permission(subject);
    if (has_permission) {
      return children;
    } else {
      return (
        <div>
          <Grid container direction="row" justify="center" alignItems="center">
            <Snackbar
              anchorOrigin={{ vertical, horizontal }}
              open={open}
              autoHideDuration={2000}
              onClose={handleClose}
            >
              <Alert onClose={handleClose} severity="warning">
                You dont't have permission!
              </Alert>
            </Snackbar>
            {/* <Image
              src={permissiondenied}
              alt="Access Denied"
              width={500}
              height={500}
            /> */}
            <Box mt={5}>
              <img
                src="https://interfacy.com/public/storage/Permissiondenied278cadb5c5a600fd354bbb4a32acf34407bf98f0.png"
                alt=""
                width={350}
                height={350}
              />
            </Box>
          </Grid>
        </div>
      );
    }
  } else {
    Router.push("/login");
  }
  return null;
});
export default Gurd;
