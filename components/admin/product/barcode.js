import { Grid, Typography } from '@material-ui/core';

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
        height: 65,
        textMargin: 0,
        fontSize: 15,
        margin: 0,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
      },
    });

    return (
      <div ref={ref}>

        <Grid container direction="column" justify="center" alignItems="center">
          <p
            style={{
              padding: 0,
              margin: 0,
              marginTop: 10,
              fontSize: 15,
              fontWeight: 'bold',
            }}>
            Boi Bichitra
          </p>
          <svg ref={inputRef} />
          {barProdName && (
            <p style={{ padding: 0, margin: 0, fontSize: 13 }}>
              {barProdName.substring(0, 30)}
            </p>
          )}
          <p
            style={{ padding: 0, margin: 0, fontSize: 14, fontWeight: 'bold' }}>
             {barProdPrice} {vatStatus ? '+vat' : ''}
          </p>
        </Grid>

      </div>
    );
  }
);
export default Barcode;
