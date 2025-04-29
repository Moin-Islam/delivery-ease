import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { Formik, Form, Field, FieldArray } from "formik";
import { TextField } from "formik-material-ui";
import { TextField as MText } from "@material-ui/core";
import { Box, Button, MenuItem, Typography } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { baseUrl } from "../../../const/api";
import { useAsyncEffect } from "use-async-effect";
import axios from "axios";
import { Autocomplete } from "formik-material-ui-lab";
import MuiTextField from "@material-ui/core/TextField";
import ProductTable from "../../../helper/productTable";
import ParchasecalculationFromCommon from "../common_calculation/posPurchaseCalculation";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import BarcodeField from "./create/barcodeField";
import ItemCode from "./create/itemCode";
import ProductName from "./create/productName";
import AllApplicationErrorNotification from '../../utils/notificationHandle';

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

const Create = ({ userDetails, token, modal, endpoint, handleRefress }) => {
  const classes = useStyles();

  const { warehouse_id, role } = userDetails || {};

  const [subTotal, setSubTotal] = React.useState(0);
  const [discountType, setDiscountType] = React.useState("Flat");
  const [discountParcent, setDiscountParcent] = React.useState(0);
  const [discountAmount, setDiscountAmount] = React.useState(0);
  const [afterDiscountAmount, setAfterDiscountAmount] = React.useState(0);
  const [vat, setVat] = React.useState(0);
  const [finalAmount, setFinalAmount] = React.useState(0);
  const [paymentType, setPaymentType] = React.useState("Cash");
  const [warehouseId, setWarehouseId] = React.useState(null);

  const [date, setDate] = React.useState(null);

  const [load, setLoad] = React.useState(false);
  const [product, setProduct] = React.useState(null);
  const [party, setParty] = React.useState(null);
  const [warehouse, setWarehouse] = React.useState([]);
  let parties = `${baseUrl}/supplier_list_active`;
  let warehouses = `${baseUrl}/warehouse_list_active`;

  React.useEffect(() => {
    if (warehouse_id && role == "warehouse admin") {
      setWarehouseId(warehouse_id);
    }
  }, []);

  useAsyncEffect(async (isMounted) => {
    const requestOne = axios.get(parties, {
      headers: { Authorization: "Bearer " + token },
    });
    const requestTwo = axios.get(warehouses, {
      headers: { Authorization: "Bearer " + token },
    });
    await axios
      .all([requestOne, requestTwo])
      .then(
        axios.spread((...responses) => {
          if (!isMounted()) return;
          const responseOneB = responses[0];
          const responseTwoU = responses[1];
          setParty(responseOneB.data.response.supplier_lists);
          setWarehouse(responseTwoU.data.response.warehouses);
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
                  invoice_number: "",
                  referance_number: "",
                  party_id: "",
                  warehouse_id: "",
                  products: [],
                  payment_type: "Cash",
                  grand_total: "",
                  paid_total: "",
                  due_amount: "",
                  discount_amount: "",
                  discount_type: "Flat",
                }}
                validate={(values) => {
                  const errors = {};

                  if (!values.invoice_number) {
                    errors.invoice_number = "Required";
                  }
                  if (!values.referance_number) {
                    errors.referance_number = "Required";
                  }

                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                  if (!date) {
                    alert("Please Select Date");
                    setSubmitting(false);
                    return 0;
                  }

                  if (!values.party_id) {
                    alert("Please Select Supplier");
                    setSubmitting(false);
                    return 0;
                  }

                  if (!values.warehouse_id && !warehouseId) {
                    alert("Please Select Warehouse");
                    setSubmitting(false);
                    return 0;
                  }

                  setTimeout(() => {
                    axios
                      .post(
                        `${baseUrl}/${endpoint}`,
                        {
                          date: date,
                          invoice_no: values.invoice_number,
                          reference_no: values.referance_number,
                          party_id: values.party_id.id,
                          warehouse_id: warehouseId
                            ? warehouseId
                            : values.warehouse_id.id,
                          products: values.products,
                          sub_total: subTotal,
                          discount_type: discountType,
                          discount_percent: discountParcent,
                          discount_amount: discountAmount,
                          after_discount_amount: afterDiscountAmount,
                          total_vat_amount: vat,
                          total_amount: finalAmount,
                          payment_type: paymentType,
                          due_amount: 0,
                        },
                        {
                          headers: { Authorization: "Bearer " + token },
                        }
                      )
                      .then((res) => {
                        setSubmitting(false);
                        handleRefress();
                        modal(false);
                        cogoToast.success('Create Success',{position: 'top-right', bar:{size: '10px'}});
                      })
                      .catch(function (error) {
                        console.log(error);
                    
                        setSubmitting(false);
                        AllApplicationErrorNotification(error?.response?.data)
                      });
                  });
                }}
              >
                {({ values, errors, submitForm, isSubmitting, setValues }) => (
                  <div className={classes.root}>
                    <div className={classes.paper}>
                      <form className={classes.form} noValidate>
                        <GridContainer>
                          <GridItem xs={12} sm={12} md={6}>
                            {load && (
                              <Field
                                name="party_id"
                                component={Autocomplete}
                                options={party}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => (
                                  <MuiTextField
                                    {...params}
                                    label="Supplier"
                                    variant="outlined"
                                    fullWidth
                                    helperText="Please select party(Supplier)"
                                  />
                                )}
                              />
                            )}
                          </GridItem>
                          <GridItem xs={12} sm={12} md={1}>
                            <Box mt={1}>
                              <Typography variant="h5" align="center">
                                <DoubleArrowIcon fontSize="small" />
                              </Typography>
                            </Box>
                          </GridItem>
                          <GridItem xs={12} sm={12} md={5}>
                            {load && (
                              <Field
                                name="warehouse_id"
                                component={Autocomplete}
                                options={warehouse}
                                disabled={
                                  warehouse_id && role == "warehouse admin"
                                    ? true
                                    : false
                                }
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => (
                                  <MuiTextField
                                    {...params}
                                    label="Warehouse"
                                    variant="outlined"
                                    fullWidth
                                    helperText="Please select warehouse"
                                  />
                                )}
                              />
                            )}
                          </GridItem>

                          <GridItem xs={12} sm={4} md={4}>
                            <Box mt={2}>
                              <MText
                                variant="outlined"
                                id="date"
                                type="date"
                                // defaultValue="2017-05-24"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                            </Box>
                          </GridItem>

                          <GridItem xs={12} sm={4} md={4}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="text"
                              label="Invoice Number"
                              name="invoice_number"
                            />
                          </GridItem>

                          <GridItem xs={12} sm={4} md={4}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="text"
                              label="Reference Number"
                              name="referance_number"
                            />
                          </GridItem>

                          <GridItem xs={12} sm={12} md={12}>
                            <GridContainer>
                              <GridItem xs={12} sm={12} md={12}>
                                <FieldArray
                                  name="products"
                                  render={({
                                    insert,
                                    replace,
                                    remove,
                                    push,
                                  }) => (
                                    <GridContainer>
                                      <GridItem xs={4} sm={4} md={4}>
                                        <BarcodeField
                                          warehouse_id={
                                            warehouseId
                                              ? warehouseId
                                              : values.warehouse_id.id
                                          }
                                          push={push}
                                          products={product}
                                          values={values}
                                          // setOpenError={setOpen}
                                          replace={replace}
                                          token={token}
                                        />
                                      </GridItem>
                                      <GridItem xs={4} sm={4} md={4}>
                                        <ItemCode
                                          warehouse_id={
                                            warehouseId
                                              ? warehouseId
                                              : values.warehouse_id.id
                                          }
                                          push={push}
                                          products={product}
                                          values={values}
                                          // setOpenError={setOpen}
                                          replace={replace}
                                          token={token}
                                        />
                                      </GridItem>

                                      <GridItem xs={4} sm={4} md={4}>
                                        <ProductName
                                          warehouse_id={
                                            warehouseId
                                              ? warehouseId
                                              : values.warehouse_id.id
                                          }
                                          push={push}
                                          values={values}
                                          // setOpenError={setOpen}
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
                                          Purchase Items :
                                        </Typography>
                                        <Button
                                          align="right"
                                          color="secondary"
                                          onClick={() => {
                                            setValues({
                                              party_id: "",
                                              warehouse_id: "",
                                              products: [],
                                              payment_type: "Cash",
                                              grand_total: "",
                                              paid_total: "",
                                              due_amount: "",
                                              discount_amount: "",
                                              discount_type: "Flat",
                                            });
                                          }}
                                        >
                                          Clear All Product
                                        </Button>
                                      </GridItem>

                                      {values.products.length > 0 && (
                                        <ProductTable
                                          removeHide={false}
                                          values={values}
                                          remove={remove}
                                          isEdit={false}
                                          purchasePrice={true}
                                          mrpPrice={false}
                                          wholeSalePrice={false}
                                          vat={false}
                                          priceReadOnly={false}
                                        />
                                      )}
                                    </GridContainer>
                                  )}
                                />
                              </GridItem>
                            </GridContainer>
                          </GridItem>
                          <GridItem xs={12} sm={12} md={12}>
                            <ParchasecalculationFromCommon
                              dynamicvat={15}
                              values={values}
                              subTotal={subTotal}
                              setSubTotal={setSubTotal}
                              discountType={discountType}
                              setDiscountType={setDiscountType}
                              discountParcent={discountParcent}
                              setDiscountParcent={setDiscountParcent}
                              discountAmount={discountAmount}
                              setDiscountAmount={setDiscountAmount}
                              afterDiscountAmount={afterDiscountAmount}
                              setAfterDiscountAmount={setAfterDiscountAmount}
                              vat={vat}
                              setVat={setVat}
                              finalAmount={finalAmount}
                              setFinalAmount={setFinalAmount}
                              paymentType={paymentType}
                              setPaymentType={setPaymentType}
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
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};

export default Create;
