import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Box, Button, Icon } from '@material-ui/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRootStore } from 'models/root-store-provider';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100vw',
    height: '100%',
    backgroundColor: '#e6e6e6',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export const LayoutCustomer = observer(({ children }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const { user } = useRootStore();
  const router = useRouter();
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const logout = () => {
    user.logOut();
    console.log('logout');
    router.push('/login');
    //window.location.href = window.location.origin + "/auth/login";
  };
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className={classes.root}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <img src="/logo.png" alt="Boibichitra" width="150px" />
          </Typography>
          {/* <Box mr={2}>
            <Avatar style={{ backgroundColor: "#0c4da2" }}>
              <Typography variant="subtitle2">0 ৳</Typography>{" "}
            </Avatar>
          </Box> */}

          <Avatar
            onClick={handleClick}
            alt="userName"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfmJO1vZOid-nPBHG4aMhenFmy5zW4qPg_-g&usqp=CAU"
          />
        </Toolbar>
      </AppBar>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
      <div>{children}</div>
    </div>
  );
});
