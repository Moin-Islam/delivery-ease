import React, { useState } from 'react';
import GridContainer from 'components/Grid/GridContainer.js';
import Gurd from '../../components/guard/Gurd';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import MaterialTable from 'material-table';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import tableIcons from 'components/table_icon/icon';
import {
  Button,
  CircularProgress,
  Grid,
  LinearProgress,
  MenuItem,
  Paper,
  TextField,
} from '@material-ui/core';
import PaymentPaid from '../../components/admin/payment/PaymentPaid';
import PaymentCollection from 'components/admin/payment/PaymentCollection';
import { useRootStore } from 'models/root-store-provider';
import { baseUrl } from 'const/api';
import useSWR from 'swr';
import axios from 'axios';
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import { useEffect } from 'react';
import CardBody from 'components/Card/CardBody';
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}>
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
}));

const title = 'Payment';
const subject = 'payment';

const TableList = observer(() => {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const { user } = useRootStore();
  const [supplierList, setSupplierList] = useState(null);
  const [selectedSup, setSelectedSup] = useState(null);
  const [totalDue, setTotalDue] = useState(0);
  const [paymentDate, setPaymentDate] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentType, setPaymentType] = useState('Cash');
  const [invoice, setInvoice] = useState(null);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };
  useEffect(() => {
    axios
      .get(`${baseUrl}/party_supplier_list`, {
        headers: { Authorization: 'Bearer ' + user.auth_token },
      })
      .then((res) => setSupplierList(res.data.response.party_suppliers))
      .catch((err) => console.log(err));
    axios
      .get(`${baseUrl}/payment_invoice_no`, {
        headers: { Authorization: 'Bearer ' + user.auth_token },
      })
      .then((res) => setInvoice(res.data.response))
      .catch((err) => console.log(err));
  }, []);
  const fetcher = (url, auth) =>
    axios
      .get(url, {
        headers: { Authorization: 'Bearer ' + auth },
      })
      .then((res) => res.data);

  const url = `${baseUrl}/supplier_due_payment_list`;
  const { data, error, mutate } = useSWR([url, user.auth_token], fetcher);
  const setSupplier = async (e) => {
    setSelectedSup(e.target.value);
    await axios
      .post(
        `${baseUrl}/payment_paid_due_list_by_supplier`,
        { supplier_id: e.target.value },
        {
          headers: { Authorization: 'Bearer ' + user.auth_token },
        }
      )
      .then((res) => {
        if (res.data.total_payment_paid_due_amount == 0) {
          setTotalDue(0);
          alert('Total Due 0');
        } else {
          setTotalDue(res.data.total_payment_paid_due_amount);
        }
      })
      .catch((err) => console.log(err));
  };
  const createPay = async () => {
    await axios
      .post(
        `${baseUrl}/supplier_due_payment_create`,
        {
          supplier_id: selectedSup,
          current_due_amount: totalDue,
          paid_amount: paymentAmount,
          payment_type: paymentType,
          invoice_no: invoice,
          date: paymentDate,
        },
        {
          headers: { Authorization: 'Bearer ' + user.auth_token },
        }
      )
      .then((res) => {
        setSelectedSup(null);
        setTotalDue(0);
        setPaymentAmount(0);
        setPaymentDate(null);
        mutate();
      })
      .catch((err) => console.log(console.log('Something went wrong')));
  };
  const columns = [
    { title: 'Invoice No', field: 'invoice_no' },
    { title: 'Name', field: 'name' },
    {
      title: 'Paid Amount',
      field: 'paid_amount',

    },
    {
      title: 'Due Amount',
      field: 'due_amount',
    
    },
    { title: 'Paid Date', field: 'paid_date' },
    { title: 'Payment Type', field: 'payment_type' },
  ];
  return (
    <Gurd subject={subject}>
      <div className={classes.root} style={{ width: '100%' }}>
        <Grid container direction="row" spacing={1}>
          <Grid item xs={6}>
            <Typography variant="body1">Invoice No.</Typography>
            {invoice ? (
              <Typography variant="h6" color="primary">
                {invoice}
              </Typography>
            ) : (
              <CircularProgress />
            )}
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="standard-select-currency"
              select
              label="Select Supplier"
              margin="dense"
              fullWidth={true}
              variant="outlined"
              value={selectedSup}
              onChange={setSupplier}
              helperText="Please select Supplier">
              {supplierList &&
                supplierList.map((st) => (
                  <MenuItem value={st.id}>{st.name}</MenuItem>
                ))}
            </TextField>
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="standard-select-currency"
              // label="Total Due"
              fullWidth={true}
              variant="outlined"
              margin="dense"
              helperText="Total Due"
              value={totalDue}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="standard-helperText"
           type="tel"
              label="Payment Amount"
              fullWidth={true}
              variant="outlined"
              margin="dense"
              helperText="payment amount"
              onChange={(e) => setPaymentAmount(e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="standard-helperText"
              type="date"
              fullWidth={true}
              variant="outlined"
              margin="dense"
              helperText="Payment Date"
              onChange={(e) => setPaymentDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              name="payment_type"
              label="Payment Type"
              select
              fullWidth
              variant="outlined"
              helperText="Select Payment Type"
              margin="dense"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}>
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Check">Check</MenuItem>
              <MenuItem value="Check">Card</MenuItem>
              <MenuItem value="Bkash">Bkash</MenuItem>
              <MenuItem value="Nogod">Nogod</MenuItem>
              <MenuItem value="Rocket">Rocket</MenuItem>
              <MenuItem value="Upay">Upay</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={1}>
            <Box mt={1}>
              <Button onClick={createPay} variant="contained" color="primary">
                Submit
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Paper>
          <Card>
            <CardHeader color="primary">
              <Grid container spacing={1}>
                <Grid container item xs={6} spacing={3} direction="column">
                  <Box p={1}>
                    <h4 className={classes.cardTitleWhite}>
                      Supplier Payment List
                    </h4>
                  </Box>
                </Grid>
              </Grid>
            </CardHeader>
            <CardBody>
              {!data && (
                <>
                  <Box mb={2}>
                    <Typography variant="h6" color="secondary">
                      {' '}
                      Fetching Supplier payment List.Wait...
                    </Typography>
                  </Box>

                  <LinearProgress color="secondary" />
                </>
              )}
              {data && (
                <MaterialTable
                  icons={tableIcons}
                  title="List"
                  columns={columns}
                  data={data.response}
                  options={{
                    actionsColumnIndex: -1,
                    exportButton: false,
                    grouping: true,
                    search: true,
                   pageSize: 12,
                    pageSizeOptions: [12],
                    padding: 'dense',
                  }}
                />
              )}
            </CardBody>
          </Card>
        </Paper>
        {/* <Paper>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            centered
            aria-label="full width tabs example"
          >
            <Tab label="Payment Paid" {...a11yProps(0)} />
            <Tab label="Payment Collection" {...a11yProps(1)} />
          </Tabs>
        </Paper>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <PaymentPaid />
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <PaymentCollection />
          </TabPanel>
        </SwipeableViews> */}
      </div>
    </Gurd>
  );
});

export default TableList;
