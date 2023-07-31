import React, { Component } from "react";
import intl from "react-intl-universal";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  Typography,
} from "@material-ui/core";
import {
  getPaymentSolutionDetails,
  preparePayment,
} from "../../../helpers/request";
import { displayCurrency } from "../../../helpers/currency";
import { ExpandMore } from "@material-ui/icons";
import { siteProcess, openSnackbar } from "../../../redux/slices/notifications";
import Rates from "../../reusable/Rates";
import SolutionDetailField from "../SolutionDetailField";
import { Link } from "react-router-dom";
import { getStaticPageMap } from "../../../redux/selectors";

@connect(
  (state) => ({
    pages: getStaticPageMap(state),
  }),
  { siteProcess, openSnackbar }
)
@withStyles((theme) => ({
  root: {},
  heading: {
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    color: theme.palette.text.secondary,
  },
  noUnderline: {
    textDecoration: "none",
  },
}))
class Withdraw extends Component {
  state = {
    expanded: "",
    expandedInfo: {},
    submitted: false,
    cannotWithdraw: false,
    expressCashoutLinkName: "",
  };

  validationData = {};

  fieldData = {};

  isWithdrawDataValid(panel) {
    const validation = this.validationData[panel];
    let valid = true;

    for (const key in validation) {
      valid = validation[key] && valid;
    }

    return valid;
  }

  isGreaterThanExpressCheckOut(panel) {
    const { expandedInfo } = this.state;
    const withdrawInfo = expandedInfo[panel].content;
    const expressCashout =
      (withdrawInfo &&
        withdrawInfo.extra &&
        withdrawInfo.extra.express_cashout) ||
      null;
    const { fieldData } = this;
    const data = fieldData[panel];

    return !!(
      expressCashout &&
      Number(expressCashout.amount) < Number(data[expressCashout.compare_field])
    );
  }

  onSubmit(linkName, panel) {
    const { openSnackbar } = this.props;
    return (event) => {
      // Prevent the forms redirect
      event.preventDefault();

      if (!this.isWithdrawDataValid(panel)) {
        const message = intl
          .get("profile.withdraw.notify.cannotSubmit")
          .defaultMessage(
            "Could not submit, please verify your provided information is correct."
          );
        openSnackbar({ message });
      } else if (this.isGreaterThanExpressCheckOut(panel)) {
        this.setState({ expressCashoutLinkName: linkName });
      } else {
        this.makeWithdraw(linkName, panel);
      }
    };
  }

  makeWithdraw(linkName, panel) {
    const { fieldData } = this;
    const data = fieldData[panel];

    const { siteProcess, openSnackbar } = this.props;
    siteProcess(1);
    preparePayment("withdraw", linkName, data)
      .then(() => {
        this.setState({ submitted: true });
      })
      .catch(() => {
        const message = intl
          .get("profile.withdraw.notify.requestFailed")
          .defaultMessage("Your withdraw request could not be submitted.");
        openSnackbar({ message });
      })
      .finally(() => {
        siteProcess(-1);
      });
  }

  makePanelChange(withdraw, panel) {
    return () => {
      if (withdraw.withdrawBlocked) {
        this.setState({ cannotWithdraw: true });
        return;
      }

      const { fieldData, validationData } = this;
      const { expandedInfo } = this.state;
      const { siteProcess, openSnackbar } = this.props;

      siteProcess(1);

      const solutionDetails = expandedInfo[panel]
        ? Promise.resolve(expandedInfo[panel])
        : getPaymentSolutionDetails(
            "withdraw",
            withdraw.paymentMethod.linkName
          ).then((sd) => {
            // Create field maps from solution details
            const hidden = {};
            const fields = {};
            const reqFieldsValid = {};
            // If the structure type is 'check-transaction' - there is already a withdrawal pending.
            // otherwise it should be 'form' if we can display the withdrawal form.
            if (sd.paymentMethodStructureType === "check-transaction") {
              throw new Error("check-transaction");
            }
            // Iterate over the hidden/required fields
            sd.content.fields.hidden.forEach((field) => {
              hidden[field.name] = field.value;
            });
            sd.content.fields.required.forEach((field) => {
              fields[field.name] = "";
              // initialize as not valid
              reqFieldsValid[field.name] = false;
            });
            // Initialize field data for newely-opened panels
            this.fieldData = {
              ...fieldData,
              [panel]: {
                ...hidden,
                ...fields,
              },
            };
            // Initialize validation data
            this.validationData = {
              ...validationData,
              [panel]: {
                ...reqFieldsValid,
              },
            };
            return sd;
          });

      solutionDetails
        .then((sd) => {
          expandedInfo[panel] = sd;
          this.setState({
            expanded: this.state.expanded === panel ? false : panel,
            expandedInfo,
          });
        })
        .catch((err) => {
          let message = intl
            .get("profile.withdraw.notify.failedToRetrieveWithdrawInfo")
            .defaultMessage("Failed to retrieve your withdraw info.");
          if (err.message === "check-transaction") {
            message = intl
              .get("profile.withdraw.notify.transactionPending")
              .defaultMessage(
                "Cannot create another withdrawal while one is still pending."
              );
          }
          openSnackbar({ message });
        })
        .finally(() => {
          siteProcess(-1);
        });
    };
  }

