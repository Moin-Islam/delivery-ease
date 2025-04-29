import React from 'react';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
// core components
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardAvatar from 'components/Card/CardAvatar.js';
import CardBody from 'components/Card/CardBody.js';
import CardFooter from 'components/Card/CardFooter.js';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import Grid from '@material-ui/core/Grid';
import { Button, MenuItem, FormControlLabel, Box } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { baseUrl } from '../../../const/api';
import { useAsyncEffect } from 'use-async-effect';
import axios from 'axios';
import ProductImageUploadEdit from './productImageUploadEdit';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Switch from '@material-ui/core/Switch';
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
};

const useStyles = makeStyles(styles);
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Edit({ token, modal, editData, endpoint, mutate }) {
  console.log(mutate);
  const classes = useStyles();
  const [errorAlert, setOpen] = React.useState({
    open: false,
    key: '',
    value: [],
  });
  const [roles, setRoles] = React.useState([]);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen({
      open: false,
      key: '',
      value: [],
    });
  };
  const [insertedProduct, setInsertedProduct] = React.useState(editData);
  const [openUpload, setOpenupload] = React.useState(false);
  const handleClickOpenUpload = () => {
    setOpenupload(true);
  };
  const handleCloseUpload = () => {
    setOpenupload(false);
    mutate();
    modal(false);
  };
  const [vat, setVat] = React.useState(editData.vat_status ? true : false);

  const handleVat = (event) => {
    setVat(event.target.checked);
  };
  // const [brand, setBrand] = React.useState([]);
  const [unit, setUnit] = React.useState([]);
  const [category, setCategory] = React.useState([]);

  let units = `${baseUrl}/product_unit_list`;
  let categoryes = `${baseUrl}/product_category_list`;

  useAsyncEffect(async (isMounted) => {
    await axios
      .all([
        axios.get(units, {
          headers: { Authorization: "Bearer " + token },
        }),
        axios.get(categoryes, {
          headers: { Authorization: "Bearer " + token },
        }),
      ])
      .then(
        axios.spread((...responses) => {
          const responseOneB = responses[0];
          const responseTwoU = responses[1];
          setUnit(responseOneB.data.response.product_units);
          setCategory(responseTwoU.data.response.product_categories);
          //console.log(responseOneB, responseTwoU);
        })
      )
      .catch((errors) => {
        console.error(errors);
      });
  }, []);

  return (
    <div>
      <GridContainer style={{ padding: '20px 30px', marginTop: 250 }}>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
   
            <CardBody>
              <Formik
                initialValues={{
                  product_name: editData.product_name,
                  arabic_name: editData.arabic_name,
                  item_code: editData.item_code,
                  barcode: editData.barcode,
                  purchase_price: editData.purchase_price,
                  minimum_selling_price: editData.minimum_selling_price,
                  selling_price: editData.selling_price,
                  whole_sale_price: 0,
                  self_no: 0,
                  low_inventory_alert: editData.low_inventory_alert,
                  brand_name: editData.brand_id,
                  unit_name: editData.unit_id,
                  category_name: editData.category_id,
                  note: editData.specification,
                  status: editData.status,
                }}
                validate={(values) => {
                  const errors = {};
                  if (!values.product_name) {
                    errors.product_name = "Required";
                  }

                  if (!values.arabic_name) {
                    errors.arabic_name = "Required";
                  }
                  
                
                  if (!values.purchase_price) {
                    errors.purchase_price = "Required";
                  }
                  if (!values.minimum_selling_price) {
                    errors.minimum_selling_price = "Required";
                  }
                  if (!values.selling_price) {
                    errors.selling_price = "Required";
                  }
               
                  if (!values.unit_name) {
                    errors.unit_name = "Required";
                  }
                  if (!values.category_name) {
                    errors.unit_name = "Required";
                  }
                  if (!values.item_code) {
                    errors.item_code = "Required";
                  }
                  if (!values.low_inventory_alert) {
                    errors.low_inventory_alert = "Required";
                  }
                  
                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                  setTimeout(() => {
                    Axios.post(
                      `${baseUrl}/${endpoint}`,
                      {
                        product_id: editData.id,
                        name: values.product_name,
                        arabic_name: values.arabic_name,
                        product_category_id: values.category_name,
                        product_unit_id: values.unit_name,
                        item_code: values.item_code,
                        barcode: values.barcode,
                        self_no: values.self_no,
                        low_inventory_alert: values.low_inventory_alert,
                        product_brand_id: values.brand_name,
                        purchase_price: values.purchase_price,
                        minimum_selling_price: values.minimum_selling_price,
                        selling_price: values.selling_price,
                        whole_sale_price: values.whole_sale_price,
                        specification: values.note,
                        date: '2021-01-01',
                        vat_status: vat ? 1 : 0,
                        status: values.status,
                      },
                      {
                        headers: { Authorization: 'Bearer ' + token },
                      }
                    )
                      .then((res) => {
                        console.log(res);
                        setSubmitting(false);

                        setInsertedProduct(editData);
                        handleClickOpenUpload();
                        // mutate();
                        // modal(false);
                      })
                      .catch(function (error) {
                        console.log(error);
                        setOpen({
                          open: true,
                          key: Object.values(error.response.data.message),
                          value: Object.values(error.response.data.message),
                        });
                        setSubmitting(false);
                      });
                  });
                }}>
                {({ submitForm, isSubmitting }) => (
                  <div className={classes.root}>
                    <div className={classes.paper}>
                      <form className={classes.form} noValidate>
                        <GridContainer>
                          <GridItem xs={12} sm={12} md={6}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="text"
                              label="Name"
                              name="product_name"
                            />
                          </GridItem>


                          <GridItem xs={12} sm={12} md={6}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="text"
                              label="Arabic Name"
                              name="arabic_name"
                            />
                          </GridItem>


                          <GridItem xs={12} sm={12} md={4}>
                            <Field
                              component={TextField}
                              name="item_code"
                              type="text"
                              label="Item Code"
                              variant="outlined"
                              margin="normal"
                              fullWidth
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={2}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="text"
                              label="Barcode"
                              name="barcode"
                              // InputProps={{
                              //   readOnly: true,
                              // }}
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={2}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="text"
                              label="Purchase Price"
                              name="purchase_price"
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={2}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                           type="tel"
                              label="Minimum Selling Price"
                              name="minimum_selling_price"
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={2}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                           type="tel"
                              label="Selling Price"
                              name="selling_price"
                            />
                          </GridItem>
                          {/* <GridItem xs={12} sm={12} md={2}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                           type="tel"
                              label="Whole Sale Price"
                              name="whole_sale_price"
                              hidden
                            />
                          </GridItem> */}
                          {/* <GridItem xs={12} sm={12} md={4}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                           type="tel"
                              label="Self No"
                              name="self_no"
                            />
                          </GridItem> */}
                          <GridItem xs={12} sm={12} md={2}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                           type="tel"
                              label="Low Inventory Alert"
                              name="low_inventory_alert"
                            />
                          </GridItem>

                          {/* <GridItem xs={12} sm={12} md={3}>
                            <Field
                              component={TextField}
                              type="text"
                              name="brand_name"
                              label="Brand"
                              select
                              fullWidth
                              variant="outlined"
                              helperText="Please select brand"
                              margin="normal">
                              {brand.map((b) => (
                                <MenuItem value={b.id}>{b.name}</MenuItem>
                              ))}
                            </Field>
                          </GridItem> */}
                          <GridItem xs={12} sm={12} md={2}>
                            <Field
                              component={TextField}
                              type="text"
                              name="unit_name"
                              label="Unit"
                              select
                              fullWidth
                              variant="outlined"
                              helperText="Please select unit"
                              margin="normal">
                              {unit.map((u) => (
                                <MenuItem value={u.id}>{u.name}</MenuItem>
                              ))}
                            </Field>
                          </GridItem>
 
                          <GridItem xs={12} sm={12} md={2}>
                        
                          <Field
                              component={TextField}
                              type="text"
                              name="category_name"
                              label="Category"
                              select
                              fullWidth
                              variant="outlined"
                              helperText="Please select category"
                              margin="normal">
                              {category.map((u) => (
                                <MenuItem value={u.id}>{u.name}</MenuItem>
                              ))}
                            </Field>
                        
                          </GridItem>


                          <GridItem xs={12} sm={12} md={2}>
                            <Field
                              component={TextField}
                              type="text"
                              name="status"
                              label="Status"
                              select
                              fullWidth
                              variant="outlined"
                              helperText="Please select status"
                              margin="normal">
                              <MenuItem value="1">Active</MenuItem>
                              <MenuItem value="0">Inactive</MenuItem>
                            </Field>
                          </GridItem>
                          {/* <GridItem xs={12} sm={12} md={1}>
                            <Box mt={3}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={vat}
                                    onChange={handleVat}
                                    name="checkedA"
                                    inputProps={{
                                      'aria-label': 'secondary checkbox',
                                    }}
                                  />
                                }
                                label="VAT"
                              />
                            </Box>
                          </GridItem> */}
                          <GridItem xs={12} sm={12} md={5}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="text"
                              label="Specification"
                              name="note"
                            />
                          </GridItem>
                        </GridContainer>
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
                            'UPDATE'
                          )}
                        </Button>
                      </form>
                    </div>
                  </div>
                )}
              </Formik>
              <Dialog
                open={openUpload}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseUpload}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description">
                <DialogTitle id="alert-dialog-slide-title">
                  Select Product Image For Upload
                </DialogTitle>
                <DialogContent>
                  <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center">
                    <ProductImageUploadEdit
                      product={insertedProduct}
                      token={token}
                      modal={modal}
                      mutate={mutate}
                    />
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleCloseUpload}
                    color="primary"
                    variant="outlined">
                    Save and Exit
                  </Button>
                </DialogActions>
              </Dialog>
            </CardBody>
            <Snackbar
              open={errorAlert.open}
              autoHideDuration={2000}
              onClose={handleClose}>
              <Alert
                onClose={handleClose}
                severity="error"
                color="error"
                style={{
                  backgroundColor: '#ff1a1a',
                  color: 'white',
                }}>
                {errorAlert.value[0]}
              </Alert>
            </Snackbar>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}


export default Edit;
