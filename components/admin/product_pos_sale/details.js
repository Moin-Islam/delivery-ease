import React from 'react';
import GridContainer from 'components/Grid/GridContainer.js';

import { baseUrl } from '../../../const/api';
import { useAsyncEffect } from 'use-async-effect';
import axios from 'axios';
import MaterialTable from 'material-table';
import tableIcons from 'components/table_icon/icon';


const Details = ({ token, modal, editData }) => {


  const [load, setLoad] = React.useState(false);
  const [product, setProduct] = React.useState(null);
  let products = `${baseUrl}/product_pos_sale_details`;

  useAsyncEffect(async (isMounted) => {
    console.log('edited data' + editData.id);
    const requestThree = axios.post(
      products,
      {
        product_sale_id: editData.id,
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
          setProduct(responsethree.data.response.product_pos_sale_details);
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
      title: 'MRP Price',
      field: 'mrp_price',
   
    },
    {
      title: 'Quantity',
      field: 'qty',
      render: (rowData) => rowData.qty + ' ' + rowData.product_unit_name,
    },
  ];

  return (
    <div>
      <GridContainer
        style={{ padding: '20px 30px', marginTop: 250, width: '100%' }}>
        {load && (
          <MaterialTable
            style={{ width: '100%' }}
            title="Product List"
            columns={columns}
            data={product}
            icons={tableIcons}
            options={{
              actionsColumnIndex: -1,
              exportButton: false,
              search: true,
            }}
          />
        )}
      </GridContainer>
    </div>
  );
};


export default Details;
