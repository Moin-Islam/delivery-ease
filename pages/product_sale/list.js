import React, { useEffect } from "react";
import { useState } from "react"; 
import tableIcons from "components/table_icon/icon";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import MaterialTable from "material-table";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import Gurd from "../../components/guard/Gurd";
import axios from "axios";
import { useRootStore } from "../../models/root-store-provider";
import { observer } from "mobx-react-lite";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import Link from "next/link";

import {
  Box,
  Grid,
} from "@material-ui/core";
import { baseUrl } from "../../const/api";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import RefreshIcon from "@material-ui/icons/Refresh";
// import Edit from "../../components/admin/product_pos_sale/edit";
import Create from "../../components/admin/product_pos_sale/create";
import Details from "../../components/admin/product_pos_sale/details";
import { useReactToPrint } from "react-to-print";
import PosSaleInvoicePrint  from "components/admin/product_pos_sale/Invoice_pos_purchase.js";
import useStatePromise from "hooks/use-state-promise";
import PrintTwoToneIcon from "@material-ui/icons/PrintTwoTone";
import { convertFristCharcapital } from "../../helper/getMonthToNumber";
import dummyData from '../../utils/dummyData'; // Import dummyData for product_sale_list

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
  searchRoot: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 400,
  },
  input: {
    marginLeft: 3,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
};

const useStyles = makeStyles(styles);
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const title = "Product Sale";
const subject = "product_pos_sale";
const endpoint = {
  list: "product_pos_sale_list",
  create: "product_pos_sale_create",
  edit: "product_pos_sale_edit",
  delete: "product_pos_sale_delete",
};

