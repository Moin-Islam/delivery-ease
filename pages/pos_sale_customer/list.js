import React from "react";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Gurd from "../../components/guard/Gurd";
import axios from "axios";
import { useRootStore } from "../../models/root-store-provider";
import { observer } from "mobx-react-lite";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import RefreshIcon from "@material-ui/icons/Refresh";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { Box, Grid, Chip } from "@material-ui/core";
import DeleteForeverTwoToneIcon from "@material-ui/icons/DeleteForeverTwoTone";
import CreateNewPosCustomer from "../../components/admin/pos_sale_customer/create";
import EditPosCustomer from "../../components/admin/pos_sale_customer/edit";
import { baseUrl } from "../../const/api";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import MaterialTable from "material-table";
import tableIcons from "components/table_icon/icon";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";
import PurchaseHistory from "components/admin/party/purchaseHistory";
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

const title = "pos_sale_customer_list";
const subject = "pos_sale_customer_list";

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
  const [purchaseData, setPurchaseData] = useState(null);
  const [openPurchaseModal, setPurchaseModal] = useState(false);
  const [openWarning, setOpenWarning] = React.useState(false);

  const handleClickWarning = () => {
    setOpenWarning(true);
  };
  const handleCloseWarning = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenWarning(false);
  };

  // create and edit customerHandle
  const handleClickOpenCreate = () => {
    setOpenCreateModal(true);
  };
  const handleCloseCreate = () => {
    setOpenCreateModal(false);
  };
  const handleCloseEdit = () => {
    setOpenEditModal(false);
  };

  const handleEdit = (row) => {
    // if (!user.can('edit', subject)) {
    //   setOpenWarning(true);
    //   return null;
    // }
    setEditData(row);
    setOpenEditModal(true);
  };
  const handleCreate = () => {
    // if (!user.can('create', subject)) {
    //   setOpenWarning(true);
    //   return null;
    // }
    handleClickOpenCreate(true);
  };
  const handleDelete = async (row_id) => {
    // if (!user.can("delete", subject)) {
    //   setOpenWarning(true);
    //   return null;
    // }
    const party = await axios.post(
      `${baseUrl}/customer_delete`,
      {
        party_id: row_id,
      },
      {
        headers: { Authorization: "Bearer " + user.auth_token },
      }
    );
    handleRefress();
  };

 

  // purchase handler
  const handlePurchaseHistory = (row) => {
    // if (!user.can('edit', subject)) {
    //   setOpenWarning(true);
    //   return null;
    // }
    setPurchaseData(row);
    setPurchaseModal(true);
  };
  const handleClosePurchesase = () => {
    setPurchaseModal(false);
  };
 
  const columns = [
    { title: "Customer Code", field: "customer_code" },
    {
      title: "Name",
      field: "product_name",
      render: (rowData) => (
        <Typography variant="subtitle2" style={{ width: "250px" }}>
          {rowData.name}
        </Typography>
      ),
    },
    { title: "Store Name", field: "customer_store_name" },
    { title: "Phone", field: "phone" },
    { title: "Address", field: "address" },
    // { title: "Total Amount", field: "sale_total_amount" },
    { title: "Virtual Balance", field: "virtual_balance" },
    { title: "VAT Number", field: "vat_number" },
    {
      title: "Status",
      field: "status",
      render: (rowData) => (
        <Chip
          color={rowData.status ? "primary" : "secondary"}
          size="small"
          label={rowData.status ? "Active" : "Inactive"}
          icon={rowData.status ? <CheckCircleIcon /> : <ErrorIcon />}
        />
      ),
    },
  ];
 
  return (
    <Gurd subject="pos_sale_customer">
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <Grid container spacing={1}>
                <Grid container item xs={3} spacing={3} direction="column">
                  <Box p={2}>
                    <h4 className={classes.cardTitleWhite}>
                      POS Sale Customer</h4>
                   
                  </Box>
                </Grid>
                <Grid
                  container
                  item
                  xs={9}
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
                    Create Pos Customer
                  </Button>
                </Grid>
              </Grid>
            </CardHeader>
            <CardBody>
              <MaterialTable
                icons={tableIcons}
                title="CUSTOMER LIST"
                columns={columns}
                tableRef={tableRef}

                data={query =>
                  new Promise((resolve, reject) => {
                   
                    let url = `${baseUrl}/pos_sale_customer_list_pagination_with_search?`;
                    //searching
                    if (query.search) {
                      url += `search=${query.search}`
                    }
                  
                    url += `&page=${query.page + 1}`
                    fetch(url,{
                          method: "post",
                          headers: { Authorization: "Bearer " + user.auth_token },
                        }
                      ).then(resp => resp.json()).then(resp => {
                      console.log(resp)
                      resolve({
                            data: resp.data,
                            page: resp?.meta?.current_page - 1,
                            totalCount: resp?.meta?.total,
                      });
                    })
        
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
                        <EditTwoToneIcon fontSize="small" color="white" />
                      </Button>
                    ),
                    tooltip: "Edit POS Customer",
                    onClick: (event, rowData) => handleEdit(rowData),
                  },

                  // {
                  //   icon: () => (
                  //     <Button
                  //       fullWidth={true}
                  //       variant="contained"
                  //       color="primary"
                  //     >
                  //       <ShoppingBasketIcon fontSize="small" color="white" />
                  //     </Button>
                  //   ),
                  //   tooltip: "Purchase History",
                  //   onClick: (event, rowData) => handlePurchaseHistory(rowData),
                  // },
                  (rowData) => ({
                    icon: () => (
                      <Button
                        fullWidth={true}
                        variant="contained"
                        color="secondary"
                      >
                        <DeleteForeverTwoToneIcon
                          fontSize="small"
                          color="white"
                        />
                      </Button>
                    ),
                    tooltip: "Delete Customer",
                    onClick: (event, rowData) => (
                      confirm("You want to delete " + rowData.name),
                      handleDelete(rowData.id)
                    ),
                  }),
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
                  pageSizeOptions:[12],
                  padding: "dense",
                }}
                
              />
            </CardBody>
          </Card>

          <Dialog
            open={openPurchaseModal}
            onClose={handleClosePurchesase}
            TransitionComponent={Transition}
            fullWidth={true}
            maxWidth="lg"
          >
            <AppBar style={{ position: "relative" }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleClosePurchesase}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" style={{ flex: 1 }}>
                  Purchase History
                </Typography>
              </Toolbar>
            </AppBar>
            <PurchaseHistory
              token={user.auth_token}
              modal={setPurchaseModal}
              party={purchaseData}
              mutate={handleRefress}
            />
          </Dialog>

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
                  Create POS Customer
                </Typography>
              </Toolbar>
            </AppBar>
            <CreateNewPosCustomer
              token={user.auth_token}
              modal={setOpenCreateModal}
              mutate={handleRefress}
            />
          </Dialog>

          <Dialog
            open={openEditModal}
            onClose={handleCloseEdit}
            TransitionComponent={Transition}
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
            <EditPosCustomer
              token={user.auth_token}
              modal={setOpenEditModal}
              editData={editData}
              //  endpoint={endpoint.edit}
              mutate={handleRefress}
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
