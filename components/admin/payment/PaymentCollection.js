import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import { baseUrl, webUrl } from "const/api";
import ClearIcon from "@material-ui/icons/Clear";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import { useAsyncEffect } from "use-async-effect";
import Paginate from "components/paginate/Paginate";
import Skeleton from "@material-ui/lab/Skeleton";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import { useRootStore } from "models/root-store-provider";
import { observer } from "mobx-react-lite";
import { Box, Button, Grid, TextField } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import PaymentCollectionCalculation from "./PaymentCollectionCalculation";
import Autocomplete from "@material-ui/lab/Autocomplete";
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const PaymentCollection = observer(() => {
  const classes = useStyles();
  const { user } = useRootStore();
  const [prods, setProds] = React.useState(null);
  const [products, setProducts] = React.useState(null);
  const [load, setLoad] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [dataFilter, setDataFilter] = React.useState(null);
  const [customer, setCustomer] = React.useState(null);
  const [barcode, setBarcode] = React.useState(null);
  const [itemcode, setItemcode] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [currentData, setCurrentData] = React.useState(null);

  const handleClickOpenModal = (row) => {
    setOpenModal(true);
    setCurrentData(row);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  useAsyncEffect(async (isMounted) => {
    await paginateInvoice();
    await getCustomer();
  }, []);
  const getCustomer = async () => {
    //setLoading(true);
    await axios
      .all([
        axios.get(`${baseUrl}/customer_list`, {
          headers: { Authorization: "Bearer " + user.auth_token },
        }),
      ])
      .then(
        axios.spread((...responses) => {
          // if (!isMounted()) return;
          const responsethree = responses[0];
          setCustomer(responsethree.data.response.customer_lists);
        })
      )
      .catch((errors) => {
        console.error(errors);
      });
  };
  const paginateInvoice = async (pageNumber = 1) => {
    setLoading(true);
    await axios
      .all([
        axios.get(`${baseUrl}/payment_collection_due_list?page=${pageNumber}`, {
          headers: { Authorization: "Bearer " + user.auth_token },
        }),
      ])
      .then(
        axios.spread((...responses) => {
          // if (!isMounted()) return;
          const responsethree = responses[0];
          console.log(
            responsethree.data.response.payment_collection_due_list.data
          );
          setProducts(
            responsethree.data.response.payment_collection_due_list.data
          );
          setProds(
            responsethree.data.response.payment_collection_due_list.data
          );
          setData(responsethree.data.response.payment_collection_due_list);
          setDataFilter(
            responsethree.data.response.payment_collection_due_list
          );
          setLoad(true);
          setLoading(false);
        })
      )
      .catch((errors) => {
        console.error(errors);
        setLoad(false);
      });
  };

  const filterByCustomer = (cus_id) => {
    console.log(cus_id);
    if (cus_id == null) {
      clearInput();
    } else {
      axios
        .all([
          axios.post(
            `${baseUrl}/payment_collection_due_list_by_customer?page=1`,
            {
              customer_id: cus_id.id,
            },
            {
              headers: { Authorization: "Bearer " + user.auth_token },
            }
          ),
        ])
        .then(
          axios.spread((...responses) => {
            const responsethree = responses[0];
            setProds(
              responsethree.data.response.payment_collection_due_list.data
            );
            setDataFilter(
              responsethree.data.response.payment_collection_due_list
            );
            setLoad(true);
            setLoading(false);
          })
        )
        .catch((errors) => {
          console.error(errors);
          setLoad(false);
        });
    }
  };
  const clearInput = () => {
    setProds(products);
    setDataFilter(data);
  };

  return (
    <>
      <Grid container item xs={12} justify="flex-end">
        <Box mb={3}>
          <Autocomplete
            id="combo-box-demo"
            options={customer}
            getOptionLabel={(option) => option.name}
            style={{ width: 400 }}
            onChange={(event, newInputValue) => {
              filterByCustomer(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search by Customer"
                variant="outlined"
              />
            )}
          />
        </Box>
      </Grid>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Invoice</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Paid</TableCell>
              <TableCell align="right">Due</TableCell>
              <TableCell align="right">Purchase Date</TableCell>
              <TableCell align="right">Customer</TableCell>
              <TableCell align="right">Store</TableCell>
              <TableCell align="center">Pay</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading ? (
              <>
                {load &&
                  prods.map((row) => (
                    <TableRow key={row.invoice_no}>
                      <TableCell component="th" scope="row">
                        {row.invoice_no}
                      </TableCell>
                      <TableCell align="right"> {row.total_amount}</TableCell>
                      <TableCell align="right">{row.paid_amount}</TableCell>
                      <TableCell align="right"> {row.due_amount}</TableCell>
                      <TableCell align="right">{row.sale_date_time}</TableCell>
                      <TableCell align="right">{row.customer_name}</TableCell>
                      <TableCell align="right">{row.store_name}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleClickOpenModal(row)}
                        >
                          Pay Now
                        </Button>
                      </TableCell>
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
        <Grid container justify="center">
          {load && <Paginate data={dataFilter} getProduct={paginateInvoice} />}
        </Grid>
      </TableContainer>
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Payment Process</DialogTitle>
        <DialogContent>
          <PaymentCollectionCalculation
            data={currentData}
            token={user.auth_token}
            modal={handleCloseModal}
            listUpdate={paginateInvoice}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default PaymentCollection;
