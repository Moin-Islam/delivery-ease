import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Axios from "axios";
import { baseUrl } from "../../../../const/api";

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
      `${baseUrl}/product_pos_purchase_details`,
      {
        product_purchase_id: id,
      },
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
      .then((res) => {
 

        console.log(res.data.response.product_pos_purchase_details);
        res.data.response.product_pos_purchase_details.map((prd) =>
          push({
            product_purchase_detail_id: prd.product_purchase_detail_id,
            product_id: prd.product_id,
            product_name: prd.product_name,
            product_unit_id: prd.product_unit_id,
            product_unit_name: prd.product_unit_name,
            product_brand_id: prd.product_brand_id,
            product_brand_name: prd.product_brand_name,
            price: prd.price,
            mrp_price: prd.mrp_price,
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
