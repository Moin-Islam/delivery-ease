import React from 'react';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
// core components
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
//import Button from "components/CustomButtons/Button.js";
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import { Formik, Form, Field, FieldArray } from 'formik';
import { TextField } from 'formik-material-ui';
import Grid from '@material-ui/core/Grid';
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
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
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
  const [warehouse_id, setWarehouseId] = React.useState(null);
  const [store_id, setStoreId] = React.useState(null);
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
          //setProduct(responsethree.data.response.products);
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
                  store_id: '',
                  warehouse_id: '',
                  products: [],
                  payment_type: 'Cash',
                  grand_total: total,
                  paid_total: paid,
                  due_amount: due,
                  barcode: '',
                }}
                validate={(values) => {
                  const errors = {};
                  if (!values.store_id) {
                    errors.store_id = 'Required';
                  }
                  if (!values.warehouse_id) {
                    errors.warehouse_id = 'Required';
                  }
                  values.products.map((p) => {
                    p.qty > p.stock &&
                      ((p.qty = 1),
                      setOpen({
                        open: true,
                        key: '',
                        value: [`Maximum Quantity ${p.stock}`],
                        severity: 'error',
                        color: 'error',
                      }));
                    p.qty < 1 &&
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
                  console.log(values);
                  setTimeout(() => {
                    axios
                      .post(
                        `${baseUrl}/${endpoint}`,
                        {
                          return_from_store_id: store_id,
                          return_to_warehouse_id: warehouse_id,
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
                  });
                }}>
                {({ values, errors, submitForm, isSubmitting, setValues }) => (
                  <div className={classes.root}>
                    <div className={classes.paper}>
                      <form className={classes.form} noValidate>
                        <GridContainer>
                          <GridItem xs={12} sm={12} md={5}>
                            {load && (
               
                              <Field
                                component={TextField}
                                type="text"
                                name="store_id"
                                select
                                label="Store"
                                variant="outlined"
                                fullWidth
                                helperText="From which store you want to return"
                                margin="normal"
                                InputLabelProps={{
                                  shrink: true,
                                }}>
                                {store.map((option) => (
                                  <MenuItem
                                    key={option.id}
                                    value={option.id}
                                    onClick={() => setStoreId(option.id)}>
                                    {option.store_name}
                                  </MenuItem>
                                ))}
                              </Field>
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
                                select
                                label="Warehouse"
                                variant="outlined"
                                fullWidth
                                helperText="In which warehouse you want to return item"
                                margin="normal"
                                InputLabelProps={{
                                  shrink: true,
                                }}>
                                {warehouse.map((option) => (
                                  <MenuItem
                                    key={option.id}
                                    value={option.id}
                                    onClick={() => setWarehouseId(option.id)}>
                                    {option.name}
                                  </MenuItem>
                                ))}
                              </Field>
                            )}
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
                                      {store_id != null && (
                                        <>
                                          <GridItem xs={4} sm={4} md={4}>
                                            <BarcodeField
                                              push={push}
                                              products={product}
                                              values={values}
                                              setOpenError={setOpen}
                                              replace={replace}
                                              token={token}
                                              store_id={store_id}
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
                                              store_id={store_id}
                                            />
                                          </GridItem>

                                          <GridItem xs={4} sm={4} md={4}>
                                            <ProductName
                                              push={push}
                                              values={values}
                                              setOpenError={setOpen}
                                              replace={replace}
                                              token={token}
                                              store_id={store_id}
                                            />
                                          </GridItem>
                                        </>
                                      )}

                                      <GridItem
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        className="row">
                                        {store_id != null ? (
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
                                            Select Store First
                                          </Typography>
                                        )}
                                      </GridItem>
                                      {values.products.length > 0 &&
                                        values.products.map(
                                          (product, index) => (
                                            <>
                                              <Field
                                                variant="outlined"
                                                margin="normal"
                                                fullWidth
                                                type="text"
                                                label="product_id"
                                                hidden={true}
                                                name={`products.${index}.product_id`}
                                              />
                                              <Field
                                                variant="outlined"
                                                margin="normal"
                                                fullWidth
                                             type="tel"
                                                label="stock"
                                                hidden={true}
                                                name={`products.${index}.stock`}
                                              />
                                              <Field
                                                variant="outlined"
                                                margin="normal"
                                                fullWidth
                                                type="text"
                                                label="product_unit_id"
                                                hidden={true}
                                                name={`products.${index}.product_unit_id`}
                                              />
                                              <Field
                                                variant="outlined"
                                                margin="normal"
                                                fullWidth
                                                type="text"
                                                label="product_brand_id"
                                                hidden={true}
                                                name={`products.${index}.product_brand_id`}
                                              />
                                              <Grid
                                                container
                                                direction="row"
                                                spacing={1}>
                                                <Grid item xs={3}>
                                                  <Field
                                                    component={TextField}
                                                    variant="outlined"
                                                    margin="normal"
                                                    fullWidth
                                                    type="text"
                                                    label="Name"
                                                    InputProps={{
                                                      readOnly: true,
                                                    }}
                                                    name={`products.${index}.product_name`}
                                                  />
                                                </Grid>
                                                <Grid item xs={1}>
                                                  <Field
                                                    component={TextField}
                                                    variant="outlined"
                                                    margin="normal"
                                                    fullWidth
                                                    type="text"
                                                    label="Unit"
                                                    InputProps={{
                                                      readOnly: true,
                                                    }}
                                                    name={`products.${index}.product_unit_name`}
                                                  />
                                                </Grid>
                                                <Grid item xs={2}>
                                                  <Field
                                                    component={TextField}
                                                    variant="outlined"
                                                    margin="normal"
                                                    fullWidth
                                                    type="text"
                                                    label="Brand"
                                                    InputProps={{
                                                      readOnly: true,
                                                    }}
                                                    name={`products.${index}.product_brand_name`}
                                                  />
                                                </Grid>
                                                <Grid item xs={2}>
                                                  <Field
                                                    component={TextField}
                                                    variant="outlined"
                                                    margin="normal"
                                                    fullWidth
                                                 type="tel"
                                                    label="Price"
                                                    name={`products.${index}.price`}
                                                    InputProps={{
                                                      readOnly: true,
                                                    }}
                                                  />
                                                </Grid>
                                                <Grid item xs={2}>
                                                  <Field
                                                    component={TextField}
                                                    variant="outlined"
                                                    margin="normal"
                                                    fullWidth
                                                 type="tel"
                                                    label="MRP Price"
                                                    name={`products.${index}.mrp_price`}
                                                    InputProps={{
                                                      readOnly: true,
                                                    }}
                                                  />
                                                </Grid>
                                                <Grid item xs={1}>
                                                  <Field
                                                    component={TextField}
                                                    variant="outlined"
                                                    margin="normal"
                                                    fullWidth
                                                 type="tel"
                                                    label="Quantity"
                                                    name={`products.${index}.qty`}
                                                    helperText={`Stock ${values.products[index].stock}.`}
                                                    // onBlur={() => {
                                                    //   values.products[index].qty >
                                                    //     values.products[index]
                                                    //       .stock &&
                                                    //     alert(
                                                    //       'Exceed Current Stock'
                                                    //     );
                                                    // }}
                                                  />
                                                </Grid>
                                                <Grid item xs={1}>
                                                  <button
                                                    type="button"
                                                    className="secondary"
                                                    style={{
                                                      width: '100%',
                                                      height: '60%',
                                                      backgroundColor: 'red',
                                                      padding: '10px 0px',
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
                                                </Grid>
                                              </Grid>
                                            </>
                                          )
                                        )}
                                      {/* {values.warehouse_id && (
                                        <GridItem
                                          xs={12}
                                          sm={12}
                                          md={3}
                                          className="row"
                                        >
                                          <Button
                                            variant="contained"
                                            fullWidth={true}
                                            color="secondary"
                                            style={{
                                              height: "100%",
                                              color: "#000",
                                              backgroundColor: "#0e41947a",
                                            }}
                                            onClick={() =>
                                              handleClickModalOpen()
                                            }
                                          >
                                            <AddCircleOutlineIcon
                                              style={{ fontSize: 50 }}
                                            />
                                          </Button>
                                        </GridItem>
                                      )} */}

                                      {/* <button
                                        type="button"
                                        className="secondary"
                                        onClick={() => handleClickModalOpen()}
                                      >
                                        Add Product
                                      </button> */}
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
