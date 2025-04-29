import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
//import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { Formik, Form, Field, FieldArray } from "formik";
import { TextField } from "formik-material-ui";
import Grid from "@material-ui/core/Grid";
import { Box, Button, MenuItem, Typography } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import { baseUrl } from "../../../const/api";
import { useAsyncEffect } from "use-async-effect";
import axios from "axios";
import { Autocomplete } from "formik-material-ui-lab";
import MuiTextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import WholeProduct from "./create/wholeProduct";
import WholeProductTotalCalculation from "./create/wholeProductTotalCalculation";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ClearIcon from "@material-ui/icons/Clear";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import BarcodeField from "./create/barcodeField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
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
  cardBack: {
    color: "#FFFFFF",
    backgroundColor: "blue",
  },
};
const useStyles = makeStyles(styles);
const Create = ({ token, modal, endpoint, mutate }) => {
  const classes = useStyles();
  const [errorAlert, setOpen] = React.useState({
    open: false,
    key: "",
    value: [],
    severity: "error",
    color: "error",
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen({
      open: false,
      key: "",
      value: [],
      severity: "error",
      color: "error",
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
  const [vat, setVat] = React.useState(0);
  const [paid, setPaid] = React.useState(0);
  const [due, setDue] = React.useState(0);
  const [discount, setDiscount] = React.useState(0);

  const [load, setLoad] = React.useState(false);
  const [product, setProduct] = React.useState(null);
  const [party, setParty] = React.useState(null);
  const [store, setStore] = React.useState([]);
  let parties = `${baseUrl}/party_list`;
  let stores = `${baseUrl}/store_list`;
  //let products = `${baseUrl}/product_list`;

  useAsyncEffect(async (isMounted) => {

    await axios
      .all([
        axios.get(parties, {
          headers: { Authorization: "Bearer " + token },
        }),
        axios.get(stores, {
          headers: { Authorization: "Bearer " + token },
        }),
      ])
      .then(
        axios.spread((...responses) => {
          if (!isMounted()) return;
          const responseOneB = responses[0];
          const responseTwoU = responses[1];
          setParty(responseOneB.data.response.parties);
          setStore(responseTwoU.data.response.stores);
          setLoad(true);
        })
      )
      .catch((errors) => {
        console.error(errors);
        setLoad(false);
      });
  }, []);
  const [currentStore, setCurrentStore] = React.useState(null);
  const fetchStock = (e) => {
    axios
      .post(
        `${baseUrl}/store_current_stock_list`,
        {
          store_id: e.target.value,
        },
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        if (res.data.response.store_current_stock_list.length == 0) {
          setProduct(null);
        } else {
          console.log("sls");
          setProduct(res.data.response.store_current_stock_list);
        }
        setCurrentStore(e.target.value);
      })
      .catch((error) => {
        console.log("nai");
        setOpen({
          open: true,
          key: "",
          value: ["Empty Store"],
          severity: "error",
          color: "error",
        });
        setProduct(null);
        setCurrentStore(null);
      });
  };
  return (
    <div>
      <GridContainer style={{ padding: "20px 30px", marginTop: 250 }}>
        <GridItem xs={12} sm={12} md={12}></GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardBody>
              <Formik
                initialValues={{
                  party_id: "",
                  //store_id: "",
                  products: [],
                  payment_type: "Cash",
                  grand_total: total,
                  paid_total: paid,
                  due_amount: due,
                  barcode: "",
                  discount_amount: discount,
                  discount_type: "Flat",
                }}
                validate={(values) => {
                  const errors = {};
                  if (!values.party_id) {
                    errors.party_id = "Required";
                  }
                  // if (!values.store_id) {
                  //   errors.store_id = "Required";
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
                    p.qty < 1 &&
                      ((p.qty = 1),
                      setOpen({
                        open: true,
                        key: "",
                        value: [`Minimum Quantity 1`],
                        severity: "error",
                        color: "error",
                      }));
                  });
                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                  console.log(values);
                  console.log(total);
                  setTimeout(() => {
                    axios
                      .post(
                        `${baseUrl}/${endpoint}`,
                        {
                          party_id: values.party_id.id,
                          store_id: currentStore,
                          products: values.products,
                          total_amount: total,
                          total_vat_amount: vat,
                          paid_amount: paid,
                          due_amount: due,
                          payment_type: values.payment_type,
                          discount_amount: discount,
                          discount_type: values.discount_type,
                        },
                        {
                          headers: { Authorization: "Bearer " + token },
                        }
                      )
                      .then((res) => {
                        //console.log(res);
                        setSubmitting(false);
                        setTotal(0);
                        setPaid(0);
                        setDue(0);
                        setVat(0);
                        setDiscount(0);
                        mutate();
                        if (res.data.payment_type == "SSL Commerz") {
                          axios
                            .post(
                              `${baseUrl}/checkout/ssl/pay`,
                              {
                                transaction_id: res.data.transaction_id,
                              },
                              {
                                headers: { Authorization: "Bearer " + token },
                              }
                            )
                            .then((res) => {
                              modal(false);
                              window && (window.location.href = res.data);
                            })
                            .catch(function (error) {
                              console.log(error);
                            });
                        } else {
                          modal(false);
                        }
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
                {({ values, errors, submitForm, isSubmitting }) => (
                  <div className={classes.root}>
                    <div className={classes.paper}>
                      <form className={classes.form} noValidate>
                        <GridContainer>
                          <GridItem xs={12} sm={12} md={6}>
                            {load && (
    
                              <Box mt={2}>
                                <FormControl
                                  variant="outlined"
                                  className={classes.formControl}
                                  fullWidth={true}
                                >
                                  <InputLabel id="demo-simple-select-outlined-label">
                                    Store
                                  </InputLabel>
                                  <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    label="Store"
                                    onChange={fetchStock}
                                  >
                                    {store.map((str) => (
                                      <MenuItem value={str.id} key={str.id}>
                                        {str.store_name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Box>
                            )}
                          </GridItem>
                          <GridItem xs={12} sm={12} md={6}>
                            {load && (
                              <Field
                                name="party_id"
                                component={Autocomplete}
                                options={party}
                                getOptionLabel={(option) =>
                                  option.type == "customer" ? option.name : ""
                                }
                                renderInput={(params) => (
                                  <MuiTextField
                                    {...params}
                                    label="Customer"
                                    variant="outlined"
                                    fullWidth
                                    helperText="Please select customer"
                                    margin="normal"
                                  />
                                )}
                              />
                            )}
                          </GridItem>
                          {product ? (
                            <>
                              <GridItem xs={12} sm={12} md={9}>
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
                                          <GridItem xs={12} sm={12} md={12}>
                                            <BarcodeField
                                              push={push}
                                              products={product}
                                              values={values}
                                              setOpenError={setOpen}
                                              replace={replace}
                                              token={token}
                                            />
                                          </GridItem>
                                          <GridItem
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            className="row"
                                          >
                                            <Typography
                                              color="primary"
                                              variant="h5"
                                            >
                                              Products :
                                            </Typography>
                                          </GridItem>
                                          {values.products.length > 0 &&
                                            values.products.map(
                                              (product, index) => (
                                                <GridItem
                                                  xs={12}
                                                  sm={12}
                                                  md={4}
                                                  className="row"
                                                  key={index}
                                                >
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
                                                    component={TextField}
                                                    variant="outlined"
                                                    fullWidth
                                                    type="text"
                                                    label="Name"
                                                    margin="dense"
                                                    InputProps={{
                                                      readOnly: true,
                                                    }}
                                                    name={`products.${index}.product_name`}
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
                                                    component={TextField}
                                                    variant="outlined"
                                                    fullWidth
                                                    type="text"
                                                    label="Unit"
                                                    InputProps={{
                                                      readOnly: true,
                                                    }}
                                                    margin="dense"
                                                    name={`products.${index}.product_unit_name`}
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
                                                  <Field
                                                    component={TextField}
                                                    variant="outlined"
                                                    fullWidth
                                                    type="text"
                                                    label="Brand"
                                                    InputProps={{
                                                      readOnly: true,
                                                    }}
                                                    margin="dense"
                                                    name={`products.${index}.product_brand_name`}
                                                  />
                                                  {/* <Field
                                                    component={TextField}
                                                    variant="outlined"
                                                    margin="normal"
                                                    fullWidth
                                                 type="tel"
                                                    label="Price"
                                                    name={`products.${index}.price`}
                                                  /> */}
                                                  <GridContainer>
                                                    <GridItem
                                                      xs={12}
                                                      sm={12}
                                                      md={4}
                                                    >
                                                      <Field
                                                        component={TextField}
                                                        variant="outlined"
                                                        fullWidth
                                                     type="tel"
                                                        label="MRP Price"
                                                        margin="dense"
                                                        name={`products.${index}.mrp_price`}
                                                        InputProps={{
                                                          readOnly: true,
                                                        }}
                                                      />
                                                    </GridItem>
                                                    <GridItem
                                                      xs={12}
                                                      sm={12}
                                                      md={4}
                                                    >
                                                      <Field
                                                        component={TextField}
                                                        variant="outlined"
                                                        fullWidth
                                                     type="tel"
                                                        label="VAT"
                                                        margin="dense"
                                                        InputProps={{
                                                          readOnly: true,
                                                        }}
                                                        name={`products.${index}.vat_amount`}
                                                      />
                                                    </GridItem>
                                                    <GridItem
                                                      xs={12}
                                                      sm={12}
                                                      md={4}
                                                    >
                                                      <Field
                                                        component={TextField}
                                                        variant="outlined"
                                                        fullWidth
                                                     type="tel"
                                                        label="Quantity"
                                                        margin="dense"
                                                        name={`products.${index}.qty`}
                                                      />
                                                    </GridItem>
                                                  </GridContainer>

                                                  {/* {errors.friends &&
                                                errors.friends[index] &&
                                                errors.friends[index].name &&
                                                touched.friends &&
                                                touched.friends[index].name && (
                                                  <div className="field-error">
                                                    {errors.friends[index].name}
                                                  </div>
                                                )} */}

                                                  <button
                                                    type="button"
                                                    className="secondary"
                                                    style={{
                                                      width: "100%",
                                                      backgroundColor: "red",
                                                      padding: "10px 0px",
                                                      margin: "10px 0px",
                                                      border: "0px",
                                                      borderRadius: "3px",
                                                      cursor: "ponter",
                                                      color: "white",
                                                      fontWeight: "bold",
                                                    }}
                                                    onClick={() =>
                                                      remove(index)
                                                    }
                                                  >
                                                    Remove
                                                  </button>
                                                </GridItem>
                                              )
                                            )}
                                          <GridItem
                                            xs={12}
                                            sm={12}
                                            md={4}
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
                                            maxWidth="lg"
                                          >
                                            <WholeProduct
                                              push={push}
                                              handleClose={handleModalClose}
                                              products={product}
                                              token={token}
                                              values={values}
                                              setOpenError={setOpen}
                                              replace={replace}
                                            />
                                          </Dialog>
                                        </GridContainer>
                                      )}
                                    />
                                  </GridItem>
                                </GridContainer>
                              </GridItem>
                              <GridItem xs={12} sm={12} md={3}>
                                <WholeProductTotalCalculation
                                  values={values}
                                  total={total}
                                  setTotal={setTotal}
                                  paid={paid}
                                  setPaid={setPaid}
                                  due={due}
                                  setDue={setDue}
                                  discount={discount}
                                  setDiscount={setDiscount}
                                  vat={vat}
                                  setVat={setVat}
                                />
                              </GridItem>
                            </>
                          ) : (
                            <GridItem xs={12} sm={12} md={12}>
                              <Typography
                                variant="h6"
                                container
                                justify="center"
                                color="secondary"
                              >
                                Select store to sale product
                              </Typography>
                            </GridItem>
                          )}
                        </GridContainer>
                        <Box my={3}>
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
              onClose={handleClose}
            >
              <Alert
                onClose={handleClose}
                severity={errorAlert.severity}
                color={errorAlert.color}
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

// UserProfile.layout = Admin;

export default Create;
