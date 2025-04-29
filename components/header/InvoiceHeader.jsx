import { Box, Grid, Typography } from '@material-ui/core';
import React from 'react';
import PhoneIcon from '@material-ui/icons/Phone';
import MailOutlineOutlinedIcon from '@material-ui/icons/MailOutlineOutlined';
import LanguageOutlinedIcon from '@material-ui/icons/LanguageOutlined';
import LocationOnIcon from '@material-ui/icons/LocationOn';

const InvoiceHeader = () => {
  return (
    <div style={{marginTop:'6px'}}>
      <Box>
        <Grid container direction="column">

        
        <Box style={{textAlign:'center',margin:'10px'}}>  
          <img style={{width:"490px"}} src="/bbLarge.png" alt=""  height="67px" />

        </Box>


          <Grid
            item
            xs={12}
            container
            direction="row"
            justify="center"
            alignItems="center"
            gap={1}
            // textAligh="center"
            >
            <Grid item style={{ display: 'inline-block' }}>
              <Typography variant="subtitle2" style={{ marginRight: '5px', fontWeight: 'bold' }}>
                <PhoneIcon
                  // fontSize="default"
                  color="primary"
                  style={{fontSize:"19px", marginRight: '2px', marginBottom: '-5px' }}
                />
                +8801902890181
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle2" style={{ marginRight: '5px',fontWeight: 'bold' }}>
                <MailOutlineOutlinedIcon
                  // fontSize="default"
                  color="primary"
                  style={{fontSize:"19px",marginRight: '2px', marginBottom: '-5px' }}
                />
                support@boibichitra.com
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle2" style={{marginRight: '5px', fontWeight: 'bold' }}>
                <LanguageOutlinedIcon
                  // fontSize="default"
                  color="primary"
                  style={{fontSize:"19px", marginRight: '2px', marginBottom: '-5px' }}
                />
                www.boibichitra.com
              </Typography>
            </Grid>
          </Grid>


          <Grid
            item
            xs={12}
            container
            direction="row"
            justify="center"
            alignItems="center">
            <Box mt={0} item style={{ display: 'inline-block' }}>
              <Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>
                <LocationOnIcon
                  // fontSize="default"
                  color="primary"
                  style={{fontSize:"19px", marginRight: '5px', marginBottom: '-5px' }}
                />
                6, Kalabagan Bus Stand, Mirpur Road, Dhaka-1205, Bangladesh
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default InvoiceHeader;
