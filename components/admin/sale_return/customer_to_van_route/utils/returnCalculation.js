import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Form, Field, FieldArray } from "formik";
import { TextField } from "formik-material-ui";
import { Box, Button, MenuItem, Typography } from "@material-ui/core";
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";

const useStyles = makeStyles({
  root: {
    maxWidth: 245,
  },
});

const ReturnCalculation = ({
  values,
  total,
  setTotal,
  paid,
  setPaid,
  due,
  setDue,
  discount,
  setDiscount,
}) => {
  const classes = useStyles();

  // console.log(values.products);
  // const [dis, setDis] = React.useState(discount);
  // const [apply, setApply] = React.useState(false);
  // let t = 0;
  // useEffect(() => {
  //   values.products.map((prd) => (t = t + prd.price * prd.new_return_qty));
  //   setTotal(t);
  //   setDue(t - discount - paid);
  // }, [values.products]);

  // const getPaid = (event) => {
  //   setPaid(event.target.value);
  //   if (total - event.target.value < 0 || total == 0) {
  //     setDue(0);
  //   } else {
  //     setDue(total - event.target.value);
  //   }
  // };
  // const setDisco = (event) => {
  //   setDis(event.target.value);
  // };
  // const calDiscount = () => {
  //   if (dis != 0) {
  //     setApply(true);
  //     if (values.discount_type == "Flat") {
  //       if (total - dis <= 0) {
  //         setTotal(0);
  //         setDue(0);
  //         setPaid(0);
  //         setDiscount(0);
  //       } else {
  //         setTotal(total - dis);
  //         const a = total - dis;
  //         setDue(a - paid);
  //         setDiscount(dis);
  //       }
  //     } else if (values.discount_type == "Percentage") {
  //       const d = Math.floor((dis * total) / 100);
  //       console.log(d);
  //       if (d <= 0) {
  //         setTotal(0);
  //         setDue(0);
  //         setPaid(0);
  //         setDiscount(0);
  //       } else {
  //         setTotal(total - d);
  //         const a = total - d;
  //         setDue(a - paid);
  //         setDiscount(d);
  //       }
  //     }
  //   } else {
  //     alert("Discount can not be 0");
  //   }
  // };
  // const cancelDis = (event) => {
  //   let t = 0;
  //   values.products.map((prd) => (t = t + prd.price * prd.qty));
  //   setTotal(t);
  //   setDue(t - paid);
  //   setDiscount(0);
  //   setDis(0);
  //   setApply(false);
  // };
  // const getDue = () => {
  //   setDue(total - due);
  // };
  return (
    <div>
      <Field
        component={TextField}
        variant="filled"
        margin="normal"
        fullWidth
     type="tel"
        label="Total Amount"
        name="grand_total"
        // value={total}
        InputProps={{
          readOnly: true,
        }}
      />

    </div>
  );
};
export default ReturnCalculation;
