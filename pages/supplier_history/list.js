import React from 'react';
import { useState } from 'react';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
// core components
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';
import Gurd from '../../components/guard/Gurd';
import { useAsyncEffect } from 'use-async-effect';
import axios from 'axios';
import { useRootStore } from '../../models/root-store-provider';
import { observer } from 'mobx-react-lite';
// import MaterialTable from "material-table";
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { Box, Grid, Chip } from '@material-ui/core';
import CreateParty from '../../components/admin/party/create';
import useSWR from 'swr';
import EditParty from '../../components/admin/party/edit';
import { Swrloader } from '../../components/loader/Swrloader';
import { baseUrl } from '../../const/api';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import MaterialTable from 'material-table';
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

const title = 'Supplier History';
const subject = 'supplier_history';

const TableList = observer(() => {
  const classes = useStyles();
  const { user } = useRootStore();
  const [editParty, setEditParty] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openWarning, setOpenWarning] = React.useState(false);

  const handleClickWarning = () => {
    setOpenWarning(true);
  };
  const handleCloseWarning = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenWarning(false);
  };
  const handleClickOpenCreate = () => {
    setOpenCreateModal(true);
  };
  const handleCloseCreate = () => {
    setOpenCreateModal(false);
  };

  const handleClickOpenEdit = () => {
    setOpenEditModal(true);
  };
  const handleCloseEdit = () => {
    setOpenEditModal(false);
  };

  const fetcher = (url, auth) =>
    axios
      .get(url, {
        headers: { Authorization: 'Bearer ' + auth },
      })
      .then((res) => res.data);

  const url = `${baseUrl}/party_supplier_list`;
  const { data, error, mutate } = useSWR([url, user.auth_token], fetcher);


  const columns = [
    {
      title: 'Name',
      field: 'name',
      render: (rowData) => (
        <Typography variant="subtitle2" style={{ width: '250px' }}>
          {rowData.name}
        </Typography>
      ),
    },
    { title: 'Phone', field: 'phone' },
    { title: 'Address', field: 'address' },
    { title: 'Total Purchase', field: 'purchase_total_amount' },
    {
      title: 'Status',
      field: 'status',
      render: (rowData) => (
        <Chip
          color={rowData.status ? 'primary' : 'secondary'}
          size="small"
          label={rowData.status ? 'Active' : 'Inactive'}
          icon={rowData.status ? <CheckCircleIcon /> : <ErrorIcon />}
        />
      ),
    },
  ];
  const handleDelete = async (row_id) => {
    if (!user.can('delete', subject)) {
      setOpenWarning(true);
      return null;
    }
    const party = await axios.post(
      `${baseUrl}/party_delete`,
      {
        party_id: row_id,
      },
      {
        headers: { Authorization: 'Bearer ' + user.auth_token },
      }
    );
    mutate();
  };
  const handleEdit = (row) => {
    // if (!user.can('edit', subject)) {
    //   setOpenWarning(true);
    //   return null;
    // }
    setEditParty(row);
    setOpenEditModal(true);
  };
  const handleCreate = () => {
    if (!user.can('create', subject)) {
      setOpenWarning(true);
      return null;
    }
    handleClickOpenCreate(true);
  };
  return (
    <Gurd subject="party">
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <Grid container spacing={1}>
                <Grid container item xs={6} spacing={3} direction="column">
                  <Box p={2}>
                    <h3 className={classes.cardTitleWhite}>{title}</h3>
                   
                  </Box>
                </Grid>
              </Grid>
            </CardHeader>
            <CardBody>
              {data && (
                <MaterialTable
                  icons={tableIcons}
                  title="SUPPLIER LIST"
                  columns={columns}
                  data={data.response.party_suppliers}
                  options={{
                    actionsColumnIndex: -1,
                    // exportButton: false,
                    // grouping: true,
                    search: true,
                   pageSize: 12,
                    pageSizeOptions: [12],
                    padding: 'dense',
                  }}
                />
              )}
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
                  Create Party
                </Typography>
              </Toolbar>
            </AppBar>
            <CreateParty
              token={user.auth_token}
              modal={setOpenCreateModal}
              mutate={mutate}
            />
          </Dialog>

          <Dialog
            open={openEditModal}
            onClose={handleCloseEdit}
            TransitionComponent={Transition}
            fullWidth={true}
            maxWidth="lg">
            <AppBar style={{ position: 'relative' }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleCloseEdit}
                  aria-label="close">
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" style={{ flex: 1 }}>
                  Purchase History
                </Typography>
              </Toolbar>
            </AppBar>
            <EditParty
              token={user.auth_token}
              modal={setOpenEditModal}
              party={editParty}
              mutate={mutate}
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
