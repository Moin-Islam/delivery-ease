import {  Grid  } from '@material-ui/core';
import React from 'react';
import { useBarcode } from '@createnextapp/react-barcode';

const Barcode = React.forwardRef(
  (
    { inv, invoiceProduct, barProd, barProdName, barProdPrice, vatStatus },
    ref
  ) => {


    const [value, setValue] = React.useState('initial');

    React.useEffect(() => {
      setValue(barProd);
    }, [barProd]);

    const { inputRef } = useBarcode({
      value: value,
      options: {
        width: 1,
        height: 40,
        textMargin: 0,
        fontSize: 13,
        margin: 0,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 3,
        marginRight: 3,
      },
    });

    return (
      <div ref={ref}>

        <Grid container direction="column" justify="center" alignItems="center">
          <p
            style={{
              padding: 0,
              margin: 0,
              marginTop: 0,
              fontSize: 13,
              fontWeight: 'bold',
            }}>
            DeliverEase
          </p>
          <svg ref={inputRef} />
          {barProdName && (
            <p style={{ padding: 0, margin: 0, fontSize: 12 }}>
              {barProdName.substring(0, 24)}
            </p>
          )}
          <p
            style={{ padding: 0, margin: 0, fontSize: 12, fontWeight: 'bold' }}>
            Price {barProdPrice} {vatStatus ? '+vat' : ''}
          </p>
        </Grid>


      </div>
    );
  }
);
export default Barcode;
