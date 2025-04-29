import { Box, Button, Divider, Grid, Typography } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
// import Paper from "@material-ui/core/Paper";
import React from "react";

import { makeStyles } from "@material-ui/core/styles";
// import Card from "components/Card/Card";
// import CardHeader from "components/Card/CardHeader";
import InvoiceHeader from "components/header/InvoiceHeader";
import { convertFristCharcapital } from "../../../helper/getMonthToNumber";

const useStyles = makeStyles({
  table: {
    "& .MuiTableCell-root": {
      border: "1px solid black",
    },
  },
});

const InvoicePosPurchase = React.forwardRef(
  ({ prods, total, supp, from, to }, ref) => {
    const classes = useStyles();
    console.log(prods);
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
      <div ref={ref} style={{ margin: "20px" }}>
        {prods && (
          <>
            <InvoiceHeader />
            <Box mt={2} mb={2}>
              <Divider />
            </Box>

            <Grid container>
              <Grid item xs="4"></Grid>

              <Grid item xs="4" style={{ textAlign: "center" }}>
                <Typography variant="h6" color="primary">
                  Whole Sale Report
                </Typography>
              </Grid>
              <Grid item xs="4" style={{ textAlign: "right" }}>
                <Typography color="primary">Date: {datePrint()}</Typography>
              </Grid>
            </Grid>

            <Typography
              variant="body1"
              style={{ fontWeight: "bold" }}
              color="primary"
              align="center"
            >
              Form {from} To {to}
            </Typography>

            <Box mb={4} mt={2}>
              <Grid container direction="column" justify="flex-start">
                <Typography variant="body1">
                  Name: {supp && supp.name}
                </Typography>
                <Typography variant="body1">
                  Phone: {supp && supp.phone}
                </Typography>
                <Typography variant="body1">
                  Email: {supp && supp.email}
                </Typography>
                <Typography variant="body1">
                  Address: {supp && supp.address}
                </Typography>
              </Grid>
            </Box>

            <Box item xs={12} p="5">
         
                <Table
                  className={classes.table}
                  aria-label="simple table"
                  size="small"
                  style={{
                    marginBottom: `${prods?.length > 12 && "-1px"}`,
                  }}
                >
                  {prods?.length > 12 && (
                    <thead>
                      <tr style={{ height: "0px" }}>
                        <th style={{ height: "0px" }}></th>
                        <th style={{ height: "0px" }}></th>
                        <th style={{ height: "0px" }}></th>
                        <th style={{ height: "0px" }}></th>
                        <th style={{ height: "0px" }}></th>
                        <th style={{ height: "0px" }}></th>
                      </tr>
                    </thead>
                  )}

                  <TableBody>
                    <TableRow>
                      <TableCell align="right">SL.</TableCell>
                      <TableCell align="center"> Date</TableCell>
                      <TableCell align="center">Invoice No.</TableCell>
                      {/* <TableCell align="center">Vch. Type</TableCell> */}
                      <TableCell align="center">Debit</TableCell>
                      <TableCell align="center">Credit</TableCell>
                      <TableCell align="center">Balance</TableCell>
                    </TableRow>
                    {!false ? (
                      <>
                        {true &&
                          prods.map((row, index) => (
                            <TableRow key={row.id}>
                              <TableCell align="center">{index + 1}</TableCell>
                              <TableCell align="center">
                                {row.transaction_date}
                              </TableCell>
                              <TableCell align="center">
                              {convertFristCharcapital(row.invoice_no)}
                              </TableCell>
                              {/* <TableCell align="center">
                                {row.vch_type}
                              </TableCell> */}
                              <TableCell align="right">{row.debit}</TableCell>
                              <TableCell align="right">{row.credit}</TableCell>
                              <TableCell align="right">{row.balance}</TableCell>
                            </TableRow>
                          ))}
                        {/* <Divider /> */}
                        <TableRow>
                          {/* <TableCell colSpan={4} /> */}
                          <TableCell
                            colSpan={5}
                            style={{ fontWeight: "bold" }}
                            align="right"
                          >
                            Total
                          </TableCell>
                          <TableCell
                            style={{ fontWeight: "bold" }}
                            align="right"
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
