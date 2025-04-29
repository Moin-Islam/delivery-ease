import { Box, Button, Divider, Grid, Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import InvoiceHeader from 'components/header/InvoiceHeader';
import { curencyNumbertoWord } from 'helper/currenctConvert';

const useStyles = makeStyles({
  table: {
    '& .MuiTableCell-root': {
      border: '1px solid black',
    },
  },
});

const InvoicePosPurchase = React.forwardRef(
  ({ prods, total, store_name, store_add, store_phone, from, to }, ref) => {
    const classes = useStyles();
    const [tk, setTk] = useState('');
    const [date, setDate] = useState([1, 2, 3]);
    const [time, setTime] = useState([1, 2]);
    useEffect(() => {
      const tk = curencyNumbertoWord(parseInt(total));
      setTk(tk);
      // var date = inv ? inv.sale_date.split('-') : [1, 2, 3];
      // setDate(date);
      // var time = inv ? inv.sale_date_time.split(' ') : [1, 2];
      // setTime(time);
    }, [total]);
    return (
      <div ref={ref}>
        {prods && (
          <>
            <Box mt={1}>
              <InvoiceHeader />
            </Box>
            {/* <Box mt={3}>
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="center">
                <Box>
                  <img
                    src="/logo.png"
                    alt=""
                  />
                </Box>
                <Box>
                  <Typography variant="body1" align="center">
                    6, Kalabagan Bus Stand (1st Floor)
                  </Typography>
                  <Typography variant="body1" align="center">
                    support@boibichitra.com
                  </Typography>
                  <Typography variant="body1" align="center">
                    Hotline: +8801902890188
                  </Typography>
                </Box>
              </Grid>
            </Box> */}
            <Box mt={2} mb={2}>
              <Divider />
              <Divider />
            </Box>
            <Box mb={2}>
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="center">
                <Typography variant="h6" color="primary" align="center">
                  POS Sale Report
                </Typography>
                <Typography
                  variant="body1"
                  style={{ fontWeight: 'bold' }}
                  color="primary"
                  align="center">
                  Form {from} to {to}
                </Typography>
                <Typography
                  variant="body1"
                  style={{ fontWeight: 'bold' }}
                  color="primary"
                  align="center">
                  {store_name}
                </Typography>
                <Typography variant="body1" color="primary" align="center">
                  {store_add}
                </Typography>
                <Typography variant="body1" color="primary" align="center">
                  {store_phone}
                </Typography>
              </Grid>
            </Box>
            <Box item xs={12}>
              <TableContainer component={Paper}>
                <Table
                  className={classes.table}
                  aria-label="simple table"
                  size="small">
                  <TableHead>
                    <TableRow>
                      {/* <TableCell align="right">Warehouse Name</TableCell> */}
                      <TableCell align="center">Date</TableCell>
                      <TableCell align="center">Invoice No</TableCell>
                      <TableCell align="center">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!false ? (
                      <>
                        {true &&
                          prods.map((row, index) => (
                            <TableRow key={row.id}>
                              <TableCell align="center">
                                {row.sale_date}
                              </TableCell>
                              <TableCell align="center">
                                {row.invoice_no}
                              </TableCell>
                              <TableCell align="center">
                                {row.total_amount}
                              </TableCell>
                            </TableRow>
                          ))}
                        <Divider />
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            style={{ fontWeight: 'bold' }}
                            align="center">
                            Total 
                          </TableCell>
                          <TableCell
                            style={{ fontWeight: 'bold' }}
                            align="center">
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
              </TableContainer>
            </Box>

            <Box px={5} mt={2}>
              <Typography variants="body1" style={{ fontWeight: 'bold' }}>
                In Words: {tk}.
              </Typography>
            </Box>
            <Box p={5} mt={5}>
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center">
                <Box
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                  <Typography
                    variant="body1"
                    align="left"
                    style={{
                      borderTop: '2px solid black',
                    }}>
                    Checked/Recommended by
                  </Typography>
                </Box>
                <Box
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                  <Typography
                    variant="body1"
                    align="left"
                    style={{
                      borderTop: '2px solid black',
                    }}>
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
