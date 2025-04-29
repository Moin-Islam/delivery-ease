
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Form, Field, FieldArray } from "formik";
import { TextField } from "formik-material-ui";
import { Box, Button, MenuItem, Typography } from "@material-ui/core";
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";


const test = ({values, total,setTotal,}) => {


  values.products.map((prd) => {
    prd.pp_discount=  prd.discount / prd.qty,
    prd.pp_after_discount_amount= prd.after_discount_amount / prd.qty,
    prd.pp_vat_amount=  prd.vat_amount / prd.qty,
    prd.pp_sub_total=  prd.sub_total / prd.qty
  })




  let t = 0;
  
    useEffect(() => {


    values.products.map((prd) => {
      if(prd.new_return_qty > 0){
   
          prd.new_pp_discount=  prd.pp_discount * parseFloat(prd.new_return_qty),
          prd.new_pp_after_discount_amount= prd.pp_after_discount_amount * parseFloat(prd.new_return_qty),
          prd.new_pp_vat_amount=  prd.pp_vat_amount * parseFloat(prd.new_return_qty)
          prd.new_pro_sub_total=   prd.pp_sub_total * parseFloat(prd.new_return_qty)
      }else{
        prd.new_pp_discount=  0,
        prd.new_pp_after_discount_amount=  0,
        prd.new_pp_vat_amount=  0,
        prd.new_pro_sub_total=   0
      }



    })

    const totalSubTotal = values?.products?.reduce(
      (accumulator, currentValue) => accumulator + currentValue.new_pro_sub_total,
      0
    );

    setTotal(totalSubTotal);


  }, [values.products]);




  // const totalQty = arrayOfproduct.reduce(
    //   (accumulator, currentValue) => accumulator + currentValue.qty,
    //   0
    // );

  // const saleCalculation= (arrayOfproduct,dynamicDis,dynamicVat) => {

  
  //  let tempAMount = 0;
  //  let subtotal = 0;
  //  let afterDiscountAmount = 0;
  //  let includeVatAferDis = 0;
  
  //   arrayOfproduct.map(
  //     (prd) => (tempAMount = tempAMount + parseFloat(prd.selling_price) * prd.qty)
  //   );
  //   subtotal = subtotal + tempAMount;
  //   afterDiscountAmount = tempAMount   - parseFloat(dynamicDis)
  //   includeVatAferDis =    afterDiscountAmount + dynamicVat
    
  // }

  // const salereturnCalculation= (arrayOfproduct,preSubtotal,preDisAmount, preVat, afterDiscountAmount,includeVatAferDis ) => {
  //   let tempAMountreturn = 0;
  //   let subtotalreturn = 0;
  //   let afterDiscountAmount = 0;
  //   let includeVatAferDis = 0;
   
  //   arrayOfproduct.map(
  //     (prd) => (tempAMountreturn = tempAMountreturn + parseFloat(prd.selling_price) * prd.return_qty)
  //   );
  //   subtotalreturn = subtotalreturn + subtotalreturn
  //   const newDisAmount = (preDisAmount *  subtotalreturn) / preSubtotal
  //   const newVat  = (preVat *  subtotalreturn) / preSubtotal
  //   const   afterDiscountAmountRerurn = tempAMount   - parseFloat(newDisAmount)
  //   const includeVatAferDisReturn =    afterDiscountAmount + newVat
  
  // }


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
    )
}

export default test
