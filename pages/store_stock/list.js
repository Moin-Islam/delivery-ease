import React from 'react';
import { useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import tableIcons from 'components/table_icon/icon';
import GridItem from 'components/Grid/GridItem.js';
import { useAsyncEffect } from "use-async-effect";
import GridContainer from 'components/Grid/GridContainer.js';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';
import Gurd from '../../components/guard/Gurd';
import RefreshIcon from '@material-ui/icons/Refresh';
import axios from 'axios';
import { useRootStore } from '../../models/root-store-provider';
import { observer } from 'mobx-react-lite';
import MaterialTable from 'material-table';
import Typography from '@material-ui/core/Typography';
import { Box, Grid, TextField } from '@material-ui/core';
import useSWR from 'swr';
import { baseUrl } from '../../const/api';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import dummyData from '../../utils/dummyData'; // Import dummyData for store_current_stock_list

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
      color: '#FFFFFF',
    },
  },
  cardTitleWhite: {
    color: '#FFFFFF',
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

const title = 'Store Stock';
const subject = 'store_stock';
const endpoint = {
  list: 'store_current_stock_list_pagination',
};

const TableList = observer(() => {
  const classes = useStyles();
  const tableRef = React.createRef();

  const handleRefress = () => {
    tableRef.current && tableRef.current.onQueryChange();
  };

  const { user } = useRootStore();

  const [load, setLoad] = useState(false);
  const [storeList, setStoreList] = useState([]);
  const [warehouseList, setWarehouseList] = useState([]);

  const [storeId, setStoreId] = useState(null);
  const [wareHouseId, setWarehouseId] = useState(null);

  const [openWarning, setOpenWarning] = useState(false);

  const handleCloseWarning = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenWarning(false);
  };

  const { warehouse_id, role } = user?.details || {};

  React.useEffect(() => {
    if (warehouse_id && role === 'warehouse admin') {
      setWarehouseId(warehouse_id);
    }
  }, []);

  useAsyncEffect(async (isMounted) => {
    const requestOne = axios.get(`${baseUrl}/store_list_active`, {
      headers: { Authorization: "Bearer " + user?.details?.token },
    });
    const requestTwo = axios.get(`${baseUrl}/warehouse_list_active`, {
      headers: { Authorization: "Bearer " + user?.details?.token },
    });
    await axios
      .all([requestOne, requestTwo])
      .then(
        axios.spread((...responses) => {
          if (!isMounted()) return;
          const responseOneB = responses[0];
          const responseTwoU = responses[1];

          setStoreList(responseOneB?.data?.response?.stores);
          setWarehouseList(responseTwoU?.data?.response?.warehouses);
          setLoad(true);
        })
      )
      .catch((errors) => {
        console.error(errors);
        setLoad(false);
      });
  }, []);

  const columns = [
    {
      title: 'Name',
      field: 'product_name',
      render: (rowData) => (
        <Typography variant="subtitle2" style={{ width: '250px' }}>
          {rowData.product_name}
        </Typography>
      ),
    },
    { title: 'Current Stock', field: 'current_stock' },
    { title: 'Purchase Price', field: 'purchase_price' },
    {
      title: 'MRP',
      field: '',
      render: (rowData) => rowData.current_stock * rowData.purchase_price,
    },
    { title: 'Barcode', field: 'barcode' },
    { title: 'Store', field: 'store_name' },
  ];

  const handleStoreWiseSearch = (s) => {
    if (s) {
      setStoreId(s.id);
      handleRefress();
    }
  };

  const handleWarehouseWiseSearch = (s) => {
    if (s) {
      setWarehouseId(s.id);
      handleRefress();
    }
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
                  alignItems="center"
                ></Grid>
              </Grid>
            </CardHeader>

            <Grid container spacing={3}>
              <Grid item xs={6}>
                {load && (
                  <Autocomplete
                    id="combo-box-demo"
                    onChange={(e, v) => handleStoreWiseSearch(v)}
                    options={storeList}
                    getOptionLabel={(option) => option.store_name}
                    style={{ padding: '20px' }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Store"
                        variant="outlined"
                      />
                    )}
                  />
                )}
              </Grid>
              <Grid item xs={6}>
                {load && (
                  <Autocomplete
                    id="combo-box-demo"
                    onChange={(e, v) => handleWarehouseWiseSearch(v)}
                    options={warehouseList}
                    disabled={warehouse_id && role === 'warehouse admin'}
                    getOptionLabel={(option) => option.name}
                    style={{ padding: '20px' }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Warehouse"
                        variant="outlined"
                      />
                    )}
                  />
                )}
              </Grid>
            </Grid>

            <CardBody>
              <MaterialTable
                icons={tableIcons}
                title="Store Stock List"
                tableRef={tableRef}
                columns={columns}
                data={(query) =>
                  new Promise((resolve, reject) => {
                    const filteredData = dummyData.store_current_stock_list.filter(item => {
                      if (query.search) {
                        return (
                          item.product_name.toLowerCase().includes(query.search.toLowerCase()) ||
                          item.barcode.toLowerCase().includes(query.search.toLowerCase()) ||
                          item.store_name.toLowerCase().includes(query.search.toLowerCase())
                        );
                      }
                      return true;
                    });

                    const pageData = filteredData.slice(
                      query.page * query.pageSize,
                      (query.page + 1) * query.pageSize
                    );

                    resolve({
                      data: pageData,
                      page: query.page,
                      totalCount: filteredData.length,
                    });
                  })
                }
                actions={[
                  {
                    icon: RefreshIcon,
                    tooltip: 'Refresh Data',
                    isFreeAction: true,
                    onClick: () => handleRefress(),
                  },
                ]}
                options={{
                  actionsColumnIndex: -1,
                  pageSize: 12,
                  pageSizeOptions: [12],
                  padding: 'dense',
                }}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <Snackbar
        open={openWarning}
        autoHideDuration={2000}
        onClose={handleCloseWarning}
      >
        <Alert onClose={handleCloseWarning} severity="warning">
          You don't have permission!
        </Alert>
      </Snackbar>
    </Gurd>
  );
});

export default TableList;
