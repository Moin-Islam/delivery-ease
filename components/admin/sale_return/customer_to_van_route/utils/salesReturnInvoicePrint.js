import { Box, Divider, Grid, Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';
import QRCode from 'qrcode.react'
import {convertFristCharcapital, dateFormatIssueDate} from '../../../../../helper/getMonthToNumber'

const SalesReturnInvoicePrint = React.forwardRef(({buniessDetails, inv, invoiceProduct }, ref) => {

 
console.log( inv );
  const totalQty = invoiceProduct?.reduce(
    (accumulator, currentValue) => accumulator + currentValue.qty,
    0
  );

  const  numberWithCommas = (x)=>{
    
      if(x==0){
        return 0
      }
      if(x){
        const y  = x.toFixed(2)
        return y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
      }
      return 0

    }
const base64qrcodevalue = (data) =>{
  let key = `01`
        // seller name
        //const name = 'Al Insaf Al Mutamaiyeza Est.'
        const name =buniessDetails?.title || ''
        const vat_no =buniessDetails?.vat_no || ''

        let nameLength = name?.length?.toString(16)
       
        // userData1.name?.length.toString(16)
        if (nameLength?.length < 2) {
            key = key + `0${nameLength}`
        } else {
            key = key + nameLength
        }
        const nameHex = Buffer.from(name, 'utf8').toString('hex')
        key = key + nameHex

        // Vat Registration
        const reg = vat_no
        let codeLength = reg.length.toString(16)  // will change 
        if (codeLength.length < 2) {
            key = key + `020${codeLength}`
        } else {
            key = key + `02${codeLength}`
        }
        const regHex = Buffer.from(reg, 'utf8').toString('hex')
        key += regHex

        //time stamp
        const time = data?.product_sale_return_date
        // new Date().toISOString();
        let timeLength = time.length.toString(16)
        if (timeLength.length < 2) {
            key = key + `030${timeLength}`
        } else {
            key = key + `03${timeLength}`
        }
        const timeHex = Buffer.from(time, 'utf8').toString('hex')
        key = key + timeHex

        //Total Money
        let total
        if (data?.total_amount?.toString().includes('.')) {
            total = data?.total_amount?.toString()
        } else {
            total = data?.total_amount?.toString() + '.00'
        }

        // data?.total_amount?.toString();
        let totalLength = total.length.toString(16)
        if (totalLength.length < 2) {
            key = key + `040${totalLength}`
        } else {
            key = key + `04${totalLength}`
        }
        const totalHex = Buffer.from(total, 'utf8').toString('hex')
        key = key + totalHex

        //Total Vat

        let vat
        if (data?.total_vat_amount?.toString().includes('.')) {
            vat = data?.total_vat_amount?.toString()
        } else {
            vat = data?.total_vat_amount?.toString() + '.00'
        }

        // data?.total_vat_amount?.toString();
        let vatLength = vat.length.toString(16)
        if (vatLength.length < 2) {
            key = key + `050${vatLength}`
        } else {
            key = key + `05${vatLength}`
        }
        const vatHex = Buffer.from(vat, 'utf8').toString('hex')
        key = key + vatHex

        // console.log('key: ', key)
        var base64String = Buffer.from(key, 'hex').toString('base64')
        return base64String
        // console.log('base64: ', base64String)
}


  return (
    <div ref={ref}>
  
      {inv && (
        <Grid container direction="column" style={{ paddingRight:"20px", paddingLeft:"20px" }}>
                <Typography variant="subtitle1" align="center">
                فاتورة ضريبية
                </Typography>

                <Typography variant="subtitle1" align="center">
                Tax Invoice
                </Typography>


          <Box>
            <Grid
  
            container
              direction="column"
              justify="center"
              alignItems="center">
                <Box>
                  <img  style={{height:"90px",width:"90px"}} src={`/img/${buniessDetails?.logo}`} alt="" />
                </Box>
             
              <Typography variant="subtitle2" align="center">
              {buniessDetails?.title}
              </Typography>
              <Typography variant="subtitle2" align="center">
              VAT NO: {buniessDetails?.vat_no}
              </Typography>
            </Grid>
          </Box>
        


                <Grid container spacing={1} direction="row" style={{ marginTop:"10px", marginBottom:"7px" }}>
                    <Grid item xs={9}>

            <Box pl={3} pr={2}>
  
        
                <Typography variant="body2" align="left">
                Invoice No (رقم الفاتورة): {convertFristCharcapital(inv.invoice_no)}
                </Typography>

                <div style={{display:"flex"}}> 
                    <div>
                        <Typography variant="body2" align="left">
                       Date (تاريخ):  
                       </Typography>
                    </div>

                    <div>
                        <Typography variant="body2" align="left">
                        {inv?.product_sale_return_date}
                      </Typography>
                    </div>    
                  </div>
           

                {/* <Typography variant="body2" align="left">
                Date & Time (التاريخ و الوقت): {inv.sale_date_time}
                </Typography> */}

                  <Typography variant="body2" align="left">
                  Route (طريق): {inv?.store_name}
                </Typography>

                  <div style={{display:"flex"}}> 
                    <div>
                        <Typography variant="body2" align="left">
                        Salesman ID (معرف البائع):
                        </Typography>
                    </div>

                    <div>
                        <Typography variant="body2" align="left">
                        {inv?.sales_man_user_id}
                      </Typography>
                    </div>    
                  </div>
           
                <Typography variant="body2" align="left">
                  Salesman (بائع): {inv?.user_name}
                </Typography>

              
           


                <Typography variant="body2" align="left" style={{display:"flex"}}>
                 Customer Code (كود العميل): {inv?.customer_code}
                </Typography>

                <Typography variant="body2" align="left">
                  Customer Name (اسم الزبون): {inv?.customer_name}
                </Typography>

                <div style={{display:"flex"}}> 
                    <div>
                        <Typography variant="body2" align="left">
                        Customer VAT NO (ضريبة القيمة المضافة للعميل):
                        </Typography>
                    </div>

                    <div>
                        <Typography variant="body2" align="left">
                        {inv?.vat_number}
                      </Typography>
                    </div>    
                  </div>




            <Grid item xs={12}>
              <Box pt={1}>
                <Divider />
              </Box>
            </Grid>
          </Box>  

                    </Grid>

                    <Grid item xs={3}>
                    <QRCode size={150} value={base64qrcodevalue(inv)} />
                    </Grid>

                </Grid>

           

          <Grid container >
            <Grid item xs={12}>
            
              <table width="100%" style={{padding:"10px"}}>
                <tr>
                  <th
                
                    >
                    SL#
                  </th>
                  <th
                    style={{
                    
                       width:"50%"
                    }}>
                   Description
                  </th>
                  <th
                   
                   >
                  U/M
                 </th>
                  <th
                   
                    >
                    Quantity
                  </th>
                  <th
                   
                    >
                    Unit Price
                  </th>
                  <th
                    
                    
                    >
                    Total Price(SAR)
                  </th>
                </tr>

                <tr>
                  <th
                    style={{
                      borderBottom: '2px solid #000000',
                      padding: '3px',
                    }}>
                    عدد#
                  </th>
                  <th
                    style={{
                      borderBottom: '2px solid #000000',
                      padding: '3px',
                       width:"50%"
                    }}>
                 يصف
                  </th>

                  <th
                    style={{
                      borderBottom: '2px solid #000000',
                      padding: '3px',
                    }}>
                   يو/م

                  </th>
                  <th
                    style={{
                      borderBottom: '2px solid #000000',
                      padding: '3px',
                    }}>
                   كمية
                  </th>
                  <th
                    style={{
                      borderBottom: '2px solid #000000',
                      padding: '3px',
                    }}>
                    سعر الوحدة
                  </th>
                  <th
                    style={{
                      borderBottom: '2px solid #000000',
                      padding: '3px',
                    }}>
                    السعر الكلي
                  </th>
                </tr>
                {invoiceProduct &&
                  invoiceProduct.map((prd, index) => (
                    <tr>
                      <td
                        style={{
                          textAlign: 'center',
                          borderBottom: '2px solid #000000',
                          paddingBottom: '3px',
                        }}>
                        {index + 1}
                      </td>
                      <td
                        style={{
                          borderBottom: '2px solid #000000',
                          paddingBottom: '3px',
                        }}>
                        {`${prd.product_name} (${prd?.arabic_name})`}
                      </td>
                      <td
                        style={{
                          textAlign: 'center',
                          borderBottom: '2px solid #000000',
                          paddingBottom: '3px',
                        }}>
                      {prd?.product_unit_name}
                      </td>
                      <td
                        style={{
                          textAlign: 'center',
                          borderBottom: '2px solid #000000',
                          paddingBottom: '3px',
                        }}>
                        {prd.qty}
                      </td>
                      <td
                        style={{
                          textAlign: 'right',
                          borderBottom: '2px solid #000000',
                          paddingBottom: '3px',
                        }}>
                        {prd.mrp_price}
                      </td>
                      <td
                        style={{
                          textAlign: 'right',
                          borderBottom: '2px solid #000000',
                          paddingBottom: '3px',
                         
                        }}>
                        {numberWithCommas(prd.qty * prd.mrp_price)}
                      </td>
                    </tr>
 
                  ))}

                        
<tr>
                      <td colSpan="3" >
                      Total Quantity (الكمية الإجمالية)
                      </td>
                      <td  style={{
                            textAlign: "center",
                       
                          }}>
                      {totalQty}
                      </td>
                    </tr>
              </table>
            </Grid>
          </Grid>

          <Box pl={3} pr={2} py={2}>
            <Grid
              container
              direction="column"
              justify="start"
              alignItems="start">
              <Grid item xs={12}>
                <TableContainer>
                  <Table aria-label="simple table" padding="none" size="small">
                 
                    <TableBody>

              
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Sub Total ( المجموع الفرعي)
                        </TableCell>
                        <TableCell align="right" style={{ fontWeight: 'bold' }}>
                          {numberWithCommas(inv.after_discount_amount -inv.discount_amount )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Discount ( خصم)
                        </TableCell>
                        <TableCell align="right" style={{ fontWeight: 'bold' }}>
                          {numberWithCommas(inv.discount_amount)}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell component="th" scope="row">
                          After Discount Amount ( بعد مبلغ الخصم)
                        </TableCell>
                        <TableCell align="right" style={{ fontWeight: 'bold' }}>
                          {numberWithCommas(inv.after_discount_amount)}
                        </TableCell>
                      </TableRow>


                      <TableRow>
                        <TableCell component="th" scope="row">
                          VAT( ضريبة القيمة المضافة)
                        </TableCell>
                        <TableCell align="right">
                          {numberWithCommas(inv.total_vat_amount)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Grand Total ( المبلغ الإجمالي)
                        </TableCell>
                        <TableCell align="right" style={{ fontWeight: 'bold' }}>
                          {numberWithCommas(inv?.total_amount)}
                        </TableCell>
                      </TableRow>
                  
               
                     
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Box>
    
        </Grid>
      )}
    </div>
  );
});
export default SalesReturnInvoicePrint;
