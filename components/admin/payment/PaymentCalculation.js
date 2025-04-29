import { Button, Grid, MenuItem, TextField } from "@material-ui/core";
import { baseUrl } from "const/api";
import React, { useState } from "react";
import axios from "axios";

const PaymentCalculation = ({ data, token, modal, listUpdate }) => {
  const [total, setTotal] = React.useState(data.total_amount);
  const handleTotal = (e) => {
    setTotal(e.target.value);
  };
  const [paid, setPaid] = React.useState(data.paid_amount);
  const handlePaid = (e) => {
    setPaid(e.target.value);
  };
  const [due, setDue] = React.useState(data.due_amount);
  const handleDue = (e) => {
    setDue(e.target.value);
  };
  const [newPaid, setNewPaid] = React.useState(data.due_amount);
  const handleNewPaid = (e) => {
    setNewPaid(e.target.value);
  };
  const [payment, setPayment] = React.useState("Cash");
  const handlePayment = (e) => {
    setPayment(e.target.value);
  };

  const submitPayment = () => {
    axios
      .post(
        `${baseUrl}/payment_paid_due_create`,
        {
          invoice_no: data.invoice_no,
          supplier_id: data.supplier_id,
          warehouse_id: data.warehouse_id,
          total_amount: data.total_amount,
          payment_type: payment,
          paid_amount: parseInt(paid) + parseInt(newPaid),
          new_paid_amount: parseInt(newPaid),
          due_amount: parseInt(due) - parseInt(newPaid),
        },
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        if (res.data.payment_type == "SSL Commerz") {
          axios
            .post(
              `${baseUrl}/checkout/ssl/pay`,
              {
                transaction_id: res.data.transaction_id,
              },
              {
                headers: { Authorization: "Bearer " + token },
              }
            )
            .then((res) => {
              modal();
              window && (window.location.href = res.data);
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
          listUpdate();
          modal();
        }
      });
  };
  return (
    <div>
      <Grid container direction="row" justify="center">
        <TextField
          id="filled-basic"
          fullWidth={true}
          label="Total Amount"
          variant="filled"
          value={total}
          InputProps={{
            readOnly: true,
          }}
          onChange={handleTotal}
        />
        <TextField
          id="filled-basic"
          fullWidth={true}
          label="Paid Amount"
          variant="filled"
          value={paid}
          InputProps={{
            readOnly: true,
          }}
          onChange={handlePaid}
        />
        <TextField
          id="filled-basic"
          fullWidth={true}
          label="Due Amount"
          variant="filled"
          value={due}
          InputProps={{
            readOnly: true,
          }}
          onChange={handleDue}
        />
        <TextField
          id="filled-basic"
          fullWidth={true}
          label="Want to Pay"
          variant="filled"
          value={newPaid}
          onChange={handleNewPaid}
        />
        <TextField
          type="text"
          name="payment_type"
          label="Payment Type"
          select
          fullWidth
          variant="standard"
          helperText="Please select payment type"
          margin="normal"
          value={payment}
          onChange={handlePayment}
        >
          <MenuItem value="Cash">Cash</MenuItem>
          <MenuItem value="Check">Check</MenuItem>
          <MenuItem value="SSL Commerz">SSL Commerz</MenuItem>
        </TextField>
        <Button variant="contained" onClick={submitPayment}>
          Submit
        </Button>
      </Grid>
    </div>
  );
};
export default PaymentCalculation;
