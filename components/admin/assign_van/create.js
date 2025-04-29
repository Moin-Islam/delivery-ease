 
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import cogoToast from 'cogo-toast';
import CardBody from "components/Card/CardBody.js";
import { Formik, Field } from "formik";
import {
  Box,
  Button,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { baseUrl } from "../../../const/api";
import { useAsyncEffect } from "use-async-effect";
import axios from "axios";
import { Autocomplete } from "formik-material-ui-lab";
import MuiTextField from "@material-ui/core/TextField";


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



  const [load, setLoad] = React.useState(false);
  const [store, setStore] = React.useState(null);
  const [van, setVan] = React.useState(null);
  const [salesMan, setSalesMan] = React.useState(null);


  let stores = `${baseUrl}/store_list_active`;
  let warehouses = `${baseUrl}/warehouse_list_active`;
  let salemanlist = `${baseUrl}/sales_man_user_list_only_active`;
  let vanlist = `${baseUrl}/van_list_active`;
 

  useAsyncEffect(async (isMounted) => {

    await axios
      .all([
        axios.get(stores, {
          headers: { Authorization: "Bearer " + token },
        }),
        axios.get(warehouses, {
          headers: { Authorization: "Bearer " + token },
        }),
        axios.get(salemanlist, {
          headers: { Authorization: "Bearer " + token },
        }),
        axios.get(vanlist, {
          headers: { Authorization: "Bearer " + token },
        }),
      ])
      .then(
        axios.spread((...responses) => {
          if (!isMounted()) return;
          const responseOneB = responses[0];
          const responseTwoU = responses[1];
          const salesManResult = responses[2];
          const vanResult = responses[3];
         
          setStore(responseOneB.data.response.stores);
          setVan(vanResult.data.response.vans)
          setSalesMan(salesManResult.data.response.users)
          setLoad(true);
          // mutate()
        })
      )
      .catch((errors) => {
        console.error(errors);
        setLoad(false);
        // mutate()
      });
  }, []);

  return (
    <div>
{/* 
<button onClick={()=>mutate()}>red</button> */}
      <GridContainer style={{ padding: "20px 30px", marginTop: 250 }}>
        <GridItem xs={12} sm={12} md={12}></GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardBody>
              <Formik
                initialValues={{
                  route: "",
                  van: "",
                  salesman: ""
                
                }}
            
                onSubmit={(values, { setSubmitting }) => {
                  

                  if(!values.route) {
                   cogoToast.warn('Please Select Route',{position: 'top-right', bar:{size: '10px'}}); 
                   setSubmitting(false);
                   return 0
                 }

                 if(!values.van) {
                  cogoToast.warn('Please Select VAN',{position: 'top-right', bar:{size: '10px'}}); 
                 setSubmitting(false);
                 return 0
               }
               
                 if(!values.salesman) {
                  cogoToast.warn('Please Select Salesman',{position: 'top-right', bar:{size: '10px'}}); 
                 setSubmitting(false);
                 return 0
               }
             

                  setTimeout(() => {
                    axios
                      .post(
                        `${baseUrl}/store_van_user_create`,
                        {
                          store_id: values?.route?.id,
                          van_id: values?.van?.id,
                          sales_man_user_id: values.salesman.id,
                    
                        },
                        {
                          headers: { Authorization: "Bearer " + token },
                        }
                      )
                      .then((res) => {
                        setSubmitting(false);
                        modal(false);
                        mutate()
                        cogoToast.success('Create Success',{position: 'top-right', bar:{size: '10px'}}); 
                      })
                      .catch(function (error) {
                        // console.log(error.response)
                       
                        cogoToast.error('Something Went Wrong',{position: 'top-right', bar:{size: '10px'}}); 
                        setSubmitting(false);
                        // mutate()
                      });
                  }
                  
                  );
                }}
              >
                {({ values, errors, submitForm, isSubmitting, setValues }) => (
                  <div className={classes.root}>
                    <div className={classes.paper}>
                    
                    
                      <form className={classes.form} noValidate>
                        <GridContainer>
                     
                          <GridItem xs={12} sm={12} md={4}>
                            {load && (
                              <Field
                                name="route"
                                component={Autocomplete}
                                options={store}
                                getOptionLabel={(option) => option.store_name}
                                renderInput={(params) => (
                                  <MuiTextField
                                    {...params}
                                    label="Route"
                                    variant="outlined"
                                    fullWidth
                                 
                                    margin="normal"
                                  />
                                )}
                              />
                            )}
                          </GridItem>



                          <GridItem xs={12} sm={12} md={4}>
                            {load && (
                              <Field
                                name="van"
                                component={Autocomplete}
                                options={van}
                                getOptionLabel={(option) => option.name}
                             
                                renderInput={(params) => (
                                  <MuiTextField
                                    {...params}
                                    label="VAN"
                                    variant="outlined"
                                    fullWidth
                           
                                    margin="normal"
                                  />
                                )}
                              />
                            )}
                          </GridItem>

                             
                          <GridItem xs={12} sm={12} md={4}>
                            {load && (
                              <Field
                                name="salesman"
                                component={Autocomplete}
                                options={salesMan}
                                getOptionLabel={(option) => option.name}
                             
                                renderInput={(params) => (
                                  <MuiTextField
                                    {...params}
                                    label="Salesman"
                                    variant="outlined"
                                    fullWidth
                                  
                                    margin="normal"
                                  />
                                )}
                              />
                            )}
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
