import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import { Formik, Form, Field } from 'formik';
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

const Create = ({ token, modal, endpoint, mutate,user }) => {
  
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
  let ware = `${baseUrl}/warehouse_list`;
  let stor = `${baseUrl}/store_list`;
  let rol = `${baseUrl}/roles`;
  useAsyncEffect(async (isMounted) => {
    await axios
      .all([axios.get(ware, {
        headers: { Authorization: 'Bearer ' + token },
      }), axios.get(stor, {
        headers: { Authorization: 'Bearer ' + token },
      }), axios.get(rol, {
        headers: { Authorization: 'Bearer ' + token },
      })])
      .then(
        axios.spread((...responses) => {
          const responseOneB = responses[0];
          const responseTwoU = responses[1];
          const responseTwoR = responses[2];
          setWarehouse(responseOneB.data.response.warehouses);
          setStore(responseTwoU.data.response.stores);
          setRoles(responseTwoR.data.response.role);
          //console.log(responseOneB, responseTwoU);
        })
      )
      .catch((errors) => {
        console.error(errors);
      });
  }, []);

  return (
    <div>
      <GridContainer style={{ padding: '20px 30px', marginTop: 250 }}>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
          
            <CardBody>
              <Formik
                initialValues={{
                  roles: '',
                  name: '',
                  password: '',
                  confirm_password: '',
                  phone: '',
                  email: '',
                  warehouse: '',
                  store: user.store.id ? user.store.id : '',
                  status: '1',
                }}
                validate={(values) => {
                  const errors = {};
                  if (!values.phone) {
                    errors.phone = 'Required';
                  } else if (values.phone.length != 11) {
                    errors.phone = 'Invalid Phone Number';
                  }
                  if (!values.roles) {
                    errors.roles = 'Required';
                  }
                  if (!values.name) {
                    errors.name = 'Required';
                  }
                  if (!values.status) {
                    errors.status = 'Required';
                  }
                  if (!values.password) {
                    errors.password = 'Required';
                  } else if (values.password.length < 5) {
                    errors.password = 'Minimum length 6';
                  }
                  if (!values.confirm_password) {
                    errors.confirm_password = 'Required';
                  } else if (values.confirm_password != values.password) {
                    errors.confirm_password = 'Password does not match';
                  }
                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                  setTimeout(() => {
                    Axios.post(
                      `${baseUrl}/${endpoint}`,
                      {
                        roles: values.roles,
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
                          <GridItem xs={12} sm={12} md={4}>
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
                          <GridItem xs={12} sm={12} md={4}>
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
                          <GridItem xs={12} sm={12} md={4}>
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

                          <GridItem xs={12} sm={12} md={6}>
                            <Field
                              component={TextField}
                              type="text"
                              name="roles"
                              label="Role"
                              select
                              fullWidth
                              variant="outlined"
                              helperText="Please select roles"
                              margin="normal">
                              {roles.map((role) => (
                                <MenuItem value={role.name}>
                                  {role.name}
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
                              variant="outlined"
                              helperText="Please select warehouse"
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
                              helperText="Please select route"
                              margin="normal">
                              {store.map((s) => (
                                <MenuItem value={s.id}>{s.store_name}</MenuItem>
                              ))}
                            </Field>
                          </GridItem>


                          <GridItem xs={12} sm={12} md={6}>
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
                            'SUBMIT'
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
};

export default Create;
