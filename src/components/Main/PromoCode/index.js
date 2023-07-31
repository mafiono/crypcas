import React, { Component } from "react";
import intl from "react-intl-universal";
import { connect } from "react-redux";
import { withRouter, Link, Redirect } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import { Typography, CircularProgress, Button, Box } from "@material-ui/core";
import { activatePromoCode, setLoginRedirect } from "../../../helpers/request";
import { getUser } from "../../../redux/selectors";

@withRouter
@connect((state) => ({
  user: getUser(state),
}))
@withStyles((theme) => ({
  root: {
    textAlign: "center",
    padding: theme.spacing(10),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(5),
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1),
    },
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  link: {
    textDecoration: "none",
  },
}))
class PromoCode extends Component {
  state = {
    processing: true,
    alreadyActive: false,
    invalid: false,
    shouldRedirectToProfileDepositPage: false, // boolean
  };

  componentDidMount() {
    const { user } = this.props;
    if (user.signedIn) {
      const code = (this.props.code && this.props.code.trim()) || "";
      // Perform the call to verify the code
      activatePromoCode(code)
        .then((res) => {
          const shouldRedirectToProfileDepositPage = res?.activated.some(
            ({ codeType }) => codeType === "deposit"
          );
          // Success
          this.setState({
            processing: false,
            shouldRedirectToProfileDepositPage,
          });
        })
        .catch((res) => {
          // Failure, Get the error code
          const errorCode = res && res.errorCode;
          if (errorCode === 3504) {
            // 3504: Promo code already activated
            this.setState({ processing: false, alreadyActive: true });
          } else {
            // Default 3502: unknown promo code
            this.setState({ processing: false, invalid: true });
          }
        });
    } else {
      this.setState({ processing: false });
    }
  }

  makeSetLoginRedirect(linkTo) {
    return () => {
      const { history } = this.props;
      if (linkTo === "/login") {
        setLoginRedirect(history.location.pathname);
      }
    };
  }

  render() {
    const {
      processing,
      invalid,
      alreadyActive,
      shouldRedirectToProfileDepositPage,
    } = this.state;
    const { classes, user } = this.props;

    const title = intl
      .get("account.promoCode.title")
      .defaultMessage("Activate promo code");
    let message = intl
      .get("account.promoCode.messageError")
      .defaultMessage("Promo code has been activated.");

    let actionText = "";
    let actionLocation = "";

    if (!user.signedIn) {
      message = intl
        .get("account.promoCode.messageLogin")
        .defaultMessage("You must be logged in to activate a promo code.");
      actionText = intl.get("login.action.login").defaultMessage("Login");
      actionLocation = "/login";
    } else if (invalid) {
      message = intl
        .get("account.promoCode.messageInvalidCode")
        .defaultMessage("This promo code does not seem to be valid.");
      actionText = intl.get("support.action.support").defaultMessage("Support");
      actionLocation = "/support";
    } else if (alreadyActive) {
      message = intl
        .get("account.promoCode.messageAlreadyActive")
        .defaultMessage("This promo code has already been activated.");
    }

    let action = null;
    if (actionText && actionLocation) {
      action = (
        <Box mt={1}>
          <Link to={actionLocation} className={classes.link}>
            <Button
              color="primary"
              variant="contained"
              onClick={this.makeSetLoginRedirect(actionLocation)}
            >
              {actionText}
            </Button>
          </Link>
        </Box>
      );
    }

    return (
      <div className={classes.root}>
        {shouldRedirectToProfileDepositPage && (
          <Redirect to="/profile/deposit" />
        )}
        {processing ? (
          <CircularProgress />
        ) : (
          <Box mt={4} mb={4}>
            <Typography variant="h3" className={classes.title}>
              {title}
            </Typography>
            <Typography variant="body1">{message}</Typography>
            {action}
          </Box>
        )}
      </div>
    );
  }
}

export default PromoCode;
