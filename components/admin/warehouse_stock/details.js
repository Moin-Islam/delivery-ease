import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/Grid/GridContainer.js";
import { baseUrl } from "../../../const/api";
import { useAsyncEffect } from "use-async-effect";
import axios from "axios";
import MaterialTable from "material-table";
import tableIcons from "components/table_icon/icon";
import Router from "next/router";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
  cardBack: {
    color: "#FFFFFF",
    backgroundColor: "blue",
  },
};
const useStyles = makeStyles(styles);
const purchase_product = [];
const Details = ({ token, modal }) => {
  const classes = useStyles();
  const [errorAlert, setOpen] = React.useState({
    open: false,
    key: "",
    value: [],
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen({
      open: false,
      key: "",
      value: [],
    });
  };
  const [openModal, setModalOpen] = React.useState(false);
  const handleClickModalOpen = () => {
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
  };

  const [load, setLoad] = React.useState(false);
  const [product, setProduct] = React.useState(null);
  let products = `${baseUrl}/warehouse_stock_low_list`;

  useAsyncEffect(async (isMounted) => {
    const requestThree = axios.get(products, {
      headers: { Authorization: "Bearer " + token },
    });
    await axios
      .all([requestThree])
      .then(
        axios.spread((...responses) => {
          if (!isMounted()) return;
          const responsethree = responses[0];
          console.log(responsethree.data.response.warehouse_stock_low_list);
          setProduct(responsethree.data.response.warehouse_stock_low_list);
          setLoad(true);
        })
      )
      .catch((errors) => {
        console.error(errors);
        setLoad(false);
      });
  }, []);

  const columns = [
    { title: "Stocked User", field: "stock_by_user" },
    { title: "Warehouse Name", field: "warehouse_name" },
    { title: "Product Name", field: "product_name" },
    { title: "Unit", field: "product_unit_name" },
    { title: "Brand", field: "product_brand_name" },
    { title: "Stock Type", field: "stock_type" },
    { title: "Stock Where", field: "stock_where" },
    { title: "Previous Stock", field: "previous_stock" },
    { title: "Stock In", field: "stock_in" },
    { title: "Stock Out", field: "stock_out" },
    { title: "Current Stock", field: "current_stock" },
    { title: "Stock Date", field: "stock_date_time" },
  ];

  return (
    <div>
      <GridContainer style={{ padding: "20px 30px", marginTop: 250 }}>
        {load && (
          <MaterialTable
            title="Low Stock Products"
            columns={columns}
            icons={tableIcons}
            data={product}
            actions={[
              {
                icon: "edit",
                iconProps: {
                  style: {
                    color: "#e6f1ff",
                    backgroundColor: "#0e4194",
                    padding: "5px 35px",
                    borderRadius: 5,
                  },
                },
                tooltip: "Purchase",
                onClick: (event, rowData) =>
                  Router.push("/product_whole_purchase/list"),
              },
            ]}
            options={{
              actionsColumnIndex: -1,
              exportButton: false,
              // grouping: true,
              search: true,
            }}
          />
        )}
      </GridContainer>
    </div>
  );
};

// UserProfile.layout = Admin;

export default Details;
