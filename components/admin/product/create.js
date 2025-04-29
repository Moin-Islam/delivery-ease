import React, { useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";;
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import Grid from "@material-ui/core/Grid";
import { Box, Button, FormControlLabel, MenuItem } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import { baseUrl } from "../../../const/api";
import { useAsyncEffect } from "use-async-effect";
import axios from "axios";
import {
  Autocomplete,
} from "formik-material-ui-lab";
import MuiTextField from "@material-ui/core/TextField";
import ProductImageUpload from "./productImageUpload";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
// import AppBar from "@material-ui/core/AppBar";
// import Toolbar from "@material-ui/core/Toolbar";
// import IconButton from "@material-ui/core/IconButton";
// import Typography from "@material-ui/core/Typography";
// import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
// import CreateBrand from "components/admin/product_brand/create"; 
import Switch from "@material-ui/core/Switch";
const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
};

const useStyles = makeStyles(styles);
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Create = ({ token, modal, endpoint, mutate }) => {
  console.log("Create");
  const classes = useStyles();
  const [errorAlert, setOpen] = React.useState({
    open: false,
    key: "",
    value: [],
  });
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen({
      open: false,
      key: "",
      value: [],
    });
  };
  const [insertedProduct, setInsertedProduct] = React.useState(null);
  const [openUpload, setOpenupload] = React.useState(false);
  const handleClickOpenUpload = () => {
    setOpenupload(true);
  };
  const handleCloseUpload = () => {
    setOpenupload(false);
    mutate();
    modal(false);
  };

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const handleClickOpenCreate = () => {
    setOpenCreateModal(true);
  };
  const handleCloseCreate = () => {
    setOpenCreateModal(false);
  };

  const [vat, setVat] = React.useState(false);

  const handleVat = (event) => {
    setVat(event.target.checked);
  };

  const [load, setLoad] = React.useState(false);

  const [unit, setUnit] = React.useState([]);
  const [category, setCategory] = React.useState([]);

    // const [brand, setBrand] = React.useState(null);
  // let brands = `${baseUrl}/product_brand_list`;

  let units = `${baseUrl}/product_unit_list`;
  let categoryes = `${baseUrl}/product_category_list_active`;

  useAsyncEffect(async (isMounted) => {
    await axios
      .all([
        // axios.get(brands, {
        //   headers: { Authorization: "Bearer " + token },
        // }),
        axios.get(units, {
          headers: { Authorization: "Bearer " + token },
        }),
        axios.get(categoryes, {
          headers: { Authorization: "Bearer " + token },
        }),
      ])
      .then(
        axios.spread((...responses) => {
          if (!isMounted()) return;
          const responseOneB = responses[0];
          const responseTwoU = responses[1];
          // setBrand(responseOneB.data.response.product_brand);
          setUnit(responseOneB.data.response.product_units);
          setCategory(responseTwoU.data.response.product_categories);
          
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
      <GridContainer style={{ padding: "20px 30px", marginTop: 250 }}>
        <GridItem xs={12} sm={12} md={12}>
      
          <Card>
          
            <CardBody>
              <Formik
                initialValues={{
                  product_name: "",
                  arabic_name: "",
                  item_code: "",
                  purchase_price: "",
                  minimum_selling_price: "",
                  selling_price: "",
                  whole_sale_price: 0,
                  self_no: 0,
                  low_inventory_alert: "",
                  brand_name: "",
                  unit_name: "",
                  category_name: "",
                  note: "",
                  status: "1",
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
                  console.log(values);
                  setTimeout(() => {
                    Axios.post(
                      `${baseUrl}/${endpoint}`,
                      {
                        name: values.product_name,
                        product_unit_id: values.unit_name.id,
                        product_category_id: values.category_name.id,
                        arabic_name: values.arabic_name,
                        item_code: values.item_code,
                        barcode: null,
                        vat_status: 0,
                        self_no: values.self_no,
                        low_inventory_alert: values.low_inventory_alert,
                        product_brand_id: values.brand_name.id,
                        purchase_price: values.purchase_price,
                        minimum_selling_price: values.minimum_selling_price,
                        selling_price: values.selling_price,
                        whole_sale_price: values.whole_sale_price,
                        specification: values.note,
                        date: "2021-01-01",
                        status: values.status,
                      },
                      {
                        headers: { Authorization: "Bearer " + token },
                      }
                    )
                      .then((res) => {
                        console.log(res);
                        setSubmitting(false);
                        setInsertedProduct(res.data.response);
                        handleClickOpenUpload();
                        // mutate();
                        // modal(false);
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
                }}
              >
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


                          <GridItem xs={12} sm={12} md={2}>
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
                           type="tel"
                              label="Purchase Price"
                              name="purchase_price"
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


                          <GridItem xs={12} sm={12} md={2}>
                            {load && (
                              <Field
                                name="unit_name"
                                component={Autocomplete}
                                options={unit}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => (
                                  <MuiTextField
                                    {...params}
                                    label="Unit"
                                    variant="outlined"
                                    fullWidth
                                    helperText="Please select unitss"
                                    margin="normal"
                                  />
                                )}
                              />
                            )}
                          </GridItem>

                  
                          <GridItem xs={12} sm={12} md={2}>
                            {load && (
                              <Field
                                name="category_name"
                                component={Autocomplete}
                                options={category}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => (
                                  <MuiTextField
                                    {...params}
                                    label="Category"
                                    variant="outlined"
                                    fullWidth
                                    helperText="Please select category"
                                    margin="normal"
                                  />
                                )}
                              />
                            )}
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
                              margin="normal"
                            >
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
                                      "aria-label": "secondary checkbox",
                                    }}
                                  />
                                }
                                label="VAT"
                              />
                            </Box>
                          </GridItem> */}
                          <GridItem xs={12} sm={12} md={4}>
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
                          onClick={submitForm}
                        >
                          {isSubmitting ? (
                            <CircularProgress color="primary" size={24} />
                          ) : (
                            "SUBMIT"
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
                aria-describedby="alert-dialog-slide-description"
              >
                <DialogTitle id="alert-dialog-slide-title">
                  Select Product Image For Upload
                </DialogTitle>
                <DialogContent>
                  <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                  >
                    <ProductImageUpload
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
                    variant="outlined"
                  >
                    Save and Exit
                  </Button>
                </DialogActions>
              </Dialog>
              {/* <Dialog
                fullScreen
                open={openCreateModal}
                onClose={handleCloseCreate}
                TransitionComponent={Transition}
              >
                <AppBar style={{ position: "relative" }}>
                  <Toolbar>
                    <IconButton
                      edge="start"
                      color="inherit"
                      onClick={handleCloseCreate}
                      aria-label="close"
                    >
                      <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" style={{ flex: 1 }}>
                      Create Brand
                    </Typography>
                  </Toolbar>
                </AppBar>
                <CreateBrand
                  token={token}
                  modal={setOpenCreateModal}
                  endpoint="product_brand_create"
                  mutate={mutate}
                />
              </Dialog> */}
            </CardBody>
            <Snackbar
              open={errorAlert.open}
              autoHideDuration={2000}
              onClose={handleClose}
            >
              <Alert
                onClose={handleClose}
                severity="error"
                color="error"
                style={{
                  backgroundColor: "#ff1a1a",
                  color: "white",
                }}
              >
                {errorAlert.value[0]}
              </Alert>
            </Snackbar>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};



export default Create;
