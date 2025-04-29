import React from 'react';
import cogoToast from 'cogo-toast';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { baseUrl } from 'const/api';
import axios from 'axios';

export default function ProductName({
  token,
  warehouse_id,
  setOpenError,
  values,
  products,
  push,
  replace,
}) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;
  const [currentValue, setCurrentValue] = React.useState(false);
  const handleValue = (val) => {
    console.log(val);
    if (val.length > 2) {
      setCurrentValue(val);
    }
  };
/// stock check
  // if(__FOUND.current_stock < 1){
  //   setOptions([]);
  //   cogoToast.error('Out of stock',{position: 'top-right', bar:{size: '10px'}});
  //      return null
  // }

  React.useEffect(() => {
 
    (async () => {
      await axios
        .all([
          axios.post(
            `${baseUrl}/product_list_pagination_product_name?page=1`,
            {
              name: currentValue,
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
            setOptions(responsethree.data.response.products.data);
          
          })
        )
        .catch((errors) => {
          console.error(errors);
        });

    })();

  }, [currentValue,warehouse_id]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  function addprod(__FOUND) {
    setCurrentValue('');
    if (!__FOUND) {
      return;
    } 
    var found = values.products.find(function (p, index) {
      if (p.product_id == __FOUND.id) return true;
    });
    if (found == undefined) {
      push({ 
        product_id: __FOUND.id,
        product_name: __FOUND.product_name,
        product_category_id: __FOUND.category_id,
        product_category_name: __FOUND.category_name,
        product_unit_id: __FOUND.unit_id,
        product_unit_name: __FOUND.unit_name,
        product_brand_id: __FOUND.brand_id,
        product_brand_name: __FOUND.brand_name,
        price: __FOUND.purchase_price,
        mrp_price: __FOUND.selling_price,
        stock: 20,
        qty: 0,
        product_type: 'new',
        product_purchase_detail_id: ''
      });
      setOptions([]);
      cogoToast.success('Product Added',{position: 'top-right', bar:{size: '10px'}});
  
    } else {
      let index = values.products.findIndex((pr) => pr.product_id == found.id);
      replace(index, {
        product_id: __FOUND.id,
        product_name: __FOUND.product_name,
        product_unit_id: __FOUND.unit_id,
        product_unit_name: __FOUND.unit_name,
        product_category_id: __FOUND.category_id,
        product_category_name: __FOUND.category_name,
        product_brand_id: __FOUND.brand_id,
        product_brand_name: __FOUND.brand_name,
        price: __FOUND.purchase_price,
        mrp_price: __FOUND.selling_price,
        stock: 20,
        qty: found.qty + 1,
        product_type: 'new',
        product_purchase_detail_id: ''
      });
      setOptions([]);
      cogoToast.success(`Quantity Updated for ${__FOUND.product_name}`,{position: 'top-right', bar:{size: '10px'}});
  
    }
    setOpen(false);
  }
  return (
    <Autocomplete
      id="asynchronous-demo"
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={(event, newValue) => {
        addprod(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        handleValue(newInputValue);
      }}
     
      getOptionLabel={(option) =>
        option.product_name + `(${option.arabic_name})` +
        '  -> Price' +
        option.purchase_price +
        ' -> QTY '
      
      }
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search by product name"
          variant="outlined"
          margin="dense"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="primary" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
