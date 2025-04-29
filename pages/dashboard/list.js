import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Button, CircularProgress, Grid } from '@material-ui/core';
import { useRootStore } from '../../models/root-store-provider';
import { observer } from 'mobx-react-lite';
import MonetizationOnRoundedIcon from '@material-ui/icons/MonetizationOnRounded';
import { baseUrl } from '../../const/api';
import axios from 'axios';
import ArrowRightAltRoundedIcon from '@material-ui/icons/ArrowRightAltRounded';
import AddShoppingCartRoundedIcon from '@material-ui/icons/AddShoppingCartRounded';
import ShoppingCartRoundedIcon from '@material-ui/icons/ShoppingCartRounded';
import KeyboardReturnRoundedIcon from '@material-ui/icons/KeyboardReturnRounded';
import TransformRoundedIcon from '@material-ui/icons/TransformRounded';
import { useAsyncEffect } from 'use-async-effect';
import Link from 'next/link';
import Gurd from 'components/guard/Gurd';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
  root: {
    // display: "flex",
    background:
      'linear-gradient(0deg, rgba(0,46,121,1) 0%, rgba(22,77,167,1) 27%, rgba(86,150,255,1) 100%)',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const title = 'Dashboard';
const subject = 'dashboard';

const Dashboard = observer(() => {
  const classes = useStyles();
  const theme = useTheme();
  const { user } = useRootStore();

  const [load, setLoad] = useState(false);
  const [todayPurchase, setTodayPurchase] = useState(null);
  const [todaySale, setTodaySale] = useState(null);
  const [todayPurchaseRe, setTodayPurchaseRe] = useState(null);
  const [todaySaleRe, setTodaySaleRe] = useState(null);
  const [totalPurchase, setTotalPurchase] = useState(null);
  const [totalSale, setTotalSale] = useState(null);
  const [totalPurchaseRe, setTotalPurchaseRe] = useState(null);
  const [totalSaleRe, setTotalSaleRe] = useState(null);
  const [todayProfit, setTodayProfit] = useState(null);
  const [totalProfit, setTotalProfit] = useState(null);

  const urlTodayPurchase = `${baseUrl}/today_purchase`;
  const urlTodaySale = `${baseUrl}/today_sale`;
  const urlTodayPurchaseRe = `${baseUrl}/today_purchase_return`;
  const urlTodaySaleRe = `${baseUrl}/today_sale_return`;
  const urlTotalPurchase = `${baseUrl}/total_purchase`;
  const urlTotalSale = `${baseUrl}/total_sale`;
  const urlTotalPurchaseRe = `${baseUrl}/total_purchase_return`;
  const urlTotalSaleRe = `${baseUrl}/total_sale_return`;
  const urlTodayProfit = `${baseUrl}/today_profit`;
  const urlTotalProfit = `${baseUrl}/total_profit`;

  useAsyncEffect(async (isMounted) => {
    const todSale = axios.get(urlTodaySale, {
      headers: { Authorization: 'Bearer ' + user.auth_token },
    });
    const todPur = axios.get(urlTodayPurchase, {
      headers: { Authorization: 'Bearer ' + user.auth_token },
    });
    const todPurRe = axios.get(urlTodayPurchaseRe, {
      headers: { Authorization: 'Bearer ' + user.auth_token },
    });
    const todSaleRe = axios.get(urlTodaySaleRe, {
      headers: { Authorization: 'Bearer ' + user.auth_token },
    });
    const totalPur = axios.get(urlTotalPurchase, {
      headers: { Authorization: 'Bearer ' + user.auth_token },
    });
    const totalSale = axios.get(urlTotalSale, {
      headers: { Authorization: 'Bearer ' + user.auth_token },
    });
    const totalPurRe = axios.get(urlTotalPurchaseRe, {
      headers: { Authorization: 'Bearer ' + user.auth_token },
    });
    const totSaleRe = axios.get(urlTotalSaleRe, {
      headers: { Authorization: 'Bearer ' + user.auth_token },
    });
    const todProfit = axios.get(urlTodayProfit, {
      headers: { Authorization: 'Bearer ' + user.auth_token },
    });
    const totProfit = axios.get(urlTotalProfit, {
      headers: { Authorization: 'Bearer ' + user.auth_token },
    });
    await axios
      .all([
        todSale,
        todPur,
        todPurRe,
        todSaleRe,
        totalPur,
        totalSale,
        totalPurRe,
        totSaleRe,
        todProfit,
        totProfit,
      ])
      .then(
        axios.spread((...responses) => {
          if (!isMounted()) return;
          setTodaySale(responses[0].data.response);
          setTodayPurchase(responses[1].data.response);
          setTodayPurchaseRe(responses[2].data.response);
          setTodaySaleRe(responses[3].data.response);
          setTotalPurchase(responses[4].data.response);
          setTotalSale(responses[5].data.response);
          setTotalPurchaseRe(responses[6].data.response);
          setTotalSaleRe(responses[7].data.response);
          setTodayProfit(responses[8].data.response);
          setTotalProfit(responses[9].data.response);
          setLoad(true);
        })
      )
      .catch((errors) => {
        console.error(errors);
        setLoad(true);
      });
  }, []);
  const router = useRouter();

  return (
    <div>

      <Gurd subject={subject}>
        <Grid container direction="row" justify="space-evenly" spacing={2}>

          <Grid item xs={12} md={3}>
            <Link href="/product_pos_purchase/list">
              <Card className={classes.root} style={{ cursor: 'pointer' }}>
                <Grid container direction="row">
                  <Grid item xs={8} md={8}>
                    <CardContent>
                      <Typography
                        component="h5"
                        variant="h5"
                        style={{ fontWeight: '700', color: '#ffffff' }}>
                        {todayPurchase ? (
                          todayPurchase.toFixed(2)
                        ) : load ? (
                          <Button
                            variant="text"
                            style={{ color: 'rgb(255, 169, 4)' }}
                            size="medium"
                            className={classes.button}
                            endIcon={<ArrowRightAltRoundedIcon />}>
                            Start
                          </Button>
                        ) : (
                          <CircularProgress />
                        )}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        style={{ color: 'rgb(255, 169, 4)' }}>
                        Today Purchase
                      </Typography>
                    </CardContent>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    md={4}
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center">
                    <ShoppingCartRoundedIcon
                      style={{ color: 'rgb(255, 169, 4)', fontSize: 65 }}
                    />
                  </Grid>
                </Grid>
              
              </Card>
            </Link>
          </Grid>


          <Grid item xs={12} md={3}>
            <Link href="/product_pos_sale/list">
              <Card className={classes.root} style={{ cursor: 'pointer' }}>
                <Grid container direction="row">
                  <Grid item xs={8} md={8}>
                    <CardContent>
                      <Typography
                        component="h5"
                        variant="h5"
                        style={{ fontWeight: '700', color: '#ffffff' }}>
                        {todaySale ? (
                          todaySale.toFixed(2)
                        ) : load ? (
                          <Button
                            variant="text"
                            style={{ color: 'rgb(255, 169, 4)' }}
                            size="medium"
                            className={classes.button}
                            endIcon={<ArrowRightAltRoundedIcon />}>
                            Start
                          </Button>
                        ) : (
                          <CircularProgress />
                        )}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        style={{ color: 'rgb(255, 169, 4)' }}>
                        Today Sale
                      </Typography>
                    </CardContent>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    md={4}
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center">
                    <AddShoppingCartRoundedIcon
                      style={{ color: 'rgb(255, 169, 4)', fontSize: 65 }}
                    />
                  </Grid>
                </Grid>
          
              </Card>
            </Link>
          </Grid>







          <Grid item xs={12} md={3}>
            <Card className={classes.root}>
              <Grid container direction="row">
                <Grid item xs={8} md={8}>
                  <CardContent>
                    <Typography
                      component="h5"
                      variant="h5"
                      style={{ fontWeight: '700', color: '#ffffff' }}>
                      {totalPurchase ? (
                        totalPurchase.toFixed(2)
                      ) : load ? (
                        <Button
                          variant="text"
                          style={{ color: 'rgb(255, 169, 4)' }}
                          size="medium"
                          className={classes.button}
                          endIcon={<ArrowRightAltRoundedIcon />}>
                          Start
                        </Button>
                      ) : (
                        <CircularProgress />
                      )}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="textSecondary"
                      style={{ color: 'rgb(255, 169, 4)' }}>
                      Total Purchase
                    </Typography>
                  </CardContent>
                </Grid>
                <Grid
                  item
                  xs={4}
                  md={4}
                  container
                  direction="row"
                  justify="flex-start"
                  alignItems="center">
                  <ShoppingCartRoundedIcon
                    style={{ color: 'rgb(255, 169, 4)', fontSize: 65 }}
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card className={classes.root}>
              <Grid container direction="row">
                <Grid item xs={8} md={8}>
                  <CardContent>
                    <Typography
                      component="h5"
                      variant="h5"
                      style={{ fontWeight: '700', color: '#ffffff' }}>
                      {totalSale ? (
                        totalSale.toFixed(2)
                      ) : load ? (
                        <Button
                          variant="text"
                          style={{ color: 'rgb(255, 169, 4)' }}
                          size="medium"
                          className={classes.button}
                          endIcon={<ArrowRightAltRoundedIcon />}>
                          Start
                        </Button>
                      ) : (
                        <CircularProgress />
                      )}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="textSecondary"
                      style={{ color: 'rgb(255, 169, 4)' }}>
                      Total Sale
                    </Typography>
                  </CardContent>
                </Grid>
                <Grid
                  item
                  xs={6}
                  md={3}
                  container
                  direction="row"
                  justify="flex-start"
                  alignItems="center">
                  <AddShoppingCartRoundedIcon
                    style={{ color: 'rgb(255, 169, 4)', fontSize: 65 }}
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>
  
        
        </Grid>
      </Gurd>
    </div>
  );
});
export default Dashboard;
