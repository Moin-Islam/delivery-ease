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
import { Box, Grid } from "@material-ui/core";
import { baseUrl } from "../../const/api";
import ReturnComponent from "../../components/admin/sale_return/van_route_to_warehouse/index";
import tableIcons from "components/table_icon/icon";
import { convertFristCharcapital } from "../../helper/getMonthToNumber";
import dummyData from "../../utils/dummyData"; // Import dummyData for van_route_to_warehouse

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

const title = "Return Van-Route To Warehouse";
const subject = "sale_return_van_route_warehouse";
const endpoint = {
  list: "stock_transfer_list_with_search",
  edit: "product_sale_return_van_route_warehouse_create",
};

const VatToRoute = observer(() => {
  const classes = useStyles();
  const { user } = useRootStore();
  const [editData, setEditData] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const tableRef = React.createRef();

  const handleRefress = () => {
    tableRef.current && tableRef.current.onQueryChange();
  };

  const handleCloseEdit = () => {
    setOpenEditModal(false);
  };

  const columns = [
    {
      title: "Invoice No",
      render: (rowData) => convertFristCharcapital(rowData.invoice_no),
    },
  ];

  const handleEdit = (row) => {
    setEditData(row);
    setOpenEditModal(true);
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
                      Warehouse to van stock transfer invoice list
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
                    const filteredData = dummyData.van_route_to_warehouse.filter(
                      (item) => {
                        if (query.search) {
                          return item.invoice_no
                            .toLowerCase()
                            .includes(query.search.toLowerCase());
                        }
                        return true;
                      }
                    );

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
                        Return
                      </Button>
                    ),
                    tooltip: "Edit Purchase",
                    onClick: (event, rowData) => handleEdit(rowData),
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
                  {title}
                </Typography>
              </Toolbar>
            </AppBar>
            <ReturnComponent
              token={user.auth_token}
              modal={setOpenEditModal}
              invoice={editData}
              endpoint={endpoint.edit}
              mutate={handleRefress}
            />
          </Dialog>
        </GridItem>
      </GridContainer>
    </Gurd>
  );
});

export default VatToRoute;