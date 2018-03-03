import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Hidden from 'material-ui/Hidden';
import Divider from 'material-ui/Divider';
import {  Link } from 'react-router-dom';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

import MenuIcon from 'material-ui-icons/Menu';
import WifiIcon from 'material-ui-icons/Wifi';
import SystemUpdateIcon from  'material-ui-icons/SystemUpdate';
import AccessTimeIcon from 'material-ui-icons/AccessTime';
import SettingsInputAntennaIcon from 'material-ui-icons/SettingsInputAntenna';

const drawerWidth = 250;

const styles = theme => ({
  root: {
    zIndex: 1,
    width: '100%',
    height: '100%',
  },
  toolbar: {
    paddingLeft: theme.spacing.unit,
    paddingRight:  theme.spacing.unit,
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing.unit * 3,
      paddingRight: theme.spacing.unit  * 3,
    }
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  appBar: {
    position: 'absolute',
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  drawerPaper: {
    width: drawerWidth,
    height: '100%',
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      position:'fixed',
      left:0,
      top:0,
      overflow:'auto'
    },
  },
  content: {
    backgroundColor: theme.palette.background.default,
    width:"100%",
    marginTop: 56,
    [theme.breakpoints.up('md')]: {
      paddingLeft: drawerWidth
    },
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64,
    },
  },
});

class MenuAppBar extends React.Component {
  state = {
    mobileOpen: false,
  };

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  render() {
    const { classes, theme, children, sectionTitle } = this.props;

    const drawer = (
      <div>
        <Toolbar>
            <Typography variant="title" color="primary">
              ESP8266 React
            </Typography>
          <Divider absolute />
        </Toolbar>
        <Divider />
        <List>
          <ListItem button component={Link} to='/wifi-configuration'>
            <ListItemIcon>
              <WifiIcon />
            </ListItemIcon>
            <ListItemText primary="WiFi Configuration" />
          </ListItem>
          <ListItem button component={Link} to='/ap-configuration'>
            <ListItemIcon>
              <SettingsInputAntennaIcon />
            </ListItemIcon>
            <ListItemText primary="AP Configuration" />
          </ListItem>
          <ListItem button component={Link} to='/ntp-configuration'>
            <ListItemIcon>
              <AccessTimeIcon />
            </ListItemIcon>
            <ListItemText primary="NTP Configuration" />
          </ListItem>
          <ListItem button component={Link} to='/ota-configuration'>
            <ListItemIcon>
              <SystemUpdateIcon />
            </ListItemIcon>
            <ListItemText primary="OTA Configuration" />
          </ListItem>
        </List>
      </div>
    );

    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar className={classes.appBar}>
            <Toolbar className={classes.toolbar} disableGutters={true}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={this.handleDrawerToggle}
                className={classes.navIconHide}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="title" color="inherit" noWrap>
                {sectionTitle}
              </Typography>
            </Toolbar>
          </AppBar>
          <Hidden mdUp>
            <Drawer
              variant="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={this.state.mobileOpen}
              classes={{
                paper: classes.drawerPaper,
              }}
              onClose={this.handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden smDown implementation="css">
            <Drawer
              variant="permanent"
              open
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <main className={classes.content}>
            {children}
          </main>
        </div>
      </div>
    );
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  sectionTitle: PropTypes.string.isRequired,
};

export default withStyles(styles, { withTheme: true })(MenuAppBar);