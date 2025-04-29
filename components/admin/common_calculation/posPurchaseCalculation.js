import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Field } from 'formik';
import { TextField } from 'formik-material-ui';
import {  Grid, MenuItem } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    maxWidth: 245,
  },
  multilineColor: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 17,
  },
});

 
const PosSaleCalculation = ({
  values,
  dynamicvat,
  subTotal,
  setSubTotal,
  discountType,
  setDiscountType,
  discountParcent,
  setDiscountParcent,
  discountAmount,
  setDiscountAmount,
  afterDiscountAmount,
  setAfterDiscountAmount,
  vat,
  setVat,
  finalAmount,
  setFinalAmount,
  paymentType,
  setPaymentType,
  
}) => {
  const classes = useStyles();
 
  const [discountPoint, setDiscountPoint] = React.useState(); 

  let tempAMount = 0

  useEffect(() => {
    values.products.map(
      (prd) => (tempAMount = tempAMount + parseFloat(prd.price) * prd.qty)
    );
     setSubTotal(tempAMount)
     setAfterDiscountAmount(tempAMount   - parseFloat(discountAmount))
     const  vatcalculation =  (afterDiscountAmount * dynamicvat) / 100
     setVat(vatcalculation);
     setFinalAmount(afterDiscountAmount+vat)
  }, [values,subTotal, afterDiscountAmount,vat,finalAmount,discountAmount,setDiscountAmount,setDiscountType,setDiscountPointHandle]);


    


  const setDiscountPointHandle = (dPoint) => {
     if(dPoint && dPoint >=0){
      setDiscountPoint(dPoint)
     if (discountType == 'Flat') {
      setDiscountAmount(parseFloat(dPoint))
     }
     if (discountType == 'Percentage') {
      const calDiscount = (dPoint * subTotal) / 100;
      setDiscountAmount(calDiscount)
      setDiscountParcent(dPoint)
    
    }
  }
  else{
    setDiscountAmount(0)
    setDiscountPoint()
  }
  }





const discountTypeHandle = (dType) => {
  setDiscountType(dType)
  if(discountPoint && discountPoint >= 0){
   if (dType == 'Flat') {
    setDiscountAmount(parseFloat(discountPoint))
   }
   if (dType == 'Percentage') {
    const calDiscount = (discountPoint * subTotal) / 100;
    setDiscountAmount(calDiscount)
    setDiscountParcent(discountPoint)
  }
}

}


 

  return (
    <div>
      <Grid container spacing={1} direction="row">
           
        <Grid item xs={1}>
          <Field
            component={TextField}
            variant="filled"
            margin="normal"
            fullWidth
            type="number"
            label="Sub Amount"
            name="subAmount"
            value={parseFloat(subTotal)}
            InputProps={{
              className: classes.multilineColor,
              readOnly: true,
            }}
  
          />
        </Grid>

        <Grid item xs={1}>
          <Field
            component={TextField}
            variant="filled"
            margin="normal"
            fullWidth
            type="number"
            label="Discount Amount"
            name="discoumt"
            value={parseFloat(discountAmount)}
            InputProps={{
              className: classes.multilineColor,
              readOnly: true,
            }}
  
          />
        </Grid>
     

     

        <Grid item xs={1}>
          <Field
            component={TextField}
            variant="filled"
            margin="normal"
            fullWidth
            type="number"
            label="Total"
            name="total"
          
            value={parseFloat(afterDiscountAmount)}
            InputProps={{
              className: classes.multilineColor,
              readOnly: true,
            }}
          />
        </Grid> 

        <Grid item xs={1}>
          <Field
            component={TextField}
            variant="filled"
            margin="normal"
            fullWidth
            type="number"
            label="VAT"
            name="vat"
            value={parseFloat(vat)}
            InputProps={{
              className: classes.multilineColor,
              readOnly: true,
            }}
  
          />
        </Grid>

        <Grid item xs={2}>
          <Field
            component={TextField}
            variant="filled"
            margin="normal"
            fullWidth
            type="number"
            label="Grand Total"
            name="grand_total"
            // helperText="Including VAT"
            value={parseFloat(finalAmount)}
            InputProps={{
              className: classes.multilineColor,
              readOnly: true,
            }}
          />
        </Grid> 
        <Grid item xs={2}>
          <Field
            component={TextField}
            type="text"
            name="payment_type"
            label="Payment Type"
            select
            fullWidth
            value={paymentType}
            variant="filled"
            helperText="Please select payment type"
            margin="normal"
            onChange={(e)=>setPaymentType(e.target.value)}
            >
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Check">Check</MenuItem>
            <MenuItem value="Card">Card</MenuItem>
  
          </Field>
        </Grid>
            <Grid item xs={2}>
              <Field
                component={TextField}
                variant="filled"
                margin="normal"
                fullWidth
                select
                type="tel"
                name="discount_type"
                label="Discount Type"
                disabled={false}
                value={discountType}
                onChange={(e)=>discountTypeHandle(e.target.value)}
              >
                <MenuItem value="Flat">Flat</MenuItem>
                <MenuItem value="Percentage">Percentage</MenuItem>
                  </Field>
            </Grid>
            


            <Grid item xs={2}>
              <Field
                component={TextField}
                variant="filled"
                margin="normal"
                fullWidth
                type="tel"
                label="Discount Amount"
                name="discount_amount"
                disabled={false}
                value={discountPoint}
                onChange={(e)=>setDiscountPointHandle(e.target.value)}
                InputProps={{
                  className: classes.multilineColor,
                }}
              />


            </Grid>

      </Grid>
    </div>
  );
};
export default PosSaleCalculation;

