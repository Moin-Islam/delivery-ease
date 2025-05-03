import React from "react"; 
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import GridContainer from 'components/Grid/GridContainer.js';
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Gurd from "../../components/guard/Gurd";
import axios from "axios";
import { useRootStore } from "../../models/root-store-provider";
import Button from "@material-ui/core/Button";
import Menu from '@material-ui/core/Menu';
import cogoToast from 'cogo-toast';
import MenuItem from '@material-ui/core/MenuItem';
import { Box, Chip, Grid, TextField} from "@material-ui/core";
import { baseUrl, webUrl } from "../../const/api";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
// import LinearProgress from '@material-ui/core/LinearProgress';
import exportFromJSON from 'export-from-json'  
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
} 
const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#000000",
    },
  },
  cardTitleWhite: {
    color: "#000000",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

const useStyles = makeStyles(styles);

const title = "Product";
const subject = "product";
const endpoint = {
  list: "product_list_with_search",
  create: "product_create",
  edit: "product_edit",
  delete: "product_delete",
};

const ExportReport = () => {
  const classes = useStyles();
  const tableRef = React.createRef();
  const { user } = useRootStore();
  const [isloading, setLoading] = useState(false);
  const [openWarning, setOpenWarning] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [exportData, setExportData] = useState([]);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [fetchType, setType] = useState(null);
  const [notFound, setNotfound] = useState(false);
  const typeArray = ['Product', 'Product Purchase', 'Product Sale']

  const handleClickWarning = () => {
    setOpenWarning(true);
  };
  const handleCloseWarning = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenWarning(false);
  };

  const fileName = fetchType  



  const handleExportMenuOpen = (event,typ) => {

    if(!from){
    return  cogoToast.warn('Please Select From Date',{position: 'top-right', bar:{size: '10px'}}); 
    }

    if(!to){
      return  cogoToast.warn('Please Select To Date',{position: 'top-right', bar:{size: '10px'}}); 
    }
    setAnchorEl(event.currentTarget);
    setType(typ)
  };

  const handleExportMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExport = async(exportType) => {
    cogoToast.loading('Loading',{position: 'top-right', bar:{size: '10px'}});
    setLoading(true)
    setNotfound(false)
    try {
      const exportDataResult = await axios.post(
        `${baseUrl}/xls_export_by_date_difference_type`,
        {
          type: fetchType,
          to_date:to,
          from_date: from,
        },
        {
          headers: { Authorization: "Bearer " + user.auth_token },
        }
      );



      if(exportDataResult?.data?.data.length){

        console.log('everything oky')
        const data = exportDataResult.data.data;
          //   const data = exportData.map((item)=>( {
    //     'Product Name': item.product_name,
    //     'Arabic Name' : item.arabic_name,
    //     'Category Name': item.category_name,
    //     'Unit Name': item.unit_name,
    //     'Barcode': item.barcode,
    //     'Item Code': item.item_code,
    //     'Self No': item.self_no,
    //     'Low Inventory Alert': item.low_inventory_alert,
    //     'Purchase Price': item.purchase_price,
    //     'Selling Price': item.selling_price,
    //     'Specification': item.specification,
    //     'Barcode': item.selling_price,
    //     'Date': item.date,

    //   }));
    //
    exportFromJSON({data , fileName, exportType }) 

      }else{
        cogoToast.info('Data Not Found',{position: 'top-right', bar:{size: '10px'}}); 
      }

      cogoToast.success('Download Success',{position: 'top-right', bar:{size: '10px'}}); 
       handleExportMenuClose()

    } catch (error) {
      console.log(error)
      cogoToast.error('Something went wrong',{position: 'top-right', bar:{size: '10px'}}); 
     
    }

  }


  return (
    // <Gurd subject={subject}>
<div>
      <GridContainer>

      <GridItem xs={12} sm={12} md={12}>

          <Card>
            <CardHeader color="primary">
              <Grid container spacing={1}>
                <Grid container item xs={6} spacing={3} direction="column">
                  <Box p={2}>
                    <h4 className={classes.cardTitleWhite}>Export</h4>
                    
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
                  >
                   

                    {/* <Button style={{marginLeft:"8px"}} onClick={handleExportMenuOpen}>
                          Export
                    </Button> */}
                  </Grid>
              </Grid>
            </CardHeader>
            <CardBody>

            <Grid container spacing={3}>
            {/* <Grid item xs={12} sm={12}>
              {
                isloading ? <LinearProgress/> : null
              }
              
              </Grid> */}
              {/* <Grid item xs={12} sm={12} textAlign="center">
              {
                notFound ? <span style={{textAlign:"center",color:"red"}}>Data not found</span> : null
              }
              
              </Grid> */}

              


              <Grid item xs={12} sm={12}>
              <Grid
                    container
                    
                    spacing={2}
                    direction="row"
                  
                  >
 <Grid item  xs={1}>
   </Grid>
<Grid item xs={5}>
              <Box>
                <TextField
                size="small"
                  id="standard-helperText"
                  type="date"
                  fullWidth={true}
                  variant="outlined"
                  helperText="Form"
                  onChange={(e) => setFrom(e.target.value)}
                />
              </Box>
            </Grid>
            <Grid item xs={5}>
              <Box>
                <TextField
                 size="small"
                  id="standard-helperText"
                  type="date"
                  fullWidth={true}
                  variant="outlined"
                  helperText="To"
                  onChange={(e) => setTo(e.target.value)}
                />
              </Box>
            </Grid>


<Grid item  xs={1}>
   </Grid>
                    </Grid>
              
                    
              </Grid>

         {
typeArray.map((item)=>(
         <Grid item xs={6} sm={3}>
             <Button  variant="contained" color="secondary" onClick={(e)=>handleExportMenuOpen(e,item)}>
              {item}
             </Button>
        </Grid>

  ))

         }
           



      </Grid>

                 

              </CardBody>
              </Card>
           </GridItem >
        
        </GridContainer>


      <Snackbar
        open={openWarning}
        autoHideDuration={2000}
        onClose={handleCloseWarning}
      > 
        <Alert onClose={handleCloseWarning} severity="warning">
          You dont't have permission!
        </Alert>
      </Snackbar>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleExportMenuClose}
      >
        <MenuItem value="xls"  onClick={(e)=>handleExport('xls')}>XLS</MenuItem>
        <MenuItem value="csv"  onClick={(e)=>handleExport('csv')}>CSV</MenuItem>

        
      </Menu>
  
      </div>

  );
};

export default ExportReport;
