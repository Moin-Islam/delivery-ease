import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { TextField } from 'formik-material-ui';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Axios from 'axios';
import { Formik, Field } from 'formik';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useRootStore } from './../models/root-store-provider';
import { observer } from 'mobx-react-lite';
import Router from 'next/router';
import { baseUrl } from './../const/api';
import Paper from '@material-ui/core/Paper';
import VanAnimation from '../components/VanAnimation'; // Assuming this component will handle the van animation

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
  },

  paper: {
    margin: theme.spacing(8, 4),
  },

  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },

  formParent: {
    backgroundColor: '#f1f8ff',
  },

  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = observer(() => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false); // State to toggle login form visibility

  const { user } = useRootStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogin(true); // Show login form after 2 seconds
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div>
      <Head>
        <title>DeliverEase</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!showLogin ? (
        <VanAnimation /> // Render van animation while waiting
      ) : (
        <div>
          <Formik
            initialValues={{
              phone: '',
              password: '',
            }}
            validate={(values) => {
              const errors = {};
              if (!values.phone) {
                errors.phone = 'Required';
              } else if (values.phone.length !== 11) {
                errors.phone = 'Invalid Phone Number';
              }
              if (!values.password) {
                errors.password = 'Required';
              } else if (values.password.length < 6) {
                errors.password = 'Minimum 6 characters';
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              user.logIn({
                id: 1,
                name: 'Test User',
                phone: '12345678901',
                email: null,
                status: 1,
                created_at: '2025-05-01T00:00:00Z',
                updated_at: '2025-05-01T00:00:00Z',
                role: 'admin',
                token: 'abc123xyz',
                warehouse_id: null,
                store_id: null,
                store_name: null,
                permissions: [
                  { id: 1, name: 'dashboard_list', guard_name: 'web', created_at: '2025-05-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z', permission_id: 101, role_id: 1 },
                  { id: 2, name: 'product_pos_sale', guard_name: 'web', created_at: '2025-05-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z', permission_id: 115, role_id: 1 },
                  { id: 3, name: 'warehouse_list', guard_name: 'web', created_at: '2025-05-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z', permission_id: 105, role_id: 1 },
                  { id: 4, name: 'store_list', guard_name: 'web', created_at: '2025-05-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z', permission_id: 104, role_id: 1 },
                  { id: 5, name: 'van_list', guard_name: 'web', created_at: '2025-05-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z', permission_id: 108, role_id: 1 },
                  { id: 6, name: 'party_list', guard_name: 'web', created_at: '2025-05-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z', permission_id: 116, role_id: 1 },
                  { id: 7, name: 'pos_sale_customer_list', guard_name: 'web', created_at: '2025-05-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z', permission_id: 117, role_id: 1 },
                  { id: 8, name: 'product_category_list', guard_name: 'web', created_at: '2025-05-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z', permission_id: 118, role_id: 1 },
                  { id: 9, name: 'product_unit_list', guard_name: 'web', created_at: '2025-05-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z', permission_id: 118, role_id: 1 },
                  { id: 10, name: 'product_whole_purchase_list', guard_name: 'web', created_at: '2025-05-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z', permission_id: 120, role_id: 1 },
                  { id: 29, name: 'store_van_user_list', guard_name: 'web', created_at: '2025-05-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z', permission_id: 128, role_id: 1 },
                  { id: 22, name: 'stock_transfer_invoice_list', guard_name: 'web', created_at: '2025-05-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z', permission_id: 139, role_id: 1 },
                  { id: 23, name: 'warehouse_stock_list', guard_name: 'web', created_at: '2025-05-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z', permission_id: 140, role_id: 1 },
                  { id: 24, name: 'store_stock_list', guard_name: 'web', created_at: '2025-05-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z', permission_id: 141, role_id: 1 },
                  { id: 25, name: 'product_purchase_return_list', guard_name: 'web', created_at: '2025-05-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z', permission_id: 142, role_id: 1 },
                  { id: 26, name: 'sale_return_customer_van_route_list', guard_name: 'web', created_at: '2025-05-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z', permission_id: 143, role_id: 1 },
                  { id: 27, name: 'sale_return_van_route_warehouse_list', guard_name: 'web', created_at: '2025-05-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z', permission_id: 144, role_id: 1 },
                  { id: 7, name: 'role_list', guard_name: 'web', created_at: '2025-05-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z', permission_id: 102, role_id: 1 },
                  { id: 18, name: 'user_list', guard_name: 'web', created_at: '2025-05-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z', permission_id: 103, role_id: 1 },
                  { id: 19, name: 'sale_list', guard_name: 'web', created_at: '2025-05-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z', permission_id: 106, role_id: 1 },
                  { id: 100, name: 'purchase_list', guard_name: 'web', created_at: '2025-05-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z', permission_id: 107, role_id: 1 },
                  { id: 11, name: 'supplier_list', guard_name: 'web', created_at: '2025-05-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z', permission_id: 109, role_id: 1 },
                  { id: 12, name: 'customer_list', guard_name: 'web', created_at: '2025-05-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z', permission_id: 110, role_id: 1 },
                  { id: 13, name: 'pos_setting_list', guard_name: 'web', created_at: '2025-05-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z', permission_id: 111, role_id: 1 },
                  { id: 14, name: 'stock_manage_list', guard_name: 'web', created_at: '2025-05-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z', permission_id: 112, role_id: 1 },
                  { id: 15, name: 'purchase_return_list', guard_name: 'web', created_at: '2025-05-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z', permission_id: 113, role_id: 1 },
                  { id: 16, name: 'sale_return_list', guard_name: 'web', created_at: '2025-05-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z', permission_id: 114, role_id: 1 },
                  { id: 67, name: 'product_pos_sale_create', guard_name: 'web', created_at: '2025-05-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z', permission_id: 228, role_id: 1 },
                  { id: 57, name: 'product_pos_sale_list', guard_name: 'web', created_at: '2025-05-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z', permission_id: 119, role_id: 1 },
                ],
                store_van_user: null,
              });
              Router.push('/dashboard/list');
              setSubmitting(false);
            }}>
            {({ submitForm, isSubmitting }) => (
              <div className={classes.root}>
                <Grid
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justifyContent="center">
                  <CssBaseline />
                  <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    className={classes.image}
                  />
                  <Grid
                    item
                    xs={12}
                    sm={8}
                    md={5}
                    component={Paper}
                    elevation={6}
                    square
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    className={classes.formParent}>
                    <div className={classes.paper}>
                      <Typography variant="h6">DeliverEase Login</Typography>
                      <form className={classes.form} noValidate>
                        <Field
                          component={TextField}
                          name="phone"
                          type="email"
                          label="Phone"
                          variant="outlined"
                          margin="normal"
                          fullWidth
                        />
                        <Field
                          component={TextField}
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          type="password"
                          label="Password"
                          name="password"
                        />
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
                            'SIGN IN'
                          )}
                        </Button>
                      </form>
                    </div>
                  </Grid>
                </Grid>
                <Snackbar
                  open={open}
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
                    Invalid Credential
                  </Alert>
                </Snackbar>
              </div>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
});

export default Login;
