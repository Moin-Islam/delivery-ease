
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Form, Field, FieldArray } from "formik";
import { TextField } from "formik-material-ui";
import { Box, Button, MenuItem, Typography } from "@material-ui/core";
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";


const DetailsHeader = ({invoiceData}) => {




    return (
     
<GridContainer>
    <GridItem xs={6} sm={3} md={3}>
                            
    <Typography align="center" variant="h6"> Invoice Details</Typography>
          <hr/>
   <Typography>Invoice No: {invoiceData?.invoice_no}</Typography>
   <Typography>Date: {invoiceData?.sale_date}</Typography>
   

 </GridItem>


 <GridItem xs={6} sm={4} md={4}>
  
   <Typography align="center" variant="h6"> Customer Details</Typography>
   <hr/>
   <Typography>Name: {invoiceData?.customer_name}</Typography>
   <Typography>Code: {invoiceData?.customer_code}</Typography>
   
   <Typography>VAT Number: {invoiceData?.vat_number}</Typography>
 </GridItem>

 <GridItem xs={6} sm={3} md={3}>
 
   <Typography align="center" variant="h6"> Route Details</Typography>
   <hr/>
   <Typography>Name: {invoiceData?.store_name}</Typography>
   {/* <Typography>Code: {invoice.customer_code}</Typography> */}
 </GridItem>

 <GridItem xs={6} sm={2} md={2}>
  
   <Typography align="center" variant="h6">Salesman Details</Typography>
   <hr/>
   <Typography>Name: {invoiceData?.user_name}</Typography>
 </GridItem>
 </GridContainer>
   
    )
}

export default DetailsHeader
