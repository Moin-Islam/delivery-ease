import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  LinearProgress,
} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import StoreIcon from '@material-ui/icons/Store';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import { baseUrl } from 'const/api';
import { useAsyncEffect } from 'use-async-effect';
import axios from 'axios';
import { useRootStore } from 'models/root-store-provider';
import { observer } from 'mobx-react-lite';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SaleDetails from 'components/customer/sale/SaleDetails';
import Paginate from 'components/paginate/Paginate';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));
const PurchaseHistory = observer(({ party }) => {
  const classes = useStyles();
  const { user } = useRootStore();
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = (id) => {
    setSaleId(id);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [load, setLoad] = React.useState(false);
  const [sales, setSales] = React.useState(null);
  const [dataFilter, setDataFilter] = React.useState(null);
  const [balance, setBalance] = React.useState(0);
  const [saleId, setSaleId] = React.useState(0);


 

  const paginateProducts = async (pageNumber = 1) => {
    await axios
      .all([
        axios.post(`${baseUrl}/customer_sale_by_customer_id?page=${pageNumber}`,
        {
          customer_id: party.id,
        },
        {
          headers: { Authorization: 'Bearer ' + user.auth_token },
        }
        ),
      ])
      .then(
        axios.spread((...responses) => {
          const responsethree = responses[0];
          setSales(responsethree.data.response.product_sales.data);

            setDataFilter(responsethree?.data?.response?.product_sales)
   
          setLoad(true);
        })
      )
      .catch((errors) => {
        console.error(errors);
        setLoad(false);
      });
  };

  useAsyncEffect(async (isMounted) => {
    console.log('ksks');
    await paginateProducts();
  }, []);
  return (
    <Container maxWidth="lg" style={{ marginBottom: 100 }}>
      <Box mt={2}>
        <div className={classes.root}>
          <AppBar position="static" style={{ backgroundColor: '#ffffff' }}>
            <Toolbar>
              <Typography
                variant="h6"
                color="primary"
                className={classes.title}>
                Shopping List
              </Typography>
            </Toolbar>
          </AppBar>
        </div>
      </Box>
      <Box mt={3}>
        {load ? (
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={2}>


            {sales ? (
              sales.map((sale) => (
                <Grid item xs={12} sm={6} md={3}>
                  <Card className={classes.root}>
                    <CardActionArea>
                      {/* <CardMedia
                        component="img"
                        alt="Contemplative Reptile"
                        height="180"
                        image="/img/customer_order.jpg"
                        title="Contemplative Reptile"
                      /> */}
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="h2">
                          {sale.invoice_no}
                        </Typography>
                        <Typography color="textSecondary">
                          <Box
                            style={{
                              display: 'inline-flex',
                            }}
                            component="span"
                            mb={1}>
                            <StoreIcon />
                            <Box ml={1} component="span">
                              {sale.store_name}
                            </Box>
                          </Box>
                        </Typography>
                        <Typography color="textSecondary">
                          <Box
                            style={{
                              display: 'inline-flex',
                            }}
                            component="span"
                            mb={1}>
                            <EventAvailableIcon />
                            <Box ml={1} component="span">
                              {sale.sale_date_time}
                            </Box>
                          </Box>
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions>
                      <Typography color="primary" style={{ flexGrow: 1 }}>
                        <Typography variant="h6">
                          ৳{sale.total_amount}
                        </Typography>
                      </Typography>
                      <Button
                        size="small"
                        color="primary"
                        endIcon={<ArrowRightAltIcon />}
                        onClick={() => handleClickOpen(sale.id)}>
                        Details
                      </Button>
                    </CardActions>
                  </Card>

               
                </Grid>
              ))
            ) : (
              <Box p={2} mb={3}>
                <Typography variant="h3" color="secondary">
                  Nothing Found
                </Typography>
              </Box>
            )}
          </Grid>
        ) : (
          <LinearProgress />
        )}
      </Box>

      <Grid container justify="center">
                  {sales && (
                    <Paginate data={dataFilter} getProduct={paginateProducts} />
                  )}
                </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        {/* <DialogTitle id="alert-dialog-title">
          {""}
        </DialogTitle> */}
        <DialogContent>
          <SaleDetails
            token={user && user.auth_token}
            id={saleId}
            user_id={user.details && user.details.id}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
});
export default PurchaseHistory;
