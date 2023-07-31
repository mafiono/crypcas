import React, { Component } from "react";
import intl from "react-intl-universal";
import withStyles from "@material-ui/core/styles/withStyles";
import { Typography, CircularProgress, Button, Box } from "@material-ui/core";
import { verifyEmail } from "../../../helpers/request";
import { Link } from "react-router-dom";

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
class VerifyEmail extends Component {
  state = {
    processing: true,
    invalid: false,
  };

  componentDidMount() {
    const token = (this.props.token && this.props.token.trim()) || "";
    // Perform the call to verify the token
    verifyEmail(token)
      .then((res) => {
        // Success
        this.setState({ processing: false });
      })
      .catch((res) => {
        // Failure
        this.setState({ processing: false, invalid: true });
      });
  }

  render() {
    const { processing, invalid } = this.state;
    const { classes } = this.props;

    let title = intl
      .get("account.verifyEmail.title")
      .defaultMessage("Account activation successful");
    let message = intl
      .get("account.verifyEmail.message")
      .defaultMessage("You may now login");

    let actionText = intl.get("login.action.login").defaultMessage("Login");
    let actionLocation = "/login";

    if (invalid) {
      title = intl
        .get("account.verifyEmail.titleError")
        .defaultMessage("Account activation failed");
      message = intl
        .get("account.verifyEmail.messageError")
        .defaultMessage(
          "Please try again, or contact support if the problem persists."
        );

      actionText = intl.get("support.action.support").defaultMessage("Support");
      actionLocation = "/support";
    }

    return (
      <div className={classes.root}>
        {processing ? (
          <CircularProgress />
        ) : (
          <Box mt={4} mb={4}>
            <Typography variant="h3" className={classes.title}>
              {title}
            </Typography>
            <Typography variant="body1">{message}</Typography>
            <Box mt={1}>
              <Link to={actionLocation} className={classes.link}>
                <Button color="primary" variant="contained">
                  {actionText}
                </Button>
              </Link>
            </Box>
          </Box>
        )}
      </div>
    );
  }
}
export default VerifyEmail;
