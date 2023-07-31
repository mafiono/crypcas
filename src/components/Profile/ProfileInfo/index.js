import React, { Component } from "react";
import intl from "react-intl-universal";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import memoizeOne from "memoize-one";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  Input,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import { changePassword as requestPasswordChange } from "../../../helpers/request";
import { validateElement } from "../../../helpers/validation";
import { siteProcess, openSnackbar } from "../../../redux/slices/notifications";
import { getLanguage } from "../../../redux/selectors";
import Balances from "./Balances";

@connect(
  (state) => ({
    language: getLanguage(state),
  }),
  { siteProcess, openSnackbar }
)
@withStyles((theme) => ({
  root: {},
  marginBottom: {
    marginBottom: theme.spacing(1),
  },
  ubtcToUsd: {
    fontSize: "0.85rem",
    margin: theme.spacing(0, 1),
    opacity: 0.5,
  },
}))
class ProfileInfo extends Component {
  state = {
    processing: false,
    changePassword: false,
    changePasswordSuccess: false,
    // Fields
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    // Error Flags
    currentPasswordError: false,
    newPasswordError: false,
    confirmPasswordError: false,
    // Helper Texts
    currentPasswordHelperText: "",
    newPasswordHelperText: "",
    confirmPasswordHelperText: "",
  };

  validation = {
    currentPassword: {
      required: true,
    },
    newPassword: {
      required: true,
    },
    confirmPassword: {
      required: true,
      match: "newPassword",
    },
  };

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

  makeInputChange() {
    return (e) => {
      const { name, value } = e.target;
      this.setState({ [name]: value });
      this.validateInput({ name, value });
    };
  }

  memoizeInputChange = memoizeOne(this.makeInputChange);

