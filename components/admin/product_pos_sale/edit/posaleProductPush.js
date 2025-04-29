import React, { useEffect } from "react";
import Axios from "axios";
import { baseUrl } from "../../../../const/api";;



const WholeProduct = ({
  push,
  token,
  id,
}) => {

  useEffect(() => {
    Axios.post(
      `${baseUrl}/product_pos_sale_details`,
      {
        product_sale_id: id,
      },
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
      .then((res) => {

       
        res.data.response.product_pos_sale_details.map((prd) =>
          push({
            product_sale_detail_id: prd.product_sale_detail_id,
            product_id: prd.product_id,
            product_name: prd.product_name,
            product_unit_id: prd.product_unit_id,
            product_unit_name: prd.product_unit_name,
            product_brand_id: prd.product_brand_id,
            product_brand_name: prd.product_brand_name,
            selling_price: prd.mrp_price,
            vat_amount: prd.vat_amount,
            qty: prd.qty,
            current_stock: prd.current_stock,
            exits_qty: Number(prd.qty) + Number(prd.current_stock),
          })
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
 
  return <div></div>;
};
export default WholeProduct;
