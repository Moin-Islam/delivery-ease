import React, { useState } from "react";
import MuiTextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
import axios from "axios";
import { baseUrl } from "const/api";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

const CreateCustomer = ({ token, handleClose, storeUpdate }) => {
  const [errorAlert, setOpen] = React.useState({
    open: false,
    key: "",
    value: [],
  });
  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen({
      open: false,
      key: "",
      value: [],
    });
  };
  const [customerName, setCustomerName] = React.useState("");
  const [customerPhone, setCustomerPhone] = React.useState("");
  const handleCustomerName = (e) => {
    setCustomerName(e.target.value);
  };
  const handleCustomerPhone = (e) => {
    setCustomerPhone(e.target.value);
  };
  const submitCustomer = async () => {
    await axios
      .all([
        axios.post(
          `${baseUrl}/party_create`,
          {
            type: "customer",
            customer_type: "Whole Sale",
            name: customerName,
            phone: customerPhone,
            status: 1,
          },
          {
            headers: { Authorization: "Bearer " + token },
          }
        ),
      ])
      .then(
        axios.spread((...responses) => {
          storeUpdate();
          handleClose(false);
        })
      )
      .catch((error) => {
        console.error(error);
        setOpen({
          open: true,
          key: Object.values(error.response.data.message),
          value: Object.values(error.response.data.message),
        });
      });
  };
  return (
    <div>
      <MuiTextField
        label="Name"
        variant="standard"
        fullWidth={true}
        helperText="Customer name"
        margin="normal"
        value={customerName}
        onChange={handleCustomerName}
      />
      <MuiTextField
        label="Phone"
        variant="standard"
        fullWidth={true}
        helperText="Customer Mobile Number"
        margin="normal"
        value={customerPhone}
        onChange={handleCustomerPhone}
      />
      {customerName.length > 0 && customerPhone.length == 11 && (
        <Button
          onClick={submitCustomer}
          variant="outlined"
          fullWidth={true}
          color="primary"
        >
          Create Customer
        </Button>
      )}
      <Snackbar
        open={errorAlert.open}
        autoHideDuration={2000}
        onClose={handleCloseError}
      >
        <Alert onClose={handleCloseError} severity="error" color="error">
          {errorAlert.value[0]}
        </Alert>
      </Snackbar>
    </div>
  );
};
export default CreateCustomer;
