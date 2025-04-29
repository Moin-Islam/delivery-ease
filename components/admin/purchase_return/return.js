import React from 'react';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
// core components
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import Card from 'components/Card/Card.js';
import cogoToast from 'cogo-toast';
import CardBody from 'components/Card/CardBody.js';
import { Formik, Form, Field, FieldArray } from 'formik';
import { TextField } from 'formik-material-ui';
import { Box, Button, Grid, MenuItem, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { baseUrl } from '../../../const/api';
import { useAsyncEffect } from 'use-async-effect';
import axios from 'axios';
import ProductTable from '../../../helper/returnTable'
// import WholeProduct from './edit/wholeProduct';
// import WholeProductTotalCalculation from './edit/wholeProductTotalCalculation';

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

  console.log(invoice);
  const classes = useStyles();
  const [editData, setEditData] = React.useState(null);



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
  const [party, setParty] = React.useState(null);
  const [warehouse, setWarehouse] = React.useState([]);
  let parties = `${baseUrl}/party_list`;
  let warehouses = `${baseUrl}/warehouse_list`;
  let products = `${baseUrl}/product_purchase_details`;

  useAsyncEffect(async (isMounted) => {
    const requestOne = axios.get(parties, {
      headers: { Authorization: 'Bearer ' + token },
    });
    const requestTwo = axios.get(warehouses, {
      headers: { Authorization: 'Bearer ' + token },
    });
    const requestThree = axios.post(
      products,
      {
        product_purchase_invoice_no: invoice.invoice_no,
      },
      {
        headers: { Authorization: 'Bearer ' + token },
      }
    );
    await axios
      .all([requestOne, requestTwo, requestThree])
      .then(
        axios.spread((...responses) => {
          if (!isMounted()) return;
          const responseOneB = responses[0];
          const responseTwoU = responses[1];
          const responsethree = responses[2];
        //   setParty(responseOneB.data.response.parties);
        //   setWarehouse(responseTwoU.data.data);
        //   setProduct(responsethree.data.response);
        //   setEditData(responsethree.data.response.product_purchases);
        //   setTotal(responsethree.data.response.product_purchases.total_amount);
        //   setPaid(responsethree.data.response.product_purchases.paid_amount);
        //   setDue(responsethree.data.response.product_purchases.due_amount);
        //   setDiscount(
        //     responsethree.data.response.product_purchases.discount_amount
        //   );
          setLoad(true);
        })
      )
      .catch((errors) => {
        console.error(errors);
        setLoad(false);
      });
  }, []);






 
  const permaRemove = (index, products) => {
    // axios
    //   .post(
    //     `${baseUrl}/product_whole_purchase_single_product_remove`,
    //     {
    //       product_purchase_id: editData.id,
    //       product_purchase_detail_id: products[index].product_purchase_detail_id,
    //     },
    //     {
    //       headers: { Authorization: "Bearer " + token },
    //     }
    //   )
    //   .then((res) => {
    //     setOpen({
    //       open: true,
    //       key: "Deleted succesfuly",
    //       value: ["Permanently Deleted"],
    //     });
    //   })
    //   .catch(function (error) {
    //     setOpen({
    //       open: true,
    //       key: Object.values("Something went wrong"),
    //       value: ["Something went wrong"],
    //     });
    //   });
  };


  return (
    <div>
      {load ? (
        <GridContainer style={{ padding: '20px 30px', marginTop: 250 }}>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardBody>
                <Formik
                  initialValues={{
                    party_id: editData.supplier_id,
                    warehouse_id: editData.warehouse_id,
                    products: [],
                    payment_type: 'Cash',
                    grand_total: total,
                    paid_total: paid,
                    due_amount: due,
                    discount_type: editData.discount_type,
                    discount_amount: discount,
                    // barcode: "",
                  }}
                  validate={(values) => {
                    const errors = {};
              
                    values.products.map((p) => {
                      p.qty < 0 &&
                        ((p.qty = 0),

                        cogoToast.error(`Minimum Quantity 1`,{position: 'top-right', bar:{size: '10px'}})

                        
                        );
                      p.qty > p.exists_return_qty &&
                        ((p.qty = p.exists_return_qty),
                        cogoToast.error(`Maximum Quantity ${p.exists_return_qty}`,{position: 'top-right', bar:{size: '10px'}})

                        );
                    });
                    return errors;
                  }}
                  onSubmit={(values, { setSubmitting }) => {


                    if(!values.party_id) {
                      cogoToast.warn('Please Selecet Supplyer',{position: 'top-right', bar:{size: '10px'}}); 
                     setSubmitting(false);
                     return 0
                   }

                   if(!values.warehouse_id) {
                    cogoToast.warn('please selecet warehouse',{position: 'top-right', bar:{size: '10px'}}); 
                   setSubmitting(false);
                   return 0
                 }


                    setTimeout(() => {
                      axios
                        .post(
                          `${baseUrl}/${endpoint}`,
                          {
                            product_purchase_id: editData.id,
                            product_purchase_invoice_no: editData.invoice_no,
                            party_id: values.party_id,
                            warehouse_id: values.warehouse_id,
                            products: values.products,
                            total_amount: total,
                            paid_amount: 0,
                            due_amount: 0,
                            payment_type: values.payment_type,
                            discount_type: null,
                            discount_amount: 0,
                          },
                          {
                            headers: { Authorization: 'Bearer ' + token },
                          }
                        )
                        .then((res) => {
                        
                          cogoToast.success('Update Success',{position: 'top-right', bar:{size: '10px'}});
                          setSubmitting(false);
                      
                          mutate();
                          modal(false);
                        })
                        .catch(function (error) {
                          AllApplicationErrorNotification(error?.response?.data)
        
                          setSubmitting(false);
                        });
                    });
                  }}>
                  {({ values, errors, submitForm, isSubmitting }) => (
                    <div className={classes.root}>
                      <div className={classes.paper}>
                        <form className={classes.form} noValidate>
                          <GridContainer>
                            <GridItem xs={12} sm={12} md={6}>
                              {load && (
                                <Field
                                disabled
                                  component={TextField}
                                  type="text"
                                  name="warehouse_id"
                                  label="Warehouse"
                                  select
                                  fullWidth
                                  variant="outlined"
                                  helperText="Please select warehouse"
                                  margin="normal">
                                  {warehouse.map((b) => (
                                    <MenuItem value={b.id}>{b.name}</MenuItem>
                                  ))}
                                </Field>
                              )}
                            </GridItem>
                            <GridItem xs={12} sm={12} md={6}>
                              {load && (
                                <Field
                                disabled
                                  component={TextField}
                                  type="text"
                                  name="party_id"
                                  label="Party"
                                  select
                                  fullWidth
                                  variant="outlined"
                                  helperText="Please select party"
                                  margin="normal">
                                  {party.map(
                                    (b) =>
                                      b.type == 'supplier' && (
                                        <MenuItem value={b.id}>
                                          {b.name}
                                        </MenuItem>
                                      )
                                  )}
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

                                        {values.products.length > 0 && (
                                       <ProductTable removeHide={false} values={values} remove={remove} permaRemove={permaRemove} isEdit={false} purchasePrice={true} mrpPrice={false} wholeSalePrice={false} vat={false} priceReadOnly={true} current_qry={true}/>
                                      )}


      
{/*                                
                                        <WholeProduct
                                          push={push}
                                          handleClose={handleModalClose}
                                          products={
                                            product.product_pos_purchase_details
                                          }
                                          token={token}
                                          values={values}
                                          // setOpenError={setOpen}
                                          replace={replace}
                                          id={editData.id}
                                        /> */}
                                      </GridContainer>
                                    )}
                                  />
                                </GridItem>
                              </GridContainer>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={3}>
                              {/* <WholeProductTotalCalculation
                                values={values}
                                total={total}
                                setTotal={setTotal}
                                paid={paid}
                                setPaid={setPaid}
                                due={due}
                                setDue={setDue}
                                discount={discount}
                                setDiscount={setDiscount}
                              /> */}
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
