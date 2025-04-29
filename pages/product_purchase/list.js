import React from "react";
import { useState,useEffect } from "react";
import cogoToast from 'cogo-toast';
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import RefreshIcon from "@material-ui/icons/Refresh";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Gurd from "../../components/guard/Gurd";
import axios from "axios";
import { useRootStore } from "../../models/root-store-provider";
import { observer } from "mobx-react-lite";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { Box, Chip, Grid } from "@material-ui/core";
import { baseUrl } from "../../const/api";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Create from "../../components/admin/product_whole_purchase/create";
import Details from "../../components/admin/product_whole_purchase/details";
import tableIcons from "components/table_icon/icon";
import { useReactToPrint } from "react-to-print";
import ListAltTwoToneIcon from "@material-ui/icons/ListAltTwoTone";
import PurchaseInvoice from "components/admin/product_whole_purchase/PurchaseInvoice";
import PrintTwoToneIcon from "@material-ui/icons/PrintTwoTone";
import { convertFristCharcapital } from "helper/getMonthToNumber";

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
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
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
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const title = "Product Purchase";
const subject = "product_whole_purchase";
const endpoint = {
  list: "product_pos_purchase_list_pagination_with_search",
  create: "product_pos_purchase_create",
  edit: "product_pos_purchase_edit",
  delete: "product_pos_purchase_delete",
};

const TableList = observer(() => {
  const classes = useStyles();
  const { user } = useRootStore();
  const tableRef = React.createRef();
  const componentRef = React.useRef(null);
  const handleRefress = () => {
    tableRef.current && tableRef.current.onQueryChange();
  };

  const [editData, setEditData] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [invoiceData, setInvoicedata] = useState(null);
  const [invoiceProduct, setInvoiceproduct] = useState(null);



  const handleClickOpenCreate = () => {
    setOpenCreateModal(true);
  };
  const handleCloseCreate = () => {
    setOpenCreateModal(false);
  };


  const columns = [
    { title: "Inv Date", field: "purchase_date_time" },
    {
      title: "Inv Number",
      render: (rowData) => convertFristCharcapital(rowData.invoice_no),
    },
    { title: "Ref Num", field: "reference_no" },
    { title: "Supplier Name", field: "supplier_name" },
    { title: "Supplier VAT No", field: "vat_number" },
    { title: "Inv Amt (Excl.VAT)", field: "after_discount_amount" },
    { title: "VAT", field: "total_vat_amount" },
    { title: "Inv Amt (Incl.VAT)", field: "total_amount" },
  ];


    // work hold
  // const handleDelete = async (row_id) => {
  //   if (!user.can("delete", subject)) {
  //     setOpenWarning(true);
  //     return null;
  //   }
  //   const dlt = await axios.post(
  //     `${baseUrl}/${endpoint.delete}`,
  //     {
  //       product_purchase_id: row_id,
  //     },
  //     {
  //       headers: { Authorization: "Bearer " + user.auth_token },
  //     }
  //   );
  //   handleRefress();
  // };



  // handle create function
  const handleCreate = () => {
    if (!user.can("create", subject)) {
      cogoToast.warn("You dont't have permission!",{position: 'top-right', bar:{size: '10px'}});
      return null;
    }
    handleClickOpenCreate(true);
  };


// handle details function
  const handleDetail = (row) => {
    setEditData(row);
    setOpenDetailModal(true);
  };

  const handleCloseDetail = () => {
    setOpenDetailModal(false);
  };



// handle print function
  const handlePrint = async (row) => {
    await axios
      .post(
        `${baseUrl}/product_pos_purchase_details`,
        {
          product_purchase_id: row.id,
        },
        {
          headers: { Authorization: "Bearer " + user.auth_token },
        }
      )
      .then((res) => {
        setInvoiceproduct(res.data.response);
        setInvoicedata(row)
        
      });
  
  };


  // handle print

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
        <PurchaseInvoice
          ref={componentRef}
          inv={invoiceData}
          invoiceProduct={invoiceProduct}
          invoiceTitle='Purchase Invoice'
        />
      </div>
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
            </CardHeader>
            <CardBody>
              <MaterialTable
                icons={tableIcons}
                title="List"
                columns={columns}
                tableRef={tableRef}
                data={(query) =>
                  new Promise((resolve, reject) => {
                    let url = `${baseUrl}/${endpoint.list}?`;
                    //searching
                    if (query.search) {
                      url += `search=${query.search}`;
                    }

                    url += `&page=${query.page + 1}`;
                    fetch(url, {
                      method: "post",
                      headers: { Authorization: "Bearer " + user.auth_token },
                    })
                      .then((resp) => resp.json())
                      .then((resp) => {
                        console.log(resp);
                        resolve({
                          data: resp.data,
                          page: resp?.meta?.current_page - 1,
                          totalCount: resp?.meta?.total,
                        });
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
                    onClick: (event, rowData) => handlePrint(rowData),
                  },
                  {
                    icon: () => (
                      <Button
                        fullWidth={true}
                        variant="contained"
                        color="primary"
                      >
                        <ListAltTwoToneIcon fontSize="small" color="white" />
                      </Button>
                    ),
                    tooltip: "Show Products",
                    onClick: (event, rowData) => handleDetail(rowData),
                  },

                  {
                    icon: RefreshIcon,
                    tooltip: "Refresh Data",
                    isFreeAction: true,
                    onClick: () => handleRefress(),
                  },
                ]}
                options={{
                  actionsColumnIndex: -1,
                  pageSize: 12,
                  pageSizeOptions: [12],
                  padding: "dense",
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
              </Toolbar>
            </AppBar>
            <Create
              userDetails={user?.details}
              token={user.auth_token}
              modal={setOpenCreateModal}
              endpoint={endpoint.create}
              handleRefress={handleRefress}
            />
          </Dialog>

          <Dialog
            open={openDetailModal}
            onClose={handleCloseDetail}
            TransitionComponent={Transition}
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

    </Gurd>
  );
});

export default TableList;
