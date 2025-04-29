import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
//import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

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
import WholeProduct from "./edit/wholeProduct";
import WholeProductTotalCalculation from "./edit/EditTotalcalculation";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
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
  const [paid, setPaid] = React.useState(0);
  const [due, setDue] = React.useState(0);
  const [discount, setDiscount] = React.useState(0);

  const [load, setLoad] = React.useState(false);
  const [product, setProduct] = React.useState(null);
  const [store, setStore] = React.useState(null);
  const [warehouse, setWarehouse] = React.useState([]);
  const [warehouse_id, setWarehouseId] = React.useState(null);
  const [store_id, setStoreId] = React.useState(null);
  const [misCharge, setMisCharge] = React.useState(editData?.miscellaneous_charge);
  let stores = `${baseUrl}/store_list`;
  let warehouses = `${baseUrl}/warehouse_list`;
  //let products = `${baseUrl}/product_list`;

  useAsyncEffect(async (isMounted) => {

    await axios
      .all([
        axios.get(stores, {
          headers: { Authorization: "Bearer " + token },
        }),
        axios.get(warehouses, {
          headers: { Authorization: "Bearer " + token },
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


  const permaRemove = (index, products) => {
    axios
      .post(
        `${baseUrl}/stock_transfer_single_product_remove`,
        {
          stock_transfer_id: editData.id,
          stock_transfer_detail_id: products[index].stock_transfer_detail_id,
        },
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        setOpen({
          open: true,
          key: "Deleted successfully",
          value: ["Permanently Deleted"],
        });
      })
      .catch(function (error) {
        setOpen({
          open: true,
          key: Object.values("Something went wrong"),
          value: ["Something went wrong"],
        });
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
                  warehouse_id: editData.warehouse_id,
                  store_id: editData.store_id,
                  products: [],
                  payment_type: "Cash",
                  grand_total: total,
                  paid_total: paid,
                  due_amount: due,
                  discount_type: editData.discount_type,
                  discount_amount: discount,
                  miscellaneous_comment: editData.miscellaneous_comment,
                  miscellaneous_charge: editData.miscellaneous_charge,
                  // barcode: "",
                }}
                validate={(values) => {
                  const errors = {};
                  // if (!values.party_id) {
                  //   errors.party_id = "Required";
                  // }
                  if (!values.store_id) {
                    errors.store_id = "Required";
                  }
                  values.products.map((p) => {
                    p.qty < 0 &&
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
                //   console.log({
                            
                //           stock_transfer_id: editData.id,
                //           store_id: values.store_id,
                //           warehouse_id: values.warehouse_id,
                //           products: values.products,
                //           miscellaneous_charge: values.miscellaneous_charge,
                //           miscellaneous_comment: values.miscellaneous_comment,
                //         },
                // )
                  setTimeout(() => {
                    axios
                      .post(
                        `${baseUrl}/${endpoint}`,
                        {
                          stock_transfer_id: editData.id,
                          store_id: values.store_id,
                          warehouse_id: values.warehouse_id,
                          products: values.products,
                          miscellaneous_charge: misCharge,
                          miscellaneous_comment: values.miscellaneous_comment,
                        },
                        {
                          headers: { Authorization: "Bearer " + token },
                        }
                      )
                      .then((res) => {
                        //console.log(res);
                        setSubmitting(false);
                        // setTotal(0);
                        // setPaid(0);
                        // setDue(0);
                        // setVat(0);
                        mutate();
                        modal(false);
                      })
                      .catch(function (error) {
                        // setOpen({
                        //   open: true,
                        //   key: Object.values(error.response.data.message),
                        //   value: Object.values(error.response.data.message),
                        // });
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
                          <GridItem xs={6} sm={6} md={6}>
                            <Box mb={3}>
                              <Typography variant="h5" align="center">
                                Invoice No: {editData.invoice_no}
                              </Typography>
                            </Box>
                          </GridItem>
                          <GridItem xs={6} sm={6} md={6}>
                            <Box mb={3}>
                              <Typography variant="h5" align="center">
                                Date: {editData.issue_date}
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
                                }}
                              >
                                {warehouse.map((option) => (
                                  <MenuItem
                                    key={option.id}
                                    value={option.id}
                                    onClick={() => setWarehouseId(option.id)}
                                  >
                                    {option.name}
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
                                }}
                              >
                                {store.map((option) => (
                                  <MenuItem
                                    key={option.id}
                                    value={option.id}
                                    onClick={() => setStoreId(option.id)}
                                  >
                                    {option.store_name}
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
{/*                                   
                                      <GridItem xs={4} sm={4} md={4}>
                                        <BarcodeField
                                          push={push}
                                          products={product}
                                          values={values}
                                          setOpenError={setOpen}
                                          replace={replace}
                                          token={token}
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
                                        />
                                      </GridItem>

                                      <GridItem xs={4} sm={4} md={4}>
                                        <ProductName
                                          push={push}
                                          values={values}
                                          setOpenError={setOpen}
                                          replace={replace}
                                          token={token}
                                        />
                                      </GridItem> */}
                                      {values.products.length > 0 ? (
                                        <TableContainer>
                                          <Table aria-label="simple table">
                                            <TableHead>
                                              <TableRow>
                                                <TableCell
                                                  style={{ display: "none" }}
                                                >
                                                  {" "}
                                                  stock transfer id{" "}
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

                                                <TableCell
                                                  style={{ display: "none" }}
                                                >
                                                  Brand Id
                                                </TableCell>
                                                <TableCell
                                                  style={{ display: "none" }}
                                                >
                                                  Brand
                                                </TableCell>

                                                <TableCell align="center">
                                                  Price
                                                </TableCell>
                                                <TableCell align="center">
                                                  Quantity
                                                </TableCell>
                                                <TableCell align="center">
                                                  Action
                                                </TableCell>
                                              </TableRow>
                                            </TableHead>
                                            <TableBody>
                                              {values.products.map(
                                                (product, index) => (
                                                  <TableRow>
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
                                                        label="stock_transfer_detail_id"
                                                        hidden={true}
                                                        name={`products.${index}.stock_transfer_detail_id`}
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
                                                        // label="Name"
                                                        InputProps={{
                                                          readOnly: true,
                                                        }}
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
                                                      style={{
                                                        display: "none",
                                                      }}
                                                    >
                                                      <Field
                                                        variant="outlined"
                                                        margin="normal"
                                                        fullWidth
                                                        type="text"
                                                        // label="product_brand_id"
                                                        hidden={true}
                                                        name={`products.${index}.product_brand_id`}
                                                      />
                                                    </TableCell>

                                                    <TableCell
                                                      style={{
                                                        display: "none",
                                                      }}
                                                    >
                                                      <Field
                                                        component={TextField}
                                                        variant="outlined"
                                                        fullWidth
                                                        type="text"
                                                        // label="Brand"
                                                        margin="dense"
                                                        InputProps={{
                                                          readOnly: true,
                                                        }}
                                                        name={`products.${index}.product_brand_name`}
                                                      />
                                                    </TableCell>

                                                    <TableCell>
                                                      <Field
                                                        component={TextField}
                                                        variant="outlined"
                                                        margin="dense"
                                                        fullWidth
                                                        type="tel"
                                                        // label="Whole Sale Price"
                                                        name={`products.${index}.price`}
                                                        // InputProps={{
                                                        //   readOnly: true,
                                                        // }}
                                                      />
                                                    </TableCell>

                                                    <TableCell>
                                                      <Field
                                                        component={TextField}
                                                        variant="outlined"
                                                        fullWidth
                                                        type="tel"
                                                        margin="dense"
                                                        defaultValue={0}
                                                        // label="Quantity"
                                                        name={`products.${index}.qty`}
                                                      />
                                                    </TableCell>

                                                    <TableCell>
                                                      <button
                                                        type="button"
                                                        className="secondary"
                                                        style={{
                                                          width: "100%",
                                                          backgroundColor:
                                                            "red",
                                                          padding: "10px 0px",
                                                          margin: "10px",
                                                          border: "0px",
                                                          borderRadius: "3px",
                                                          cursor: "pointer",
                                                          color: "white",
                                                          fontWeight: "bold",
                                                        }}
                                                        onClick={() => {
                                                          permaRemove(
                                                            index,
                                                            values.products
                                                          );
                                                          remove(index);
                                                        }}
                                                      >
                                                        Remove
                                                      </button>
                                                    </TableCell>
                                                  </TableRow>
                                                )
                                              )}
                                            </TableBody>
                                          </Table>
                                        </TableContainer>
                                      ) : (
                                        <GridItem
                                          xs={12}
                                          sm={12}
                                          md={12}
                                          container
                                          justify="center"
                                        >
                                          <CircularProgress />
                                          <Box ml={2}>
                                            <Typography
                                              variant="h6"
                                              color="primary"
                                            >
                                              Fetching Data...
                                            </Typography>
                                          </Box>
                                        </GridItem>
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
                                      )}

                                      <button
                                        type="button"
                                        className="secondary"
                                        onClick={() => handleClickModalOpen()}
                                      >
                                        Add Product
                                      </button> */}

                                      <WholeProduct
                                        push={push}
                                        handleClose={handleModalClose}
                                        products={product}
                                        setProducts={setProduct}
                                        token={token}
                                        values={values}
                                        setOpenError={setOpen}
                                        replace={replace}
                                        id={editData.id}
                                      />
                                      <GridItem xs={12} sm={12} md={6}>
                                        <Field
                                          component={TextField}
                                          variant="outlined"
                                          margin="normal"
                                          fullWidth
                                          type="text"
                                          label="Miscellaneous Comment"
                                          name="miscellaneous_comment"
                                        />
                                      </GridItem>
                                      <GridItem xs={12} sm={12} md={6}>
                                        <Field
                                          component={TextField}
                                          variant="outlined"
                                          margin="normal"
                                          fullWidth
                                          type="tel"
                                          label="Miscellaneous Charge"
                                          name="miscellaneous_charge"
                                          value={misCharge}
                                          onChange={(e)=>setMisCharge(e.target.value)}
                                        />
                                      </GridItem>
                                    </GridContainer>
                                  )}
                                />
                              </GridItem>
                            </GridContainer>
                          </GridItem>

                          <GridItem xs={12} sm={12} md={12}>
                            <WholeProductTotalCalculation
                             values={values}
                              total={total}
                              setTotal={setTotal}
                              paid={paid}
                              setPaid={setPaid}
                              due={due}
                              setDue={setDue}
                              misCharge={misCharge || 0}
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
