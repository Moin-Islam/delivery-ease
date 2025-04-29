import React, { useEffect } from 'react';
const returnProduct = ({
  push,
  products,
}) => {
console.log(products)
  useEffect(() => {
    products.map((prd) =>
      push({
        product_sale_detail_id: prd.product_sale_detail_id,
        product_id: prd.product_id,
        product_name: prd.product_name,
        product_unit_id: prd.product_unit_id,
        product_unit_name: prd.product_unit_name,
        product_brand_id: prd.product_brand_id,
        product_brand_name: prd.product_brand_name,
        price: prd.price,
        mrp_price: prd.mrp_price,
        qty: 0,
        already_return_qty: prd.already_return_qty,
        exists_return_qty: prd.exists_return_qty,
        purchase_qty: prd.purchase_qty,

      })
    );
  }, []);

  return <div></div>;
};
export default returnProduct;
