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
  useEffect(() => {
    Axios.post(
      `${baseUrl}/store_to_warehouse_stock_return_details`,
      {
        store_stock_return_id: id,
      },
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
      .then((res) => {
        res.data.response.store_stock_return_details.map((prd) =>
          push({
            store_stock_return_detail_id: prd.stock_transfer_return_detail_id,
            product_id: prd.product_id,
            product_name: prd.product_name,
            product_unit_id: prd.product_unit_id,
            product_unit_name: prd.product_unit_name,
            product_brand_id: prd.product_brand_id,
            product_brand_name: prd.product_brand_name,
            price: prd.price,
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
