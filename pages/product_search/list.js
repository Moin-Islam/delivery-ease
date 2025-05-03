import React from 'react';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';
import Gurd from '../../components/guard/Gurd';
import axios from 'axios';
import { useRootStore } from '../../models/root-store-provider';
import { observer } from 'mobx-react-lite';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Box, Grid, LinearProgress, TextField } from '@material-ui/core';
import { baseUrl } from '../../const/api';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
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
      color: "#000000",
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

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

// const title = 'SearchList';
const subject = 'product_search';
// const endpoint = {
//   list: 'date_wise_vats_report',
// };

const TableList = observer(() => {
  const classes = useStyles();
  const { user } = useRootStore();
  const [stotoreData, setStoreData] = useState([]);
  const [warehouseData, setWarehouseData] = useState([]);
  const [openWarning, setOpenWarning] = useState(false);
  const [name, setName] = useState(null);
  const [barcode, setBarcode] = useState(null);
  const [item_code, setItemCode] = useState(null);
  const [load, setLoad] = useState(false);
  const [result1, setResult1] = useState(false);
  const [result2, setResult2] = useState(false);


  console.log(stotoreData,warehouseData )
  const handleCloseWarning = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenWarning(false);
  };

  const findResult = (bodyData) => {
    setLoad(true);
    axios
      .post(
        `${baseUrl}/universal_search_store_current_product_stock`,
        bodyData,
        {
          headers: { Authorization: 'Bearer ' + user.auth_token },
        }
      )
      .then((res) => {
        setStoreData(res.data?.response?.store_stock_details)
        setWarehouseData(res.data?.response?.warehouse_stock_details)
        setLoad(false);
        setResult1(true)
        setResult2(true)
      })
      .catch((error) => {
        console.log(error);
        setStoreData(null)
        setWarehouseData(null)
        setLoad(false);
        setResult1(false)
        setResult2(false)
      });
  };

  return (
    <Gurd subject={subject}>

      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Grid container spacing={1}>
           

          <Grid item xs={3}>
              <Box>
                <TextField
                  id="standard-helperText"
                  type="text"
                  fullWidth={true}
                  variant="outlined"
                  placeholder="Enter product name"
                
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box>
                <TextField
                  id="standard-helperText"
                  type="text"
                  fullWidth={true}
                  variant="outlined"
                  placeholder="Enter barcode"
              
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                />
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box>
                <TextField
              
                  id="standard-helperText"
                  type="text"
                  fullWidth={true}
                  variant="outlined"
                  placeholder="Enter item code"
        
                  value={item_code}
                  onChange={(e) => setItemCode(e.target.value)}
                />
              </Box>
            </Grid>

            <Grid item xs={3}>
              <Button
                style={{marginTop:"8px"}}
                variant="contained"
                color="primary"
                fullWidth={true}
                onClick={() =>
                  findResult({
                    name,
                    barcode,
                    item_code,
                  })
                }
              >
                Search
              </Button>
            </Grid>



          </Grid>

          
          {!load ? (
            <Card>
              <CardHeader color="primary">
                <Grid container spacing={1}>
                  <Grid container item xs={6} spacing={3} direction="column">
                    <Box p={2}>
                      <h4 className={classes.cardTitleWhite}>Result</h4>
                     
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

              <CardBody>

                {/* {!warehouseData.length  && result1 ("Warehouse Product Not Found")} */}
              {!!warehouseData.length && (
  <div >
    <TableContainer >
    <Table  aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Warehouse name</TableCell>
          <TableCell >Product Name</TableCell>
          <TableCell>Price</TableCell>
          <TableCell >Current Stock</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
       
      {
          warehouseData.map((warehouseItem)=> (
            <TableRow >
            <TableCell component="th" scope="row">
            {warehouseItem?.warehouse_name}
            </TableCell>
            <TableCell >  
            {warehouseItem?.product_name}
      
            </TableCell>
            <TableCell >  
            {warehouseItem?.price}
            </TableCell>
          
            <TableCell >  
            {warehouseItem?.current_stock}
            </TableCell>
          </TableRow>
          ))
        }
  
      </TableBody>
    </Table>
  </TableContainer>
</div>
 )}


{/* {!stotoreData.length  && result2 ("Store Product Not Found")} */}
 {!!stotoreData.length && (
    <TableContainer style={{marginTop:'20px'}}>
    <Table  aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Store name</TableCell>
          <TableCell >Product Name</TableCell>
          <TableCell>Price</TableCell>
          <TableCell >Current Stock</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>

        {
          stotoreData.map((storeItem)=> (
            <TableRow >
            <TableCell component="th" scope="row">
            {storeItem?.store_name}
            </TableCell>
            <TableCell >  
            {storeItem?.product_name}
      
            </TableCell>
            <TableCell >  
            {storeItem?.price}
            </TableCell>
          
            <TableCell >  
            {storeItem?.current_stock}
            </TableCell>
          </TableRow>
          ))
        }
       
       
  
      </TableBody>
    </Table>
  </TableContainer>

 )}




                
              </CardBody>
            </Card>
          ) : (
            <LinearProgress />
          )}
       
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
