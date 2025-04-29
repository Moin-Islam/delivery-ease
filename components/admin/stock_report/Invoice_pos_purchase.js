import { Box, Button, Divider, Grid, Typography } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import InvoiceHeader from "components/header/InvoiceHeader";
import { curencyNumbertoWord } from "helper/currenctConvert";
 
const useStyles = makeStyles({
  table: {
    "& .MuiTableCell-root": {
      border: "1px solid black",
    },
  },
});

const InvoicePosPurchase = React.forwardRef(
  ({ prods, total, store_name, store_add, store_phone }, ref) => {
    const classes = useStyles();
    console.log(store_name, store_add, store_phone);
    const [tk, setTk] = useState("");
    const [date, setDate] = useState([1, 2, 3]);
    const [time, setTime] = useState([1, 2]);
    useEffect(() => {
      const tk = curencyNumbertoWord(parseInt(total));
      setTk(tk);

    }, [total]);

    const datePrint = () => {
      const today = new Date();
      let dd = today.getDate();

      let mm = today.getMonth() + 1;
      const yyyy = today.getFullYear();
      if (dd < 10) {
        dd = `0${dd}`;
      }

      if (mm < 10) {
        mm = `0${mm}`;
      }
      return `${dd}/${mm}/${yyyy}`;
    };
    return (
      <div ref={ref} style={{ margin: "15px" }}>
        {prods && (
          <>
            <Box mt={1}>
              <InvoiceHeader />
            </Box>
            <Box mt={2} mb={2}>
              <Divider />
              <Divider />
            </Box>
            <Box mb={2}>
              <Grid container>
                <Grid item xs="4"></Grid>
                <Grid item xs="4" style={{ textAlign: "right" }}>
                  <Typography variant="h6" color="primary" align="center">
                    {store_name ? "Store" : "Warehouse"} Stock List
                  </Typography>
                </Grid>
                <Grid item xs="4" style={{ textAlign: "right" }}>
                  <Typography color="primary" style={{ marginTop: "5px" }}>
                    Date: {datePrint()}
                  </Typography>
                </Grid>
              </Grid>

              {store_name ? (
                <Grid container direction="row">
                  <Grid item xs={8} style={{ marginLeft: "10px" }}>
                    <Typography variant="body1" color="primary">
                      Name: {store_name}
                    </Typography>
                    <Typography variant="body1" color="primary">
                      Address: {store_add}
                    </Typography>
                    <Typography variant="body1" color="primary">
                      Phone: {store_phone}
                    </Typography>
                  </Grid>
                </Grid>
              ) : null}
            </Box>
            <Box item xs={12}>
              {/* <TableContainer component={Paper}> */}
                <Table
                  className={classes.table}
                  aria-label="simple table"
                  size="small"
           
                >

                      <TableHead>
                        <TableRow>
                          <TableCell
                            style={{ padding: "1px", textAlign: "center" }}
                          >
                            SL#
                          </TableCell>
                          <TableCell width="65%">Description</TableCell>
                          <TableCell>QTY</TableCell>
                          <TableCell>Unit</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Total</TableCell>
                        </TableRow>
                      </TableHead>
               

                  <TableBody>
                    

                    {!false ? (
                      <>
                        {true &&
                          prods.map((row, index) => (
                            <TableRow key={row.id}>
                          
                              <TableCell>{index + 1}</TableCell>
                              <TableCell style={{ fontSize: '12px' }}>

                              {row.product_name?.slice(0, 55)}
                              </TableCell>
                              <TableCell align="center">
                                {`${row.current_stock}`}
                              </TableCell>
                              <TableCell align="center">
                                {row.product_unit_name}
                              </TableCell>
                              <TableCell align="center">
                                {row.selling_price}
                              </TableCell>
                              <TableCell align="center">
                                {row.selling_price * row.current_stock}
                              </TableCell>
                            </TableRow>
                          ))}
                        {/* <Divider /> */}
                        <TableRow>
                          <TableCell colSpan={4} />
                          <TableCell
                            style={{ fontWeight: "bold" }}
                            align="center"
                          >
                            Total
                          </TableCell>
                          <TableCell
                            style={{ fontWeight: "bold" }}
                            align="center"
                          >
                            {total}
                          </TableCell>
                        </TableRow>
                      </>
                    ) : (
                      <>
                        {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map(() => (
                          <TableRow>
                            <TableCell component="th" scope="row">
                              <Skeleton variant="rect" />
                            </TableCell>
                            <TableCell align="right">
                              <Skeleton variant="rect" />
                            </TableCell>
                            <TableCell align="right">
                              <Skeleton variant="rect" />
                            </TableCell>
                            <TableCell align="right">
                              <Skeleton variant="rect" />
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}
                  </TableBody>
                </Table>
              {/* </TableContainer> */}
            </Box>
            <Box px={5} mt={2}>
              <Typography variants="body1" style={{ fontWeight: "bold" }}>
                In Words: {tk}.
              </Typography>
            </Box>
            <Box mt={5}>
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
              >
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body1"
                    align="left"
                    style={{
                      borderTop: "2px solid black",
                    }}
                  >
                    Checked/Recommended by
                  </Typography>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body1"
                    align="left"
                    style={{
                      borderTop: "2px solid black",
                    }}
                  >
                    Authorized by
                  </Typography>
                </Box>
              </Grid>
            </Box>
          </>
        )}
      </div>
    );
  }
);
export default InvoicePosPurchase;

