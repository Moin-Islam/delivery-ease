import React from 'react';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
// core components
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
//import Button from "components/CustomButtons/Button.js";
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import { Formik, Form, Field, FieldArray } from 'formik';
import { TextField } from 'formik-material-ui';
import Grid from '@material-ui/core/Grid';
import { Box, Button, MenuItem, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { baseUrl } from '../../../const/api';
import { useAsyncEffect } from 'use-async-effect';
import axios from 'axios';
import { Autocomplete } from 'formik-material-ui-lab';
import MuiTextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import WholeProduct from './create/wholeProduct';
import WholeProductTotalCalculation from './create/wholeProductTotalCalculation';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import MaterialTable from 'material-table';
import tableIcons from 'components/table_icon/icon';
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';

const styles = {
  cardCategoryWhite: {
    color: 'rgba(255,255,255,.62)',
    margin: '0',
    fontSize: '14px',
    marginTop: '0',
    marginBottom: '0',
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
  },
  cardBack: {
    color: '#FFFFFF',
    backgroundColor: 'blue',
  },
};
const useStyles = makeStyles(styles);
const purchase_product = [];
const Details = ({ token, modal, editData }) => {
  const classes = useStyles();
  const [errorAlert, setOpen] = React.useState({
    open: false,
    key: '',
    value: [],
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen({
      open: false,
      key: '',
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

  const [total, setTotal] = React.useState(0);
  const [paid, setPaid] = React.useState(0);
  const [due, setDue] = React.useState(0);

  const [load, setLoad] = React.useState(false);
  const [product, setProduct] = React.useState(null);
  let products = `${baseUrl}/product_pos_purchase_details`;

  useAsyncEffect(async (isMounted) => {
    console.log('edited data' + editData.id);
    const requestThree = axios.post(
      products,
      {
        product_purchase_id: editData.id,
      },
      {
        headers: { Authorization: 'Bearer ' + token },
      }
    );
    await axios
      .all([requestThree])
      .then(
        axios.spread((...responses) => {
          if (!isMounted()) return;
          const responsethree = responses[0];
          setProduct(responsethree.data.response.product_pos_purchase_details);
          setLoad(true);
        })
      )
      .catch((errors) => {
        console.error(errors);
        setLoad(false);
      });
  }, []);

  const columns = [
    { title: 'Product', field: 'product_name' },
    { title: 'Unit', field: 'product_unit_name' },
    { title: 'Brand', field: 'product_brand_name' },
    {
      title: 'Price',
      field: 'price',

    },
    {
      title: 'MRP Price',
      field: 'mrp_price',
    
    },
    {
      title: 'Quantity',
      field: 'qty',
      render: (rowData) => rowData.qty + ' ' + rowData.product_unit_name,
    },
  ];
  const handleEdit = (row) => {
    // if (!user.can("edit", subject)) {
    //   setOpenWarning(true);
    //   return null;
    // }
    console.log(row);
    axios
      .post(
        `${baseUrl}/product_purchase_remove`,
        {
          product_id: row.id,
          product_purchase_id: editData.id,
          party_id: editData.supplier_id,
          warehouse_id: editData.warehouse_id,
          paid_amount: editData.paid_amount,
          due_amount: editData.due_amount,
          sub_total: row.price * row.qty,
          total_amount: editData.total_amount,
          payment_type: editData.payment_type,
          product_purchase_detail_id: row.product_purchase_detail_id,
        },
        {
          headers: { Authorization: 'Bearer ' + token },
        }
      )
      .then((res) => {
        console.log(res.data.response);
        //console.log(res.data.response.sum_asset_amount.total_debit);

        // res.data.response.map((d) => {
        //   db = db + d.debit;
        //   cr = cr + d.credit;
        // });
        // setCreditTotal(cr);
        // setDebitTotal(db);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <GridContainer style={{ padding: '20px 30px', marginTop: 250 }}>
        {load && (
          <MaterialTable
            title="Product List"
            columns={columns}
            data={product}
            icons={tableIcons}
            actions={[
              {
                icon: () => (
                  <Button fullWidth={true} variant="contained" color="primary">
                    <EditTwoToneIcon fontSize="small" color="white" />
                  </Button>
                ),
                tooltip: 'Edit Purchase',
                onClick: (event, rowData) => handleEdit(rowData),
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
