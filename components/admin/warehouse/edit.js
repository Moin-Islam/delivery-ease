import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import cogoToast from 'cogo-toast';
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { Formik, Field } from "formik";
import { TextField } from "formik-material-ui";
import { Button, MenuItem } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import { baseUrl } from "../../../const/api";
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
};
 
const useStyles = makeStyles(styles);

function Edit({ token, modal, editData, endpoint, mutate }) {
 console.log(editData)
  const [categoryList, setCategoryList] = React.useState([]);

  const classes = useStyles();
  const [errorAlert, setOpen] = React.useState({
    open: false,
    key: "",
    value: [],
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen({
      open: false,
      key: "",
      value: [],
    });
  };



  const  fetchCategory= async()=>{
    try {
       const result = await Axios.get(`${baseUrl}/product_category_list_active`, {
          headers: { Authorization: "Bearer " + token },
        });
        setCategoryList(result?.data.response?.product_categories)
       
    } catch (error) {
       console.log(error)
    }
    
  }
  
  
  React.useEffect(() => {
    fetchCategory()
  }, [])
  
  
  console.log(categoryList)

  return (
    <div>
      <GridContainer style={{ padding: "20px 30px", marginTop: 250 }}>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
         
            <CardBody>
              <Formik
                initialValues={{
                  category: editData.product_category_id,
                  name: editData.name,
                  phone: editData.phone,
                  email: editData.email,
                  address: editData.address,
                  status: editData.status,
                  company_vat_number: editData.company_vat_number
                }}
                validate={(values) => {
                  const errors = {};
      
                  if (!values.category) {
                    errors.category_name = "Required";
                  }


                  if (!values.phone) {
                    errors.phone = "Required";
                  } else if (values.phone.length != 11) {
                    errors.phone = "Invalid Phone Number";
                  }
                  if (!values.name) {
                    errors.name = "Required";
                  }
                  if (!values.address) {
                    errors.address = "Required";
                  }
                  if (!values.status) {
                    errors.status = "Required";
                  }
                  // if (!values.company_vat_number) {
                  //   errors.company_vat_number = "Required";
                  // }
                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                  setTimeout(() => {
                    Axios.post(
                      `${baseUrl}/${endpoint}`,
                      {
                        product_category_id: values.category,
                        warehouse_id: editData.id,
                        name: values.name,
                        phone: values.phone,
                        email: values.email,
                        status: values.status,
                        address: values.address,
                        company_vat_number: values.company_vat_number,
                      },
                      {
                        headers: { Authorization: "Bearer " + token },
                      }
                    )
                      .then((res) => {
                        // console.log(res);
                        setSubmitting(false);
                        mutate();
                        modal(false);
                        cogoToast.success('Update Success',{position: 'top-right', bar:{size: '10px'}}); 
                      })
                      .catch(function (error) {
                        AllApplicationErrorNotification(error.response.data)
                        // console.log(error);
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
                {({ submitForm, isSubmitting }) => (
                  <div className={classes.root}>
                    <div className={classes.paper}>
                      <form className={classes.form} noValidate>
                        <GridContainer>

                        <GridItem xs={12} sm={12} md={6}>
                        
                        <Field
                            component={TextField}
                            type="text"
                            name="category"
                            label="Category"
                            select
                            fullWidth
                            variant="outlined"
                            helperText="Please select category"
                            margin="normal">
                            {categoryList.map((u) => (
                              <MenuItem value={u.id}>{u.name}</MenuItem>
                            ))}
                          </Field>
                      
                        </GridItem>


                          <GridItem xs={12} sm={12} md={6}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="text"
                              label="Name"
                              name="name"
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={6}>
                            <Field
                              component={TextField}
                              name="phone"
                              type="text"
                              label="Phone"
                              variant="outlined"
                              margin="normal"
                              fullWidth
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={6}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="email"
                              label="Email"
                              name="email"
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={4}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="text"
                              label="Address"
                              name="address"
                            />
                          </GridItem>


                          {/* <GridItem xs={12} sm={12} md={4}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="text"
                              label="VAT Number"
                              name="company_vat_number"
                            /> 
                          </GridItem> */}


                          <GridItem xs={12} sm={12} md={4}>
                            <Field
                              component={TextField}
                              type="text"
                              name="status"
                              label="Status"
                              select
                              fullWidth
                              variant="outlined"
                              helperText="Please select status"
                              margin="normal"
                            >
                              <MenuItem value="1">Active</MenuItem>
                              <MenuItem value="0">Inactive</MenuItem>
                            </Field>
                          </GridItem>
                        </GridContainer>
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
                            "UPDATE"
                          )}
                        </Button>
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
                severity="error"
                color="error"
                style={{
                  backgroundColor: "#ff1a1a",
                  color: "white",
                }}
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



export default Edit;
