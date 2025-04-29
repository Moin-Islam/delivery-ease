import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { Formik, Field, FieldArray } from "formik"; 
import cogoToast from 'cogo-toast';
import { TextField as MText } from "@material-ui/core";
import { Box, Button, MenuItem, Typography } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import { baseUrl } from "../../../const/api";
import { useAsyncEffect } from "use-async-effect";
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import PossaleCalculation from "./../common_calculation/posSaleCalculation";
import BarcodeField from "./create/barcodeField";
import ItemCode from "./create/itemCode";
import ProductName from "./create/productName";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import ProductTable from '../../../helper/productTable'
import CreateCustomer from "../product_pos_sale/create/CreateCustomer";
import AddIcon from "@material-ui/icons/Add";
import { TextField as MUIText } from "@material-ui/core";

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
const Create = ({ token, modal, endpoint, mutate, handlePrint, user }) => {
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
  const [openCustomer, setOpenCustomer] = React.useState(false);

  

  const handleClickOpenCustomer = () => {
    setOpenCustomer(true);
  };

  const handleCloseCustomer = () => {
    setOpenCustomer(false);
  };

  const [subTotal, setSubTotal] = React.useState(0);
  const [discountType, setDiscountType] = React.useState('Flat');
  const [discountParcent, setDiscountParcent] = React.useState(0);
  const [discountAmount, setDiscountAmount] = React.useState(0);
  const [afterDiscountAmount, setAfterDiscountAmount] = React.useState(0);
  const [vat, setVat] = React.useState(0);
  const [finalAmount, setFinalAmount] = React.useState(0);
  const [paymentType, setPaymentType] = React.useState('Cash');

  const [date, setDate] = React.useState(null);

  const [load, setLoad] = React.useState(false);
  const [product, setProduct] = React.useState(null);
  const [party, setParty] = React.useState(null);
  const [store, setStore] = React.useState(null);
  const [store_id, setStoreId] = React.useState(user?.details?.store_van_user?.assign_store_id);
  const [salesman, setSalesman] = React.useState(user?.details?.store_van_user);
  const [partyId, setPartyId] = React.useState(null);
  const [partyName, setPartyName] = React.useState(null);
  const [partyPhone, setPartyPhone] = React.useState(null);
  const [newPhone, setNewPhone] = React.useState(null);
  


  let parties = `${baseUrl}/pos_sale_customer_list`;
  let stores = `${baseUrl}/store_list`;
  useAsyncEffect(async (isMounted) => {
    await getStore();
    await getCustomer();
  }, []);
  const getStore = async () => {
    await axios
      .all([
        axios.get(stores, {
          headers: { Authorization: "Bearer " + token },
        }),
      ])
      .then(
        axios.spread((...responses) => {
          const responseTwoU = responses[0];
          setStore(responseTwoU.data.response.stores);
          setLoad(false);
        })
      )
      .catch((errors) => {
        console.error(errors);
        setLoad(false);
      });
  };

  
  const getCustomer = async () => {
    await axios
      .all([
        axios.get(parties, {
          headers: { Authorization: "Bearer " + token },
        }),
      ])
      .then(
        axios.spread((...responses) => {
          // if (!isMounted()) return;
          const responseOneB = responses[0];
          setParty(responseOneB.data.response.customer_lists);
          setLoad(true);
        })
      )
      .catch((errors) => {
        console.error(errors);
        setLoad(false);
      });
  };
  const [currentStore, setCurrentStore] = React.useState(null);

  const fetchStock = (e) => {
    setStoreId(e.target.value);;
  };
  const abc = (e) => e.preventDefault();
  
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
                  products: [],
                  payment_type: "Cash",
                  grand_total: "",
                  paid_total: "",
                  due_amount: "",
                  barcode: "",
                  discount_amount: "",
                  discount_type: "Flat",
                }}
                validate={(values) => {
                  const errors = {};
                  if (!partyId) {
                    cogoToast.warn('Please Selecet Customer',{position: 'top-right', bar:{size: '10px'}});
                
                  }
            
                  values.products.map((p) => {
                    console.log('products data',p)
                    
                    p.qty > p.stock &&
                    cogoToast.error(`Maximum Quantity ${p.stock}`,{position: 'top-right', bar:{size: '10px'}});
             
                    p.qty < 0.1 &&
                    cogoToast.error(`Minimum Quantity 0.1`,{position: 'top-right', bar:{size: '10px'}});
               

                  });



                  values.products.map((p) => {
          
                    
                    p.selling_price < p.minimum_selling_price &&
                    cogoToast.warn(`Minimum Selling Price ${p.minimum_selling_price}`,{position: 'top-right', bar:{size: '10px'}});
               

                  })


                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {

                  if(!partyId){
                    cogoToast.warn('Please select customer',{position: 'top-right', bar:{size: '10px'}});
                  
                    setSubmitting(false);
                    return 0
                  }
                  if(!date) {
                    cogoToast.warn('Please Select Date',{position: 'top-right', bar:{size: '10px'}});
                    setSubmitting(false);
                    return 0
                    }

                    if(!values.products.length){
                      cogoToast.warn('Please Add Some Product',{position: 'top-right', bar:{size: '10px'}});
                      setSubmitting(false);
                      return 0
                    }
                   

                  setTimeout(() => {
                    axios
                      .post(
                        `${baseUrl}/${endpoint}`,
                        {
                          date: date,
                          party_id: partyId,
                          store_id: salesman?.assign_store_id,
                          van_id: salesman?.assign_van_id,
                          sales_man_user_id: user?.details?.id,
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
                      
                        mutate();
                        cogoToast.success('Create Success',{position: 'top-right', bar:{size: '10px'}});
                        modal(false);
                        handlePrint(res.data.product_pos_sale);
                    
                      })
                      .catch(function (error) {
                        console.log(error)
                        cogoToast.error(`${error.response.data.message}`,{position: 'top-right', bar:{size: '10px'}});
 
                        setSubmitting(false);
                      });
                  });
                }}
              >
                {({ values, errors, submitForm, isSubmitting, setValues }) => (
                  <div className={classes.root}>
                    <div className={classes.paper}>
                      <form className={classes.form} noValidate>
                        <GridContainer>
                          <GridItem xs={12} sm={11} md={4}>
                            {load ? (
                              <Box mt={2}>
                                <Autocomplete
                                  onChange={(event, newValue) => {
                                    console.log(newValue);
                                    if (newValue) {
                                      setPartyId(newValue.id);
                                      setPartyName(newValue.name);
                                      setPartyPhone(newValue.phone);
                                      setNewPhone(null);
                                    }
                                  }}
                                  onInputChange={(event, value) => {
                                    if (value) {
                                      setNewPhone(value);
                                    }
                                  }}
                                  getOptionLabel={(option) =>
                                    option?.customer_code  +"  " + option?.vat_number +"  " + option?.name + "  " + option?.phone
                                  }
                                  id="controllable-states-demo"
                                  options={party}
                                  renderInput={(params) => (
                                    <MUIText
                                      {...params}
                                      fullWidth={true}
                                      label="Customer"
                                      variant="outlined"
                                    />
                                  )}
                                />
                              </Box>
                            ) : (
                              <CircularProgress />
                            )}
                          </GridItem>

                          <GridItem xs={1} sm={1} md={1}>
                            <Box mt={3}>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={handleClickOpenCustomer}
                              >
                                <AddIcon />
                              </Button>
                            </Box>
                          </GridItem>

                          <GridItem xs={3} sm={3} md={3}>
                            <Box mt={1}>
                              <Typography
                                variant="caption"
                                color={partyId ? "secondary" : "primary"}
                              >
                                Current Customer:
                              </Typography>
                              {partyId ? (
                                <>
                                  <Typography variant="h6" color="primary">
                                    {partyName}
                                  </Typography>
                                  <Typography variant="subtitle2">
                                    {partyPhone}
                                  </Typography>
                                </>
                              ) : (
                                <>
                                  <Typography variant="h6" color="secondary">
                                    Select or Create
                                  </Typography>
                                  <Typography variant="subtitle2">
                                    Customer
                                  </Typography>
                                </>
                              )}
                            </Box>
                          </GridItem>

                          {salesman?.assign_store_id ? (
                            <GridItem xs={12} sm={12} md={3}>
                              <Box mt={2}>
                                <Typography variant="caption" color="primary">
                                  Current Route:
                                </Typography>
                                <Typography variant="h6" color="primary">
                                  { salesman?.assign_store_name }
                                </Typography>
                              </Box>
                            </GridItem>
                          ) : (
                            <GridItem xs={12} sm={12} md={2}>
                              {load ? (
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
                                      {store &&
                                        store.map((str) => (
                                          <MenuItem value={str.id} key={str.id}>
                                            {str.store_name}
                                          </MenuItem>
                                        ))}
                                    </Select>
                                  </FormControl>
                                </Box>
                              ) : (
                                <CircularProgress />
                              )}
                            </GridItem>
                          )}



                        <GridItem xs={12} sm={4} md={2}>
                         
                     
                           <MText
                       
                             variant="outlined"
                             id="date"
                             type="date"
                         
                           value={date}
                           onChange={(e) => setDate(e.target.value)}
                             InputLabelProps={{
                               shrink: true,
                             }}
                           />
                       -
                        </GridItem>

                          {salesman?.assign_store_id  ? (
                            <>
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

                                         <GridItem xs={12} sm={12} md={4}>
                                            <ProductName
                                              push={push}
                                              values={values}
                                              setOpenError={setOpen}
                                              replace={replace}
                                              token={token}
                                              store_id={store_id}
                                              warehouse_id={user.details?.warehouse_id}
                                            />
                                          </GridItem>

                                          <GridItem xs={12} sm={12} md={4}>
                                            <ItemCode
                                              push={push}
                                              products={product}
                                              values={values}
                                              setOpenError={setOpen}
                                              replace={replace}
                                              token={token}
                                              store_id={store_id}
                                              warehouse_id={user.details?.warehouse_id}
                                            />
                                          </GridItem>


                                          <GridItem xs={12} sm={12} md={4}>
                                            <BarcodeField
                                              push={push}
                                              products={product}
                                              values={values}
                                              setOpenError={setOpen}
                                              replace={replace}
                                              token={token}
                                              store_id={store_id}
                                              warehouse_id={user.details?.warehouse_id}
                                            />
                                          </GridItem>


                                    


                                 



                                          <GridItem
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            className="row"
                                          >
                                            {values.products.length != 0 && (
                                              <Box mt={2} mb={2}>
                                                <Typography
                                                  color="primary"
                                                  variant="h6"
                                                >
                                                  Sale Items :
                                                </Typography>
                                                <Button
                                                  align="right"
                                                  color="secondary"
                                                  onClick={() => {
                                                    setValues({
                                                      party_id: "",
                                                      products: [],
                                                      payment_type: "Cash",
                                                      grand_total: total,
                                                      paid_total: paid,
                                                      due_amount: due,
                                                      barcode: "",
                                                      discount_amount: discount,
                                                      discount_type: "Flat",
                                                    });
                                                  }}
                                                >
                                                  Clear All Product
                                                </Button>
                                              </Box>
                                            )}
                                          </GridItem>

                                          {values.products.length > 0 && (
                                       <ProductTable removeHide={false}  values={values} remove={remove} isEdit={false} purchasePrice={false} mrpPrice={true} wholeSalePrice={false} vat={false} priceReadOnly={false}/>
                                      )}

                                        </GridContainer>
                                      )}
                                    />
                                  </GridItem>
                                </GridContainer>
                              </GridItem>
                              <GridItem
                                xs={12}
                                sm={12}
                                md={12}
                                style={{
                                  borderTop: "3px solid #c9c9c9",
                                  marginTop: "25px",
                                }}
                              >
                                {values.products.length != 0 && (
                                  <PossaleCalculation
                                  
                                        dynamicvat={15}
                                        values={values}
                                         subTotal ={subTotal}
                                        setSubTotal ={setSubTotal}
                                        discountType ={discountType}
                                        setDiscountType ={setDiscountType}
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
                                )}
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
                          {values.products.length != 0 && (
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
                          )}
                        </Box>
                        <Dialog
                          open={openCustomer}
                          onClose={handleCloseCustomer}
                          aria-labelledby="form-dialog-title"
                        >
                          <DialogContent style={{width:"370px"}}>
                            <CreateCustomer
                              token={token}
                              handleClose={handleCloseCustomer}
                              storeUpdate={getCustomer}
                              setPartyName={setPartyName}
                              setPartyId={setPartyId}
                              setPartyPhone={setPartyPhone}
                              newPhone={newPhone}
                              setNewPhone={setNewPhone}
                              // setCustomerCode={setCustomerCode}
                              // customerCode={customerCode}
                            />
                          </DialogContent>
                          <DialogActions>
                            <Button
                              onClick={handleCloseCustomer}
                              color="primary"
                            >
                              Cancel
                            </Button>
                          </DialogActions>
                        </Dialog>
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

export default Create;
