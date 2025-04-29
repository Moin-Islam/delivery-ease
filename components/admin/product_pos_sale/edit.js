import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { Formik, Field, FieldArray } from "formik"; 
import cogoToast from 'cogo-toast';
import { Box, Button, MenuItem, Typography } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { baseUrl } from "../../../const/api";
import { useAsyncEffect } from "use-async-effect";
import axios from "axios";
import PosaleProductPush from './edit/posaleProductPush';
import PossaleCalculation from "./../common_calculation/posSaleCalculation";
import ProductTable from '../../../helper/productTable'


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
const Edit = ({ token, modal, editData, endpoint, mutate, user }) => {
  const classes = useStyles();

   
  const [subTotal, setSubTotal] = React.useState(0);
  const [discountType, setDiscountType] = React.useState(editData.discount_type);
  const [discountParcent, setDiscountParcent] = React.useState(editData.discount_percent);
  const [discountAmount, setDiscountAmount] = React.useState(editData.discount_amount);
  const [afterDiscountAmount, setAfterDiscountAmount] = React.useState(0);
  const [vat, setVat] = React.useState(0);
  const [finalAmount, setFinalAmount] = React.useState(0);
  const [paymentType, setPaymentType] = React.useState('Cash');
  const [date, setDate] = React.useState(null);
  const [load, setLoad] = React.useState(false);
  const [product, setProduct] = React.useState([]);
  const [party, setParty] = React.useState(null);
  const [store, setStore] = React.useState(null);
  const [store_id, setStoreId] = React.useState(editData.store_id);
  const [salesman, setSalesman] = React.useState(user?.details?.store_van_user);
  const [partyId, setPartyId] = React.useState(editData.customer_id);

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
                        cogoToast.success('Update Success',{position: 'top-right', bar:{size: '10px'}});
                        modal(false);            
                      })
                      .catch(function (error) {
                    
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
                     
                          </GridItem>

            

                            <GridItem xs={3} sm={3} md={3}>
        
                            </GridItem>



                            <GridItem xs={12} sm={4} md={2}>
    
                            </GridItem>

                   
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

                                          {values.products.length > 0 && (
                                       <ProductTable removeHide={true} values={values} remove={remove} isEdit={false} purchasePrice={false} mrpPrice={true} wholeSalePrice={false} vat={false} priceReadOnly={false}/>
                                      )}


                                     <PosaleProductPush
                                        push={push}
                    
                                        products={product}
                                        token={token}
                                        values={values}

                                        replace={replace}
                                        id={editData.id}
                                      />
                                          
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

export default Edit;
