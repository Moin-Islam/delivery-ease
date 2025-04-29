import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Container, Grid, TextField } from '@material-ui/core';
import axios from 'axios';
import { baseUrl, webUrl } from '../../../../const/api';
import ClearIcon from '@material-ui/icons/Clear';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { useAsyncEffect } from 'use-async-effect';
import Paginate from 'components/paginate/Paginate';
import Skeleton from '@material-ui/lab/Skeleton';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
const useStyles = makeStyles({
  root: {
    maxWidth: 245,
  },
});

const WholeProduct = ({
  push,
  setOpenError,
  handleClose,
  token,
  values,
  replace,
}) => {
  const classes = useStyles();
  const [prods, setProds] = React.useState(null);
  const [products, setProducts] = React.useState(null);
  const [load, setLoad] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [dataFilter, setDataFilter] = React.useState(null);
  const [name, setName] = React.useState(null);
  const [barcode, setBarcode] = React.useState(null);
  const [itemcode, setItemcode] = React.useState(null);
  useAsyncEffect(async (isMounted) => {
    await paginateProduct();
  }, []);
  const paginateProduct = async (pageNumber = 1) => {
    setLoading(true);
    await axios
      .all([axios.get(`${baseUrl}/product_list_pagination?page=${pageNumber}`)])
      .then(
        axios.spread((...responses) => {
          // if (!isMounted()) return;
          const responsethree = responses[0];
          console.log(responsethree.data.response.products.data);
          setProducts(responsethree.data.response.products.data);
          setProds(responsethree.data.response.products.data);
          setData(responsethree.data.response.products);
          setDataFilter(responsethree.data.response.products);
          setLoad(true);
          setLoading(false);
        })
      )
      .catch((errors) => {
        console.error(errors);
        setLoad(false);
      });
  };
  const getProduct = (prd) => {
    var __FOUND = values.products.find(function (p, index) {
      if (p.product_id == prd.id) return true;
    });
    if (__FOUND == undefined) {
      push({
        product_id: prd.id,
        product_name: prd.product_name,
        product_unit_id: prd.unit_id,
        product_unit_name: prd.unit_name,
        product_brand_id: prd.brand_id,
        product_brand_name: prd.brand_name,
        price: prd.purchase_price,
        mrp_price: prd.selling_price,
        qty: 0,
      });
    } else {
      let index = values.products.findIndex(
        (pr) => pr.product_id == __FOUND.product_id
      );
      replace(index, {
        product_id: prd.id,
        product_name: prd.product_name,
        product_unit_id: prd.unit_id,
        product_unit_name: prd.unit_name,
        product_brand_id: prd.brand_id,
        product_brand_name: prd.brand_name,
        price: prd.purchase_price,
        mrp_price: prd.selling_price,
        qty: __FOUND.qty + 1,
      });
    }
    handleClose();
  };
  const handleName = (e) => {
    setName(e.target.value);
  };
  const filterByName = (e) => {
    e.preventDefault();
    axios
      .all([
        axios.post(`${baseUrl}/product_list_pagination_product_name?page=1`, {
          name: name,
        }),
      ])
      .then(
        axios.spread((...responses) => {
          const responsethree = responses[0];
          setProds(responsethree.data.response.products.data);
          setDataFilter(responsethree.data.response.products);
          setLoad(true);
          setLoading(false);
        })
      )
      .catch((errors) => {
        console.error(errors);
        setLoad(false);
      });
  };
  const handleItemcode = (e) => {
    setItemcode(e.target.value);
  };
  const filterByItemcode = (e) => {
    e.preventDefault();
    axios
      .all([
        axios.post(`${baseUrl}/product_list_pagination_item_code?page=1`, {
          item_code: itemcode,
        }),
      ])
      .then(
        axios.spread((...responses) => {
          const responsethree = responses[0];
          setProds(responsethree.data.response.products.data);
          setDataFilter(responsethree.data.response.products);
          setLoad(true);
          setLoading(false);
        })
      )
      .catch((errors) => {
        console.error(errors);
        setLoad(false);
      });
  };
  const handleBarcode = (e) => {
    setBarcode(e.target.value);
  };

  const filterByBarcode = (e) => {
    e.preventDefault();
    axios
      .all([
        axios.post(`${baseUrl}/product_list_pagination_barcode?page=1`, {
          barcode: barcode,
        }),
      ])
      .then(
        axios.spread((...responses) => {
          const responsethree = responses[0];
          setProds(responsethree.data.response.products.data);
          setDataFilter(responsethree.data.response.products);
          setLoad(true);
          setLoading(false);
        })
      )
      .catch((errors) => {
        console.error(errors);
        setLoad(false);
      });
  };
  const clearInput = () => {
    setProds(products);
    setDataFilter(data);
    setBarcode('');
    setName('');
    setItemcode('');
  };
  return (
    <div>
      <Container maxWidth="lg">
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={11} style={{ padding: 20 }}>
            <Typography variant="h5" color="primary">
              Selcet Product From The list
            </Typography>
          </Grid>
          <Grid
            item
            xs={1}
            style={{ padding: 20, cursor: 'pointer' }}
            onClick={handleClose}>
            <CloseIcon />
          </Grid>
          <Grid item xs={4} style={{ padding: 5 }}>
            <form onSubmit={filterByName}>
              <TextField
                id="outlined-basic"
                label="Product Name"
                variant="outlined"
                fullWidth={true}
                value={name}
                onChange={handleName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton aria-label="clear" onClick={clearInput}>
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label="clear" onClick={filterByName}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </Grid>
          <Grid item xs={4} style={{ padding: 5 }}>
            <form onSubmit={filterByItemcode}>
              <TextField
                id="outlined-basic"
                label="Item Code"
                variant="outlined"
                fullWidth={true}
                value={itemcode}
                onChange={handleItemcode}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton aria-label="clear" onClick={clearInput}>
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label="clear" onClick={filterByItemcode}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </Grid>
          <Grid item xs={4} style={{ padding: 5 }}>
            <form onSubmit={filterByBarcode}>
              <TextField
                id="outlined-basic"
                label="Barcode"
                variant="outlined"
                fullWidth={true}
                value={barcode}
                onChange={handleBarcode}
                autoFocus={true}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton aria-label="clear" onClick={clearInput}>
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label="clear" onClick={filterByBarcode}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </Grid>
          {!loading ? (
            <>
              {load &&
                prods.map((prod) => (
                  <Grid item xs={2} style={{ padding: 20 }} key={prod.id}>
                    <Card className={classes.root}>
                      <CardActionArea onClick={() => getProduct(prod)}>
                        <CardMedia
                          component="img"
                          alt={prod.product_name}
                          height="100"
                          image={`${webUrl}/uploads/products/${prod.image}`}
                          title={prod.product_name}
                        />
                        <CardContent>
                          <Typography
                            gutterBottom
                            variant="body2"
                            component="h2">
                            {prod.product_name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p">
                            {prod.purchase_price}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            color="textSecondary"
                            component="p">
                            Item Code : {prod.item_code}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            color="textSecondary"
                            component="p">
                            Barcode : {prod.barcode}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                      <CardActions>
                        <Button
                          size="small"
                          color="primary"
                          variant="outlined"
                          fullWidth={true}
                          onClick={() => getProduct(prod)}>
                          Select
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
            </>
          ) : (
            <>
              {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map(() => (
                <Grid
                  item
                  xs={2}
                  container
                  style={{ margin: 10 }}
                  direction="column"
                  justify="center">
                  <Skeleton variant="rect" width={210} height={118} />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="rect" width={210} height={30} />
                </Grid>
              ))}
            </>
          )}

          <Grid item xs={12} container justify="center">
            {load && (
              <Paginate data={dataFilter} getProduct={paginateProduct} />
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};
export default WholeProduct;
