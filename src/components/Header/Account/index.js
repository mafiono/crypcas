import React, { Component } from "react";
import { connect } from "react-redux";
import { Switch, Route, Link, withRouter } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import { AccountCircle } from "@material-ui/icons";
import { Button, Typography, Popover, Hidden } from "@material-ui/core/";
import intl from "react-intl-universal";
import { getUser } from "../../../redux/selectors";
import { logout as requestLogout } from "../../../helpers/request";
import ProfileOptionList from "../ProfileOptionList";
import LanguageChanger from "../../reusable/LanguageChanger";
import PlayerBalance from "../../reusable/PlayerBalance";

@withRouter
@connect((state) => ({
  user: getUser(state),
}))
@withStyles((theme) => ({
  root: {
    height: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "right",
  },
  popoverTitle: {
    padding: theme.spacing(2, 2, 0, 2),
  },
  noUnderline: {
    textDecoration: "none",
  },
  rightMargin: {
    marginRight: theme.spacing(1),
  },
  horizontalMargin: {
    margin: theme.spacing(0, 2),
  },
  noMinWidth: {
    minWidth: "unset",
  },
}))
class Account extends Component {
  state = {
    anchorEl: null,
  };

  makeOpenPopover() {
    return (e) => {
      this.setState({ anchorEl: e.currentTarget });
    };
  }

  makeClosePopover() {
    return () => {
      this.setState({ anchorEl: null });
    };
  }

  makeNavTo(loc) {
    const { history } = this.props;
    return () => {
      this.setState({ anchorEl: null });
      history.push(loc);
    };
  }

  makeDoLogout() {
    return () => {
      this.setState({ anchorEl: null });
      requestLogout();
    };
  }

  renderPopover() {
    const { anchorEl } = this.state;

    return (
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={this.makeClosePopover()}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <ProfileOptionList actionSelected={this.makeClosePopover()} />
      </Popover>
    );
  }

  renderAccount() {
    const { classes } = this.props;

    return (
      <>
        <Switch>
          <Route path="/game/play"></Route>
          <Route path="/">
            <Hidden xsDown>
              <PlayerBalance />
            </Hidden>
          </Route>
        </Switch>
        <Button
          color="secondary"
          className={`${classes.noMinWidth} ${classes.horizontalMargin}`}
          onClick={this.makeOpenPopover()}
        >
          <AccountCircle />
        </Button>
        {this.renderPopover()}
      </>
    );
  }

  render() {
    const { classes, user } = this.props;

    const SITE_NAME = process.env.REACT_APP_WEBSITE_NAME_SHORT;

    const dontHaveId = intl
      .get("account.dontHaveId", { 0: SITE_NAME })
      .defaultMessage(`You don't have a ${SITE_NAME} ID?`);
    const signUp = intl.get("account.signUp").defaultMessage("Sign Up");
    const alreadyHaveId = intl
      .get("account.alreadyHaveId", { 0: SITE_NAME })
      .defaultMessage(`Already have a ${SITE_NAME} ID?`);
    const signIn = intl.get("account.signIn").defaultMessage("Sign In");

    // What you see when the url is at /login
    const loginPath = (
      <Route path="/login">
        <Hidden mdDown>
          <Typography className={classes.rightMargin}>{dontHaveId}</Typography>
        </Hidden>
        <Link to="/register" className={classes.noUnderline}>
          <Button color="primary" variant="contained">
            {signUp}
          </Button>
        </Link>
        <Typography>&nbsp;</Typography>
      </Route>
    );
    // What you see when the url is at /register
    const registerPath = (
      <Route path="/register">
        <Hidden mdDown>
          <Typography className={classes.rightMargin}>
            {alreadyHaveId}
          </Typography>
        </Hidden>
        <Link to="/login" className={classes.noUnderline}>
          <Button color="primary" variant="contained">
            {signIn}
          </Button>
        </Link>
        <Typography>&nbsp;</Typography>
      </Route>
    );

    // When not logged in, displays an account icon which takes you to the login page
    const loginLink = (
      <Link to="/login">
        <Button
          color="primary"
          className={`${classes.noMinWidth} ${classes.horizontalMargin}`}
        >
          <AccountCircle />
        </Button>
      </Link>
    );

    const defaultPath = (
      <Route
        path="/"
        render={(route) => (
          <>{user.signedIn ? this.renderAccount() : loginLink}</>
        )}
      />
    );

    return (
      <div className={classes.root}>
        <Switch>
          {loginPath}
          {registerPath}
          {defaultPath}
        </Switch>
        <LanguageChanger />
      </div>
    );
  }
}
export default Account;
