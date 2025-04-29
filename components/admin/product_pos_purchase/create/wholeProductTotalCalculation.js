// import React, { useEffect, useState } from "react";
// import { makeStyles } from "@material-ui/core/styles";
// import { Formik, Form, Field, FieldArray } from "formik";
// import { TextField } from "formik-material-ui";
// import { Box, Button, Grid, MenuItem, Typography } from "@material-ui/core";
// import GridItem from "components/Grid/GridItem";
// import GridContainer from "components/Grid/GridContainer";

// const useStyles = makeStyles({
//   root: {
//     maxWidth: 245,
//   },
// });

// const WholeProductTotalCalculation = ({
//   values,
//   total,
//   setTotal,
//   paid,
//   setPaid,
//   due,
//   setDue,
//   discount,
//   setDiscount,
// }) => {
//   const classes = useStyles();
//   //console.log(values.products);
//   const [dis, setDis] = React.useState(0);
//   const [apply, setApply] = React.useState(false);
//   let t = 0;
//   useEffect(() => {
//     values.products.map((prd) => (t = t + prd.price * prd.qty));
//     setTotal(t);
//     setDue(t - paid);
//     setDis(0);
//     setDiscount(0);
//   }, [values.products]);

//   const getPaid = (event) => {
//     setPaid(event.target.value);
//     if (total - event.target.value < 0 || total == 0) {
//       setDue(0);
//     } else {
//       setDue(total - event.target.value);
//     }
//   };
//   const setDisco = (event) => {
//     setDis(event.target.value);
//   };
//   const calDiscount = () => {
//     if (dis != 0) {
//       setApply(true);
//       if (values.discount_type == "Flat") {
//         if (total - dis <= 0) {
//           setTotal(0);
//           setDue(0);
//           setPaid(0);
//           setDiscount(0);
//         } else {
//           setTotal(total - dis);
//           const a = total - dis;
//           setDue(a - paid);
//           setDiscount(dis);
//         }
//       } else if (values.discount_type == "Percentage") {
//         const d = Math.floor((dis * total) / 100);
//         console.log(d);
//         if (d <= 0) {
//           setTotal(0);
//           setDue(0);
//           setPaid(0);
//           setDiscount(0);
//         } else {
//           setTotal(total - d);
//           const a = total - d;
//           setDue(a - paid);
//           setDiscount(d);
//         }
//       }
//     } else {
//       alert("Discount can not be 0");
//     }
//   };
//   const cancelDis = (event) => {
//     console.log(event.target.value);
//     values.discount_type = event.target.value;
//     let t = 0;
//     values.products.map((prd) => (t = t + prd.price * prd.qty));
//     setTotal(t);
//     setDue(t - paid);
//     setDiscount(0);
//     setDis(0);
//     setApply(false);
//   };

//   // const getDue = () => {
//   //   setDue(total - due);
//   // };
//   return (
//     <div>
//       <Box mt={3}></Box>
//       <Grid container direction="row" spacing={1}>
//         <Grid item xs={2}>
//           <Field
//             component={TextField}
//             variant="filled"
//             margin="dense"
//             fullWidth
//          type="tel"
//             label="Total Amount"
//             name="grand_total"
//             inputProps={{ readOnly: true }}
//             value={total}
//           />
//         </Grid>
//         <Grid item xs={2}>
//           <Field
//             component={TextField}
//             variant="filled"
//             margin="dense"
//             fullWidth
//          type="tel"
//             label="Paid Amount"
//             name="paid_total"
//             value={paid}
//             onChange={getPaid}
//           />
//         </Grid>
//         <Grid item xs={2}>
//           <Field
//             component={TextField}
//             variant="filled"
//             margin="dense"
//             fullWidth
//          type="tel"
//             label="Due Amount"
//             name="due_amount"
//             inputProps={{ readOnly: true }}
//             value={due}
//           />
//         </Grid>
//         <Grid item xs={2}>
//           <Field
//             component={TextField}
//             type="text"
//             name="payment_type"
//             label="Payment Type"
//             select
//             fullWidth
//             variant="filled"
//             helperText="Please select payment type"
//             margin="dense"
//           >
//             <MenuItem value="Cash">Cash</MenuItem>
//             <MenuItem value="Check">Check</MenuItem>
//             <MenuItem value="Check">Card</MenuItem>
//             <MenuItem value="Bkash">Bkash</MenuItem>
//             <MenuItem value="Nogod">Nogod</MenuItem>
//             <MenuItem value="Rocket">Rocket</MenuItem>
//             <MenuItem value="Upay">Upay</MenuItem>

