import React, { Component } from "react";
import intl from "react-intl-universal";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import {
  Button,
  Divider,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import QRCode from "qrcode.react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  getPaymentSolutionDetails,
  // preparePayment,
} from "../../../helpers/request";
import { displayCurrency } from "../../../helpers/currency";
import { ExpandMore } from "@material-ui/icons";
import { siteProcess, openSnackbar } from "../../../redux/slices/notifications";
import Rates from "../../reusable/Rates";
import CR8AccountLink from "./CR8AccountLink";

@connect(null, { siteProcess, openSnackbar })
@withStyles((theme) => ({
  root: {},
  heading: {
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    color: theme.palette.text.secondary,
  },
  walletField: {
    width: "100%",
    maxWidth: "500px",
  },
  noWidth: {
    width: "unset",
  },
}))
class Deposit extends Component {
  state = {
    expanded: "",
    expandedInfo: {},
  };

  makeCopied(item) {
    return () => {
      const message = intl
        .get("profile.deposit.notify.itemCopied", { 0: item })
        .defaultMessage(`${item} copied to clipboard.`);
      this.props.openSnackbar({ message });
    };
  }

  convertRates(rates) {
    const regex =
      /<money>(.*?)<currency>(.*?)<.*? = <money>(.*?)<currency>(.*?)</;
    return (
      rates &&
      rates
        .map((rate) => {
          const match = rate.match(regex);
          if (match) {
            return {
              fromAmount: match[1],
              fromCurrency: match[2],
              toAmount: match[3],
              toCurrency: match[4],
            };
          } else {
            return null;
          }
        })
        .filter((rate) => !!rate)
    );
  }

  makeHandleChange(deposit, panel) {
    return () => {
      const { expandedInfo } = this.state;
      const { siteProcess, openSnackbar } = this.props;

      siteProcess(1);

      const solutionDetails = expandedInfo[panel]
        ? Promise.resolve(expandedInfo[panel])
        : getPaymentSolutionDetails("deposit", deposit.paymentMethod.linkName);

      solutionDetails
        .then((sd) => {
          expandedInfo[panel] = sd;
          this.setState({
            expanded: this.state.expanded === panel ? false : panel,
            expandedInfo,
          });
        })
        .catch(() => {
          const message = intl
            .get("profile.deposit.notify.failedToRetrieveDepositInfo")
            .defaultMessage("Failed to retrieve your deposit info.");
          openSnackbar({ message });
        })
        .finally(() => {
          siteProcess(-1);
        });
    };
  }

  renderCryptoPanel(deposit) {
    const { expanded, expandedInfo } = this.state;
    const { classes } = this.props;

    const min = displayCurrency(
      deposit.limits.depositMin,
      deposit.limits.currencyCode
    );
    const max = displayCurrency(
      deposit.limits.depositMax,
      deposit.limits.currencyCode
    );

    const depositMessage = intl
      .get("profile.deposit.info")
      .defaultMessage(
        "This is your private depositing address. Any transaction you make to this address will show up in your balance after being confirmed on the Blockchain. This usually takes about 15 minutes."
      );

    const labelWalletAddress = intl
      .get("profile.deposit.label.walletAddress")
      .defaultMessage("Wallet Address");
    const labelDestTag = intl
      .get("profile.deposit.label.destTag")
      .defaultMessage("Destination Tag");
    const actionCopy = intl
      .get("profile.deposit.action.copyWalletAddress")
      .defaultMessage("Copy");

    const minLabel = intl
      .get("profile.deposit.label.minLimit", { 0: min })
      .defaultMessage(`Min: ${min}`);
    const maxLabel = intl
      .get("profile.deposit.label.maxLimit", { 0: max })
      .defaultMessage(`Max: ${max}`);

    const panelName = `panel${deposit.paymentMethod.id}`;

    const depositInfo =
      expandedInfo[panelName] && expandedInfo[panelName].content;
    let contents = <></>;
    if (depositInfo) {
      contents = (
        <Grid container spacing={1}>
          <Grid container direction="column" spacing={1} item xs>
            <Grid item>
              <Typography>{depositMessage}</Typography>
            </Grid>
            <Grid container item alignItems="flex-end" spacing={1}>
              <Grid item className={classes.walletField}>
                <TextField
                  label={labelWalletAddress}
                  value={depositInfo.walletAddress}
                  readOnly
                  fullWidth
                />
              </Grid>
              <Grid item>
                <CopyToClipboard
                  text={depositInfo.walletAddress}
                  onCopy={this.makeCopied(labelWalletAddress)}
                >
                  <Button color="primary" variant="contained">
                    {actionCopy}
                  </Button>
                </CopyToClipboard>
              </Grid>
            </Grid>
            {depositInfo.destTag && (
              <Grid container item alignItems="flex-end" spacing={1}>
                <Grid item className={classes.walletField}>
                  <TextField
                    label={labelDestTag}
                    value={depositInfo.destTag}
                    readOnly
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <CopyToClipboard
                    text={depositInfo.destTag}
                    onCopy={this.makeCopied(labelDestTag)}
                  >
                    <Button color="primary" variant="contained">
                      {actionCopy}
                    </Button>
                  </CopyToClipboard>
                </Grid>
              </Grid>
            )}
            {depositInfo.cryptoCurrencyName === "CR8" && (
              <Grid item className={classes.walletField}>
                <CR8AccountLink />
              </Grid>
            )}
            <Grid item>
              <Rates rates={depositInfo.rateMessage} />
            </Grid>
          </Grid>
          <Grid item>
            <QRCode value={depositInfo.walletAddress || ""} />
          </Grid>
        </Grid>
      );
    }

    return (
      <ExpansionPanel
        key={deposit.paymentMethod.id}
        expanded={expanded === panelName}
        onChange={this.makeHandleChange(deposit, panelName)}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMore />}
          aria-controls={`${panelName}bh-content`}
          id={`${panelName}bh-header`}
        >
          <Typography className={classes.heading}>
            {deposit.paymentMethod.currency}
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
        <ExpansionPanelDetails>{contents}</ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }

  render() {
    const { classes, depositMethods } = this.props;

    const title = intl.get("profile.deposit.title").defaultMessage("Deposit");

    return (
      <div className={classes.root}>
        <Typography variant="h4">{title}</Typography>
        <Divider />
        {depositMethods &&
          depositMethods.map((deposit) => this.renderCryptoPanel(deposit))}
      </div>
    );
  }
}
export default Deposit;
