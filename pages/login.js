import Head from 'next/head';
import React, { useState } from 'react';
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

const useStyles = makeStyles((theme) => ({
  root: {
 
    textAlign:'center',
  
    
    
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
  const { user } = useRootStore();
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

console.log(process)
  return (
    <div>
      <Head>
        <title>DeliverEase </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div  >
        <Formik
          initialValues={{
            phone: '',
            password: '',
          }}
          validate={(values) => {
            const errors = {};
            if (!values.phone) {
              errors.phone = 'Required';
            } else if (values.phone.length != 11) {
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
            setTimeout(() => {
              Axios.post(`${baseUrl}/login`, {
                phone: values.phone,
                password: values.password,
              })
                .then((res) => {
                  const persons = res.data;
                  user.logIn(persons.success.user);
                  if (persons.success.user.role == 'customer') {
                    Router.push('/customer/home');
                  } else {
                    Router.push('/dashboard/list');
                  }
                  setSubmitting(false);
                })
                .catch(function (error) {
                  console.log(error);
                  setOpen(true);
                  setSubmitting(false);
                });
            });
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
                <Grid item xs={false} sm={4} md={7} className={classes.image} />
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

                    <Typography variant="h6" >
                    DeliverEase Login
                    </Typography>
              
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
    </div>
  );
});
export default Login;
