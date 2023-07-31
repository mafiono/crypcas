import React, { Component } from "react";
import intl from "react-intl-universal";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import Icon from "@material-ui/core/Icon";

import BitcoinIcon from "../../../images/icons/payments/bitcoin.svg";
import ExpressCashoutIcon from "../../../images/icons/payments/icon-express-cashout.png";

import { AccountCircle, ExitToApp, History } from "@material-ui/icons";
import { Divider, Typography, List, ListItem } from "@material-ui/core/";
import { getUser } from "../../../redux/selectors";
import { logout as requestLogout } from "../../../helpers/request";

import ShowOnlyOn321 from "../../reusable/Visibility/ShowOnlyOn321";

@withRouter
@connect((state) => ({
  user: getUser(state),
}))
@withStyles((theme) => ({
  accountOption: {
    marginLeft: theme.spacing(1),
  },
  imageIcon: {
    display: "flex",
    height: "inherit",
    width: "inherit",
  },
  iconRoot: {
    textAlign: "center",
  },
}))
class ProfileOptionList extends Component {
  makeNavTo(loc) {
    const { history, actionSelected } = this.props;
    return () => {
      actionSelected && actionSelected();
      history.push(loc);
    };
  }

  makeDoLogout() {
    const { actionSelected } = this.props;
    return () => {
      actionSelected && actionSelected();
      requestLogout();
    };
  }

  render() {
    const { classes, user } = this.props;

    if (!user.signedIn) {
      return null;
    }

    const navHistory = intl
      .get("account.nav.history")
      .defaultMessage("History");
    const navDeposit = intl
      .get("account.nav.deposit")
      .defaultMessage("Deposit");
    const navWithdraw = intl
      .get("account.nav.withdraw")
      .defaultMessage("Withdraw");
    const actLogout = intl
      .get("account.action.logout")
      .defaultMessage("Logout");

    return (
      <List>
        <ListItem button onClick={this.makeNavTo("/profile/info")}>
          <AccountCircle />
          <Typography className={classes.accountOption}>
            {user.loginName}
          </Typography>
        </ListItem>
        <Divider />
        <ListItem button onClick={this.makeNavTo("/profile/history")}>
          <History />
          <Typography className={classes.accountOption}>
            {navHistory}
          </Typography>
        </ListItem>
        <Divider />
        <ListItem button onClick={this.makeNavTo("/profile/deposit")}>
          <Icon classes={{ root: classes.iconRoot }}>
            <img
              className={classes.imageIcon}
              src={BitcoinIcon}
              alt="bit-coin"
            />
          </Icon>
          <Typography className={classes.accountOption}>
            {navDeposit}
          </Typography>
        </ListItem>
        <Divider />
        <ListItem button onClick={this.makeNavTo("/profile/withdraw")}>
          <Icon classes={{ root: classes.iconRoot }}>
            <img
              className={classes.imageIcon}
              src={BitcoinIcon}
              alt="bit-coin"
            />
          </Icon>
          <Typography className={classes.accountOption}>
            {navWithdraw}
          </Typography>
        </ListItem>
        <Divider />
        <ShowOnlyOn321>
          <ListItem button onClick={this.makeNavTo("/express-cash-out")}>
            <Icon classes={{ root: classes.iconRoot }}>
              <img
                className={classes.imageIcon}
                src={ExpressCashoutIcon}
                alt="bit-coin"
              />
            </Icon>
            <Typography className={classes.accountOption}>
              Express Cash Out
            </Typography>
          </ListItem>
          <Divider />
        </ShowOnlyOn321>
        <ListItem button onClick={this.makeDoLogout()}>
          <ExitToApp />
          <Typography className={classes.accountOption}>{actLogout}</Typography>
        </ListItem>
      </List>
    );
  }
}

export default ProfileOptionList;
