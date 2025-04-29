import React from "react";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { useRootStore } from "models/root-store-provider";
import { observer } from "mobx-react-lite";
import { baseUrl } from "const/api";
import { Button, CircularProgress, Grid } from "@material-ui/core";
import { useReactToPrint } from "react-to-print";
import Barcode from "components/barcode/barcode.js";
import useStatePromise from "hooks/use-state-promise";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";

const ProductsBarcode = () => {
  const { user } = useRootStore();
  const [products, setProducts] = useState(false);
  const [printProducts, setPrintProducts] = useState(false);
  const [invoiceData, setInvoicedata, setInvoicedataPromise] = useStatePromise(
    null
  );
  const [invoiceProduct, setInvoiceproduct] = useState(null);
  const [barcodeProduct, setbarcodeproduct] = useState(null);
  const [barcodeProductName, setbarcodeproductname] = useState(null);
  const [barcodeProductPrice, setbarcodeproductprice] = useState(null);
  const [vatStatus, setVatStatus] = useState(null);
  const [firstProduct, setFirstProduct] = useState(null);
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState(false);
  useEffect(() => {
    axios
      .get(`${baseUrl}/product_list_barcode`, {
        headers: { Authorization: "Bearer " + user.auth_token },
      })
      .then((res) => {
        setProducts(res.data.response.products);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }, []);
  const fetchStock = () => {

    handlePrint();
  };

  const componentRef = React.useRef(null);

  const handlePrint = async () => {
    const state = await setInvoicedataPromise().then(() => {
      setbarcodeproduct(1234567896543211);
      // setbarcodeproductname(row.product_name);
      // setbarcodeproductprice(row.selling_price);
      // setVatStatus(row.vat_status);
    });
    if (handlePrintInvoice) {
      handlePrintInvoice();
    }
  };
  const handlePrintInvoice = useReactToPrint({
    content: () => componentRef.current,
  });
  const handleCount = (e) => {
    setCount(e.target.value);
  };
  // console.log(products);
  return (
    <div>
      <h1>Generate Barcode For Products</h1>
      <GridContainer>
        <GridItem xs={6}>
          {" "}
          {products ? (
            <Autocomplete
              id="combo-box-demo"
              options={products}
              onChange={(event, newValue) => {
                setFirstProduct(newValue);
                if (newValue == null) {
                  setStatus(false);
                } else {
                  setStatus(true);
                }
              }}
              getOptionLabel={(option) => option.product_name}
              style={{ width: 500 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Start Product"
                  variant="outlined"
                />
              )}
            />
          ) : (
            <CircularProgress />
          )}
        </GridItem>
        <GridItem xs={2}>
          {products ? (
            <TextField
              label="Count"
              variant="outlined"
              value={count}
              onChange={handleCount}
            />
          ) : (
            <CircularProgress />
          )}
        </GridItem>
        <GridItem xs={2}>
          {status && (
            <Button variant="outlined" color="primary" onClick={fetchStock}>
              Print
            </Button>
          )}
        </GridItem>
        <GridItem xs={1}>
          {status && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() =>
                (window.location.href =
                  window.location.origin + "/barcode/productsbarcode")
              }
            >
              Clear
            </Button>
          )}
        </GridItem>
      </GridContainer>

      <div ref={componentRef}>
        <Grid container spacing={1}>
          {firstProduct &&
            Array.from({ length: count }).map((prod) => (
              <Grid item xs={2}>
                <Barcode
                  inv={invoiceData}
                  barProd={firstProduct.barcode}
                  barProdName={firstProduct.product_name}
                  vatStatus={firstProduct.vat_status}
                  barProdPrice={firstProduct.selling_price}
                  invoiceProduct={invoiceProduct}
                />
              </Grid>
            ))}
          {}
        </Grid>
      </div>
    </div>
  );
};
export default ProductsBarcode;
