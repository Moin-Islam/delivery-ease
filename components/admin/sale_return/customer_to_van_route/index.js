import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import cogoToast from 'cogo-toast';
import { Formik, Form, Field, FieldArray } from 'formik';
import { TextField } from 'formik-material-ui';
import { Box, Button, Grid, MenuItem, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
// import Snackbar from '@material-ui/core/Snackbar';
// import Alert from '@material-ui/lab/Alert';
import { baseUrl } from '../../../../const/api';
import { useAsyncEffect } from 'use-async-effect';
import axios from 'axios';
import ProductTable from '../../../../helper/returnTable'
import DetailsHeader from './utils/detailsHeader'
// import returnProduct from './utils/ReturnProductPush';
// import returnCalculation from './utils/returnCalculation';
import Calculation from './utils/test'
import AllApplicationErrorNotification from '../../../utils/notificationHandle';

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

function Edit({ token, modal, invoice, endpoint, mutate }) {


  console.log(invoice)
  const classes = useStyles();
  const [editData, setEditData] = React.useState(invoice);
  const [productList, setProductList] = React.useState(null);
  const [total, setTotal] = React.useState(0);
  const [paid, setPaid] = React.useState(0);
  const [due, setDue] = React.useState(0);
  const [discount, setDiscount] = React.useState(0);
  const [load, setLoad] = React.useState(false);



const formatproduct=(pro)=>{
 return pro?.map((p)=>{
    return {
      ...p,
      new_return_qty: 0,
      exists_return_qty: p.qty - p.already_return_qty,
      per_product_sub_total: p.sub_total / p.qty,
    }
  })


}


  useAsyncEffect(async (isMounted) => {

    try {
      const productListResult = await axios.post(
        `${baseUrl}/product_pos_sale_details`,
          {
            product_sale_id: invoice.id,
          },
          {
            headers: { Authorization: 'Bearer ' + token },
          }
        );
        setProductList(productListResult?.data.response?.product_pos_sale_details)
        setLoad(true);

    } catch (error) {

          
    }





  }, []);
 


  return (
    <div>
      {load ? (
        <GridContainer style={{ padding: '20px 30px', marginTop: 250 }}>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardBody>
                <Formik
                  initialValues={{
                  
                    products:formatproduct(productList) ,
      
                  }}
                  validate={(values) => {

                        console.log(values?.products,'121');
                    const errors = {};
                     console.log(values.products);


                     values.products.map((p) => {
                      p.new_return_qty < 0 &&
                        ((p.new_return_qty = 0),

                        cogoToast.error(`Minimum Quantity`,{position: 'top-right', bar:{size: '10px'}})

                        
                        );
                      p.new_return_qty > p.exists_return_qty &&
                        ((p.new_return_qty = p.exists_return_qty),
                        cogoToast.error(`Maximum Quantity ${p.exists_return_qty}`,{position: 'top-right', bar:{size: '10px'}})

                        );
                    });



                    
                    return errors;
                  }}
                  onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                      axios
                        .post(
                          `${baseUrl}/${endpoint}`,
                          {
                            product_sale_invoice_no: editData.invoice_no,
                            total_amount: total,
                            products: values.products,
                            paid_amount: total,
                            due_amount: 0,
                        
                          },
                          {
                            headers: { Authorization: 'Bearer ' + token },
                          }
                        )
                        .then((res) => {
                          //console.log(res);
                          setSubmitting(false);
                          setTotal(0);
                          // setPaid(0);
                          setDue(0);
                          mutate();
                          modal(false);
                          cogoToast.success('Return Success',{position: 'top-right', bar:{size: '10px'}}); 
                        })
                        .catch(function (error) {
                          // setOpen({
                          //   open: true,
                          //   key: Object.values(error.response.data.message),
                          //   value: Object.values(error.response.data.message),
                          // });
                          AllApplicationErrorNotification(error?.response?.data)
                          setSubmitting(false);

                        });
                    });
                  }}>
                  {({ values, errors, submitForm, isSubmitting }) => (
                    <div className={classes.root}>
                      <div className={classes.paper}>
                        <form className={classes.form} noValidate>


                        <DetailsHeader invoiceData={invoice}/>
                        
                          <GridContainer>

                        

                            <GridItem xs={12} sm={12} md={12}>



                              <GridContainer>
                              <GridItem   xs={12}
                                          sm={12}
                                          md={12}>

                                        {values.products.length > 0 && (
                                       <ProductTable removeHide={false} values={values}  isEdit={false} purchasePrice={false} mrpPrice={true} wholeSalePrice={false} vat={false} priceReadOnly={true} current_qry={true}/>
                                      )}
                                          </GridItem>

                                          <GridItem   xs={12}
                                          sm={12}
                                          md={12}>
                                  
                                  <Calculation values={values} total={total} setTotal={setTotal}/>
                                            </GridItem>



                                {/* <GridItem xs={12} sm={12} md={12}>
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
                                          className="row">
                                          <Typography
                                            color="primary"
                                            variant="h5">
                                            Products :
                                          </Typography>
                                        </GridItem>

                                        <GridItem   xs={12}
                                          sm={12}
                                          md={12}>

                                        {values.products.length > 0 && (
                                       <ProductTable removeHide={false} values={values}  isEdit={false} purchasePrice={false} mrpPrice={true} wholeSalePrice={false} vat={false} priceReadOnly={true} current_qry={true}/>
                                      )}
                                          </GridItem>

                                          <GridItem   xs={12}
                                          sm={12}
                                          md={12}>
                                  
                                  <Calculation values={values} total={total} setTotal={setTotal}/>
                                            </GridItem>

                                      

                                      </GridContainer>
                                    )}
                                  />
                                </GridItem> */}



                              </GridContainer>


                              
                            </GridItem>

                         

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

              

            </Card>
          </GridItem>
        </GridContainer>
      ) : (
        <GridContainer
          direction="row"
          justify="center"
          alignItem="center"
          style={{ padding: '200px 0px' }}>
          <CircularProgress />
        </GridContainer>
      )}

      
    </div>
  );
}


export default Edit;
