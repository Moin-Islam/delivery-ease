import { Box, Grid, Typography } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
// import InvoiceHeader from "components/header/InvoiceHeader";
import { curencyNumbertoWord } from "helper/currenctConvert";
import { dateFormatIssueDate } from "helper/getMonthToNumber";
import Thousands_separator from "helper/thousands_separator";
const useStyles = makeStyles({
  table: {
    "& .MuiTableCell-root": {
      border: "1px solid black",
    },
  },
});

const StockTransferPdf = React.forwardRef(
  ({ inv, invoiceProduct, invoiceType }, ref) => {
    const classes = useStyles();

    const totalQty = invoiceProduct?.reduce(
      (accumulator, currentValue) => accumulator + currentValue.qty,
      0
    );

    return (
      <div ref={ref}>
        {inv && (
          <Grid container direction="column" style={{ padding: 20 }}>
            {/* <InvoiceHeader /> */}
            <Typography
              style={{ fontWeight: "bold", marginTop: "6px" }}
              variant="body1"
              align="center"
            >
              Stock Transfer
            </Typography>
            <Box pl={3} pr={2} mt={2}>
              <Grid
                container
                direction="row"
                style={{ backgroundColor: "#e6eff5", padding: "7px" }}
              >
                <Grid item xs={6}>
                  <Typography variant="h6" align="left">
                    Invoice Number: {inv.invoice_no}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" align="right">
                    Invoice Date: {dateFormatIssueDate(inv.issue_date)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Box pl={3} pr={2}>
              <TableContainer>
                <Table
                  aria-label="simple table"
                  size="small"
                  className={classes.table}
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
                    {invoiceProduct &&
                      invoiceProduct.map((prd, index) => (
                        <TableRow>
                          <TableCell align="left">{index + 1}</TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            style={{ fontSize: "12px" }}
                          >
                            {prd.product_name?.slice(0, 55)}
                          </TableCell>

                          <TableCell align="right">{prd.qty}</TableCell>

                          <TableCell align="right">
                            {prd.product_unit_name}
                          </TableCell>

                          <TableCell align="right">{prd.price}</TableCell>

                          <TableCell align="right">{Thousands_separator(prd.sub_total)}</TableCell>
                        </TableRow>
                      ))}

                    <TableRow>
                      <TableCell colSpan={2} align="right">
                        Total Quantity (الكمية الإجمالية)
                      </TableCell>
                      <TableCell align="right">{totalQty}</TableCell>

                      <TableCell colSpan={2} align="right">
                        Sub Total
                      </TableCell>
                      <TableCell align="right">
                        {Thousands_separator(inv.total_amount)}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell colSpan={5} align="right">
                        Grand Total
                      </TableCell>
                      <TableCell align="right">
                        {Thousands_separator(inv.total_amount)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Box mt={2}>
                <Typography variants="body1" style={{ fontWeight: "bold" }}>
                  In Words:{" "}
                  {curencyNumbertoWord(inv ? parseInt(inv.total_amount) : 0)}.
                </Typography>
              </Box>

              <Box mt={7}>
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
                      Customer's Signature
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
                      For-DeliverEase
                    </Typography>
                  </Box>
                </Grid>
              </Box>
            </Box>
          </Grid>
        )}
      </div>
    );
  }
);
export default StockTransferPdf;
