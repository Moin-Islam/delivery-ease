import React from 'react'
import { Field } from 'formik';
import { TextField } from 'formik-material-ui';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const ProductTable = ({values,removeHide, remove, permaRemove,stockTransferPrice, purchasePrice, mrpPrice,wholeSalePrice, vat, priceReadOnly, isEdit}) => {

  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(null);
  const [product, setProduct] = React.useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

const handlePermaneltlyDeletePopUp = (index, product) => {
  setIndex(index)
  setProduct(product)
  handleClickOpen(product)   
}


const handlePermaneltlyDelete = () => {
 if(isEdit){
  permaRemove(
    index,
    product
  )
  remove(index);
 } else{
   
   remove(index);
  }
  handleClose()
}

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
                                                      width:'45%',
                                                    }}>
                                                      Name
                                                    </TableCell>

                                                    <TableCell align="center"
                                                    style={{
                                                      width:'20%',
                                                    }}>
                                                     Specfication
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


                                                <TableCell align="center"  style={{ display: stockTransferPrice ? '' : 'none'}} >
                                                  Purchase Price
                                                </TableCell>



                                                <TableCell align="center" style={{ display: mrpPrice ? '' : 'none'}}>
                                                 MRP Price
                                                </TableCell>


                                                <TableCell align="center" style={{ display: wholeSalePrice ? '' : 'none'}}>
                                                Whole Sale Price
                                                </TableCell>



                                                <TableCell
                                                  style={{ display: vat ? '' : 'none'}}
                                                >
                                                  VAT
                                                </TableCell>

                                                <TableCell align="center" 
                                                style={{
                                                  width:'9%'
                                                }}>
                                                  Quantity
                                                </TableCell>
                                                <TableCell align="center"  style={{
                                                      width:'9%',
                                                      display: removeHide ? 'none' : ''
                                                    }}>
                                                  Action
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
                                                        // margin="normal"
                                                        // fullWidth
                                                        type="text"
                                                        size="sm"
                                                        // label="product_sale_detail_id"
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
                                                        name={`products.${index}.specification`}
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
                                                          readOnly: priceReadOnly,
                                                        }}
                                                      />
                                                    </TableCell>

                                                    <TableCell
                                                      style={{ display: stockTransferPrice ? '' : 'none'}}>
                                                      <Field
                                                        component={TextField}
                                                        variant="outlined"
                                                        margin="dense"
                                                        fullWidth
                                                        type="tel"
                                                        // label="Whole Sale Price"
                                                        name={`products.${index}.purchase_price`}
                                                        InputProps={{
                                                          readOnly: priceReadOnly,
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
                            
                                                        name={`products.${index}.selling_price`}
                                                        InputProps={{
                                                          readOnly: priceReadOnly,
                                                        }}
                                                      />
                                                    </TableCell>


                                                    <TableCell
                                                     style={{ display: wholeSalePrice ? '' : 'none'}}>
                                                      <Field
                                                        component={TextField}
                                                        variant="outlined"
                                                        margin="dense"
                                                        fullWidth
                                                        type="tel"
                            
                                                        name={`products.${index}.mrp_price`}
                                                        InputProps={{
                                                          readOnly: priceReadOnly,
                                                        }}
                                                      />
                                                    </TableCell>

                                                    <TableCell
                                                     style={{ display: vat ? '' : 'none'}}
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
                                                        name={`products.${index}.vat_amount`}
                                                      />
                                                    </TableCell>

                                                    <TableCell>
                                                      <Field
                                                        component={TextField}
                                                        variant="outlined"
                                                        fullWidth
                                                        type="tel"
                                                        margin="dense"
                                                        
                             
                                                        name={`products.${index}.qty`}
                                                      />
                                                      {/* <span>{`Stock ${values.products[index].stock}.`}</span> */}
                                                    </TableCell>

                                                    <TableCell 
                                                    align="center"
                                                  style={{display: removeHide ? 'none': ''}}
                                                    >
                                                      <button
                                                        type="button"
                                                        className="secondary"
                                                        style={{
                                                          width: "60%",
                                                          height: "60%",
                                                          backgroundColor:
                                                            "red",
                                                          padding: "10px 0px",
                                                          margin: "10px",
                                                          border: "0px",
                                                          borderRadius: "3px",
                                                          cursor: "ponter",
                                                          color: "white",
                                                          fontWeight: "bold",
                                                        }}
                                                        onClick={()=>handlePermaneltlyDeletePopUp(index, values.products)}
                                                      >
                                                        Remove
                                                      </button>
                                                    </TableCell>
                                                  </TableRow>
                                                ))}
                                            </TableBody>
                                          </Table>
                                        </TableContainer>

<Dialog
open={open}
onClose={handleClose}
aria-labelledby="alert-dialog-title"
aria-describedby="alert-dialog-description"
>
<DialogTitle id="alert-dialog-title">Do You Want To Remove</DialogTitle>

<DialogActions>
  <Button onClick={handleClose} color="primary">
   No
  </Button>
  <Button onClick={()=>handlePermaneltlyDelete()} color="primary" autoFocus>
   Yes
  </Button>
</DialogActions>
</Dialog>
    </>
    )
}

export default ProductTable
