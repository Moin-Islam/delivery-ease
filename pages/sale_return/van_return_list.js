import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import cogoToast from "cogo-toast";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import RefreshIcon from "@material-ui/icons/Refresh";
import CardBody from "components/Card/CardBody.js";
import Gurd from "../../components/guard/Gurd";
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
import MuiAlert from "@material-ui/lab/Alert";
import ProductDetails from "../../components/admin/sale_return/van_route_to_warehouse/van_route_to_return_details";
import tableIcons from "components/table_icon/icon";
import ListAltTwoToneIcon from "@material-ui/icons/ListAltTwoTone";
import { convertFristCharcapital } from "../../helper/getMonthToNumber";
import dummyData from "../../utils/dummyData";

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
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const title = "Sale Return Customer To Van";
const subject = "sale_return_van_route_warehouse";
const endpoint = {
  list: "product_sale_return_van_route_warehouse_list",
  edit: "product_sale_return_customer_van_route_create",
};

const VanReturnList = observer(() => {
  const classes = useStyles();
  const { user } = useRootStore();
  const [editData, setEditData] = useState(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const tableRef = React.createRef();

  const handleRefress = () => {
    tableRef.current && tableRef.current.onQueryChange();
  };

  const handleCloseDetail = () => {
    setOpenDetailModal(false);
  };

  const columns = [
    {
      title: "Invoice No",
      render: (rowData) => convertFristCharcapital(rowData.invoice_no),
    },
  ];

  const handleDetail = (row) => {
    setEditData({
      ...row,
      user_name: row.sales_man_user_name,
      sale_date: row.product_sale_return_date,
    });
    setOpenDetailModal(true);
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
                    <h4 className={classes.cardTitleWhite}>
                      Sale Return Invoice List
                    </h4>
                  </Box>
                </Grid>
              </Grid>
            </CardHeader>
            <CardBody>
              <MaterialTable
                icons={tableIcons}
                title="List"
                tableRef={tableRef}
                columns={columns}
                data={(query) =>
                  new Promise((resolve, reject) => {
                    const filteredData = dummyData.van_route_to_warehouse.filter((item) => {
                      if (query.search) {
                        return item.invoice_no.includes(query.search);
                      }
                      return true;
                    });

                    const page = query.page;
                    const pageSize = query.pageSize;
                    const paginatedData = filteredData.slice(
                      page * pageSize,
                      (page + 1) * pageSize
                    );

                    resolve({
                      data: paginatedData,
                      page: page,
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
                  search: true,
                  pageSize: 12,
                  pageSizeOptions: [12],
                  padding: "dense",
                }}
              />
            </CardBody>
          </Card>

          <Dialog
            open={openDetailModal}
            onClose={handleCloseDetail}
            TransitionComponent={Transition}
            fullWidth={true}
            maxWidth={true}
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
                  Details
                </Typography>
              </Toolbar>
            </AppBar>
            <ProductDetails
              token={user.auth_token}
              editData={editData}
            />
          </Dialog>
        </GridItem>
      </GridContainer>
    </Gurd>
  );
});

export default VanReturnList;