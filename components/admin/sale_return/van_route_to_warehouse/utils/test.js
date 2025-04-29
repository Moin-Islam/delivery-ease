
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Form, Field, FieldArray } from "formik";
import { TextField } from "formik-material-ui";
import { Box, Button, MenuItem, Typography } from "@material-ui/core";
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";


const test = ({values, total,setTotal,}) => {


  let t = 0;
    useEffect(() => {
    values.products.map((prd) => (t = t + prd.price * prd.new_return_qty));
    setTotal(t);
  }, [values.products]);


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
