import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Container, Grid, TextField } from "@material-ui/core";
import Axios from "axios";
import { baseUrl, webUrl } from "../../../../const/api";
import ClearIcon from "@material-ui/icons/Clear";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles({
  root: {
    maxWidth: 245,
  },
});

const WholeProduct = ({
  push,
  setOpenError,
  handleClose,
  products,
  token,
  values,
  replace,
}) => {
  const classes = useStyles();
  const [prods, setProds] = React.useState(null);
  const [load, setLoad] = React.useState(false);
  useEffect(() => {
    setProds(products);
    setLoad(true);
  }, []);
  const getProduct = (prd) => {
    console.log(prd);
    var __FOUND = values.products.find(function (p, index) {
      if (p.product_id == prd.product_id) return true;
    });

    if (__FOUND == undefined) {
      push({
        product_id: prd.product_id,
        product_name: prd.product_name,
        product_unit_id: prd.product_unit_id,
        product_unit_name: prd.product_unit_name,
        product_brand_id: prd.product_brand_id,
        product_brand_name: prd.product_brand_name,
        mrp_price: prd.whole_sale_price,
        vat_amount: prd.vat_whole_amount,
        stock: prd.current_stock,
        qty: 0,
      });
    } else {
      let index = values.products.findIndex(
        (pr) => pr.product_id == __FOUND.product_id
      );
      replace(index, {
        product_id: prd.product_id,
        product_name: prd.product_name,
        product_unit_id: prd.product_unit_id,
        product_unit_name: prd.product_unit_name,
        product_brand_id: prd.product_brand_id,
        product_brand_name: prd.product_brand_name,
        mrp_price: prd.whole_sale_price,
        stock: prd.current_stock,
        vat_amount: prd.vat_whole_amount,
        qty: __FOUND.qty + 1,
      });
    }
    handleClose();
  };
  const filterName = (e) => {
    const result = products.filter((item) =>
      item.product_name.includes(e.target.value)
    );
    if (e.target.value == 0) {
      setProds(products);
    } else {
      setProds(result);
    }
  };
  const filterByItemcode = (e) => {
    const result = products.filter((item) => item.item_code == e.target.value);
    if (e.target.value == 0) {
      setProds(products);
    } else {
      setProds(result);
    }
  };
  const filterByBarcode = (e) => {
    const result = products.filter((item) => item.barcode == e.target.value);
    if (e.target.value == 0) {
      setProds(products);
    } else {
      setProds(result);
    }
  };
  const clearInput = () => {
    setProds(products);
  };
  return (
    <div>
      <Container maxWidth="lg">
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={12} style={{ padding: 20 }}>
            <Typography variant="h5" color="primary">
              Selcet Product From The list
            </Typography>
          </Grid>
          <Grid item xs={4} style={{ padding: 5 }}>
            <TextField
              id="outlined-basic"
              label="Product Name"
              variant="outlined"
              fullWidth={true}
              onChange={filterName}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="clear" onClick={clearInput}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={4} style={{ padding: 5 }}>
            <TextField
              id="outlined-basic"
              label="Item Code"
              variant="outlined"
              fullWidth={true}
              onChange={filterByItemcode}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="clear" onClick={clearInput}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={4} style={{ padding: 5 }}>
            <TextField
              id="outlined-basic"
              label="Barcode"
              variant="outlined"
              fullWidth={true}
              onChange={filterByBarcode}
              autoFocus={true}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="clear" onClick={clearInput}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          {load &&
            prods.map((prod) => (
              <Grid item xs={2} style={{ padding: 20 }}>
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
                      <Typography gutterBottom variant="body2" component="h2">
                        {prod.product_name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        {prod.selling_price}Price
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        color="textSecondary"
                        component="p"
                      >
                        Item Code : {prod.item_code}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        color="textSecondary"
                        component="p"
                      >
                        Barcode : {prod.barcode}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    {prod.current_stock > 0 ? (
                      <Button
                        size="small"
                        color="primary"
                        variant="outlined"
                        fullWidth={true}
                        onClick={() => getProduct(prod)}
                      >
                        Select
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        color="secondary"
                        variant="outlined"
                        fullWidth={true}
                      >
                        Stock Out
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Container>
    </div>
  );
};
export default WholeProduct;
