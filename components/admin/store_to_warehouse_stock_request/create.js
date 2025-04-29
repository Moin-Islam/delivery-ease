import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import { Formik, Form, Field, FieldArray } from 'formik';
import { TextField } from 'formik-material-ui';
import { Box, Button, MenuItem, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { baseUrl } from '../../../const/api';
import { useAsyncEffect } from 'use-async-effect';
import axios from 'axios';
import { Autocomplete } from 'formik-material-ui-lab';
import MuiTextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import WholeProduct from './create/wholeProduct';
import WholeProductTotalCalculation from './create/wholeProductTotalCalculation';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import BarcodeField from './create/barcodeField';
import ItemCode from './create/itemCode';
import ProductName from './create/productName';
const styles = {
  cardCategoryWhite: {
    color: 'rgba(255,255,255,.62)',
    margin: '0',
    fontSize: '14px',
    marginTop: '0',
    marginBottom: '0',
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
  },
  cardBack: {
    color: '#FFFFFF',
    backgroundColor: 'blue',
  },
}; 
const useStyles = makeStyles(styles);
const purchase_product = [];
const Create = ({ token, modal, endpoint, mutate }) => {
  const classes = useStyles();
  const [errorAlert, setOpen] = React.useState({
    open: false,
    key: '',
    value: [],
    severity: 'error',
    color: 'error',
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen({
      open: false,
      key: '',
      value: [],
      severity: 'error',
      color: 'error',
    });
  };
  const [openModal, setModalOpen] = React.useState(false);
  const handleClickModalOpen = () => {
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
  };

  const [total, setTotal] = React.useState(0);
  const [paid, setPaid] = React.useState(0);
  const [due, setDue] = React.useState(0);

  const [load, setLoad] = React.useState(false);
  const [product, setProduct] = React.useState(null);
  const [store, setStore] = React.useState(null);
  const [warehouse, setWarehouse] = React.useState([]);
  const [storeId, setStoreId] = React.useState(null);
  const [warehouse_id, setWarehouseId] = React.useState(null);

console.log(warehouse_id,storeId)

  let stores = `${baseUrl}/store_list`;
  let warehouses = `${baseUrl}/warehouse_list`;
  //let products = `${baseUrl}/product_list`;

  useAsyncEffect(async (isMounted) => {

    await axios
      .all([
        axios.get(stores, {
          headers: { Authorization: 'Bearer ' + token },
        }),
        axios.get(warehouses, {
          headers: { Authorization: 'Bearer ' + token },
        }),
      ])
      .then(
        axios.spread((...responses) => {
          if (!isMounted()) return;
          const responseOneB = responses[0];
          const responseTwoU = responses[1];
          setStore(responseOneB.data.response.stores);
          setWarehouse(responseTwoU.data.response.warehouses);
          setWarehouseId(responseTwoU.data.response.warehouses[0].id);
          setLoad(true);
        })
      )
      .catch((errors) => {
        console.error(errors);
        setLoad(false);
      });
  }, []);

  return (
    <div>
      <GridContainer style={{ padding: '20px 30px', marginTop: 250 }}>
        <GridItem xs={12} sm={12} md={12}></GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardBody>
              <Formik
                initialValues={{
                  store_id: storeId,
                  warehouse_id: warehouse_id,
                  products: [],
                  payment_type: 'Cash',
                  grand_total: total,
                  paid_total: paid,
                  due_amount: due,
                  barcode: '',
                }}
                validate={(values) => {
                  const errors = {};
                  // if (!storeId) {
                  //   errors.store_id = 'Required';
                  // }
                  // if (!values.warehouse_id) {
                  //   errors.warehouse_id = 'Required';
                  // }
                  values.products.map((p) => {
                    p.qty > p.stock &&
                      ((p.qty = p.stock),
                      setOpen({
                        open: true,
                        key: "",
                        value: [`Maximum Quantity ${p.stock}`],
                        severity: "error",
                        color: "error",
                      }));
                    p.qty < 0 &&
                      ((p.qty = 1),
                      setOpen({
                        open: true,
                        key: '',
                        value: [`Minimum Quantity 1`],
                        severity: 'error',
                        color: 'error',
                      }));
                  });
                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                  // console.log(values)
                  // setSubmitting(false);
                  // console.log({
                  //   request_from_store_id: storeId,
                  //   request_to_warehouse_id: warehouse_id,
                  //   products: values.products,
                  // });  
                  
                  setTimeout(() => {
                    axios
                      .post(
                        `${baseUrl}/${endpoint}`,
                        {
                          request_from_store_id: storeId,
                          request_to_warehouse_id: warehouse_id,
                          products: values.products,
                        },
                        {
                          headers: { Authorization: 'Bearer ' + token },
                        }
                      )
                      .then((res) => {
                        //console.log(res);
                        setSubmitting(false);
                        setTotal(0);
                        setPaid(0);
                        setDue(0);
                        mutate();
                        modal(false);
                      })
                      .catch(function (error) {
                        setOpen({
                          open: true,
                          key: Object.values(error.response.data.message),
                          value: Object.values(error.response.data.message),
                        });
                        setSubmitting(false);
                      });
                  }
                  );
                }}>
                {({ values, errors, submitForm, isSubmitting, setValues }) => (
                  <div className={classes.root}>
                    <div className={classes.paper}>
                      <form className={classes.form} noValidate>
                        <GridContainer>
                          <GridItem xs={12} sm={12} md={5}>
                            {load && (
                              <Field
                                name={storeId}
     
                                component={Autocomplete}

                                onChange={(event, newValue) => {
                                  setStoreId(newValue.id);
                                }}
                                options={store}
                                getOptionLabel={(option) => option.store_name}
                                renderInput={(params) => (
                                  <MuiTextField
                                    {...params}
                                    label="Store"
                                    variant="outlined"
                                    fullWidth
                                    helperText="Select Store from where you send the request"
                                    margin="normal"
                                  />
                                )}
                              />
                            )}
                          </GridItem>
                          <GridItem xs={12} sm={12} md={1}>
                            <Box mt={3}>
                              <Typography variant="h5" align="center">
                                <DoubleArrowIcon fontSize="small" />
                              </Typography>
                            </Box>
                          </GridItem>
                          
                          <GridItem xs={12} sm={12} md={6}>

                          {load && (
                              <Field
                                component={TextField}
                                type="text"
                                name="warehouse_id"
                                value={warehouse[0].name}
                                disabled
                                label="Warehouse"
                                variant="outlined"
                                fullWidth
                                helperText="Default Warehouse Selected"
                                margin="normal"
                               />
                              
                            )}
                            {/* {load && (
                              <Field
                                component={TextField}
                                type="text"
                                name="warehouse_id"
                                // value={warehouse_id}
                                select
                                label="Warehouse"
                                variant="outlined"
                                fullWidth
                                helperText="Select Warehouse to send the request"
                                margin="normal"
                                InputLabelProps={{
                                  shrink: true,
                                }}>
                                {warehouse.map((option) => (
                                  <MenuItem
                                    key={option.id}
                                    value={option.id}
                                    onChange={() => setWarehouseId(option.id)}>
                                    {option.name}
                                  </MenuItem>
                                ))}
                              </Field>
                            )} */}
                          </GridItem>

                          <GridItem xs={12} sm={12} md={12}>
                            <GridContainer>
                              <GridItem xs={12} sm={12} md={12}>
                                <FieldArray
                                  name="products"
                                  render={({
                                    insert,
                                    remove,
                                    push,
                                    replace,
                                  }) => (
                                    <GridContainer>
                                      {warehouse_id != null && (
                                        <>
                                          <GridItem xs={4} sm={4} md={4}>
                                            <BarcodeField
                                              push={push}
                                              products={product}
                                              values={values}
                                              setOpenError={setOpen}
                                              replace={replace}
                                              token={token}
                                              warehouse_id={warehouse_id}
                                            />
                                          </GridItem>
                                          <GridItem xs={4} sm={4} md={4}>
                                            <ItemCode
                                              push={push}
                                              products={product}
                                              values={values}
                                              setOpenError={setOpen}
                                              replace={replace}
                                              token={token}
                                              warehouse_id={warehouse_id}
                                            />
                                          </GridItem>

                                          <GridItem xs={4} sm={4} md={4}>
                                            <ProductName
                                              push={push}
                                              values={values}
                                              setOpenError={setOpen}
                                              replace={replace}
                                              token={token}
                                              warehouse_id={warehouse_id}
                                            />
                                          </GridItem>
                                        </>
                                      )}

                                      <GridItem
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        className="row">
                                        {warehouse_id != null ? (
                                          <>
                                            <Typography
                                              color="primary"
                                              variant="h5">
                                              Products :
                                            </Typography>
                                            <Button
                                              align="right"
                                              color="secondary"
                                              onClick={() => {
                                                setValues({
                                                  store_id: '',
                                                  warehouse_id: '',
                                                  products: [],
                                                  payment_type: 'Cash',
                                                  grand_total: total,
                                                  paid_total: paid,
                                                  due_amount: due,
                                                  barcode: '',
                                                });
                                              }}>
                                              Clear All Product
                                            </Button>
                                          </>
                                        ) : (
                                          <Typography
                                            color="secondary"
                                            variant="h6">
                                            Select Warehouse First
                                          </Typography>
                                        )}
                                      </GridItem>
                                      {values.products.length > 0 &&


<TableContainer>
<Table  aria-label="simple table">
  <TableHead>
    <TableRow>
    <TableCell  style={{display:"none"}}>id</TableCell>

    <TableCell  style={{display:"none"}}>product id</TableCell>

    <TableCell  style={{display:"none"}}>Stock</TableCell>

    <TableCell align="center"
                                                    style={{
                                                      width:'40%',
                                                    }}>
                                                      Name
                                                    </TableCell>

    <TableCell  style={{display:"none"}}>unit id</TableCell>

    <TableCell align="center">Unit</TableCell>

    <TableCell  style={{display:"none"}}>Brand Id</TableCell>

    <TableCell  style={{display:"none"}}>Brand</TableCell>

    <TableCell align="center" >Price</TableCell>

    <TableCell  >MRP Price</TableCell>

    <TableCell align="center">Quantity</TableCell>

    </TableRow>
  </TableHead>
  <TableBody>


{
  values.products.map((product, index)=>(
    <TableRow >

    <TableCell style={{display:"none"}}>
      
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

      <TableCell style={{display:"none"}}>
          <Field
                variant="outlined"
                margin="dense"
                fullWidth
             type="tel"
                label="stock"
                hidden={true}
                name={`products.${index}.stock`}
              />
   </TableCell>

    <TableCell >

           <Field
                component={TextField}
                variant="outlined"
                fullWidth
                type="text"
                // label="Name"
                InputProps={{
                  readOnly: true,
                }}
                margin="dense"
                name={`products.${index}.product_name`}
              />
    </TableCell>

    <TableCell style={{display:"none"}}>
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

    <TableCell style={{display:"none"}}>
          <Field
                component={TextField}
                variant="outlined"
                fullWidth
                type="text"
                // label="Brand"
                margin="dense"
                hidden={true}
                name={`products.${index}.product_brand_name`}
              />
    </TableCell>




    <TableCell style={{display:"none"}}>
          <Field
           component={TextField}
            variant="outlined"
            margin="dense"
              fullWidth
              type="text"
              // label="product_brand_id"
              hidden={true}
                name={`products.${index}.product_brand_id`}
              />
    </TableCell>



    <TableCell >
               <Field
                component={TextField}
                variant="outlined"
                margin="dense"
                fullWidth
             type="tel"
                label="Price"
                name={`products.${index}.price`}
                InputProps={{
                  readOnly: true,
                }}
              />
    </TableCell>




    <TableCell >
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


    <TableCell >
           <Field
              component={TextField}
              variant="outlined"
              fullWidth
           type="tel"
              margin="dense"
              // defaultValue={0}
              // label="Quantity"
              name={`products.${index}.qty`}
            />
    </TableCell>

    <TableCell >
           <button
                  type="button"
                  className="secondary"
                  style={{
                    width: '100%',
                    height: '50%',
                    backgroundColor: 'red',
                    padding: '10px',
                    margin: '10px 0px',
                    border: '0px',
                    borderRadius: '3px',
                    cursor: 'ponter',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                  onClick={() =>
                    remove(index)
                  }>
                  Remove
                </button>
      </TableCell>

           
   
   
    
  </TableRow>

 
  ))

}
  
     
  </TableBody>
</Table>
</TableContainer>



}
                                      <Dialog
                                        open={openModal}
                                        onClose={handleModalClose}
                                        fullWidth={true}
                                        maxWidth="lg">
                                        <WholeProduct
                                          push={push}
                                          handleClose={handleModalClose}
                                          products={product}
                                          setProducts={setProduct}
                                          token={token}
                                          values={values}
                                          setOpenError={setOpen}
                                          replace={replace}
                                          ware_id={values.warehouse_id}
                                        />
                                      </Dialog>
                                    </GridContainer>
                                  )}
                                />
                              </GridItem>
                            </GridContainer>
                          </GridItem>

                          {/* <GridItem xs={12} sm={12} md={3}>
                            <WholeProductTotalCalculation
                              values={values}
                              total={total}
                              setTotal={setTotal}
                              paid={paid}
                              setPaid={setPaid}
                              due={due}
                              setDue={setDue}
                            />
                          </GridItem> */}
                        </GridContainer>
                        <Box my={3}>
                          <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={isSubmitting}
                            onClick={submitForm}>
                            {isSubmitting ? (
                              <CircularProgress color="primary" size={24} />
                            ) : (
                              'SUBMIT'
                            )}
                          </Button>
                        </Box>
                      </form>
                    </div>
                  </div>
                )}
              </Formik>
            </CardBody>
            <Snackbar
              open={errorAlert.open}
              autoHideDuration={2000}
              onClose={handleClose}>
              <Alert
                onClose={handleClose}
                severity={errorAlert.severity}
                color={errorAlert.color}>
                {errorAlert.value[0]}
              </Alert>
            </Snackbar>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};

// UserProfile.layout = Admin;

export default Create;
