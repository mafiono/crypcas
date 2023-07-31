import React, { Component } from "react";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import { Collapse, Grid, LinearProgress, Hidden, Box } from "@material-ui/core";
import { Switch, Route, Link } from "react-router-dom";
import { themeInLightMode } from "../../helpers/theme";
import { headerLogoLight, headerLogoDark } from "../../helpers/images";
import Navigation from "./Navigation";
import Account from "./Account";
import Mobile from "./Mobile";
import {
  getProcessing,
  getHeaderCollapsed,
  getUser,
} from "../../redux/selectors";
import PlayerBalance from "../reusable/PlayerBalance";
// import intl from 'react-intl-universal';

@connect((state) => ({
  user: getUser(state),
  headerCollapsed: getHeaderCollapsed(state),
  processing: getProcessing(state),
}))
@withStyles((theme) => ({
  root: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  headerCompensation: {
    height: "96px",
    transition: "0.2s all",
    [theme.breakpoints.down("sm")]: {
      height: "108px",
    },
  },
  topBar: {
    position: "relative",
    height: "24px",
    backgroundColor: "black",
    [theme.breakpoints.down("sm")]: {
      height: "36px",
    },
  },
  loadBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  logo: {
    maxHeight: "35px",
    maxWidth: "40vw",
  },
  mainBar: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    borderBottom: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(0, 10),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(0, 5),
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(0, 2),
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(0, 1),
    },
  },
  unsetWidth: {
    width: "unset",
  },
}))
class Header extends Component {
  render() {
    const { classes, processing, headerCollapsed, user } = this.props;

    const headerCompStyle = headerCollapsed ? { height: 0 } : {};

    const logo = themeInLightMode() ? headerLogoLight : headerLogoDark;

    return (
      <>
        <header className={classes.root}>
          <Collapse in={!headerCollapsed} timeout={200}>
            <div className={classes.topBar}>
              {user.signedIn && (
                <Switch>
                  <Route path="/game/play"></Route>
                  <Route path="/">
                    <Hidden smUp>
                      <Box textAlign="center">
                        <PlayerBalance />
                      </Box>
                    </Hidden>
                  </Route>
                </Switch>
              )}
              {processing && <LinearProgress className={classes.loadBar} />}
            </div>
            <div className={classes.mainBar}>
              <Grid
                container
                alignItems="stretch"
                wrap="nowrap"
                style={{ minHeight: "72px" }}
              >
                <Hidden lgUp>
                  <Grid
                    container
                    item
                    alignItems="center"
                    className={classes.unsetWidth}
                  >
                    <Mobile />
                  </Grid>
                </Hidden>
                <Grid item style={{ display: "flex", alignItems: "center" }}>
                  <Link to="/">
                    <img className={classes.logo} src={logo} alt="logo" />
                  </Link>
                </Grid>
                <Hidden mdDown>
                  <Grid
                    container
                    item
                    xs
                    justify="center"
                    alignItems="stretch"
                    className={classes.unsetWidth}
                  >
                    <Navigation />
                  </Grid>
                </Hidden>
                <Hidden lgUp>
                  <Grid item xs></Grid>
                </Hidden>
                <Grid
                  container
                  item
                  alignItems="center"
                  className={classes.unsetWidth}
                >
                  <Account />
                </Grid>
              </Grid>
            </div>
          </Collapse>
        </header>
        <div
          className={classes.headerCompensation}
          style={headerCompStyle}
        ></div>
      </>
    );
  }
}
export default Header;
