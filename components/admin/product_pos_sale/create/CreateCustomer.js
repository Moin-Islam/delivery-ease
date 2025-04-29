import React from 'react';
import MuiTextField from '@material-ui/core/TextField';
import { Button, Typography } from '@material-ui/core';
import axios from 'axios';
import cogoToast from 'cogo-toast';
import { baseUrl } from 'const/api';


const CreateCustomer = ({
  token,
  handleClose,
  storeUpdate,
  setPartyName,
  setPartyId,
  setPartyPhone,
  newPhone,
  setNewPhone,
}) => {

  const [customerName, setCustomerName] = React.useState('');
  const [customerStoreName, setCustomerStoreName] = React.useState('');
  const [customerCode, setCustomerCode] = React.useState('');
  const [vat_number, setVatNumber] = React.useState('');
  const [virtualBalance, setVirtualBalance] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [address, setAddress] = React.useState(null);
  const [customerPhone, setCustomerPhone] = React.useState(
    newPhone ? newPhone : ''
  );
  const handleCustomerName = (e) => {
    setCustomerName(e.target.value);
  };
  const handleCustomerStoreName = (e) => {
    setCustomerStoreName(e.target.value);
  };
  const handleCustomerPhone = (e) => {
    setCustomerPhone(e.target.value);
  };
  const handleCustomerCode = (e) => {
    setCustomerCode(e.target.value);
  };
  const handleCustomerVatNumber = (e) => {
    setVatNumber(e.target.value);
  };

  const onKeyPress = (e) => {
    if (e.which === 13) {
      submitCustomer();
    }
  };
  const submitCustomer = async () => {
    await axios
      .all([
        axios.post(
          //`${baseUrl}/party_create`,
          `${baseUrl}/pos_customer_create`,
          {
            type: 'customer',
            customer_type: 'POS Sale',
            name: customerName,
            customer_store_name: customerStoreName,
            phone: customerPhone,
            customer_code: customerCode,
            vat_number:vat_number,
            email:email,
            address:address,
            virtual_balance: 0,
            status: 1,
          },
          {
            headers: { Authorization: 'Bearer ' + token },
          }
        ),
      ])
      .then(
        axios.spread((...responses) => {
          const responsethree = responses[0];
          setPartyName(responsethree.data.response.name);
          setPartyPhone(responsethree.data.response.phone);
          setPartyId(responsethree.data.response.id);
          setNewPhone(null);
          storeUpdate();
          handleClose(false);
          cogoToast.success('Create Success',{position: 'top-right', bar:{size: '10px'}});
        })
      )
      .catch((error) => {
 
        handleClose(false);
        setNewPhone(null);
        cogoToast.error('Something went wrong',{position: 'top-right', bar:{size: '10px'}});
      });
  };
  return (
    <div >
      <MuiTextField
        label="Customer Name"
        variant="standard"
        fullWidth={true}
        // helperText="Customer Name"
        margin="normal"
        value={customerName}
        onChange={handleCustomerName}
      />
      {customerName.length == 0 && (
        <Typography variant="subtitle2" color="secondary">
          Please fill up the name
        </Typography>
      )}
      <MuiTextField
        label="Customer Store Name"
        variant="standard"
        fullWidth={true}
        // helperText="Customer Name"
        margin="normal"
        value={customerStoreName}
        onChange={handleCustomerStoreName}
      />
      {customerStoreName.length == 0 && (
        <Typography variant="subtitle2" color="secondary">
          Please fill up the customer store name
        </Typography>
      )}
      <MuiTextField
        label="Customer Mobile Number"
        variant="standard"
        fullWidth={true}
        // helperText="Customer Mobile Number"
        margin="normal"
        value={customerPhone}
        onChange={handleCustomerPhone}
        onKeyPress={onKeyPress}
      />
      {customerPhone.length != 11 && (
        <Typography variant="subtitle2" color="secondary">
          Mobile number must be 11 digits
        </Typography>
      )}
      <MuiTextField
        label="Customer Code"
        variant="standard"
        fullWidth={true}
        // helperText="Customer Code"
        margin="normal"
        value={customerCode}
        //onChange={(e)=>{setCustomerCode(e.target.value)}}
        onChange={handleCustomerCode}
      />
      {customerCode.length == 0 && (
        <Typography variant="subtitle2" color="secondary">
          Please fill up the customer Code
        </Typography>
      )}
      <MuiTextField
        label="Customer VAT Number"
        variant="standard"
        fullWidth={true}
        // helperText="Customer VAT Number"
        margin="normal"
        value={vat_number}
        onChange={handleCustomerVatNumber}
      />
      {vat_number.length == 0 && (
        <Typography variant="subtitle2" color="secondary">
          Please fill up the customer VAT
        </Typography>
      )}
      <MuiTextField
        label="Virtual Balance"
        variant="standard"
        fullWidth={true}
        // helperText="Customer Code"
        margin="normal"
        value={virtualBalance}
        onChange={(e)=>{setVirtualBalance(e.target.value)}}
      />
      <MuiTextField
        label="Email"
        variant="standard"
        fullWidth={true}
        // helperText="Customer Code"
        margin="normal"
        value={email}
        onChange={(e)=>{setEmail(e.target.value)}}
      />
      <MuiTextField
        label="Address"
        variant="standard"
        fullWidth={true}
        // helperText="Customer Code"
        margin="normal"
        value={address}
        onChange={(e)=>{setAddress(e.target.value)}}
      />
      {customerName.length > 0 && customerPhone.length == 11 && (
        <Button
          onClick={submitCustomer}
          variant="outlined"
          fullWidth={true}
          color="primary">
          Create Customer
        </Button>
      )}
    </div>
  );
};
export default CreateCustomer;