  makeOnFieldChange(panel, fieldName) {
    const { fieldData, validationData } = this;
    return (fieldObj) => {
      const { value, currency, error } = fieldObj;
      fieldData[panel][fieldName] = value;
      // If a field is a 'currency' we must add a `currency-FIELDNAME` parameter to hold the currency type
      if (currency) {
        fieldData[panel][`currency-${fieldName}`] = currency;
      }
      validationData[panel][fieldName] = !error;
    };
  }

  renderWithdrawForm(withdraw, panel) {
    // const { fieldData } = this;
    const { expandedInfo } = this.state;
    const withdrawInfo = expandedInfo[panel] && expandedInfo[panel].content;

    if (!withdrawInfo) {
      return <></>;
    }

    const fields =
      (withdrawInfo && withdrawInfo.fields && withdrawInfo.fields.required) ||
      [];
    const expressCashout =
      (withdrawInfo &&
        withdrawInfo.extra &&
        withdrawInfo.extra.express_cashout) ||
      null;

    return (
      <form onSubmit={this.onSubmit(withdraw.paymentMethod.linkName, panel)}>
        <Grid container direction="column" spacing={1}>
          {expressCashout && (
            <Grid item>
              <Typography>
                {intl
                  .get("profile.withdraw.express.cashout.info", {
                    0: expressCashout.amount,
                    1: expressCashout.currency,
                  })
                  .defaultMessage(
                    `Express cash out available up to ${expressCashout.amount} ${expressCashout.currency}`
                  )}
              </Typography>
            </Grid>
          )}
          {fields.map((field) => (
            <Grid key={field.name} item>
              <SolutionDetailField
                field={field}
                onChange={this.makeOnFieldChange(panel, field.name)}
              />
            </Grid>
          ))}
          <Grid item>
            <Button type="submit" color="primary" variant="contained">
              Submit
            </Button>
          </Grid>
          <Grid item>
            <Rates rates={withdrawInfo.text.rateMessage} />
          </Grid>
        </Grid>
      </form>
    );
  }

  renderCryptoPanel(withdraw) {
    const { expanded } = this.state;
    const { classes } = this.props;

    const min = displayCurrency(
      withdraw.limits.withdrawMin,
      withdraw.limits.currencyCode
    );
    const max = displayCurrency(
      withdraw.limits.withdrawMax,
      withdraw.limits.currencyCode
    );

    const minLabel = intl
      .get("profile.withdraw.label.minLimit", { 0: min })
      .defaultMessage(`Min: ${min}`);
    const maxLabel = intl
      .get("profile.withdraw.label.maxLimit", { 0: max })
      .defaultMessage(`Max: ${max}`);

    const panel = `panel${withdraw.paymentMethod.id}`;

    const withdrawForm = this.renderWithdrawForm(withdraw, panel);

    return (
      <ExpansionPanel
        key={withdraw.paymentMethod.id}
        expanded={expanded === panel}
        onChange={this.makePanelChange(withdraw, panel)}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMore />}
          aria-controls={`${panel}bh-content`}
          id={`${panel}bh-header`}
        >
          <Typography className={classes.heading}>
            {withdraw.paymentMethod.currency}
          </Typography>
          <Grid
            className={classes.secondaryHeading}
            container
            direction="column"
          >
            <Grid item>
              <Typography>{minLabel}</Typography>
            </Grid>
            <Grid item>
              <Typography>{maxLabel}</Typography>
            </Grid>
          </Grid>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>{withdrawForm}</ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }

