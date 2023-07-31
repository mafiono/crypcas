import React, { Component } from "react";
import intl from "react-intl-universal";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import memoizeOne from "memoize-one";
import {
  Box,
  Grid,
  FormControl,
  FormHelperText,
  InputLabel,
  Input,
  Button,
  Typography,
} from "@material-ui/core";
import { backgroundGhostLogo } from "../../../helpers/images";
import { restoreAccount } from "../../../helpers/request";
import { validateElement } from "../../../helpers/validation";
import { siteProcess, openSnackbar } from "../../../redux/slices/notifications";
import { Link } from "react-router-dom";

@connect(null, { siteProcess, openSnackbar })
@withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    position: "relative",
    display: "flex",
    padding: theme.spacing(2, 10),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(2, 5),
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2, 1),
    },
  },
  image: {
    position: "absolute",
    background: `url('${backgroundGhostLogo}')`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.07,
  },
  form: {
    margin: "auto",
    maxWidth: "1000px",
    width: "100%",
    flexGrow: 1,
    border: "3px solid #EBAB50",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    padding: theme.spacing(12),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(6),
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(3),
    },
  },
  formFieldContainer: {
    alignItems: "flex-end",
    [theme.breakpoints.down("md")]: {
      alignItems: "stretch",
      flexDirection: "column",
    },
  },
  goldButton: {
    ...theme.custom.button.gold,
  },
}))
class RestoreAccount extends Component {
  state = {
    // State Properties
    resetComplete: false,
    processing: false,
    // Fields
    password: "",
    passwordConfirm: "",
    // Error Flags
    passwordError: false,
    passwordConfirmError: false,
    // Helper Texts
    passwordHelperText: "",
    passwordConfirmHelperText: "",
  };

  validation = {
    password: {
      required: true,
    },
    passwordConfirm: {
      required: true,
      match: "password",
    },
  };

  makeInputChange() {
    return (e) => {
      const { name, value } = e.target;
      this.setState({ [name]: value });
      this.validateInput({ name, value });
    };
  }

  memoizeInputChange = memoizeOne(this.makeInputChange);

  validateInput(element) {
    const resp = validateElement(element, this.validation, this.state);

    if (resp.inputProps) {
      this.setState({
        validated: true,
        ...resp.inputProps,
      });
    }

    return resp.valid;
  }

  makeSendContactForm() {
    const { siteProcess, openSnackbar } = this.props;
    return (event) => {
      // Prevent the forms redirect
      event.preventDefault();

      // Validate all inputs
      let valid = true;
      const inputs = event.target.querySelectorAll("input, textarea");
      let firstInvalid = null;
      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        const validField = this.validateInput(input);
        valid = valid && validField;
        if (!validField && !firstInvalid) {
          firstInvalid = input;
        }
      }

      if (!valid) {
        firstInvalid && firstInvalid.focus && firstInvalid.focus();
        return false;
      }

      // Get the token
      const token = (this.props.token && this.props.token.trim()) || "";

      // Get the form data to submit from the state
      const { password } = this.state;

      // Bundle the form submission data
      const data = {
        token,
        password,
      };

      // Begin Processing
      siteProcess(1);
      this.setState({ processing: true });

      restoreAccount(data)
        .then((res) => {
          // Success
          this.setState({
            processing: false,
            resetComplete: true,
            // Reset fields
            password: "",
          });
          // Display an error message
          const message = intl
            .get("restoreAccount.form.sent")
            .defaultMessage("Your password has been updated.");
          openSnackbar({ message });
        })
        .catch((res) => {
          // Failure
          this.setState({
            processing: false,
          });
          // Display an error message
          const message = intl
            .get("restoreAccount.error.generic")
            .defaultMessage("Cannot process your request at this time.");
          openSnackbar({ message });
        })
        .finally(() => {
          siteProcess(-1);
        });
    };
  }

  render() {
    const {
      resetComplete,
      processing,
      // Fields
      password,
      passwordConfirm,
      // Error Flags
      passwordError,
      passwordConfirmError,
      // Helper Texts
      passwordHelperText,
      passwordConfirmHelperText,
    } = this.state;
    const { classes } = this.props;

    const pageTitle = intl
      .get("restoreAccount.title")
      .defaultMessage("Account Recovery");
    const pageDesc = intl
      .get("restoreAccount.description")
      .defaultMessage("Reset your account password:");

    const inputPassword = intl
      .get("restoreAccount.input.subject")
      .defaultMessage("New Password");
    const inputPasswordConfirm = intl
      .get("restoreAccount.input.message")
      .defaultMessage("Confirm Password");

    const actionSend = intl
      .get("restoreAccount.action.send")
      .defaultMessage("Send");

    const form = (
      <form onSubmit={this.makeSendContactForm()} className={classes.form}>
        <Grid container spacing={1} direction="column" justify="center">
          {/* Title and Description */}
          <Grid item xs>
            <Typography variant="h5">{pageTitle}</Typography>
          </Grid>
          <Grid item xs>
            <Typography variant="subtitle1">{pageDesc}</Typography>
          </Grid>

          <Grid
            item
            container
            spacing={2}
            className={classes.formFieldContainer}
          >
            <Grid item xs container spacing={1} direction="column">
              {/* Password */}
              <Grid item>
                <FormControl error={passwordError} fullWidth>
                  <InputLabel htmlFor="supportPassword" color="primary">
                    {inputPassword} *
                  </InputLabel>
                  <Input
                    id="supportPassword"
                    type="password"
                    name="password"
                    value={password}
                    onChange={this.memoizeInputChange()}
                  />
                  <FormHelperText>{passwordHelperText || " "}</FormHelperText>
                </FormControl>
              </Grid>

              {/* Confirm Password */}
              <Grid item>
                <FormControl error={passwordConfirmError} fullWidth>
                  <InputLabel htmlFor="supportPasswordConfirm" color="primary">
                    {inputPasswordConfirm} *
                  </InputLabel>
                  <Input
                    id="supportPasswordConfirm"
                    type="password"
                    name="passwordConfirm"
                    value={passwordConfirm}
                    onChange={this.memoizeInputChange()}
                  />
                  <FormHelperText>
                    {passwordConfirmHelperText || " "}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          {/* Send */}
          <Grid item xs>
            <Button
              type="submit"
              disabled={processing}
              className={classes.goldButton}
            >
              {actionSend}
            </Button>
          </Grid>
        </Grid>
      </form>
    );

    const completeMessage = intl
      .get("restoreAccount.completeMessage")
      .defaultMessage(
        "Your account password has been updated, you may now login."
      );
    const loginAction = intl.get("login.action.login").defaultMessage("Login");

    const completed = (
      <Box className={classes.form}>
        <Grid container spacing={1} direction="column" justify="center">
          {/* Title and Description */}
          <Grid item xs>
            <Typography variant="h5">{pageTitle}</Typography>
          </Grid>
          <Grid item xs>
            <Typography variant="subtitle1">{completeMessage}</Typography>
          </Grid>
          <Grid item xs>
            <Link to="/login" className={classes.link}>
              <Button color="primary" variant="contained">
                {loginAction}
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Box>
    );

    return (
      <Box className={classes.root}>
        <div className={classes.image}></div>
        {resetComplete ? completed : form}
      </Box>
    );
  }
}
export default RestoreAccount;
