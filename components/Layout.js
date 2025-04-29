import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Menu from '@material-ui/core/Menu';
import Avatar from '@material-ui/core/Avatar';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import admin_routes from './../admin_routes';
import { Box, Button, Icon } from '@material-ui/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRootStore } from 'models/root-store-provider';
import { observer } from 'mobx-react-lite';
import Tooltip from '@material-ui/core/Tooltip';
import { motion } from 'framer-motion';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  activeRoute: {
    backgroundColor: '#69aafd',
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    fontWeight: 'bold',
  },
}));

export const Layout = observer(({ children }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(true);
  const { user } = useRootStore();
  const router = useRouter();
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [openList, setOpenList] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleClickList = (path, collapse) => {

    if(collapse){
      if(openList == path){
        return setOpenList(null)
       }else{
         setOpenList(path);
       }
    }else{
          setOpenList(path);
          router.push(path);
    }
  };

  // const handleClickList = (path, collapse) => {
  //   if (collapse) {
  //     setOpenList(path);
  //   } else {
  //     setOpenList(path);
  //     router.push(path);
  //   }
  // };

  const logout = () => {
    user.logOut();
    console.log('logout');
    router.push('/login');
    handleClose()

  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      {router.pathname != '/login' && (
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap style={{ flexGrow: 1 }}>
              Welcome Back {user.name} (Role: {user?.details?.role})
            </Typography>


        
            <Avatar
        sx={{ width: 24, height: 24 }}
             alt="Remy Sharp" 
             src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReg_F1DaALJ6YrWo_QI0Uh3t7ZtXXCTwCMED__q3IoW9WcCrtsmOenkqBS54131SqIDmE&usqp=CAU" 
             onClick={handleClick}
             />
          </Toolbar>
        </AppBar>
      )}

      {(router.pathname != '/login') & user.isLoggedIn ? (
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}>
          <div className={classes.toolbar}>

          <Typography variant="h6" >
          DeliverEase
            </Typography>
      
          
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? (
                <ChevronRightIcon color="primary" />
              ) : (
                <ChevronLeftIcon color="primary" />
              )}
            </IconButton>
          </div>
          <Divider />
          <List>
            {admin_routes.map((route, index) => (
              <>
             
                <ListItem
                  button
                  onClick={() => handleClickList(route.path, route.collapse)}
                  className={
                    router.pathname == route.path ? classes.activeRoute : ''
                  }
     
                >
                    
                  <Tooltip title={route.name} placement="right">
                    <ListItemIcon>
                      <route.icon color="primary" />
                    </ListItemIcon>
                  </Tooltip>


                  <ListItemText primary={route.name} disableTypography={true} />
           
                  {route.collapse && (
                    <Box>
                      {openList == route.path ? <ExpandLess /> : <ExpandMore />}
                    </Box>
                  )}
                </ListItem>
               

                {route.collapse && (
                  <Collapse
                    in={openList == route.path ? true : false}
                    timeout="auto"
                    unmountOnExit>
                    <List
                      component="div"
                      disablePadding
                      style={{ marginLeft: 8 }}>
                      {route.childs.map((child) => (
                        <Link href={child.path + child.childPath} key={index}>
                          <a>
                            <ListItem
                              button
                              className={classes.nested}
                              className={
                                router.pathname == child.path + child.childPath
                                  ? classes.activeRoute
                                  : ''
                              }>
                              <Tooltip title={child.name} placement="right">
                                <ListItemIcon>
                                  <child.icon color="primary" />
                                </ListItemIcon>
                              </Tooltip>
                              <ListItemText
                                primary={child.name}
                                disableTypography={true}
                              />
                            </ListItem>
                          </a>
                        </Link>
                      ))}
                    </List>
                  </Collapse>
                )}
              </>
            ))}
          </List>
        </Drawer>
      ) : <span></span>}

      <main className={classes.content}>
        <div className={classes.toolbar} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>
          {children}
        </motion.div>
      </main>


      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
       <MenuItem onClick={()=>{
         handleClose()
         router.push('/business_setting/list')
         } } >Setting</MenuItem>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </div>
  );
});



