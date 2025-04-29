import React from "react";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import RefreshIcon from "@material-ui/icons/Refresh";
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
import { Box, Chip, Grid, CircularProgress } from "@material-ui/core";
import { baseUrl } from "../../const/api";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
// import Edit from "../../components/admin/stock_transfer_invoice/edit";
import Create from "components/admin/warehouse_stock_transfer/create";
import Details from "../../components/admin/stock_transfer_invoice/details";
import tableIcons from "components/table_icon/icon";
import { useReactToPrint } from "react-to-print";
import StockTransferInvoice from "components/admin/stock_transfer_invoice/stockTransferInvoice.js";
import useStatePromise from "hooks/use-state-promise";
// import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import PrintTwoToneIcon from "@material-ui/icons/PrintTwoTone";
import ReceiptIcon from "@material-ui/icons/Receipt";
import ListAltTwoToneIcon from "@material-ui/icons/ListAltTwoTone";
// import { TextField } from "@material-ui/core";
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

const title = "Stock Transfer Invoice";
const subject = "stock_transfer_invoice";
const endpoint = {
  list: "stock_transfer_list_with_search",
  create: "warehouse_to_store_stock_create",
  edit: "warehouse_to_store_stock_edit",
  delete: "product_whole_sale_delete",
};

const TableList = observer(() => {
  const classes = useStyles();
  const tableRef = React.createRef();
  const handleRefress = () => {
    console.log("hiiiiii");
    tableRef.current && tableRef.current.onQueryChange();
  };

  const { user } = useRootStore();
  const [stockListType, setStockListType] = useState("main");
  // const [stocks, setStocks] = useState(null);
  const [warehouseId, setWarehouseId] = useState(null);

  const [editData, setEditData] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openWarning, setOpenWarning] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [invoiceData, setInvoicedata, setInvoicedataPromise] =
    useStatePromise(null);
  const [invoiceProduct, setInvoiceproduct] = useState(null);
  const [invoiceType, setInvoicetype] = useState("invoice");
  const [search, setSearch] = useState("");

  const handleClickWarning = () => {
    setOpenWarning(true);
  };
  const handleCloseWarning = (event, reason) => {
    if (reason === "clickaway") {
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

  const handleClickOpenEdit = () => {
    setOpenEditModal(true);
  };
  const handleCloseEdit = () => {
    setOpenEditModal(false);
  };

  const handleClickOpenDetail = () => {
    setOpenDetailModal(true);
  };
  const handleCloseDetail = () => {
    setOpenDetailModal(false);
  };

  const columns = [
    { title: "Inv Date", field: "issue_date" },
    { title: "Inv Num", field: "invoice_no" },
    {
      title: "Inv Amt",
      field: "total_amount",
    },

    {
      title: "User",
      field: "user_name",
    },
    {
      title: "Warehouse",
      field: "warehouse_name",
    },
    {
      title: "Route",
      field: "store_name",
    },
    {
      title: "Salesman",
      field: "sales_man_user_name",
    },
    {
      title: "Van",
      field: "van_name",
    },
  ];

  // const handleDelete = async (row_id) => {
  //   if (!user.can("delete", subject)) {
  //     setOpenWarning(true);
  //     return null;
  //   }
  //   const dlt = await axios.post(
  //     `${baseUrl}/${endpoint.delete}`,
  //     {
  //       product_sale_id: row_id,
  //     },
  //     {
  //       headers: { Authorization: "Bearer " + user.auth_token },
  //     }
  //   );
  //   handleRefress();
  // };

  // const handleEdit = (row) => {
  //   if (!user.can("edit", subject)) {
  //     setOpenWarning(true);
  //     return null;
  //   }
  //   //console.log(row);
  //   setEditData(row);
  //   setOpenEditModal(true);
  // };
  const handleCreate = () => {
    // if (!user.can('create', subject)) {
    //   setOpenWarning(true);
    //   return null;
    // }
    handleClickOpenCreate(true);
  };
  const handleDetail = (row) => {
    setEditData(row);
    setOpenDetailModal(true);
  };

  const componentRef = React.useRef();
  const handlePrint = async (row, type) => {
    await axios
      .post(
        `${baseUrl}/stock_transfer_details`,
        {
          warehouse_id: row.warehouse_id,
          stock_transfer_id: row.id,
        },
        {
          headers: { Authorization: "Bearer " + user.auth_token },
        }
      )
      .then((res) => {
        const state = setInvoicedataPromise(row).then(() => {
          console.log("running promise");
        });

        setInvoiceproduct(res.data.response.stock_transfer_details);
        setInvoicetype(type);
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

  const fetchWarehouseId = async () => {
    try {
      const url = `${baseUrl}/warehouse_list`;
      const warehouseList = await axios.get(url, {
        headers: { Authorization: "Bearer " + user.auth_token },
      });

      setWarehouseId(warehouseList?.data?.response?.warehouses[0]?.id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWarehouseId();
  }, []);

  return (
    <Gurd subject={subject}>
      <div style={{ display: "none" }}>
        <StockTransferInvoice
          ref={componentRef}
          inv={invoiceData}
          invoiceType={invoiceType}
          invoiceProduct={invoiceProduct}
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
                    Transfer Stock
                  </Button>
                </Grid>
              </Grid>
            </CardHeader>

            <CardBody>
              {/* {stockListType === "main" && ( */}
              <MaterialTable
                icons={tableIcons}
                title="List"
                tableRef={tableRef}
                columns={columns}
                data={(query) =>
                  new Promise((resolve, reject) => {
                    let url = `${baseUrl}/${endpoint.list}?`;
                    //searching
                    if (query.search) {
                      url += `search=${query.search}`;
                    }

                    url += `&page=${query.page + 1}`;
                    fetch(url, {
                      method: "POST",
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
                        <ListAltTwoToneIcon fontSize="small" color="white" />
                      </Button>
                    ),
                    tooltip: "Show Products",
                    onClick: (event, rowData) => handleDetail(rowData),
                  },

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
                    tooltip: "Invoice",
                    onClick: (event, rowData) =>
                      handlePrint(rowData, "invoice"),
                  },
                  // {
                  //   icon: () => (
                  //     <Button
                  //       fullWidth={true}
                  //       variant="contained"
                  //       color="primary"
                  //     >
                  //       <ReceiptIcon fontSize="small" color="white" />
                  //     </Button>
                  //   ),
                  //   tooltip: "Chalan",
                  //   onClick: (event, rowData) => handlePrint(rowData, "chalan"),
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
                  search: true,
                  pageSize: 12,
                  pageSizeOptions: [12],
                  padding: "dense",
                }}
              />
              {/* )} */}
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

          {/* <Dialog
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
          You dont't have permission!
        </Alert>
      </Snackbar>
    </Gurd>
  );
});

export default TableList;
