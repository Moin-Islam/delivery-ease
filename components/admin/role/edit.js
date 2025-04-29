import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import { useRootStore } from "../../../models/root-store-provider";

import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { Formik, Form, Field } from "formik";
import { TextField, Switch, Checkbox } from "formik-material-ui";
import Grid from "@material-ui/core/Grid";
import {
  Button,
  MenuItem,
  FormControlLabel,
  Container,
  Box,
  Chip,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import { baseUrl } from "../../../const/api";
import { useAsyncEffect } from "use-async-effect";
import axios from "axios";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Skeleton from "@material-ui/lab/Skeleton";

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
  const classes = useStyles();
  const { user } = useRootStore();

  const arrayOfPermission = editData?.permissions.map((p,index)=>p.id.toString())
  // console.log(arrayOfPermission);
  const [errorAlert, setOpen] = React.useState({
    open: false,
    key: "",
    value: [],
  });
 
  const [per, setPermissions] = React.useState([]);
  const [load, setLoad] = React.useState(false);
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
 
  useAsyncEffect(async (isMounted) => {
    setLoad(true);
    try {
      const perList = await axios.get(`${baseUrl}/permission_list_show`, {
        headers: { Authorization: "Bearer " + token },
      });
      if (!isMounted()) return;

      if (perList.data.response.permissions != 0) {
        console.log(perList.data.response.permissions);
        setPermissions(perList.data.response.permissions);
        setLoad(false);
      } else {
        console.log("No Permissons");
        setLoad(false);
        modal(false);
      }
    } catch (error) {
      console.log(error);
      setLoad(false);
    }
  }, []);

  return (
    <div>
      <GridContainer style={{ padding: "20px 30px", marginTop: 250 }}>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
           
            <CardBody>
              <Formik
                initialValues={{
                  name: editData.name,
                  permissions: arrayOfPermission,
                }}
                validate={(values) => {
                  const errors = {};
                  if (!values.name) {
                    errors.name = "Required";
                  }
                  if (values.permissions.length == 0) {
                    errors.permissions = "Required";
                  }
                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                  // console.log(values);
                  // setSubmitting(false)
                  setTimeout(() => {
                    Axios.post(
                      `${baseUrl}/${endpoint}`,
                      {
                        role_id: editData.id,
                        name: values.name,
                        permission: values.permissions,
                      },
                      {
                        headers: { Authorization: "Bearer " + token },
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
                }}
              >
                {({ submitForm, isSubmitting }) => (
                  <div className={classes.root}>
                    <div className={classes.paper}>
                      <form className={classes.form} noValidate>
                        <GridContainer>
                          <GridItem xs={12} sm={12} md={12}>
                            <Field
                              component={TextField}
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              type="text"
                              label="Name"
                              name="name"
                              disabled
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={12}>
                            {editData.permissions.map((pe) => (
                              <Chip
                                key={pe.id}
                                color="primary"
                                size="small"
                                label={pe.name}
                                icon={<CheckCircleIcon />}
                                style={{ margin: 3 }}
                              />
                            ))}
                          </GridItem>
                          {load ? (
                            <div
                              style={{
                                padding: "20px",
                                height: "300px",
                                margin: "auto",
                              }}
                            >
                              <GridItem
                                xs={12}
                                sm={12}
                                md={12}
                                container
                                direction="row"
                                justify="center"
                                alignItems="center"
                              >
                                <CircularProgress color="primary" size={24} />
                              </GridItem>
                            </div>
                          ) : (
                            per.map((perm, key) => (
                              <GridItem xs={12} sm={12} md={3} key={perm.id}>
                                <FormControlLabel
                                  control={
                                    <Field
                                      component={Checkbox}
                                      type="checkbox"
                                      name="permissions"
                                      // checked={arrayOfPermission.includes(perm.name)}
                                      value={perm.id.toString()}
                                    />
                                  }
                                  label={perm.name}
                                />
                              </GridItem>
                            ))
                          )}
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

// UserProfile.layout = Admin;

export default Edit;
