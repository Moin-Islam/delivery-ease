import React, { useState, useEffect } from "react";
import { Box, Container, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ImageUploading from "react-images-uploading";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import Axios from "axios";
import Tooltip from "@material-ui/core/Tooltip";
import CircularProgress from "@material-ui/core/CircularProgress";
import { baseUrl, webUrl } from "../../../const/api";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  img_btn: {
    border: 0,
    cursor: "pointer",
    backgroundColor: "#ffffff",
  },
  fabProgress: {
    position: "absolute",
    zIndex: 1,
  },
}));

const ProductImageUploadEdit = ({ product, token }) => {
  const classes = useStyles();
  const [images, setImages] = React.useState([]);
  const [prd, setPrd] = React.useState(null);
  const [load, setLoad] = React.useState(false);
  const [error, setError] = React.useState(true);
  const [picsubmit, setPicsubmit] = React.useState(false);

  // useEffect(() => {
  //   if (!product) {
  //     return;
  //   }
  //   setPrd(product);
  //   setLoad(true);
  // }, []);
  const [alert, setAlert] = useState({
    open: false,
    severity: "error",
    massage: "Loading",
  });
  const maxNumber = 69;
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert({
      open: false,
      severity: "info",
      massage: "Saved",
    });
  };
  const handleError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setError(false);
  };
  const onChange = (imageList) => {
    // data for submiting image
    setPicsubmit(true);
    Axios.post(
      `${baseUrl}/product_image`,
      {
        pro_img: imageList[0].data_url,
        product_id: product.id,
      },
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
      .then((res) => {
        setPicsubmit(false);
        //console.log(res.data.response);
        setPrd(res.data.response.product);
        setLoad(true);
        setAlert({
          open: true,
          severity: "success",
          massage: "Product Image Inserted Succesfully",
        });
      })
      .catch(function (error) {
        setPicsubmit(false);
        setAlert({
          open: true,
          severity: "error",
          massage: "Failed",
        });
      });
  };
  return (
    <div>
      <ImageUploading
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
          errors,
        }) => (
          // write your building UI

          <div
            className="upload__image-wrapper"
            style={{ position: "relative" }}
          >
            {picsubmit && (
              <CircularProgress
                size={210}
                thickness={1}
                className={classes.fabProgress}
              />
            )}
            <Tooltip title="Click to Upload the Product Picture">
              <button
                className={classes.img_btn}
                style={isDragging ? { color: "red" } : undefined}
                onClick={onImageUpload}
                {...dragProps}
              >
                {load ? (
                  <img
                    src={`${webUrl}/uploads/products/${prd.image}`}
                    alt=""
                    width="200px"
                    height="200px"
                    //   style={{ borderRadius: "50%" }}
                  />
                ) : (
                  <img
                    src={`${webUrl}/uploads/products/${product.image}`}
                    alt=""
                    width="200px"
                    height="200px"
                    //   style={{ borderRadius: "50%" }}
                  />
                )}
              </button>
            </Tooltip>
            &nbsp;
            {errors && (
              <div>
                {errors.maxNumber && (
                  <Snackbar
                    open={error}
                    autoHideDuration={2000}
                    onClose={handleError}
                  >
                    <Alert
                      onClose={handleError}
                      severity="error"
                      variant="filled"
                    >
                      Number of selected images exceed maxNumber
                    </Alert>
                  </Snackbar>
                )}
                {errors.acceptType && (
                  <Snackbar
                    open={error}
                    autoHideDuration={2000}
                    onClose={handleError}
                  >
                    <Alert
                      onClose={handleError}
                      severity="error"
                      variant="filled"
                    >
                      Format Is Not Supported.Supported Format 'jpg', 'gif',
                      'png'
                    </Alert>
                  </Snackbar>
                )}
                {errors.maxFileSize && (
                  <Snackbar
                    open={error}
                    autoHideDuration={2000}
                    onClose={handleError}
                  >
                    <Alert
                      onClose={handleError}
                      severity="error"
                      variant="filled"
                    >
                      Selected file size exceed max file Size
                    </Alert>
                  </Snackbar>
                )}
                {errors.resolution && (
                  <Snackbar
                    open={error}
                    autoHideDuration={2000}
                    onClose={handleError}
                  >
                    <Alert
                      onClose={handleError}
                      severity="error"
                      variant="filled"
                    >
                      Not Supported Resulation
                    </Alert>
                  </Snackbar>
                )}
              </div>
            )}
          </div>
        )}
      </ImageUploading>
      <Snackbar open={alert.open} autoHideDuration={1200} onClose={handleClose}>
        <Alert onClose={handleClose} severity={alert.severity} variant="filled">
          {alert.massage}
        </Alert>
      </Snackbar>
    </div>
  );
};
export default ProductImageUploadEdit;
