import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import { Formik, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import { Button, MenuItem } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { baseUrl } from '../../../const/api';
import { useAsyncEffect } from 'use-async-effect';
import axios from 'axios';

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
};

const useStyles = makeStyles(styles);

function Edit({ token, modal, editData, endpoint, mutate }) {
  console.log(editData);
  const classes = useStyles();
  const [errorAlert, setOpen] = React.useState({
    open: false,
    key: '',
    value: [],
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen({
      open: false,
      key: '',
      value: [],
    });
  };

  const [roles, setRoles] = React.useState([]);
  const [warehouse, setWarehouse] = React.useState([]);
  const [store, setStore] = React.useState([]);
  const [routseDisableStatus, setRoutseDisableStatus] = React.useState(false);




 const fetchActiveSalesman = async(editId) =>{

const result = await axios.post(`${baseUrl}/check_sales_man_user_current_time_active_or_closed`,
{
  sales_man_user_id: editId,
},
{
  headers: { Authorization: "Bearer " + token },
}
)

if(result?.data?.response?.end_status == 0){
  setRoutseDisableStatus(true)
}else{
  setRoutseDisableStatus(false)
}


// setActivesalesman(result?.data?.response);


 }



  let ware = `${baseUrl}/warehouse_list`;
  let stor = `${baseUrl}/store_list`;
  let rol = `${baseUrl}/roles`;

  const requestOne = axios.get(ware, {
    headers: { Authorization: 'Bearer ' + token },
  });
  const requestTwo = axios.get(stor, {
    headers: { Authorization: 'Bearer ' + token },
  });
  const requestThree = axios.get(rol, {
    headers: { Authorization: 'Bearer ' + token },
  });

  useAsyncEffect(async (isMounted) => {
    await axios
      .all([requestOne, requestTwo, requestThree])
      .then(
        axios.spread((...responses) => {
          const responseOneB = responses[0];
          const responseTwoU = responses[1];
          const responseTwoR = responses[2];
          setWarehouse(responseOneB.data.response.warehouses);
          setStore(responseTwoU.data.response.stores);
          setRoles(responseTwoR.data.response.role);

        })
      )
      .catch((errors) => {
        console.error(errors);
      });
  }, []);


  useEffect(()=>{

if(editData.role == 'store salesman'){
  fetchActiveSalesman(editData.id)
}

  },[])

  return (
    <div>
      <GridContainer style={{ padding: '20px 30px', marginTop: 250 }}>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
         
            <CardBody>
              <Formik
                initialValues={{
                  name: editData.name,
                  phone: editData.phone,
                  email: editData.email,
                  role: editData.role,
                  password: '',
                  confirm_password: '',
                  warehouse: editData.warehouse_id,
                  store: editData.store_id,
                  status: editData.status,
                }}
                validate={(values) => {
                  const errors = {};
                  if (!values.phone) {
                    errors.phone = 'Required';
                  } else if (values.phone.length != 11) {
                    errors.phone = 'Invalid Phone Number';
                  }
                  if (!values.role) {
                    errors.role = 'Required';
                  }
                  if (!values.name) {
                    errors.name = 'Required';
                  }
                  if (!values.status) {
                    errors.status = 'Required';
                  }
                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                  setTimeout(() => {
                    Axios.post(
                      `${baseUrl}/${endpoint}`,
                      {
                        user_id: editData.id,
                        roles: values.role,
                        name: values.name,
                        phone: values.phone,
                        email: values.email,
                        status: values.status,
                        password: values.password,
                        confirm_password: values.confirm_password,
                        warehouse_id: values.warehouse,
                        store_id: values.store,
                      },
                      {
                        headers: { Authorization: 'Bearer ' + token },
                      }
                    )
                      .then((res) => {
                        console.log(res);
                        setSubmitting(false);
                        mutate();
                        modal(false);
                      })
                      .catch(function (error) {
                        console.log(error);
                        setOpen({
                          open: true,
                          key: Object.values(error.response.data.message),
                          value: Object.values(error.response.data.message),
                        });
                        setSubmitting(false);
                      });
                  });
                }}>
                {({ submitForm, isSubmitting }) => (
                  <div className={classes.root}>
                    <div className={classes.paper}>
                      <form className={classes.form} noValidate>
                        <GridContainer>
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

                          <GridItem xs={12} sm={12} md={6}>
                            <Field
                              component={TextField}
                              type="text"
                              name="role"
                              label="Role"
                              select
                              fullWidth
                       
                              variant="outlined"
                              helperText="Please select roles"
                              margin="normal">
                              {roles.map((r) => (
                                <MenuItem value={r.name} key={r.id}>
                                  {r.name}
                                </MenuItem>
                              ))}
                            </Field>
                          </GridItem>

                          <GridItem xs={12} sm={12} md={6}>
                            <Field
                              component={TextField}
                              type="text"
                              name="warehouse"
                              label="Warehouse"
                              select
                              fullWidth
                             
                              disabled

                              
                              // disabled={editData.role === 'admin' || editData.role === 'store salesman' ? true: false }
                              variant="outlined"
                              // helperText="Please select warehouse"
                              margin="normal">
                              {warehouse.map((w) => (
                                <MenuItem value={w.id}>{w.name}</MenuItem>
                              ))}
                            </Field>
                          </GridItem>
                          
                          <GridItem xs={12} sm={12} md={6}>
                            <Field
                              component={TextField}
                              type="text"
                              name="store"
                              label="Route"
                              select
                              fullWidth
                              variant="outlined"
                              helperText={routseDisableStatus ? 'Please frist close this salesman' : null}
                              disabled={routseDisableStatus}
                              margin="normal">
                                <MenuItem value={null}>Unselect</MenuItem>
                              {store.map((s) => (
                                <MenuItem value={s.id}>{s.store_name}</MenuItem>
                              ))}
                               
                            </Field>
                          </GridItem>
                        
                          <GridItem xs={12} sm={12} md={12}>
                            <Field
                              component={TextField}
                              type="text"
                              name="status"
                              label="Status"
                              select
                              fullWidth
                              variant="outlined"
                              helperText="Please select status"
                              margin="normal">
                              <MenuItem value="1">Active</MenuItem>
                              <MenuItem value="0">Inactive</MenuItem>
                            </Field>
                          </GridItem>
                          <GridItem xs={12} sm={12} md={6}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="password"
                              label="Password"
                              name="password"
                              helperText="Minimum Length 6"
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={6}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="password"
                              label="Confirm Password"
                              name="confirm_password"
                            />
                          </GridItem>
                        </GridContainer>
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
                            'UPDATE'
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
              onClose={handleClose}>
              <Alert
                onClose={handleClose}
                severity="error"
                color="error"
                style={{
                  backgroundColor: '#ff1a1a',
                  color: 'white',
                }}>
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
