// import fetch from 'cross-fetch';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { baseUrl } from 'const/api';
import axios from 'axios';

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

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

  React.useEffect(() => {

    (async () => {
      await axios
        .all([
          axios.post(
            `${baseUrl}/warehouse_current_stock_list_pagination_product_name?page=1`,
            {
              warehouse_id: warehouse_id,
              name: currentValue,
            },
            {
              headers: { Authorization: 'Bearer ' + token },
            }
          ),
        ])
        .then(
          axios.spread((...responses) => {
            const responsethree = responses[0];
            setOptions(
              responsethree.data.response.warehouse_current_stock_list.data
            );

          })
        )
        .catch((errors) => {
          console.error(errors);
        });

    })();


  }, [currentValue]);

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

    if(__FOUND.current_stock < 1){
      setOptions([]);
      setOpenError({
        open: true,
        key: '404',
        value: ['Out of stock'],
        severity: 'error',
        color: 'error',
      });
         return null
    }


    var found = values.products.find(function (p, index) {
      if (p.product_id == __FOUND.product_id) return true;
    });
    if (found == undefined) {
      push({
        product_id: __FOUND.product_id,
        product_name: __FOUND.product_name,
        product_unit_id: __FOUND.product_unit_id,
        product_unit_name: __FOUND.product_unit_name,
        product_category_id: __FOUND.category_id,
        product_category_name: __FOUND.category_name,
        product_brand_id: __FOUND.product_brand_id,
        product_brand_name: __FOUND.product_brand_name,
        purchase_price: __FOUND.purchase_price,
        mrp_price: __FOUND.selling_price,
        stock: __FOUND.current_stock,
        qty: 0,
      });
      setOptions([]);
      setOpenError({
        open: true,
        key: '404',
        value: ['Product Added'],
        severity: 'success',
        color: 'success',
      });
    } else {
      let index = values.products.findIndex(
        (pr) => pr.product_id == found.product_id
      );
      replace(index, {
        product_id: __FOUND.product_id,
        product_name: __FOUND.product_name,
        product_category_id: __FOUND.category_id,
        product_category_name: __FOUND.category_name,
        product_unit_id: __FOUND.product_unit_id,
        product_unit_name: __FOUND.product_unit_name,
        product_brand_id: __FOUND.product_brand_id,
        product_brand_name: __FOUND.product_brand_name,
        purchase_price: __FOUND.purchase_price,
        mrp_price: __FOUND.selling_price,
        stock: __FOUND.current_stock,
        qty: found.qty + 1,
      });
      setOptions([]);
      setOpenError({
        open: true,
        key: '404',
        value: [`Quantity Updated for ${__FOUND.product_name}`],
        severity: 'success',
        color: 'success',
      });
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
      // getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) =>
        option.product_name +
        '  -> Price' +
        option.purchase_price +
        ' -> QTY ' +
        option.current_stock
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
