 import React from 'react';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import RefreshIcon from "@material-ui/icons/Refresh";
import Snackbar from '@material-ui/core/Snackbar';
import Gurd from '../../components/guard/Gurd';
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';
import axios from 'axios';
import { useRootStore } from '../../models/root-store-provider';
import { observer } from 'mobx-react-lite';
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { Box, Chip, Grid } from '@material-ui/core';
import { baseUrl } from '../../const/api';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import Create from '../../components/admin/assign_van/create';
import tableIcons from 'components/table_icon/icon';


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
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const title = 'Assign Van and salesman';
const subject = 'store_van_user';
const endpoint = {
  list: 'store_van_user_list_with_search',
  create: 'van_create',
  edit: 'van_edit',
  delete: 'van_delete',
};

const TableList = observer(() => {
  const classes = useStyles();
  const { user } = useRootStore();
  const tableRef = React.createRef();
  const handleRefress = () => {
    console.log('helko')
    tableRef.current && tableRef.current.onQueryChange();
  };

  const [editData, setEditData] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openWarning, setOpenWarning] = useState(false);



  const handleClickOpenCreate = () => {
    setOpenCreateModal(true);
  };
  const handleCloseCreate = () => {
  

    setOpenCreateModal(false);

  };

  React.useEffect(() => {
    handleRefress()
  }, [openCreateModal])



  const handleCloseWarning = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenWarning(false);
  };


  const handleCloseEdit = () => {
    setOpenEditModal(false);
  };

  

 
  const handleEnd = async (row_id) => {
     try {
        await axios.post(
      `${baseUrl}/store_van_user_end_time`,
      {
        store_van_user_id: row_id,
      },
      {
        headers: { Authorization: "Bearer " + user.auth_token },
      }
    );
    handleRefress()
     } catch (error) {
       console.log(error)
     }

  
    
  };




  const columns = [

    {
      title: "Assign Date",
      field: "start_date_time",
      render: (rowData) => (
        <Typography variant="subtitle2" style={{ width: "140px" }}>
          {rowData.start_date_time}
        </Typography>
      ),
    },
    {
      title: "End Date",
      field: "end_date_time",
      render: (rowData) => (
        <Typography variant="subtitle2" style={{ width: "140px" }}>
          {rowData.end_date_time}
        </Typography>
      ),
    },
    {
      title: "Warehouse",
      field: "warehouse_name",
      render: (rowData) => (
        <Typography variant="subtitle2" style={{ width: "180px" }}>
          {rowData.store_name}
        </Typography>
      ),
    }, 

    

    {
      title: "Route",
      field: "van_name",
      render: (rowData) => (
        <Typography variant="subtitle2" style={{ width: "180px" }}>
          {rowData.store_name}
        </Typography>
      ),
    }, 
    {
      title: "Van Name",
      field: "van_name",
      render: (rowData) => (
        <Typography variant="subtitle2" style={{ width: "180px" }}>
          {rowData.van_name}
        </Typography>
      ),
    },
    { title: 'Van Number', field: 'number' },
    { title: 'Salesman', field: 'sales_man_user_name' }, 
    {
      title: 'Status',
      field: 'status',
      render: (rowData) => (
        <Chip
          color={rowData.end_status === 0 ? 'primary' : 'secondary'}
          size="small"
          label={rowData.end_status === 0 ? 'Running' : 'Closed'}
          icon={rowData.end_status === 0 ? <CheckCircleIcon /> : <ErrorIcon />}
        />
      ),
    },
  ];


  // const handleEdit = (row) => {
  //   // if (!user.can('edit', subject)) {
  //   //   setOpenWarning(true);
  //   //   return null;
  //   // }
  //   console.log(row);
  //   setEditData(row);
  //   setOpenEditModal(true);
  // };
  const handleCreate = () => {
    // if (!user.can('create', subject)) {
    //   setOpenWarning(true);
    //   return null;
    // }
    handleClickOpenCreate(true);
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
                <Grid
                  container
                  item
                  xs={6}
                  spacing={3}
                  direction="row"
                  justify="flex-end"
                  alignItems="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreate}>
                    Create {title}
                  </Button>
                </Grid>
              </Grid>
            </CardHeader>
            <CardBody>
 
                <MaterialTable
                  icons={tableIcons}
                  title="List"
                  tableRef={tableRef}
                  columns={columns}
                  data={query =>
                    new Promise((resolve, reject) => {
                     
                      let url = `${baseUrl}/${endpoint.list}?`;
                      //searching
                      if (query.search) {
                        url += `search=${query.search}`
                      }
                    
                      url += `&page=${query.page + 1}`
                      fetch(url,{
                            method: "POST",
                            headers: { Authorization: "Bearer " + user.auth_token },
                          }
                        ).then(resp => resp.json()).then(resp => {
           
                          
                        resolve({
                              data: resp?.data,
                              page:  resp?.meta?.current_page - 1,
                              totalCount: resp?.meta?.total,
                        });
                      })
          
                    })
                  }
  
          
                  actions={[

                    (rowData) => ({
                      icon: () => (
                        <Button
                          fullWidth={true}
                          variant="contained"
                          color="secondary"
                          disabled={rowData.end_status === 1}
                        
                          >
                          <CloseIcon
                            fontSize="small"
                            color="white"
                          />
                          
                        </Button>
                      ),
                     tooltip: 'End Action',
                      onClick: (event, rowData) => (
                        rowData.end_status === 0 ? handleEnd(rowData.id) : (null)
                     
                       
                      ),
                     
                    }),
                    // handleEnd(rowData.id)
                    // {
                    //   icon: () => (
                    //     <Button
                    //       fullWidth={true}
                    //       variant="contained"
                    //       color="primary">
                    //       <EditTwoToneIcon fontSize="small" color="white" />
                    //     </Button>
                    //   ),

                    //   tooltip: 'Edit User',
                    //   onClick: (event, rowData) => handleEdit(rowData),
                    // },
                
                    {
                      icon: RefreshIcon,
                      tooltip: "Refresh Data",
                      isFreeAction: true,
                      onClick: () => handleRefress(),
                    },
                  ]}
                  options={{
                    actionsColumnIndex: -1,
                    search: true,
                    pageSize: 12,
                    pageSizeOptions: [12],
                    padding: 'dense',
                  }}
                />
          
            </CardBody>
          </Card>
          <Dialog
            fullScreen
            open={openCreateModal}
            onClose={handleCloseCreate}
            TransitionComponent={Transition}>
            <AppBar style={{ position: 'relative' }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleCloseCreate}
                  aria-label="close">
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" style={{ flex: 1 }}>
                  Create {title}
                </Typography>
              </Toolbar>
            </AppBar>
            <Create
              token={user.auth_token}
              modal={setOpenCreateModal}
              endpoint={endpoint.create}
              mutate={handleRefress}
            />
          </Dialog>

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
