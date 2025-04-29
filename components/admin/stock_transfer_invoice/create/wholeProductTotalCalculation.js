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

const WholeProductTotalCalculation = ({
  values,
  total,
  setTotal,
  paid,
  setPaid,
  due,
  setDue,
  vat,
  setVat,
  discount,
  setDiscount,
}) => {
  const classes = useStyles();
  console.log(values.products);
  const [dis, setDis] = React.useState(discount);
  const [apply, setApply] = React.useState(false);
  let t = 0;
  let v = 0;
  // useEffect(() => {
  //   setTotal(total);
  //   setPaid(paid);
  //   setDue(due);
  // }, []);
  useEffect(() => {
    values.products.map(
      (prd) => (t = t + (prd.mrp_price + prd.vat_amount) * prd.qty)
    );
    values.products.map((prd) => (v = v + prd.vat_amount * prd.qty));
    setVat(v.toFixed(2));
    setTotal((t - discount).toFixed(2));
    setDue((t - discount - paid).toFixed(2));
  }, [values]);

  const getPaid = (event) => {
    setPaid(event.target.value);
    if (total - event.target.value < 0 || total == 0) {
      setDue(0);
    } else {
      setDue(total - event.target.value);
    }
  };
  const setDisco = (event) => {
    setDis(event.target.value);
  };
  const calDiscount = () => {
    if (dis != 0) {
      setApply(true);
      if (values.discount_type == "Flat") {
        if (total - dis <= 0) {
          setTotal(0);
          setDue(0);
          setPaid(0);
          setDiscount(0);
        } else {
          setTotal(total - dis);
          const a = total - dis;
          if (a - paid < 0) {
            setDue(0);
          } else {
            setDue(a - paid);
          }
          setDiscount(dis);
        }
      } else if (values.discount_type == "Percentage") {
        const d = Math.floor((dis * total) / 100);
        console.log(d);
        if (d <= 0) {
          setTotal(0);
          setDue(0);
          setPaid(0);
          setDiscount(0);
        } else {
          setTotal(total - d);
          const a = total - d;
          if (a - paid < 0) {
            setDue(0);
          } else {
            setDue(a - paid);
          }

          setDiscount(d);
        }
      }
    } else {
      alert("Discount can not be 0");
    }
  };
  const cancelDis = (event) => {
    let t = 0;
    values.products.map((prd) => (t = t + prd.mrp_price * prd.qty));
    setTotal(t);
    setDue(t - paid);
    setDiscount(0);
    setDis(0);
    setApply(false);
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
      <Field
        component={TextField}
        variant="filled"
        margin="normal"
        fullWidth
     type="tel"
        label="Total VAT"
        name="vat_amount"
        value={vat}
        InputProps={{
          readOnly: true,
        }}
      />
      <Field
        component={TextField}
        variant="filled"
        margin="normal"
        fullWidth
     type="tel"
        label="Paid Amount"
        name="paid_total"
        value={paid}
        onChange={getPaid}
      />
      <Field
        component={TextField}
        variant="filled"
        margin="normal"
        fullWidth
     type="tel"
        label="Due Amount"
        name="due_amount"
        InputProps={{
          readOnly: true,
        }}
        value={due}
      />

      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Box mt={2}>
            <Typography variant="subtitle2">Discount</Typography>
          </Box>
        </GridItem>

        <GridItem xs={12} sm={12} md={12}>
          <Field
            component={TextField}
            type="text"
            name="discount_type"
            label="Discount Type"
            select
            fullWidth
            variant="filled"
            // onChange={cancelDis}
            margin="normal"
          >
            <MenuItem value="Flat">Flat</MenuItem>
            <MenuItem value="Percentage">Percentage</MenuItem>
          </Field>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Field
            component={TextField}
            variant="filled"
            margin="normal"
            fullWidth
         type="tel"
            label="Discount Amount"
            name="discount_amount"
            disabled={false}
            value={dis}
            onChange={setDisco}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <GridContainer>
            <GridItem xs={6} sm={6} md={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={calDiscount}
                fullWidth={true}
                disable={apply}
              >
                Apply
              </Button>
            </GridItem>
            <GridItem xs={6} sm={6} md={6}>
              <Button
                variant="contained"
                color="secondary"
                onClick={cancelDis}
                fullWidth={true}
              >
                Cancel
              </Button>
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>

      <Field
        component={TextField}
        type="text"
        name="payment_type"
        label="Payment Type"
        select
        fullWidth
        variant="filled"
        helperText="Please select payment type"
        margin="normal"
      >
        <MenuItem value="Cash">Cash</MenuItem>
        <MenuItem value="Check">Check</MenuItem>
        <MenuItem value="Check">Card</MenuItem>
        <MenuItem value="Bkash">Bkash</MenuItem>
        <MenuItem value="Nogod">Nogod</MenuItem>
        <MenuItem value="Rocket">Rocket</MenuItem>
        <MenuItem value="Upay">Upay</MenuItem>
      </Field>
    </div>
  );
};
export default WholeProductTotalCalculation;
