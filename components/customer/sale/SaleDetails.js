import React from 'react';
import { baseUrl } from 'const/api';
import { useAsyncEffect } from 'use-async-effect';
import axios from 'axios';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuBookIcon from '@material-ui/icons/MenuBook';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

const SaleDetails = ({ token, id, user_id }) => {
  const classes = useStyles();
  const [load, setLoad] = React.useState(false);
  const [sales, setSales] = React.useState(null);
  React.useEffect(async () => {
    await axios
      .post(
        `${baseUrl}/customer_sale_details_information`,
        {
          user_id: user_id,
          sale_id: id,
        },
        {
          headers: { Authorization: 'Bearer ' + token },
        }
      )
      .then((res) => {
        console.log(res.data.response);
        setSales(res.data.response.product_sale_details);
        setLoad(true);
      });
  }, []);

  return (
    <div>
      <Grid item xs={12} md={12}>
        <Typography variant="h6" className={classes.title} align="center">
          Purchased Book
        </Typography>
        <div className={classes.demo}>
          <List dense={true}>
            {sales &&
              sales.map((sale) => (
                <ListItem>
                  <ListItemIcon>
                    {<MenuBookIcon color="primary" />}
                  </ListItemIcon>
                  <ListItemText
                    primary={sale.product_name}
                    secondary={'Price ' + sale.mrp_price}
                  />
                </ListItem>
              ))}
          </List>
        </div>
      </Grid>
    </div>
  );
};
export default SaleDetails;
