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
import WholeProduct from "./edit/wholeProduct";
import WholeProductTotalCalculation from "./edit/wholeProductTotalCalculation";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ClearIcon from "@material-ui/icons/Clear";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";

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
const purchase_product = [];

function Edit({ token, modal, editData, endpoint, mutate }) {
  console.log(editData);
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

  const [total, setTotal] = React.useState(editData.total_amount);
  const [vat, setVat] = React.useState(0);
  const [paid, setPaid] = React.useState(editData.paid_amount);
  const [due, setDue] = React.useState(editData.due_amount);
  const [discount, setDiscount] = React.useState(editData.discount_amount);

  const [load, setLoad] = React.useState(false);
  const [product, setProduct] = React.useState(null);
  const [party, setParty] = React.useState(null);
  const [store, setStore] = React.useState([]);
  let parties = `${baseUrl}/party_list`;
  let stores = `${baseUrl}/store_list`;
  // let products = `${baseUrl}/product_list`;

  useAsyncEffect(async (isMounted) => {
    const requestOne = axios.get(parties, {
      headers: { Authorization: "Bearer " + token },
    });
    const requestTwo = axios.get(stores, {
      headers: { Authorization: "Bearer " + token },
    });
    // const requestThree = axios.get(products, {
    //   headers: { Authorization: "Bearer " + token },
    // });
    await axios
      .all([requestOne, requestTwo])
      .then(
        axios.spread((...responses) => {
          if (!isMounted()) return;
          const responseOneB = responses[0];
          const responseTwoU = responses[1];
          //const responsethree = responses[2];
          setParty(responseOneB.data.response.parties);
          setStore(responseTwoU.data.response.stores);
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
      <GridContainer style={{ padding: "20px 30px", marginTop: 250 }}>
        <GridItem xs={12} sm={12} md={12}></GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardBody>
              <Formik
                initialValues={{
                  party_id: editData.customer_id,
                  store_id: editData.store_id,
                  products: [],
                  payment_type: "Cash",
                  grand_total: total,
                  paid_total: paid,
                  due_amount: due,
                  discount_type: editData.discount_type,
                  discount_amount: discount,
                  // barcode: "",
                }}
                validate={(values) => {
                  const errors = {};
                  if (!values.party_id) {
                    errors.party_id = "Required";
                  }
                  if (!values.store_id) {
                    errors.store_id = "Required";
                  }
                  values.products.map((p) => {
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
                  setTimeout(() => {
                    axios
                      .post(
                        `${baseUrl}/${endpoint}`,
                        {
                          product_sale_id: editData.id,
                          store_id: values.store_id,
                          party_id: values.party_id,
                          products: values.products,
                          total_amount: total,
                          total_vat_amount: vat,
                          paid_amount: paid,
                          due_amount: due,
                          payment_type: values.payment_type,
                          discount_type: values.discount_type,
                          discount_amount: discount,
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
                              <Field
                                component={TextField}
                                type="text"
                                name="store_id"
                                label="Store"
                                select
                                fullWidth
                                variant="outlined"
                                helperText="Please select store"
                                margin="normal"
                              >
                                {store.map((b) => (
                                  <MenuItem value={b.id}>
                                    {b.store_name}
                                  </MenuItem>
                                ))}
                              </Field>
                            )}
                          </GridItem>
                          <GridItem xs={12} sm={12} md={6}>
                            {load && (
                              <Field
                                component={TextField}
                                type="text"
                                name="party_id"
                                label="Customer"
                                select
                                fullWidth
                                variant="outlined"
                                helperText="Please select party"
                                margin="normal"
                              >
                                {party.map(
                                  (b) =>
                                    b.type == "customer" && (
                                      <MenuItem value={b.id}>{b.name}</MenuItem>
                                    )
                                )}
                              </Field>
                            )}
                          </GridItem>

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
                                                label="product_sale_detail_id"
                                                hidden={true}
                                                name={`products.${index}.product_sale_detail_id`}
                                              />
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
                                                component={TextField}
                                                variant="outlined"
                                                margin="normal"
                                                fullWidth
                                                type="text"
                                                label="Name"
                                                InputProps={{
                                                  readOnly: true,
                                                }}
                                                margin="dense"
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
                                                margin="normal"
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
                                                margin="normal"
                                                fullWidth
                                                type="text"
                                                label="Brand"
                                                margin="dense"
                                                InputProps={{
                                                  readOnly: true,
                                                }}
                                                name={`products.${index}.product_brand_name`}
                                              />
                                              <GridContainer>
                                                <GridItem
                                                  xs={12}
                                                  sm={12}
                                                  md={4}
                                                >
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
                                                </GridItem>
                                                <GridItem
                                                  xs={12}
                                                  sm={12}
                                                  md={4}
                                                >
                                                  <Field
                                                    component={TextField}
                                                    variant="outlined"
                                                    margin="normal"
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
                                                    margin="normal"
                                                    fullWidth
                                                 type="tel"
                                                    label="Quantity"
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

                                              {/* <button
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
                                                onClick={() => remove(index)}
                                              >
                                                Remove
                                              </button> */}
                                            </GridItem>
                                          )
                                        )}
                                      {/* <GridItem
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
                                          onClick={() => handleClickModalOpen()}
                                        >
                                          <AddCircleOutlineIcon
                                            style={{ fontSize: 50 }}
                                          />
                                        </Button>
                                      </GridItem> */}

                                      <WholeProduct
                                        push={push}
                                        handleClose={handleModalClose}
                                        products={product}
                                        token={token}
                                        values={values}
                                        setOpenError={setOpen}
                                        replace={replace}
                                        id={editData.id}
                                      />
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
}

// UserProfile.layout = Admin;

export default Edit;
