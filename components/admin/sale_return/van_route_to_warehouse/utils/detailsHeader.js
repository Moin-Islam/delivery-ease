
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
   <Typography>Date: {invoiceData?.issue_date}</Typography>
   

 </GridItem>



 <GridItem xs={6} sm={3} md={3}>
 
   <Typography align="center" variant="h6"> Route Details</Typography>
   <hr/>
   <Typography>Name: {invoiceData?.store_name}</Typography>

 </GridItem>


 <GridItem xs={6} sm={3} md={2}>
 
 <Typography align="center" variant="h6"> Van Details</Typography>
 <hr/>
 <Typography>Name: {invoiceData?.van_name}</Typography>

</GridItem>



 <GridItem xs={6} sm={2} md={3}>
  
   <Typography align="center" variant="h6">Warehouse Details</Typography>
   <hr/>
   <Typography>Name: {invoiceData?.warehouse_name}</Typography>
 </GridItem>


 </GridContainer>
   
    )
}

export default DetailsHeader
