import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Form, Field, FieldArray } from "formik";
import { TextField } from "formik-material-ui";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles({
  root: {
    maxWidth: 245,
  },
});

const WholeProductTotalCalculation = ({
  values,
  total,
  setTotal,
  misCharge,
}) => {
  const classes = useStyles();

  let t = 0;
  useEffect(() => {
    values.products.map((prd) => (t = t + prd.price * prd.qty));
    setTotal(t);
  }, [values,misCharge]);
   
  const grandTotal = parseInt(total) + parseInt(misCharge);

  return (
    <div >
    <Grid container spacing={1} direction="row" >
    <Grid Item  md={6} >
      </Grid>
                       <Grid Item  md={2}   >

                       <Field
          
     component={TextField}
     variant="filled"
     margin="normal"
     // fullWidth
     type="tel"
     label="Sub Total"
     name="sub_total"
     value={total}
     InputProps={{
       readOnly: true,
     }}
   style={{margin:"5px"}}
   />
   </Grid>

   <Grid Item   md={2}  >
                       <Field
     
     component={TextField}
     variant="filled"
     margin="normal"
     // fullWidth
     type="tel"
     label="Miscellaneous Charge"
     name="mistotal"
     value={misCharge}
     InputProps={{
       readOnly: true,
     }}
     style={{margin:"5px"}}
   />

</Grid>

<Grid Item md={2} >
<Field

     component={TextField}
     variant="filled"
     margin="normal"
     // fullWidth
     type="tel"
     label="Grand Total"
     name="grand_total"
     value={grandTotal}
     InputProps={{
       readOnly: true,
     }}
     style={{margin:"5px"}}
   />


</Grid> 
                 
       </Grid>
 
  
 
 </div>
  );
};
export default WholeProductTotalCalculation;
