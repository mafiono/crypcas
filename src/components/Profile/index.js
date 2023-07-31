import React, { Component } from "react";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import { Switch, Route, Link } from "react-router-dom";
import {
  History,
  Redeem,
  Person,
  Assessment,
  BrightnessHigh,
  Brightness2,
} from "@material-ui/icons";
import { Button, Grid, Typography } from "@material-ui/core";
import intl from "react-intl-universal";
import { backgroundGhostLogo, profileImage } from "../../helpers/images";
import {
  getUser,
  getOperatorId,
  getTrustTrackerURL,
} from "../../redux/selectors";
import ProfileInfo from "./ProfileInfo";
import ProfileHistory from "./ProfileHistory";
import Limits from "./Limits";
import Bonus from "./Bonus";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import { getUserAvailablePaymentMethods } from "../../helpers/request";
import { themeInDarkMode } from "../../helpers/theme";
import ActivePromotions from "./ActivePromotions";
import UBTCConverter from "../reusable/UBTCConverter";
import PlayerBalance from "./PlayerBalance";

@connect((state) => ({
  user: getUser(state),
  operatorId: getOperatorId(state),
  trustTrackerURL: getTrustTrackerURL(state),
}))
@withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    minHeight: `calc(100vh - ${theme.custom.size.headerHeight} - ${
      theme.custom.size.footerHeight
    } - ${theme.spacing(4)}px)`,
    display: "flex",
    padding: theme.spacing(2, 10),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(2, 5),
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2, 1),
    },
  },
  profileContainer: {
    background: theme.profileGradientLHS,
    color: "white",
    maxWidth: "450px",
    marginRight: 0,
    paddingBottom: theme.spacing(10),
    [theme.breakpoints.down("md")]: {
      maxWidth: "unset",
      padding: theme.spacing(5),
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1),
    },
  },
  profileNavItem: {
    textDecoration: "none",
    color: "white",
    borderRadius: "10px",
    border: "1px solid #DBDBDB",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),
    backgroundColor: "rgba(255, 255, 255, 0)",
    transition: "0.25s all",
    "&:hover": {
      borderColor: "white",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
  },
  profileNavActive: {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
  },
  iconMargin: {
    marginBottom: theme.spacing(2),
  },
  profileSummary: {
    borderRadius: "10px",
    border: "1px solid #DBDBDB",
    padding: theme.spacing(2),
  },
  noUnderline: {
    textDecoration: "none",
  },
  profileIcon: {
    backgroundImage: `url("${profileImage}")`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundColor: "white",
    border: "10px solid white",
    borderRadius: "50%",
    width: "75px",
    height: "75px",
    marginRight: theme.spacing(1),
  },
  relative: {
    position: "relative",
  },
  image: {
    pointerEvents: "none",
    position: "fixed",
    background: `url('${backgroundGhostLogo}')`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    width: "512px",
    height: "512px",
    marginLeft: "calc(50vw - 512px)",
    marginTop: "calc(50vh - 352px)",
    opacity: 0.07,
  },
  withdrawProcessTimesInfo: {
    textAlign: "justify",
    display: "block",
  },
  ubtcToUsd: {
    fontSize: "0.75rem",
    opacity: 0.5,
  },
  depositButton: {
    ...theme.custom.button.deposit,
  },
}))
class Profile extends Component {
  state = {
    availablePaymentMethods: null,
    depositMethods: null,
    withdrawMethods: null,
  };

  componentDidMount() {
    getUserAvailablePaymentMethods().then((availablePaymentMethods) => {
      const depositMethods = availablePaymentMethods.filter(
        (method) => method.paymentMethod.depositEnabled
      );
      const withdrawMethods = availablePaymentMethods.filter(
        (method) => method.paymentMethod.withdrawEnabled
      );

      this.setState({
        availablePaymentMethods,
        depositMethods,
        withdrawMethods,
      });
    });
  }

  renderLHSNav(link, Icon, text, hidden) {
    const { classes, route } = this.props;
    const { pathname } = route.location;

    let clazz = classes.profileNavItem;
    if (link === pathname) {
      clazz += ` ${classes.profileNavActive}`;
    }

    const style = {};
    if (hidden) {
      style.visibility = "hidden";
    }

    return (
      <Grid item xs style={style}>
        <Link to={link} className={clazz}>
          <Icon className={classes.iconMargin} />
          <Typography variant="subtitle1">{text}</Typography>
        </Link>
      </Grid>
    );
  }

