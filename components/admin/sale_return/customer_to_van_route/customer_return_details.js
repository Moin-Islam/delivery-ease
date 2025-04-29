import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import InputLabel from '@material-ui/core/InputLabel'
// import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
// import Card from 'components/Card/Card.js';
// import CardBody from 'components/Card/CardBody.js';
// import { TextField } from 'formik-material-ui';
// import Grid from '@material-ui/core/Grid';
import { Box, Button, MenuItem, Typography } from '@material-ui/core';
import { baseUrl } from '../../../../const/api';
import { useAsyncEffect } from 'use-async-effect';
import axios from 'axios';
import MaterialTable from 'material-table';
import tableIcons from 'components/table_icon/icon';
import DetailsHeader from './utils/detailsHeader'

// const styles = {
//   cardCategoryWhite: {
//     color: 'rgba(255,255,255,.62)',
//     margin: '0',
//     fontSize: '14px',
//     marginTop: '0',
//     marginBottom: '0',
//   },
//   cardTitleWhite: {
//     color: '#FFFFFF',
//     marginTop: '0px',
//     minHeight: 'auto',
//     fontWeight: '300',
//     fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
//     marginBottom: '3px',
//     textDecoration: 'none',
//   },
//   cardBack: {
//     color: '#FFFFFF',
//     backgroundColor: 'blue',
//   },
// };
// const useStyles = makeStyles(styles);

const Details = ({ token, editData }) => {
  const [product, setProduct] = React.useState(null);
  const [load, setLoad] = React.useState(false);

  const productsDetailsUrl = `${baseUrl}/product_sale_return_customer_van_route_details`;

  useAsyncEffect(async (isMounted) => {

    try {
        const resu = await axios.post(
            productsDetailsUrl,
              {
                product_sale_return_customer_van_route_id: editData.id,
              },
              {
                headers: { Authorization: 'Bearer ' + token },
              }
            );

    setProduct(resu.data.data)
    setLoad(true)
    } catch (error) {
        console.log(error)
        
    }

  }, []);

  const columns = [
    {
      title: 'Name',
      field: 'product_name',
      render: (rowData) => (
        <Typography variant="subtitle2" style={{ width: '250px' }}>
          {rowData.product_name}
        </Typography>
      ),
    },
    { title: 'Unit', field: 'product_unit_name' },
    {
      title: 'Price',
      field: 'mrp_price',
    },
    {
      title: 'Quantity',
      field: 'qty',
    },

  ];

  return (
    <div style={{ padding: '20px 30px'}}>

   <DetailsHeader invoiceData={editData}/>
      <GridContainer >
        {load && (
          <MaterialTable
            title="Product List"
            columns={columns}
            data={product}
            icons={tableIcons}
            options={{
                actionsColumnIndex: -1,
                search: true,
                pageSize: 12,
                pageSizeOptions:[12],

                padding: "dense",
            }}
            style={{ width: '100%' }}
          />
        )}
      </GridContainer>
    </div>
  );
};



export default Details;
