import React from 'react';
import { Field } from 'formik';
import cogoToast from 'cogo-toast';
import { TextField } from 'formik-material-ui';
import { baseUrl } from '../../../../const/api';
import axios from 'axios';

const BarcodeField = ({
  setOpenError,
  values,
  products,
  push,
  replace,
  token,
  warehouse_id,
}) => {
  const [barcode, setBarcode] = React.useState('');
  const debouncedValue = useDeboounce(barcode, 800);
  React.useEffect(() => {
    (() => {
      if (barcode == '') {
        console.log('barcode 0');
      } else {
        axios
          .all([
            axios.post(
              `${baseUrl}/all_active_product_list_barcode`,
              {
                barcode: barcode,
                warehouse_id:warehouse_id
              },
              {
                headers: { Authorization: 'Bearer ' + token },
              }
            ),
          ])
          .then(
            axios.spread((...responses) => {
              const responsethree = responses[0];
              const __FOUND = responsethree.data.response.products;
              if (__FOUND.length == 0) {
                cogoToast.error('Product Not Found',{position: 'top-right', bar:{size: '10px'}});
                setBarcode('');
              } else {
                var found = values.products.find(function (p, index) {
                  if (p.product_id == __FOUND[0].product_id) return true;
                });
                if (found == undefined) {
                  push({
                    product_id: __FOUND[0].id,
                    product_name: __FOUND[0].product_name,
                    product_unit_id: __FOUND[0].unit_id,
                    product_unit_name: __FOUND[0].unit_name,
                    product_category_id: __FOUND[0].category_id,
                    product_category_name: __FOUND[0].category_name,
                    product_brand_id: __FOUND[0].brand_id,
                    product_brand_name: __FOUND[0].brand_name,
                    price: __FOUND[0].purchase_price,
                    mrp_price: __FOUND[0].selling_price,
                    stock: __FOUND[0].current_stock,
                    qty: 0,
                    product_type: 'new',
                    product_purchase_detail_id: ''
                  });
                  setBarcode('');
                  cogoToast.success('Product Added',{position: 'top-right', bar:{size: '10px'}});
                } else {
                  let index = values.products.findIndex(
                    (pr) => pr.product_id == found.product_id
                  );
                  replace(index, {
                    product_id: __FOUND[0].id,
                    product_name: __FOUND[0].product_name,
                    product_unit_id: __FOUND[0].unit_id,
                    product_unit_name: __FOUND[0].unit_name,
                    product_category_id: __FOUND[0].category_id,
                    product_category_name: __FOUND[0].category_name,
                    product_brand_id: __FOUND[0].brand_id,
                    product_brand_name: __FOUND[0].brand_name,
                    price: __FOUND[0].purchase_price,
                    mrp_price: __FOUND[0].selling_price,
                    stock: __FOUND[0].current_stock,
                    qty: found.qty + 1,
                    product_type: 'new',
                    product_purchase_detail_id: ''
                  });
                  setBarcode('');
                  cogoToast.success(`Quantity Updated for ${__FOUND[0].product_name}`,{position: 'top-right', bar:{size: '10px'}});
                }
              }
            })
          )
          .catch((errors) => {
            cogoToast.warn('Product Not Found',{position: 'top-right', bar:{size: '10px'}});
            console.error(errors);
          });
      }
    })();
  }, [debouncedValue,warehouse_id]);

  const findByBarcode = (e) => {
    setBarcode(e.target.value);
  };
  return (
    <div>
      <Field
        component={TextField}
        variant="outlined"
        margin="normal"
        fullWidth
        autoFocus={true}
        type="text"
        label="Search by barcode"
        name="barcode"
        value={barcode}
        onChange={findByBarcode}
      />
    </div>
  );
};
export default BarcodeField;

const useDeboounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
