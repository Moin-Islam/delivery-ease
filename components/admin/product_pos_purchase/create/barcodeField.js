import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Form, Field, FieldArray } from "formik";
import { TextField } from "formik-material-ui";
import { MenuItem } from "@material-ui/core";
import { baseUrl } from "../../../../const/api";
import axios from "axios";

const BarcodeField = ({
  setOpenError,
  values,
  products,
  push,
  replace,
  token,
}) => {
  const [barcode, setBarcode] = React.useState("");
  const [data, setData] = React.useState([]);
  const debouncedValue = useDeboounce(barcode, 800);
  React.useEffect(() => {
    (() => {
      if (barcode == "") {
        console.log("barcode 0");
      } else {
        // var __FOUND = products.find(function (p, index) {
        //   if (p.barcode == barcode) return true;
        // });
        axios
          .all([
            axios.post(`${baseUrl}/product_list_pagination_barcode?page=1`, {
              barcode: barcode,
            }),
          ])
          .then(
            axios.spread((...responses) => {
              const responsethree = responses[0];
              const __FOUND = responsethree.data.response.products.data;
              if (__FOUND.length == 0) {
                setOpenError({
                  open: true,
                  key: "404",
                  value: ["Nothing Found"],
                  severity: "error",
                  color: "error",
                });
              } else {
                var found = values.products.find(function (p, index) {
                  if (p.product_id == __FOUND[0].id) return true;
                });
                if (found == undefined) {
                  push({
                    product_id: __FOUND[0].id,
                    product_name: __FOUND[0].product_name,
                    product_unit_id: __FOUND[0].unit_id,
                    product_unit_name: __FOUND[0].unit_name,
                    product_brand_id: __FOUND[0].brand_id,
                    product_brand_name: __FOUND[0].brand_name,
                    price: __FOUND[0].purchase_price,
                    mrp_price: __FOUND[0].selling_price,
                    qty: 0,
                  });
                  setBarcode("");
                  setOpenError({
                    open: true,
                    key: "404",
                    value: ["Product Added"],
                    severity: "success",
                    color: "success",
                  });
                } else {
                  let index = values.products.findIndex(
                    (pr) => pr.product_id == found.product_id
                  );
                  replace(index, {
                    product_id: __FOUND[0].id,
                    product_name: __FOUND[0].product_name,
                    product_unit_id: __FOUND[0].unit_id,
                    product_unit_name: __FOUND[0].unit_name,
                    product_brand_id: __FOUND[0].brand_id,
                    product_brand_name: __FOUND[0].brand_name,
                    price: __FOUND[0].purchase_price,
                    mrp_price: __FOUND[0].selling_price,
                    qty: found.qty + 1,
                  });
                  setBarcode("");
                  setOpenError({
                    open: true,
                    key: "404",
                    value: [`Quantity Updated for ${__FOUND[0].product_name}`],
                    severity: "success",
                    color: "success",
                  });
                }
              }
            })
          )
          .catch((errors) => {
            console.error(errors);
            setLoad(false);
          });
      }
    })();
  }, [debouncedValue]);

  const findByBarcode = (e) => {
    setBarcode(e.target.value);
  };
  return (
    <div>
      <Field
        component={TextField}
        variant="outlined"
        margin="normal"
        fullWidth
        autoFocus={true}
        type="text"
        label="Barcode"
        name="barcode"
        value={barcode}
        margin="dense"
        onChange={findByBarcode}
      />
    </div>
  );
};
export default BarcodeField;

const useDeboounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
