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
import { baseUrl } from "../../../../const/api";
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
  id,
}) => {
  const classes = useStyles();
  const [prods, setProds] = React.useState(null);
  const [load, setLoad] = React.useState(false);
  console.log("id" + id);
  useEffect(() => {
    Axios.post(
      `${baseUrl}/product_whole_sale_details`,
      {
        product_sale_id: id,
      },
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
      .then((res) => {
    

        res.data.response.product_whole_sale_details.map((prd) =>
          push({
            product_sale_detail_id: prd.product_sale_detail_id,
            product_id: prd.product_id,
            product_name: prd.product_name,
            product_unit_id: prd.product_unit_id,
            product_unit_name: prd.product_unit_name,
            product_brand_id: prd.product_brand_id,
            product_brand_name: prd.product_brand_name,
            mrp_price: prd.mrp_price,
            vat_amount: prd.vat_amount,
            qty: prd.qty,
          })
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return <div></div>;
};
export default WholeProduct;
