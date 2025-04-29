import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Form, Field, FieldArray } from "formik";
import { TextField } from "formik-material-ui";
import { MenuItem } from "@material-ui/core";
import { baseUrl } from "../../../../const/api";
import axios from "axios";

const ItemCode = ({
  setOpenError,
  values,
  products,
  push,
  replace,
  token,
  warehouse_id,
}) => {
  const [item, setItem] = React.useState("");
  const debouncedValue = useDeboounce(item, 800);
  React.useEffect(() => {
    (() => {
      if (item == "") {
        console.log("item 0");
      } else {
        axios
          .all([
            axios.post(
              `${baseUrl}/warehouse_current_stock_list_pagination_item_code?page=1`,
              {
                warehouse_id: warehouse_id,
                item_code: item,
              },
              {
                headers: { Authorization: "Bearer " + token },
              }
            ),
          ])
          .then(
            axios.spread((...responses) => {
              const responsethree = responses[0];
              const __FOUND =
                responsethree.data.response.warehouse_current_stock_list.data;
              if (__FOUND.length == 0) {
                setOpenError({
                  open: true,
                  key: "404",
                  value: ["Nothing Found"],
                  severity: "error",
                  color: "error",
                });
                setItem("");
              } else {
                var found = values.products.find(function (p, index) {
                  if (p.product_id == __FOUND[0].product_id) return true;
                });
                if (found == undefined) {
                  push({
                    product_id: __FOUND[0].product_id,
                    product_name: __FOUND[0].product_name,
                    product_unit_id: __FOUND[0].product_unit_id,
                    product_unit_name: __FOUND[0].product_unit_name,
                    product_brand_id: __FOUND[0].product_brand_id,
                    product_brand_name: __FOUND[0].product_brand_name,
                    price: __FOUND[0].purchase_price,
                    mrp_price: __FOUND[0].selling_price,
                    stock: __FOUND[0].current_stock,
                    qty: 0,
                  });
                  setItem("");
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
                    product_id: __FOUND[0].product_id,
                    product_name: __FOUND[0].product_name,
                    product_unit_id: __FOUND[0].product_unit_id,
                    product_unit_name: __FOUND[0].product_unit_name,
                    product_brand_id: __FOUND[0].product_brand_id,
                    product_brand_name: __FOUND[0].product_brand_name,
                    price: __FOUND[0].purchase_price,
                    mrp_price: __FOUND[0].selling_price,
                    stock: __FOUND[0].current_stock,
                    qty: found.qty + 1,
                  });
                  setItem("");
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
          });
      }
    })();
  }, [debouncedValue]);

  const findByItemcode = (e) => {
    setItem(e.target.value);
  };
  return (
    <div>
      <Field
        component={TextField}
        variant="outlined"
        fullWidth
        type="text"
        label="Search by item code"
        name="item"
        value={item}
        margin="dense"
        onChange={findByItemcode}
      />
    </div>
  );
};
export default ItemCode;

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
