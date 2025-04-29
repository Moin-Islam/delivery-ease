
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import cogoToast from 'cogo-toast';
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { Formik, Field, FieldArray } from "formik";
import MuiTextField from "@material-ui/core/TextField";
import { TextField } from "formik-material-ui";
import { TextField as MText } from "@material-ui/core";

import {
  Box,
  Button,
  LinearProgress,
  // MenuItem,
  Typography,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import { baseUrl } from "../../../const/api";
import { useAsyncEffect } from "use-async-effect";
import axios from "axios";
import Autocomplete from '@material-ui/lab/Autocomplete';
import Dialog from "@material-ui/core/Dialog";
import ProductTable from '../../../helper/productTable'
import WholeProduct from "./create/wholeProduct";
import WholeProductTotalCalculation from "./create/wholeProductTotalCalculation";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import BarcodeField from "./create/barcodeField";
import ItemCode from "./create/itemCode";
import ProductName from "./create/productName";
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
const Create = ({ userDetails,token, modal, endpoint, handleRefress }) => {
  const classes = useStyles();
  const [errorAlert, setOpen] = React.useState({
    open: false,
    key: "",
    value: [],
    severity: "error",
    color: "error",
  });


  const {warehouse_id, role} = userDetails || {}

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
 
  const handleModalClose = () => {
    setModalOpen(false);
  };
 
  const [store, setStore] = React.useState([]);
  const [warehouse, setWarehouse] = React.useState([]);
  const [van, setVan] = React.useState([]);

  const [date, setDate] = React.useState(null);

  const [total, setTotal] = React.useState(0);
  const [load, setLoad] = React.useState(false);
  const [product, setProduct] = React.useState(null);
  const [warehouseId, setWarehouseId] = React.useState(null);
  const [salesMan, setSalesMan] = React.useState([]);
  const [vanId, setVanId] = React.useState(null);
  const [storeId, setStoreId] = React.useState(null);

  React.useEffect(() => {
    if(warehouse_id && role=='warehouse admin'){
      console.log(warehouse_id)
    setWarehouseId(warehouse_id)
  }
  
  }, [])

   const salesmanfind =async () => {
          try {
            const result = await axios.post(
              `${baseUrl}/store_van_user_get_route_van_info2`,
              {
                store_id: storeId,
                van_id: vanId,
              },
              {
                headers: { Authorization: "Bearer " + token },
              }
            );

            console.log(result?.data?.store_van_user)
            setSalesMan(result?.data?.store_van_user)
          
          } catch (error) {
            console.log('no')

            cogoToast.warn('Salesman not assign this route',{position: 'top-right', bar:{size: '10px'}});
            setSalesMan(null)
    
            console.log(error)
          }
   }

   React.useEffect(() => {
     if(storeId && vanId ) {
      salesmanfind()
     }

   }, [storeId,vanId])

  

  let stores = `${baseUrl}/store_list_active_by_warehouse_id`;
  let warehouses = `${baseUrl}/warehouse_list`;
  let vanlist = `${baseUrl}/van_list`;
 
 
  // fetch store
  const  fetchStores= async()=>{
    try {
       const result = await axios.post(stores,{warehouse_id:warehouseId}, {
          headers: { Authorization: "Bearer " + token },
        });


        setStore(result?.data.response?.stores)

       
    } catch (error) {
       console.log(error,'store')
    }
    
  }

  
  React.useEffect(() => {
    fetchStores()
  }, [warehouseId])
  


  useAsyncEffect(async (isMounted) => {
    try {

      const warehouseListRes = await  axios.get(warehouses, {
                headers: { Authorization: "Bearer " + token },
              });
       const storeListResult = await axios.get(vanlist, {
                headers: { Authorization: "Bearer " + token },
              });


          setWarehouse(warehouseListRes.data.response.warehouses);
          setVan(storeListResult.data.data)
          setLoad(true);
      
    } catch (error) {
      console.log(error);
    }

  }, []);

  

  // useAsyncEffect(async (isMounted) => {

  //   await axios
  //     .all([
  //       axios.get(warehouses, {
  //         headers: { Authorization: "Bearer " + token },
  //       }),
  
  //       axios.get(vanlist, {
  //         headers: { Authorization: "Bearer " + token },
  //       }),


  //     ])
  //     .then(
  //       axios.spread((...responses) => {
  //         if (!isMounted()) return;
  //         setLoad(true);
  //         const warehouseresult = responses[0];
  //         const vanResult = responses[1];

  //         console.log(warehouseresult,vanResult );
  //         setWarehouse(warehouseresult.data.response.warehouses);
  //         setVan(vanResult.data.response.vans)
       
  //       })
  //     )
  //     .catch((errors) => {
  //       console.log('err');
  //       console.error(errors.response,'ss');
  //       // setLoad(false);
  //     });
  // }, []);




  return (
    <div>

      <GridContainer >
    

{
load && (

  <>
    <GridItem xs={12} sm={12} md={3}>
      <Autocomplete
       id="combo-box-demo"
        onChange={(e, value) => {
              if(value){
                setWarehouseId(value.id)
              }
          }}
        disabled={warehouse_id && role=='warehouse admin' ? true : false}
        options={warehouse}
        getOptionLabel={(option) => option.name}
        style={{padding:"20px"}}  
        renderInput={(params) => (
        <MuiTextField
        {...params}
        label="Select  Warehouse"
        variant="outlined"
        />
        )}
        />
     </GridItem>



<GridItem xs={12} sm={12} md={3}>

      <Autocomplete
       id="combo-box-demo"
       onChange={(e, value) => {
              if(value){
                setStoreId(value.id)
              }

            }}
        options={store || []}
        getOptionLabel={(option) => option.store_name}
        style={{padding:"20px"}}  
        renderInput={(params) => (
        <MuiTextField
        {...params}
        label="Select  Route"
        variant="outlined"
        />
        )}
        />
</GridItem> 



<GridItem xs={12} sm={12} md={3}>

<Autocomplete
id="combo-box-demo"
  onChange={(e, value) => {
        if(value){
          setVanId(value.id)
        }

      }}
        options={van}
        getOptionLabel={(option) => option.name}
        style={{padding:"20px"}}  
        renderInput={(params) => (
        <MuiTextField
        {...params}
        label="Select  Van"
        variant="outlined"
        />
        )}
        />
</GridItem> 

<GridItem xs={12} sm={12} md={3}>
      <MuiTextField
      style={{marginTop:"20px"}}
                id="outlined-helperText"
                disabled
                value={salesMan?.sales_man_user_name}
      
                variant="outlined"
              />
    
</GridItem>


<GridItem xs={12} sm={4} md={3}>
                         
              {/* <Box mt={2} > */}
                <MText
                style={{marginLeft:"20px", width:"86%"}}
                  variant="outlined"
                  id="date"
                  type="date"
                //  defaultValue="2017-05-24"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
            -
  </GridItem>

</>
)
}

        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardBody>
              <Formik
                initialValues={{
                  route: "",
                  warehouse: "",
                  van:"",
                  products: [],
                  warehouseId: ""
                  // payment_type: "Cash",
                  // grand_total: "",
                  // paid_total: "",
                  // due_amount: "",
             
               
                }}
                validate={(values) => {
     
                  const errors = {};

                
              
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
                        key: "",
                        value: [`Minimum Quantity 1`],
                        severity: "error",
                        color: "error",
                      }));
                  });


                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                   if(!storeId) {
                    cogoToast.warn('Please Select Route',{position: 'top-right', bar:{size: '10px'}});
                      // alert('Please Select Route')
                     setSubmitting(false);
                     return 0
                   }

                   if(!warehouseId) {
                    cogoToast.warn('Please Select Warehouse',{position: 'top-right', bar:{size: '10px'}});
                  
                    setSubmitting(false);
                    return 0
                  }

                  if(!vanId) {
                    cogoToast.warn('Please Select Van',{position: 'top-right', bar:{size: '10px'}});
                  // alert('Please Select Van')
                    setSubmitting(false);
                    return 0
                  }

                  if(!salesMan) {
                    cogoToast.warn('Please Select Salesman',{position: 'top-right', bar:{size: '10px'}});
                  // alert('Please Select Salesman')
                  setSubmitting(false);
                  return 0
                  }


                  if(!date) {
                    cogoToast.warn('Please Select Date',{position: 'top-right', bar:{size: '10px'}});
                    // alert('Please Select Date')
                    setSubmitting(false);
                    return 0
                    }

                    
                   
                  setTimeout(() => {
                    axios
                      .post(
                        `${baseUrl}/${endpoint}`,
                        {
                          date: date,
                           store_id: storeId,
                          warehouse_id: warehouseId,
                          van_id: vanId,
                          sales_man_user_id: salesMan?.sales_man_user_id,
                          products: values.products,
                          miscellaneous_charge: 0,
                          miscellaneous_comment: null,
                        },
                        {
                          headers: { Authorization: "Bearer " + token },
                        }
                      )
                      .then((res) => {
                        console.log(res);
                        handleRefress()
                        // setTimeout(() => {
                        //   handleRefress()
                        // }, 3000);
                        
                        setSubmitting(false);
                        // setTotal(0);
                        // setPaid(0);
                        // setDue(0);
                        modal(false);
                      
                      })
                      .catch(function (error) {
                        console.log(error.response)
                        // handleRefress()
                        setOpen({
                          open: true,
                          key: "msg",
                          value: "eeee",
                        });
                        setSubmitting(false);
                        modal(false);
                      });
                  });
                }}
              >
                {({ values, errors, submitForm, isSubmitting, setValues }) => (
                  <div className={classes.root}>
                    <div className={classes.paper}>
                   
                      <form className={classes.form} noValidate>
                   
                        <GridContainer>
                     
                        
        
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
                                      {warehouseId != null && (
                                        <>
                                          <GridItem xs={4} sm={4} md={4}>
                                            <BarcodeField
                                              push={push}
                                              products={product}
                                              values={values}
                                              setOpenError={setOpen}
                                              replace={replace}
                                              token={token}
                                              warehouse_id={warehouseId}
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
                                              warehouse_id={warehouseId}
                                            />
                                          </GridItem>

                                          <GridItem xs={4} sm={4} md={4}>
                                            <ProductName
                                              push={push}
                                              values={values}
                                              setOpenError={setOpen}
                                              replace={replace}
                                              token={token}
                                              warehouse_id={warehouseId}
                                            />
                                          </GridItem>
                                        </>
                                      )}

                                      <GridItem
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        className="row"
                                      >
                                        {warehouseId != null ? (
                                          <>
                                            <Typography
                                              color="primary"
                                              variant="h5"
                                            >
                                              Products :
                                            </Typography>
                                            <Button
                                              align="right"
                                              color="secondary"
                                              onClick={() => {
                                                setValues({
                                                  store_id: "",
                                                  warehouseId: "",
                                                  products: [],
                                                  payment_type: "Cash",
                                                  grand_total: total,
                                                  // paid_total: paid,
                                                  // due_amount: due,
                                                  barcode: "",
                                                  // miscellaneous_comment: "",
                                                  // miscellaneous_charge: 0,
                                                });
                                              }}
                                            >
                                              Clear All Product
                                            </Button>
                                          </>
                                        ) : (
                                          <Typography
                                            color="secondary"
                                            variant="h6"
                                          >
                                            Select Warehouse First
                                          </Typography>
                                        )}
                                      </GridItem>

                                      {values.products.length > 0 && (
                                       <ProductTable  removeHide={false} values={values} remove={remove} isEdit={false} purchasePrice={false} stockTransferPrice={true} mrpPrice={false} wholeSalePrice={false} vat={false} priceReadOnly={false}/>
                                      )}

                                       

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
                                          setProducts={setProduct}
                                          token={token}
                                          values={values}
                                          setOpenError={setOpen}
                                          replace={replace}
                                          ware_id={values.warehouseId}
                                        />
                                      </Dialog>
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
};



export default Create;
