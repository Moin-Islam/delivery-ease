import "../styles/globals.css";
import {
  RootStoreProvider,
  useRootStore,
} from "./../models/root-store-provider";
import { observer } from "mobx-react-lite";
import { Layout } from "../components/Layout";
import { makeStyles } from "@material-ui/core/styles";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { Swrloader } from "components/loader/Swrloader";
import React from "react";
import Head from "next/head";
import { LayoutCustomer } from "components/LayoutCustomer";
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#2C3532",
    },
    // secondary: {
    //   main: "#313131",
    // },
    text: {
      primary: "rgba(0, 0, 0, 1)",
    },

  },
});
const useStyles = makeStyles((theme) => ({}));

const ViewPort = observer(({ Component, pageProps }) => {
  const { user, hydrated } = useRootStore();
  return (
    <React.Fragment>
      {!hydrated ? (
        <Swrloader />
      ) : (
        <div>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, shrink-to-fit=no"
            />
            <title>DeliverEase</title>
          </Head>
          {user.type == "customer" ? (
            <LayoutCustomer>
              <Component {...pageProps} />
            </LayoutCustomer>
          ) : (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          )}
        </div>
      )}
    </React.Fragment>
  );
});

function App(props) {
  const classes = useStyles();
  return (
    <RootStoreProvider>
      <ThemeProvider theme={theme}>
        <ViewPort {...props} />
      </ThemeProvider>
    </RootStoreProvider>
  );
}

export default App;