//             {/* <MenuItem value="SSL Commerz" disabled={paid < 11}>
//               SSL Commerz {paid < 11 && "(Paid amount must be greater than 10)"}
//             </MenuItem> */}
//           </Field>
//         </Grid>
//         <Grid item xs={4}>
//           <GridContainer>
//             {/* <GridItem xs={12} sm={12} md={12}>
//               <Box mt={2}>
//                 <Typography variant="subtitle2">Discount</Typography>
//               </Box>
//             </GridItem> */}

//             <GridItem xs={6} sm={6} md={6}>
//               <Field
//                 component={TextField}
//                 type="text"
//                 name="discount_type"
//                 label="Discount Type"
//                 select
//                 fullWidth
//                 variant="filled"
//                 // onChange={cancelDis}
//                 margin="dense"
//               >
//                 <MenuItem value="Flat">Flat</MenuItem>
//                 <MenuItem value="Percentage">Percentage</MenuItem>
//               </Field>
//             </GridItem>
//             <GridItem xs={6} sm={6} md={6}>
//               <Field
//                 component={TextField}
//                 variant="filled"
//                 margin="dense"
//                 fullWidth
//              type="tel"
//                 label="Discount Amount"
//                 name="discount_amount"
//                 disabled={false}
//                 value={dis}
//                 onChange={setDisco}
//               />
//             </GridItem>
//             <GridItem xs={12} sm={12} md={12}>
//               <GridContainer>
//                 <GridItem xs={6} sm={6} md={6} container justify="flex-end">
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={calDiscount}
//                   >
//                     Apply
//                   </Button>
//                 </GridItem>
//                 <GridItem xs={6} sm={6} md={6} container justify="flex-start">
//                   <Button
//                     variant="contained"
//                     color="secondary"
//                     onClick={cancelDis}
//                   >
//                     Cancel
//                   </Button>
//                 </GridItem>
//               </GridContainer>
//             </GridItem>
//           </GridContainer>
//         </Grid>
//       </Grid>
//     </div>
//   );
// };
// export default WholeProductTotalCalculation;

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
 console.log( values,
  dynamicvat,)
  const [discountPoint, setDiscountPoint] = React.useState(); 

  let tempAMount = 0

  useEffect(() => {
    values.products.map(
      (prd) => (tempAMount = tempAMount + parseInt(prd.mrp_price) * prd.qty)
    );
     setSubTotal(tempAMount)
     setAfterDiscountAmount(tempAMount   - parseInt(discountAmount))
     const  vatcalculation =  (afterDiscountAmount * dynamicvat) / 100
     setVat(vatcalculation);
     setFinalAmount(afterDiscountAmount+vat)
  }, [values,subTotal, afterDiscountAmount,vat,finalAmount,discountAmount,setDiscountAmount,setDiscountType,setDiscountPointHandle]);


    


  const setDiscountPointHandle = (dPoint) => {
     if(dPoint && dPoint >=0){
      setDiscountPoint(dPoint)
     if (discountType == 'Flat') {
      setDiscountAmount(parseInt(dPoint))
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
    setDiscountAmount(parseInt(discountPoint))
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

        <Grid item xs={2}>
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

        <Grid item xs={1}>
          <Field
            component={TextField}
            variant="filled"
            margin="normal"
            fullWidth
            type="number"
            label="Grand Total"
            name="grand_total"
            helperText="Including VAT"
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


