import React from 'react'
import { Field } from 'formik';
import { TextField } from 'formik-material-ui';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";


const ProductTable = ({values,removeHide, mrpPrice, purchasePrice}) => {

    return (
      <>
              <TableContainer style={{height:"400px", overflowY:"scroll", padding:"0px"}}>
                                          <Table aria-label="simple table" size="10px" padding="checkbox">
                                            <TableHead>
                                              <TableRow>
                                                <TableCell
                                                  style={{ display: "none" }}
                                                >
                                                  id
                                                </TableCell>

                                                <TableCell
                                                  style={{ display: "none" }}
                                                >
                                                  product id
                                                </TableCell>

                                            

                                                <TableCell align="center"
                                                    style={{
                                                      width:'40%',
                                                    }}>
                                                      Name
                                                    </TableCell>

                                                <TableCell
                                                  style={{ display: "none" }}
                                                >
                                                  unit id
                                                </TableCell>

                                                <TableCell align="center">
                                                  Unit
                                                </TableCell>

                                    

                                                <TableCell align="center"  style={{ display: purchasePrice ? '' : 'none'}} >
                                                  Purchase Price
                                                </TableCell>


                                                <TableCell align="center"  style={{ display: mrpPrice ? '' : 'none'}} >
                                                  Sale Price
                                                </TableCell>




                                            

                                                <TableCell align="center" 
                                                 
                                                style={{
                                                  width:'9%'
                                                }}>
                                                 Sale Quantity
                                                </TableCell>
                                                

                                                <TableCell align="center" 
                                                
                                                style={{
                                                  width:'9%'
                                                }}>
                                                 Already Return
                                                </TableCell>



                                                <TableCell align="center" 
                                                
                                                style={{
                                                  width:'9%'
                                                }}>
                                                 Exists 
                                                </TableCell>
                                                


                                                <TableCell align="center" 
                                                style={{
                                                  width:'9%'
                                                }}>
                                                  Quantity
                                                </TableCell>
                                         
                                              </TableRow>
                                            </TableHead>
                                            <TableBody>
                                              {values.products.map((product, index) => (
                                                  <TableRow>
                                                    <TableCell
                                                      style={{
                                                        display: "none",
                                                      }}
                                                    >
                                                      <Field
                                                        variant="outlined"
                                                      
                                                        type="text"
                                                        size="sm"
                                                       
                                                        hidden={true}
                                                        name={`products.${index}.product_sale_detail_id`}
                                                      />
                                                    </TableCell>

                                                    <TableCell
                                                      style={{
                                                        display: "none",
                                                      }}
                                                    >
                                                      <Field
                                                        variant="outlined"
                                                        margin="normal"
                                                        fullWidth
                                                        type="text"
                                                        // label="product_id"
                                                        hidden={true}
                                                        name={`products.${index}.product_id`}
                                                      />
                                                    </TableCell>

                                                  

                                                    <TableCell>
                                                      <Field
                                                        component={TextField}
                                                        variant="outlined"
                                                        fullWidth
                                                        type="text"
                                                        size="sm"
                                                        // label="Name"
                                                        InputProps={{
                                                          readOnly: true,
                                                        }}
                                                        size="sm"
                                                        margin="dense"
                                                        name={`products.${index}.product_name`}
                                                      />
                                                    </TableCell>

                                                    <TableCell
                                                      style={{
                                                        display: "none",
                                                      }}
                                                    >
                                                      <Field
                                                        variant="outlined"
                                                        margin="normal"
                                                        fullWidth
                                                        type="text"
                                                        // label="product_unit_id"
                                                        hidden={true}
                                                        name={`products.${index}.product_unit_id`}
                                                      />
                                                    </TableCell>

                                                    <TableCell>
                                                      <Field
                                                        component={TextField}
                                                        variant="outlined"
                                                        margin="normal"
                                                        fullWidth
                                                        type="text"
                                                        // label="Unit"
                                                        InputProps={{
                                                          readOnly: true,
                                                        }}
                                                        margin="dense"
                                                        name={`products.${index}.product_unit_name`}
                                                      />
                                                    </TableCell>


                                                    <TableCell
                                                      style={{ display: purchasePrice ? '' : 'none'}}>
                                                      <Field
                                                        component={TextField}
                                                        variant="outlined"
                                                        margin="dense"
                                                        fullWidth
                                                        type="tel"
                                                        // label="Whole Sale Price"
                                                        name={`products.${index}.price`}
                                                        InputProps={{
                                                          readOnly: true,
                                                        }}
                                                      />
                                                    </TableCell>

                                                

                                                    <TableCell
                                                      style={{ display: mrpPrice ? '' : 'none'}}>
                                                      <Field
                                                        component={TextField}
                                                        variant="outlined"
                                                        margin="dense"
                                                        fullWidth
                                                        type="tel"
                                                        // label="Whole Sale Price"
                                                        name={`products.${index}.mrp_price`}
                                                        InputProps={{
                                                          readOnly: true,
                                                        }}
                                                      />
                                                    </TableCell>



<TableCell>
                                                      <Field
                                                        component={TextField}
                                                        variant="outlined"
                                                        fullWidth
                                                        type="tel"
                                                        margin="dense"
                                                        InputProps={{
                                                          readOnly: true,
                                                        }}
                                                         
                                                        name={`products.${index}.qty`}
                                                      />
                                                
                                                    </TableCell>  

                                                    <TableCell
                                                    >
                                                      <Field
                                                        component={TextField}
                                                        variant="outlined"
                                                        fullWidth
                                                        type="tel"
                                                        margin="dense"
                                                        InputProps={{
                                                          readOnly: true,
                                                        }}
                                               
                                                        name={`products.${index}.already_return_qty`}
                                                      />
                                                
                                                    </TableCell>


                                                    <TableCell
                                                    >
                                                      <Field
                                                        component={TextField}
                                                        variant="outlined"
                                                        fullWidth
                                                        type="tel"
                                                        margin="dense"
                                                        InputProps={{
                                                          readOnly: true,
                                                        }}
                                               
                                                        name={`products.${index}.exists_return_qty`}
                                                      />
                                                
                                                    </TableCell>


                                                    <TableCell>
                                                      <Field
                                                        component={TextField}
                                                        variant="outlined"
                                                        fullWidth
                                                        type="tel"
                                                        margin="dense"
                                                        
                             
                                                        name={`products.${index}.new_return_qty`}
                                                      />
                                                    
                                                    </TableCell>

                                             
                                                  </TableRow>
                                                ))}
                                            </TableBody>
                                          </Table>
                                        </TableContainer>

    </>
    )
}

export default ProductTable
