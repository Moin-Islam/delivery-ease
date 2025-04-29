import React from 'react';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import tableIcons from 'components/table_icon/icon';
import GridItem from 'components/Grid/GridItem.js';
import Autocomplete from '@material-ui/lab/Autocomplete';
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
import { Box, Grid, TextField} from '@material-ui/core';
import useSWR from 'swr';
import { baseUrl } from '../../const/api';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Separator from '../../helper/thousands_separator';


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

const title = 'Warehouse Stock';
const subject = 'warehouse_stock';
const endpoint = {
  list: 'warehouse_current_stock_list_pagination_two_with_search',
  // create: 'store_stock_create',
  // edit: 'store_stock_edit',
  // delete: 'store_stock_delete',
};

const TableList = observer(() => {
  const classes = useStyles();
  const tableRef = React.createRef();
  const handleRefress =()=>{
    tableRef.current && tableRef.current.onQueryChange()
  }


  const { user } = useRootStore();

   const {warehouse_id, role} = user.details || {}

  const [warehouseId, setWarehouseId] = useState(null);
  const [openWarning, setOpenWarning] = useState(false);
  const handleClickWarning = () => {
    setOpenWarning(true);
  };
  const handleCloseWarning = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenWarning(false);
  };



  const fetcher = (url, auth) =>
    axios
      .get(url, {
        headers: { Authorization: 'Bearer ' + auth },
      })
      .then((res) => res.data);

  const url = `${baseUrl}/warehouse_list_active`;
  const { data, error, mutate } = useSWR([url, user.auth_token], fetcher);

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
      render: (rowData) =>Separator(rowData.current_stock * rowData.purchase_price),
    },
    { title: 'Barcode', field: 'barcode' },
    {
      title: 'Warehouse',
      field: 'warehouse_name',
    },
  ];

  const handleWarehouseWiseSearch = (s) => {
    if(s){
      setWarehouseId(s.id)
      handleRefress()
      
    }
           
}

React.useEffect(() => {
  if(warehouse_id && role=='warehouse admin'){
  setWarehouseId(warehouse_id)
}

}, [])


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
          
                </Grid>
              </Grid>
            </CardHeader>

            {
              data && (
                <Autocomplete
                id="combo-box-demo"
                value={warehouseId}
                onChange={(e, v) => handleWarehouseWiseSearch(v)}
                options={data.response.warehouses}
                getOptionLabel={(option) => option.name}
                style={{padding:"15px"}}
                disabled={warehouse_id && role=='warehouse admin' ? true : false}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Warehouse"
                    variant="outlined"
                  />
                )}
              />
      
              )
            }



            <CardBody>
    {
      warehouseId &&  (
        <MaterialTable
        icons={tableIcons}
        title="Warehouse Stock List"
        tableRef={tableRef}
        columns={columns}
         

        data={query =>
          new Promise((resolve, reject) => {
           
            let url = `${baseUrl}/${endpoint.list}?`

            let data = new FormData();
            data.append( "warehouse_id", JSON.stringify(warehouseId) );
            const requestOptions = {
              method: 'POST',
              
              headers: { 
                Authorization: 'Bearer ' + user.auth_token
              },
               body: data 
          };
      
            if (query.search) {
              url += `search=${query.search}`
            }
          
            url += `&page=${query.page + 1}`
            fetch(url,requestOptions).then(resp => resp.json()).then(resp => {
              console.log(resp)
              resolve({
                  data: resp?.response?.warehouse_current_stock_list?.data,
                  page: resp?.response?.warehouse_current_stock_list?.current_page - 1,
                  totalCount: resp?.response?.warehouse_current_stock_list?.total,
              });
            })

          })
        }

  
   
        actions={[
          {
            icon: RefreshIcon,
            tooltip: 'Refresh Data',
            isFreeAction: true,
            onClick: () => handleRefress(),
          }
        ]}
        options={{
          actionsColumnIndex: -1,

          pageSize: 12,
          pageSizeOptions:[12],

          padding: 'dense',
        }}
      />

      )
    }
             

            </CardBody>
          </Card>

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
