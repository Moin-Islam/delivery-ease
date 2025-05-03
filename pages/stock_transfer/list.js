import React from 'react';
import { useState } from 'react';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import tableIcons from 'components/table_icon/icon';
// core components
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';
import Gurd from '../../components/guard/Gurd';
import { useAsyncEffect } from 'use-async-effect';
import axios from 'axios';
import { useRootStore } from '../../models/root-store-provider';
import { observer } from 'mobx-react-lite';
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { Box, Chip, CircularProgress, Grid } from '@material-ui/core';
import useSWR from 'swr';
import { Swrloader } from '../../components/loader/Swrloader';
import { baseUrl } from '../../const/api';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Create from 'components/admin/warehouse_stock_transfer/create';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const styles = {
  cardCategoryWhite: {
    '&,& a,& a:hover,& a:focus': {
      color: 'rgba(255,255,255,.62)',
      margin: '0',
      fontSize: '14px',
      marginTop: '0',
      marginBottom: '0',
    },
    '& a,& a:hover,& a:focus': {
      ccolor: "#000000",
    },
  },
  cardTitleWhite: {
    color: "#000000",
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
    '& small': {
      color: '#777',
      fontSize: '65%',
      fontWeight: '400',
      lineHeight: '1',
    },
  },
};

const useStyles = makeStyles(styles);
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const title = 'Warehouse Stock';
const subject = 'warehouse_stock_transfer';
const endpoint = {
  list: 'warehouse_current_stock_list',
  create: 'warehouse_to_store_stock_create',
  edit: 'warehouse_stock_edit',
  delete: 'warehouse_stock_delete',
};

const TableList = observer(() => {
  const classes = useStyles();
  const { user } = useRootStore();
  const [warehouse, setWarehouse] = useState(null);

  const [stockListType, setStockListType] = useState('waretostore');

  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [stocks, setStocks] = useState(null);
  const [openWarning, setOpenWarning] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleClickWarning = () => {
    setOpenWarning(true);
  };
  const handleCloseWarning = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenWarning(false);
  };

  const handleClickOpenCreate = () => {
    setOpenCreateModal(true);
  };
  const handleCloseCreate = () => {
    setOpenCreateModal(false);
  };
 
  const fetchWarehouseStockList = async() => {
    try {
      setLoader(true)
      setStocks(null);
      const url = `${baseUrl}/warehouse_list`;
       const warehouseList = await axios.get(url, {
                  headers: { Authorization: 'Bearer ' + user.auth_token  },
                })

        const res = await  axios.post(
        `${baseUrl}/warehouse_current_stock_list`,
        {
          warehouse_id: warehouseList.data.response.warehouses[0],
        },
        {
          headers: { Authorization: 'Bearer ' + user.auth_token },
              }
      )
      console.log(res)
        setLoader(false);
        setStocks(res.data.response.warehouse_current_stock_list);
      
    } catch (error) {
      console.log(error)
      setStocks(null);
      
    }

  }



  const columns = [
    { title: 'Product Name', field: 'product_name' },
    { title: 'Unit', field: 'product_unit_name' },
    { title: 'Brand', field: 'product_brand_name' },
    { title: 'Current Stock', field: 'current_stock' },
  ];






  const handleCreate = () => {
    if (!user.can('create', subject)) {
      setOpenWarning(true);
      return null;
    }
    handleClickOpenCreate(true);
  };
  return (
    <Gurd subject={subject}>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <Grid container spacing={1}>
                <Grid container item xs={6} spacing={3} direction="column">
                  <Box p={2}>
                    <h4 className={classes.cardTitleWhite}>{title} List</h4>

                  </Box>
                </Grid>
                <Grid
                  container
                  item
                  xs={6}
                  spacing={3}
                  direction="row"
                  justify="flex-end"
                  alignItems="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreate}>
                    Transfer Stock
                  </Button>
                </Grid>
              </Grid>
            </CardHeader>

            <FormControl
              variant="filled"
              className={classes.formControl}
              style={{ margin: '10px 15px' }}>
              <InputLabel id="demo-simple-select-filled-label">
                Warehouse
              </InputLabel>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                value={stockListType}
                onChange={(e)=>{
                  setStockListType(e.target.value)
                }}
                // onChange={fetchStock}
                >

                    <MenuItem  value="waretostore" 
                    onClick={()=>{
                      fetchWarehouseStockList()
                    }}
                    >
                      Stock Transfer(W-S)
                    </MenuItem>
                    <MenuItem  value="stocktransferlist">
                      Stock Transfer List
                    </MenuItem>
              </Select>
            </FormControl>

            {loader && (
              <Grid container direction="row" justify="center">
                <Box mt={3}>
                  <CircularProgress />
                </Box>
              </Grid>
            )}
            <CardBody>


              
              {stocks ? (
                <MaterialTable
                  icons={tableIcons}
                  title="List"
                  columns={columns}
                  data={stocks}
                  options={{
                    actionsColumnIndex: -1,
                    // exportButton: false,
                    // grouping: true,
                    search: true,
                   pageSize: 12,
                    pageSizeOptions: [12],
                    padding: 'dense',
                  }}
                />
              ) : (
           
                !loader && (
                  <Typography variant="h6" color="secondary">
                    Nothing Found
                  </Typography>
                )
              )}



            </CardBody>
          </Card>
          <Dialog
            fullScreen
            open={openCreateModal}
            onClose={handleCloseCreate}
            TransitionComponent={Transition}>
            <AppBar style={{ position: 'relative' }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleCloseCreate}
                  aria-label="close">
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" style={{ flex: 1 }}>
                  Transfer Stock
                </Typography>
              </Toolbar>
            </AppBar>
            <Create
              token={user.auth_token}
              modal={setOpenCreateModal}
              endpoint={endpoint.create}
              //  mutate={mutate}
            />
          </Dialog>
        </GridItem>
      </GridContainer>
      <Snackbar
        open={openWarning}
        autoHideDuration={2000}
        onClose={handleCloseWarning}>
        <Alert onClose={handleCloseWarning} severity="warning">
          You dont't have permission!
        </Alert>
      </Snackbar>
    </Gurd>
  );
});

export default TableList;
