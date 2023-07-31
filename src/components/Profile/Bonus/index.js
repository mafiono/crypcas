import React, { Component } from "react";
import intl from "react-intl-universal";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import {
  Box,
  Button,
  Divider,
  Grid,
  Typography,
  TextField,
} from "@material-ui/core";
import { activatePromoCode } from "../../../helpers/request";
import { getInvalidLoginCode, getLanguage } from "../../../redux/selectors";
import {
  openSnackbar,
  setInvalidLoginCode,
} from "../../../redux/slices/notifications";

@connect(
  (state) => ({
    invalidLoginCode: getInvalidLoginCode(state),
    language: getLanguage(state),
  }),
  { openSnackbar, setInvalidLoginCode }
)
@withStyles((theme) => ({
  root: {},
  promoContainer: {
    marginTop: theme.spacing(2),
  },
}))
class Bonus extends Component {
  state = {
    promoCode: "",
  };

  componentWillUnmount() {
    const { setInvalidLoginCode } = this.props;
    setInvalidLoginCode("");
  }

  makeChangePromo() {
    return (e) => {
      this.setState({ promoCode: e.target.value });
    };
  }

  makeProceedAction() {
    return (event) => {
      event.preventDefault();

      activatePromoCode(this.state.promoCode)
        .then((res) => {
          // Clear the text area
          this.setState({ promoCode: "" });
          // Promo code activated
          const message = intl
            .get("profile.bonus.notify.activatedPromoCode")
            .defaultMessage("Promo code activated.");
          this.props.openSnackbar({ message });
        })
        .catch((res) => {
          // Clear the text area
          this.setState({ promoCode: "" });
          // Get the error code
          const errorCode = res && res.errorCode;
          // Default 3502: unknown promo code
          let message = intl
            .get("profile.bonus.notify.invalidCode")
            .defaultMessage("Invalid promo code.");
          if (errorCode === 3504) {
            // 3504: Promo code already activated
            message = intl
              .get("profile.bonus.notify.alreadyActive")
              .defaultMessage("Promo code already activated.");
          }
          this.props.openSnackbar({ message });
        });
    };
  }

  render() {
    const { promoCode } = this.state;
    const { classes, invalidLoginCode } = this.props;

    const title = intl.get("profile.bonus.title").defaultMessage("Bonus");
    const inputPromo = intl
      .get("profile.bonus.input.promoCode")
      .defaultMessage("Add Promo Code");
    const actionProceed = intl
      .get("profile.bonus.action.proceed")
      .defaultMessage("Proceed");
    const invalidLoginCodeMsg = intl
      .get("profile.bonus.label.loginCodeInvalid", { 0: invalidLoginCode })
      .defaultMessage(
        `The promo code "${invalidLoginCode}" used on login was invalid, you may retry activating your code here.`
      );

    const instructionMsg = intl
      .get("profile.bonus.instructionMsg")
      .defaultMessage(
        "Please proceed to launch the featured slot game after activating Promo Code"
      );

    return (
      <div className={classes.root}>
        <Typography variant="h4">{title}</Typography>
        <Divider />
        <form onSubmit={this.makeProceedAction()}>
          <Grid
            container
            spacing={1}
            alignItems="flex-end"
            className={classes.promoContainer}
          >
            <Grid item>
              <TextField
                label={inputPromo}
                value={promoCode}
                onChange={this.makeChangePromo()}
              />
            </Grid>
            <Grid item>
              <Button
                color="primary"
                variant="contained"
                type="submit"
                onClick={this.makeProceedAction()}
                disabled={!promoCode}
              >
                {actionProceed}
              </Button>
            </Grid>
          </Grid>
        </form>
        {invalidLoginCode && (
          <Box mt={2} color="red">
            <Typography variant="body1">{invalidLoginCodeMsg}</Typography>
          </Box>
        )}

        <Box
          my={4}
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Typography variant="h6">{instructionMsg}</Typography>
        </Box>
      </div>
    );
  }
}
export default Bonus;