  renderLHS() {
    const { classes, user, updateTheme, route } = this.props;
    const { pathname } = route.location;

    const titleProfile = intl
      .get("account.title.profile")
      .defaultMessage("My Profile");
    const navDeposit = intl
      .get("account.nav.deposit")
      .defaultMessage("Deposit");
    const navWithdraw = intl
      .get("account.nav.withdraw")
      .defaultMessage("Withdraw");

    const navProfileInfo = intl
      .get("account.nav.profileInfo")
      .defaultMessage("Profile Info");
    const navHistory = intl
      .get("account.nav.history")
      .defaultMessage("History");
    const navGamblingLimits = intl
      .get("account.nav.gamblingLimits")
      .defaultMessage("Gambling Limits");
    const navBonus = intl.get("account.nav.bonus").defaultMessage("Bonus");
    const withdrawProcessTimesInfo1 = intl.get(
      "profile.withdraw.processTimesInfo1"
    ).defaultMessage(`
                                All Withdrawals are processed during Business hours Monday to Friday.`);
    const withdrawProcessTimesInfo2 = intl.get(
      "profile.withdraw.processTimesInfo2"
    ).defaultMessage(`
                                Any Weekend withdrawals that are not Express Cashout will be done on the first working day.`);
    const withdrawProcessTimesInfo3 = intl.get(
      "profile.withdraw.processTimesInfo3"
    ).defaultMessage(`
        If you are interested in Express Cashout email our support for details.`);

    // const navAffiliate = intl.get('account.nav.affiliate').defaultMessage('Affiliate');
    // const navDocuments = intl.get('account.nav.documents').defaultMessage('Documents');

    return (
      <Grid
        item
        container
        direction="column"
        spacing={2}
        className={classes.profileContainer}
      >
        <Grid container justify="space-between">
          <Grid item>
            <Typography variant="h5">{titleProfile}</Typography>
          </Grid>
          <Grid item>
            <Button
              color="primary"
              style={{ minWidth: "unset" }}
              onClick={updateTheme}
            >
              {themeInDarkMode() ? <BrightnessHigh /> : <Brightness2 />}
            </Button>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container className={classes.profileSummary}>
            <Grid item>
              <div className={classes.profileIcon}></div>
            </Grid>
            <Grid
              container
              direction="column"
              justify="space-between"
              spacing={1}
              item
              xs
            >
              <Grid container justify="space-between" spacing={1} item>
                <Grid item>
                  <Typography>{user.loginName}</Typography>
                </Grid>
                <Grid item>
                  <PlayerBalance />
                </Grid>
              </Grid>
              <Grid container justify="flex-end" spacing={1} item>
                <Grid item>
                  <Link to="/profile/deposit" className={classes.noUnderline}>
                    <Button
                      className={classes.depositButton}
                      variant="contained"
                    >
                      {navDeposit}
                    </Button>
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="/profile/withdraw" className={classes.noUnderline}>
                    <Button variant="contained">{navWithdraw}</Button>
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container spacing={1}>
          <Grid
            item
            container
            justify="center"
            alignItems="stretch"
            spacing={1}
          >
            {this.renderLHSNav("/profile/info", Person, navProfileInfo)}
            {this.renderLHSNav("/profile/history", History, navHistory)}
          </Grid>
          <Grid
            item
            container
            justify="center"
            alignItems="stretch"
            spacing={1}
          >
            {this.renderLHSNav("/profile/bonus", Redeem, navBonus)}
            {this.renderLHSNav(
              "/profile/limits",
              Assessment,
              navGamblingLimits,
              true
            )}
          </Grid>
          {/* <Grid item container justify="center" alignItems="stretch" spacing={1}>
                        {this.renderLHSNav('/profile/affiliate', BusinessCenter, navAffiliate)}
                        {this.renderLHSNav('/profile/documents', FolderOpen, navDocuments)}
                    </Grid> */}
        </Grid>
        {["/profile/withdraw", "/profile/deposit"].includes(pathname) && (
          <Grid item>
            <UBTCConverter />
          </Grid>
        )}
        {pathname === "/profile/withdraw" && (
          <Grid item>
            <Typography
              component="span"
              className={classes.withdrawProcessTimesInfo}
            >
              {withdrawProcessTimesInfo1}
            </Typography>
            <Typography
              component="span"
              className={classes.withdrawProcessTimesInfo}
            >
              {withdrawProcessTimesInfo2}
            </Typography>
            <br />
            <Typography
              component="span"
              className={classes.withdrawProcessTimesInfo}
            >
              {withdrawProcessTimesInfo3}
            </Typography>
          </Grid>
        )}
        {pathname === "/profile/deposit" && (
          <Grid item>
            <ActivePromotions />
          </Grid>
        )}
      </Grid>
    );
  }

  renderRHS() {
    const { balances, depositMethods, withdrawMethods } = this.state;
    const { classes, user, operatorId, trustTrackerURL } = this.props;

    return (
      <Grid item xs className={classes.relative}>
        <div className={classes.image}></div>
        <div className={classes.relative}>
          <Switch>
            {/* <Route path="/profile/affiliate">
                            <Affiliate />
                        </Route>
                        <Route path="/profile/documents">
                            <Documents />
                        </Route> */}
            <Route path="/profile/bonus">
              <Bonus />
            </Route>
            <Route path="/profile/limits">
              <Limits />
            </Route>
            <Route path="/profile/deposit">
              <Deposit depositMethods={depositMethods} />
            </Route>
            <Route path="/profile/withdraw">
              <Withdraw withdrawMethods={withdrawMethods} />
            </Route>
            <Route
              path="/profile/history"
              render={(route) => (
                <ProfileHistory
                  route={route}
                  operatorId={operatorId}
                  trustTrackerURL={trustTrackerURL}
                />
              )}
            />
            <Route path="/">
              <ProfileInfo user={user} balances={balances} />
            </Route>
          </Switch>
        </div>
      </Grid>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container justify="center" alignItems="stretch" spacing={2}>
          {this.renderLHS()}
          {this.renderRHS()}
        </Grid>
      </div>
    );
  }
}

export default Profile;
