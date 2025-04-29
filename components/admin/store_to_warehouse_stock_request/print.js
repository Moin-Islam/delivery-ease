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

const DetailsPrint = React.forwardRef(({ prods }, ref) => {
  const classes = useStyles();
  const [date, setDate] = useState([1, 2, 3]);
  const [time, setTime] = useState([1, 2]);

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
    <div ref={ref} style={{ margin: "10px" }}>
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
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Typography variant="h6" color="primary" align="center">
                Stock Request Product List
              </Typography>

              <Typography color="primary" align="center">
                Date: {datePrint()}
              </Typography>
            </Grid>
          </Box>
          <Box item xs={12} p={5}>
            <TableContainer >
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
                            <TableCell align="right">{row.qty}</TableCell>
                            <TableCell align="right">
                              {row.product_unit_name}
                            </TableCell>

                            <TableCell align="right">{row.price}</TableCell>
                            <TableCell align="right">{row.sub_total}</TableCell>
                          </TableRow>
                        ))}





                        
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

                          <TableCell align="right">
                            <Skeleton variant="rect" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box p={5} mt={5}>
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
});
export default DetailsPrint;