  makeDialogClose() {
    return () => {
      this.setState({
        submitted: false,
        cannotWithdraw: false,
        expressCashoutLinkName: "",
      });
    };
  }

  renderWithdrawalSubmittedDialog() {
    const { classes } = this.props;

    const title = intl
      .get("profile.withdraw.submitted.title")
      .defaultMessage("Request Submitted");
    const content = intl
      .get("profile.withdraw.submitted.content")
      .defaultMessage("Your withdraw request has been submitted.");

    const actionDialogClose = intl
      .get("generic.dialog.action.close")
      .defaultMessage("Close");
    const actionProfileHistory = intl
      .get("profile.withdraw.submitted.content")
      .defaultMessage("View Transactions");

    return (
      <Dialog aria-labelledby="withdrawalSubmittedDialogTitle" open={true}>
        <DialogTitle id="withdrawalSubmittedDialogTitle">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.makeDialogClose()}>{actionDialogClose}</Button>
          <Link
            to="/profile/history#transaction"
            className={classes.noUnderline}
          >
            <Button color="primary" variant="contained">
              {actionProfileHistory}
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    );
  }

  renderCannotWithdrawDialog() {
    const { classes, pages } = this.props;

    const title = intl
      .get("profile.withdraw.unavailable.title")
      .defaultMessage("Withdrawal Unavailable");
    const content = intl
      .get("profile.withdraw.unavailable.content")
      .defaultMessage(
        "This withdraw method is currently unavailable for your account. In order to withdraw you must have first made a deposit, for additional information on withdrawing please consult the Terms and Conditions."
      );

    const actionDialogClose = intl
      .get("generic.dialog.action.close")
      .defaultMessage("Close");

    return (
      <Dialog aria-labelledby="withdrawalUnavailableDialogTitle" open={true}>
        <DialogTitle id="withdrawalUnavailableDialogTitle">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.makeDialogClose()}>{actionDialogClose}</Button>
          {pages["terms-and-conditions"] && (
            <Link
              to="/page/terms-and-conditions"
              className={classes.noUnderline}
            >
              <Button color="primary" variant="contained">
                {pages["terms-and-conditions"].title}
              </Button>
            </Link>
          )}
        </DialogActions>
      </Dialog>
    );
  }

  renderExpressCashOutDialog() {
    const { expanded, expressCashoutLinkName } = this.state;

    const title = intl
      .get("profile.withdraw.express.cashout.unavailable.title")
      .defaultMessage("Express cash out unavailable");
    const content = intl.get(
      "profile.withdraw.express.cashout.unavailable.content"
    ).defaultMessage(`
            For entered amount express cash out is unavailable. Your withdrawal will process as regular cash out.
            Do you want to continue?`);

    const actionDialogCancel = intl
      .get("generic.dialog.action.cancel")
      .defaultMessage("Cancel");
    const actionDialogOk = intl
      .get("generic.dialog.action.ok")
      .defaultMessage("Ok");

    return (
      <Dialog aria-labelledby="expressCashOutDialogTitle" open={true}>
        <DialogTitle id="expressCashOutDialogTitle">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.makeDialogClose()}>{actionDialogCancel}</Button>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              this.makeWithdraw(expressCashoutLinkName, expanded);
              this.setState({ expressCashoutLinkName: "" });
            }}
          >
            {actionDialogOk}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  render() {
    const { submitted, cannotWithdraw, expressCashoutLinkName } = this.state;
    const { classes, withdrawMethods } = this.props;

    const title = intl.get("profile.withdraw.title").defaultMessage("Withdraw");

    return (
      <div className={classes.root}>
        <Typography variant="h4">{title}</Typography>
        <Divider />
        {withdrawMethods &&
          withdrawMethods.map((withdraw) => this.renderCryptoPanel(withdraw))}
        {submitted && this.renderWithdrawalSubmittedDialog()}
        {cannotWithdraw && this.renderCannotWithdrawDialog()}
        {expressCashoutLinkName && this.renderExpressCashOutDialog()}
      </div>
    );
  }
}
export default Withdraw;
