import React from 'react';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';
import Gurd from '../../components/guard/Gurd';
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useRootStore } from '../../models/root-store-provider';
import { observer } from 'mobx-react-lite';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import { Box, Chip, Grid } from '@material-ui/core';
import useSWR from 'swr';

import { baseUrl } from '../../const/api';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const styles = {
  cardCategoryWhite: {
    '&,& a,& a:hover,& a:focus': {
      color: 'rgba(255,255,255,.62)',
      margin: '0',
      fontSize: '14px',
      marginTop: '0',
      marginBottom: '0',
    },
    '& a,& a:hover,& a:focus': {
      color: '#FFFFFF',
    },
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
    '& small': {
      color: '#777',
      fontSize: '65%',
      fontWeight: '400',
      lineHeight: '1',
    },
  },
};

const useStyles = makeStyles(styles);


const title = 'business Setting';
const subject = 'role';
const endpoint = {
  list: 'roles',
  create: 'role_permission_create',
  edit: 'role_permission_update',
  delete: 'user_delete',
};

const TableList = observer(() => {
  const classes = useStyles();
  const { user } = useRootStore();
  const [editData, setEditData] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openWarning, setOpenWarning] = useState(false);

  const handleClickWarning = () => {
    setOpenWarning(true);
  };
  const handleCloseWarning = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenWarning(false);
  };



  const fetcher = (url, auth) =>
    axios
      .get(url, {
        headers: { Authorization: 'Bearer ' + auth },
      })
      .then((res) => res.data);

  const url = `${baseUrl}/business_setting_list_active`;
  const { data, error, mutate } = useSWR([url, user.auth_token], fetcher);


  const handleActive = async (activeId) => {
      try {
          await axios.post(
            `${baseUrl}/business_setting_update_current_active`,
            {
              activeId: activeId,
            },
            {
              headers: { Authorization: 'Bearer ' + user.auth_token },
            }
          );
          mutate();
          
      } catch (error) {
          console.log(error)
      }


  };







  return (
    <Gurd subject={subject}>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <Grid container spacing={1}>
                <Grid container item xs={6} spacing={3} direction="column">
                  <Box p={2}>
                    <h4 className={classes.cardTitleWhite}>{title} List</h4>
                  
                  </Box>
                </Grid>
               
              </Grid>
            </CardHeader>
            <CardBody>
            <TableContainer >
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell >VAT No</TableCell>
            <TableCell >Logo</TableCell>
            <TableCell >Activation</TableCell>
       
          
          </TableRow>
        </TableHead>
        <TableBody>
        
          {

              data?.response?.businessSettings?.map((item,index)=>(
                <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {item.title}
                </TableCell>
                <TableCell >{item.vat_no}</TableCell>
                <TableCell >
                <img  style={{height:"90px",width:"90px"}} src={`/img/${item?.logo}`} alt="" />
                </TableCell>
                <TableCell align="right">

                    {
                        item?.current_active == 0 ? <Button onClick={()=>handleActive(item.id)}>Active</Button> :  <Button>Activated</Button>
                    }
                </TableCell>
              
              </TableRow>
              ))
          }
        </TableBody>
      </Table>
    </TableContainer>

</CardBody> 
          </Card>
      

        </GridItem>
      </GridContainer>
      <Snackbar
        open={openWarning}
        autoHideDuration={2000}
        onClose={handleCloseWarning}>
        <Alert onClose={handleCloseWarning} severity="warning">
          You dont't have permission!
        </Alert>
      </Snackbar>
    </Gurd>
  );
});

export default TableList;