const TableList = observer(() => {


  const classes = useStyles();
  const { user } = useRootStore();
  const tableRef = React.createRef();
  const handleRefress = () => {
    tableRef.current && tableRef.current.onQueryChange();
  };
  const [editData, setEditData] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openWarning, setOpenWarning] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [invoiceData, setInvoicedata] =useState(null);
  const [invoiceProduct, setInvoiceproduct] = useState(null);
  const [buniessDetails, setBusinessDetails] = useState(null);

  const handleCloseWarning = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenWarning(false);
  };

  const handleClickOpenCreate = () => {
    //  if(user?.details?.role === 'admin'){
    //  return setOpenWarning(true);
    //  }

    //  if(!user?.details?.store_van_user?.assign_store_id){
    //   return setOpenWarning(true);
    //   }
  
    setOpenCreateModal(true);
  };
  const handleCloseCreate = () => {
    setOpenCreateModal(false);
  };


  const handleCloseEdit = () => {
    setOpenEditModal(false);
  };


  const handleCloseDetail = () => {
    setOpenDetailModal(false);
  };


  const handleEdit = (row) => {
    if (!user.can("edit", subject)) {
      setOpenWarning(true);
      return null;
    }
    //console.log(row);
    setEditData(row);
    setOpenEditModal(true);
  };
  const handleCreate = () => {
    // if (!user.can("create", subject)) {
    //   setOpenWarning(true);
    //   return null;
    // }
    handleClickOpenCreate(true);
  };
  const handleDetail = (row) => {
    setEditData(row);
    setOpenDetailModal(true);
  };



 

  const columns = [
    { title: "Inv Date", field: "sale_date_time"},
    { title: "Inv Num", render: (rowData) => convertFristCharcapital(rowData.invoice_no)},
    {title: "Route",field: "store_name"},
    { title: "Cust Code", field: "customer_code" },
    { title: "Cust Name", field: "customer_name" },
    { title: "Cust VAT No", field: "vat_number" },
    { title: "Inv Amt (Excl.VAT)", field: "after_discount_amount" },
    { title: "VAT", field: "total_vat_amount" },
    { title: "Inv Amt (Incl.VAT)", field: "total_amount" },
  ];

  const componentRef = React.useRef(null);
  const handlePrint = async (row) => {
  
    await axios
      .post(
        `${baseUrl}/product_pos_sale_details`,
        {
          product_sale_id: row.id,
        },
        {
          headers: { Authorization: "Bearer " + user.auth_token },
        }
      )
      .then((res) => {
        setInvoiceproduct(res.data.response.product_pos_sale_details);
        setBusinessDetails(res.data.response?.business_settings);
        setInvoicedata(row)
      });

  };

 
  const handlePrintInvoice = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: invoiceData?.invoice_no
  });


  useEffect(()=>{
    if(invoiceData){
      handlePrintInvoice();
    }
    },[invoiceData])

  
  return (
    <Gurd subject={subject}>
      <div style={{ display: "none" }}>
        <PosSaleInvoicePrint 
          ref={componentRef}
          inv={invoiceData}
          invoiceProduct={invoiceProduct}
          selesmanName={user?.details?.name}
          buniessDetails={buniessDetails}
        />
      </div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <Box py={1}>
                <Grid container spacing={1}>
                  <Grid container item xs={6} spacing={3} direction="column">
                    <Box p={1}>
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
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleCreate}
                    >
                      Create {title}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardHeader>
            <CardBody>
            <MaterialTable
                icons={tableIcons}
                title="List"
                tableRef={tableRef}
                columns={columns}

                data={(query) =>
                  new Promise((resolve, reject) => {
                    const filteredData = dummyData.product_sale_list.filter(item => {
                      if (query.search) {
                        return (
                          item.sale_date_time.toLowerCase().includes(query.search.toLowerCase()) ||
                          item.invoice_no.toLowerCase().includes(query.search.toLowerCase()) ||
                          item.store_name.toLowerCase().includes(query.search.toLowerCase()) ||
                          item.customer_code.toLowerCase().includes(query.search.toLowerCase()) ||
                          item.customer_name.toLowerCase().includes(query.search.toLowerCase()) ||
                          item.vat_number.toLowerCase().includes(query.search.toLowerCase())
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
                    icon: () => (
                      <Button
                        fullWidth={true}
                        variant="contained"
                        color="primary"
                      >
                        <PrintTwoToneIcon fontSize="small" color="white" />
                      </Button>
                    ),
                    tooltip: "Print",
                    onClick: (event, rowData) => handlePrint(rowData, false),
                  },
                  {
                    icon: () => (
                      <Button
                        fullWidth={true}
                        variant="contained"
                        color="primary"
                      >
                        <FileCopyIcon fontSize="small" color="white" />
                      </Button>
                    ),
                    tooltip: "product List",
                    onClick: (event, rowData) => handleDetail(rowData, true),
                  },
                  // {
                  //   icon: () => (
                  //     <Button
                  //       fullWidth={true}
                  //       variant="contained"
                  //       color="primary"
                  //     >
                  //       <EditTwoToneIcon fontSize="small" color="white" />
                  //     </Button>
                  //   ),
                  //   tooltip: "Edit Sale",
                  //   onClick: (event, rowData) => handleEdit(rowData),
                  // },
      
                  {
                    icon: RefreshIcon,
                    tooltip: "Refresh Data",
                    isFreeAction: true,
                    onClick: () => handleRefress(),
                  },
                ]}
                options={{
                  actionsColumnIndex: -1,
                  // search: true,
                  pageSize: 12,
                  pageSizeOptions: [12],
                  padding: "dense",
                 
                  rowStyle: {
                    fontSize: 15,
                  },
                }}

      
              />
             

            </CardBody>
          </Card>

          
          <Dialog
            fullScreen
            open={openCreateModal}
            onClose={handleCloseCreate}
            TransitionComponent={Transition}
          >
            <AppBar style={{ position: "relative" }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleCloseCreate}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" style={{ flex: 1 }}>
                  Create {title}
                </Typography>
                {/* <Link href="/product_pos_sale/listNew">
                  <a target="_blank">
                    <Button variant="contained">Sale in new Tab</Button>
                  </a>
                </Link> */}
              </Toolbar>
            </AppBar>
            <Create
              token={user.auth_token}
              modal={setOpenCreateModal}
              endpoint={endpoint.create}
              mutate={handleRefress}
              handlePrint={handlePrint}
              user={user}
            />
          </Dialog>
{/* 
          <Dialog
            open={openEditModal}
            onClose={handleCloseEdit}
            TransitionComponent={Transition}
            fullWidth={true}
            maxWidth="lg"
          >
            <AppBar style={{ position: "relative" }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleCloseEdit}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" style={{ flex: 1 }}>
                  Edit {title}
                </Typography>
              
              </Toolbar>
            </AppBar>
            <Edit
              token={user.auth_token}
              modal={setOpenEditModal}
              editData={editData}
              endpoint={endpoint.edit}
              mutate={handleRefress}
            />
          </Dialog> */}
          <Dialog
            open={openDetailModal}
            onClose={handleCloseDetail}
            TransitionComponent={Transition}
            fullWidth={true}
            maxWidth="lg"
          >
            <AppBar style={{ position: "relative" }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleCloseDetail}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" style={{ flex: 1 }}>
                  Product details
                </Typography>
              </Toolbar>
            </AppBar>
            <Details
              token={user.auth_token}
              modal={setOpenDetailModal}
              editData={editData}
            />
          </Dialog>
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
