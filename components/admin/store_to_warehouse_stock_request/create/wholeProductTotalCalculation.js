import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Form, Field, FieldArray } from "formik";
import { TextField } from "formik-material-ui";
import { MenuItem } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    maxWidth: 245,
  },
});

const WholeProductTotalCalculation = ({
  values,
  total,
  setTotal,
  paid,
  setPaid,
  due,
  setDue,
}) => {
  const classes = useStyles();
  console.log(values.products);
  let t = 0;
  useEffect(() => {
    values.products.map((prd) => (t = t + prd.mrp_price * prd.qty));
    setTotal(t);
  }, [values]);

  const getPaid = (event) => {
    setPaid(event.target.value);
    if (total - event.target.value < 0 || total == 0) {
      setDue(0);
    } else {
      setDue(total - event.target.value);
    }
  };
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
        value={total}
        InputProps={{
          readOnly: true,
        }}
      />
    </div>
  );
};
export default WholeProductTotalCalculation;