  makeRecoverPassword() {
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

      // Get the form data to submit from the state
      const { currentPassword, newPassword, confirmPassword } = this.state;

      // Bundle the form submission data
      const data = {
        oldPassword: currentPassword,
        newPassword,
        newPasswordRepeat: confirmPassword,
      };

      // Begin Processing
      siteProcess(1);
      this.setState({ processing: true });

      // {"label":"Changes saved","message":"Password successfully changed"}
      // {"errorMessage":"Wrong old password","errorCode":3222}

      requestPasswordChange(data)
        .then((res) => {
          // Success
          this.setState({
            processing: false,
            changePasswordSuccess: true,
            // Reset fields
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        })
        .catch((res) => {
          // Failure
          this.setState({
            processing: false,
            currentPassword: "",
          });
          // Display an error message
          const message = intl
            .get("profile.info.changePassword.incorrectPassword")
            .defaultMessage("Your current password was not correct.");
          openSnackbar({ message });
        })
        .finally(() => {
          siteProcess(-1);
        });
    };
  }

  makeToggleDialog() {
    return () => {
      this.setState({
        changePassword: !this.state.changePassword,
        changePasswordSuccess: false,
        // Error Flags
        currentPasswordError: false,
        newPasswordError: false,
        confirmPasswordError: false,
        // Helper Texts
        currentPasswordHelperText: "",
        newPasswordHelperText: "",
        confirmPasswordHelperText: "",
      });
    };
  }

  renderPasswordRecoveryDialog() {
    const {
      processing,
      changePassword,
      changePasswordSuccess,
      // Fields
      currentPassword,
      newPassword,
      confirmPassword,
      // Error Flags
      currentPasswordError,
      newPasswordError,
      confirmPasswordError,
      // Helper Texts
      currentPasswordHelperText,
      newPasswordHelperText,
      confirmPasswordHelperText,
    } = this.state;

    const title = intl
      .get("profile.changePasswordDialog.title")
      .defaultMessage("Change Password");
    const passwordChanged = intl
      .get("profile.changePasswordDialog.recoverySent")
      .defaultMessage("Your password has been changed.");
    const actionChange = intl
      .get("profile.changePasswordDialog.action.change")
      .defaultMessage("Change");

    const actionCancel = intl
      .get("generic.dialog.action.cancel")
      .defaultMessage("Cancel");
    const actionOkay = intl
      .get("generic.dialog.action.ok")
      .defaultMessage("Ok");

    const inputCurrentPassword = intl
      .get("profile.changePasswordDialog.input.current")
      .defaultMessage("Current Password");
    const inputNewPassword = intl
      .get("profile.changePasswordDialog.input.new")
      .defaultMessage("New Password");
    const inputConfirmPassword = intl
      .get("profile.changePasswordDialog.input.confirm")
      .defaultMessage("Confirm Password");

    let dialogContent = false;

    if (changePasswordSuccess) {
      // Password recovery sent successfully
      dialogContent = (
        <>
          <DialogContent>
            <DialogContentText>{passwordChanged}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              variant="contained"
              onClick={this.makeToggleDialog()}
            >
              {actionOkay}
            </Button>
          </DialogActions>
        </>
      );
    } else {
      // Prompt for password recovery
      dialogContent = (
        <form onSubmit={this.makeRecoverPassword()}>
          <DialogContent>
            <Grid container spacing={1} direction="column">
              <Grid item>
                <FormControl error={currentPasswordError} fullWidth>
                  <InputLabel htmlFor="currentPassword" color="primary">
                    {inputCurrentPassword} *
                  </InputLabel>
                  <Input
                    id="currentPassword"
                    type="password"
                    name="currentPassword"
                    value={currentPassword}
                    onChange={this.memoizeInputChange(this)}
                  />
                  <FormHelperText>{currentPasswordHelperText}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item>
                <FormControl error={newPasswordError} fullWidth>
                  <InputLabel htmlFor="newPassword" color="primary">
                    {inputNewPassword} *
                  </InputLabel>
                  <Input
                    id="newPassword"
                    type="password"
                    name="newPassword"
                    value={newPassword}
                    onChange={this.memoizeInputChange(this)}
                  />
                  <FormHelperText>{newPasswordHelperText}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item>
                <FormControl error={confirmPasswordError} fullWidth>
                  <InputLabel htmlFor="confirmPassword" color="primary">
                    {inputConfirmPassword} *
                  </InputLabel>
                  <Input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={this.memoizeInputChange(this)}
                  />
                  <FormHelperText>{confirmPasswordHelperText}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.makeToggleDialog()}>{actionCancel}</Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={processing}
            >
              {actionChange}
            </Button>
          </DialogActions>
        </form>
      );
    }

    return (
      <Dialog open={changePassword} onClose={this.makeToggleDialog()}>
        <DialogTitle>{title}</DialogTitle>
        {dialogContent}
      </Dialog>
    );
  }

  addSpaces(word) {
    let result = word || "";

    result = result.replace(/[A-Z]/g, (match) => ` ${match}`);
    result = result.replace(/ {2}/g, " ").trim();

    return result;
  }

  render() {
    const { classes, user } = this.props;

    const labelEmail = intl
      .get("profile.info.label.email")
      .defaultMessage("Email");
    const labelLogin = intl
      .get("profile.info.label.login")
      .defaultMessage("Login Name");
    const profileInfoTitle = intl
      .get("profile.info.header.profileInfo")
      .defaultMessage("Profile Info");
    const accountInfoTitle = intl
      .get("profile.info.header.accountInfo")
      .defaultMessage("Account Info");
    const changePasswordAction = intl
      .get("profile.info.action.changePassword")
      .defaultMessage("Change Password");

    return (
      <div className={classes.root}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Typography variant="h4">{profileInfoTitle}</Typography>
            <Divider />
          </Grid>

          <Grid item>
            <Balances />
          </Grid>

          <Grid item>
            <Typography variant="h5">{accountInfoTitle}</Typography>
            <Divider className={classes.marginBottom} />
            <Grid container direction="column" spacing={1}>
              <Grid item>
                <TextField label={labelEmail} value={user.email} />
              </Grid>
              <Grid item>
                <TextField label={labelLogin} value={user.loginName} />
              </Grid>
              <Grid item>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={this.makeToggleDialog()}
                >
                  {changePasswordAction}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {this.renderPasswordRecoveryDialog()}
      </div>
    );
  }
}

export default ProfileInfo;
