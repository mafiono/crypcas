import React, { Component } from "react";
import intl from "react-intl-universal";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import { format } from "date-fns";
import {
  Button,
  CircularProgress,
  Grid,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  TextField,
  Typography,
  Paper,
  Select,
  Switch,
} from "@material-ui/core";
import { AddCircle } from "@material-ui/icons";
import { KeyboardDatePicker } from "@material-ui/pickers";
import {
  getUserLimits,
  setUserLimits,
  removeUserLimits,
} from "../../../helpers/request";
import { openSnackbar } from "../../../redux/slices/notifications";

@connect(null, { openSnackbar })
@withStyles((theme) => ({
  root: {},
  limits: {
    marginTop: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(1),
  },
}))
class Limits extends Component {
  state = {
    limits: [],
    originalLimits: [],
    changes: false,
    loading: true,
  };

  limitId = -1;

  componentDidMount() {
    this.loadLimits();
  }

  loadLimits() {
    this.setState({ loading: true }, () => {
      getUserLimits().then((limits) => {
        this.setState({ limits, originalLimits: limits, loading: false });
      });
    });
  }

  convertLimitsForServer(limits) {
    return {
      userLimits:
        limits &&
        limits.map((limit) => ({
          limitId: limit.limitId,
          limitType: limit.limitType,
          activationDate: new Date(limit.activationDate).getTime(),
          duration: Number(limit.duration),
          timeUnit: limit.timeUnit,
          limitAmount: Number(limit.limitAmount),
          currentAmount: Number(limit.currentAmount),
          enabled: limit.enablede,
        })),
      depositLimits: null,
      spendLimits: null,
      lossLimits: null,
    };
  }

  makeSetLimits() {
    return () => {
      const { limits, originalLimits } = this.state;

      removeUserLimits(this.convertLimitsForServer(originalLimits)).then(() => {
        setUserLimits(this.convertLimitsForServer(limits))
          .then((newLimits) => {
            const message = intl
              .get("profile.history.notify.limitsChanged")
              .defaultMessage("Successfully updated limits");
            this.props.openSnackbar({ message });
            this.setState({ limits: newLimits, originalLimits: newLimits });
          })
          .catch((res) => {
            const message = intl
              .get("profile.history.notify.limitChangeFailed")
              .defaultMessage("Error, could not update limits");
            this.props.openSnackbar({ message });
          });
      });
    };
  }

  makeAddLimit() {
    return () => {
      const { limits } = this.state;
      limits.push({
        limitId: this.limitId--,
        limitType: "deposit_limit",
        activationDate: "2019-02-04T05:42:50+0200",
        duration: 24,
        timeUnit: "hour",
        limitAmount: 100.0,
        currentAmount: 0.0,
        enabled: false,
      });
      this.setState({ limits, changes: true });
    };
  }

  makeLimitPropertyChange(index, property) {
    return (event) => {
      const { limits } = this.state;
      limits[index][property] = event.target.value;
      this.setState({ limits, changes: true });
    };
  }

  makeDateChange(index) {
    return (value) => {
      const { limits } = this.state;
      limits[index].activationDate = value;
      this.setState({ limits, changes: true });
    };
  }

  makeEnableLimit(index) {
    return (event, value) => {
      const { limits } = this.state;
      limits[index].enabled = value;
      this.setState({ limits, changes: true });
    };
  }

  renderLimit(limit, index) {
    const { classes } = this.props;

    const labelLimitType = intl
      .get("profile.limits.label.limitType")
      .defaultMessage("Limit Type");
    const labelSpendLimit = intl
      .get("profile.limits.label.spendLimit")
      .defaultMessage("Spend Limit");
    const labelDepositLimit = intl
      .get("profile.limits.label.depositLimit")
      .defaultMessage("Deposit Limit");
    const inputActivationDate = intl
      .get("profile.limits.input.activationDate")
      .defaultMessage("Date");

    const labelDuration = intl
      .get("profile.limits.label.duration")
      .defaultMessage("Duration");
    const labelTimeUnit = intl
      .get("profile.limits.label.timeUnit")
      .defaultMessage("Time Unit");
    const labelAmount = intl
      .get("profile.limits.label.amount")
      .defaultMessage("Amount");
    const labelCurrentAmount = intl
      .get("profile.limits.label.currentAmount")
      .defaultMessage("Current Amount");
    const labelEnabled = intl
      .get("profile.limits.label.enabled")
      .defaultMessage("Enabled");

    const labelTimeUnitHours = intl
      .get("profile.limits.label.hours")
      .defaultMessage("Hours");
    const labelTimeUnitDays = intl
      .get("profile.limits.label.days")
      .defaultMessage("Days");
    const labelTimeUnitWeeks = intl
      .get("profile.limits.label.weeks")
      .defaultMessage("Weeks");
    const labelTimeUnitMonths = intl
      .get("profile.limits.label.months")
      .defaultMessage("Months");

    const invalidDateFormat = intl
      .get("validation.helper.invalidDateFormat")
      .defaultMessage("Invalid date format");

    const actionDialogOk = intl
      .get("generic.dialog.action.ok")
      .defaultMessage("Ok");
    const actionDialogCancel = intl
      .get("generic.dialog.action.cancel")
      .defaultMessage("Cancel");
    const actionDialogToday = intl
      .get("generic.date.dialog.action.today")
      .defaultMessage("Today");

    const date = format(new Date(limit.activationDate), "yyyy-MM-dd");

    return (
      <Paper className={classes.paper}>
        <Grid container direction="column" spacing={1}>
          <Grid item>
            <FormControl fullWidth>
              <InputLabel>{labelLimitType}</InputLabel>
              <Select
                value={limit.limitType}
                onChange={this.makeLimitPropertyChange(index, "limitType")}
              >
                <MenuItem value="deposit_limit">{labelDepositLimit}</MenuItem>
                <MenuItem value="spend_limit">{labelSpendLimit}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <KeyboardDatePicker
              showTodayButton
              variant="dialog"
              format="yyyy-MM-dd"
              label={inputActivationDate}
              value={date}
              onChange={this.makeDateChange(index)}
              invalidDateMessage={invalidDateFormat}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              okLabel={actionDialogOk}
              cancelLabel={actionDialogCancel}
              todayLabel={actionDialogToday}
              fullWidth
            />
          </Grid>
          <Grid item>
            <TextField
              type="number"
              label={labelDuration}
              value={limit.duration}
              fullWidth
              onChange={this.makeLimitPropertyChange(index, "duration")}
            />
          </Grid>
          <Grid item>
            <FormControl fullWidth>
              <InputLabel>{labelTimeUnit}</InputLabel>
              <Select
                value={limit.timeUnit}
                onChange={this.makeLimitPropertyChange(index, "timeUnit")}
              >
                <MenuItem value="hour">{labelTimeUnitHours}</MenuItem>
                <MenuItem value="day">{labelTimeUnitDays}</MenuItem>
                <MenuItem value="week">{labelTimeUnitWeeks}</MenuItem>
                <MenuItem value="month">{labelTimeUnitMonths}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <TextField
              type="number"
              label={labelAmount}
              value={limit.limitAmount}
              fullWidth
              onChange={this.makeLimitPropertyChange(index, "limitAmount")}
            />
          </Grid>
          <Grid item>
            <TextField
              type="number"
              label={labelCurrentAmount}
              value={limit.currentAmount}
              fullWidth
              onChange={this.makeLimitPropertyChange(index, "currentAmount")}
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Switch
                  checked={limit.enabled}
                  onChange={this.makeEnableLimit(index)}
                  color="primary"
                  inputProps={{ "aria-label": "primary checkbox" }}
                />
              }
              label={labelEnabled}
            />
          </Grid>
        </Grid>
      </Paper>
    );
  }

  render() {
    const { limits, changes, loading } = this.state;
    const { classes } = this.props;

    const title = intl.get("profile.limits.title").defaultMessage("Limits");
    const actionSaveLimits = intl
      .get("profile.limits.action.saveLimits")
      .defaultMessage("Save Limits");

    let contents = <CircularProgress />;
    if (!loading) {
      contents = (
        <Grid container spacing={1}>
          {limits &&
            limits.map((limit, index) => (
              <Grid key={limit.limitId} item>
                {this.renderLimit(limit, index)}
              </Grid>
            ))}
          <Grid item>
            <Paper className={classes.paper}>
              <Button color="primary" onClick={this.makeAddLimit()}>
                <AddCircle />
              </Button>
            </Paper>
          </Grid>
        </Grid>
      );
    }

    return (
      <div className={classes.root}>
        <Grid container justify="space-between">
          <Grid item>
            <Typography variant="h4">{title}</Typography>
          </Grid>
          <Grid item>
            <Button
              color="primary"
              variant="contained"
              disabled={!changes}
              onClick={this.makeSetLimits()}
            >
              {actionSaveLimits}
            </Button>
          </Grid>
        </Grid>
        <Divider />
        <div className={classes.limits}>{contents}</div>
      </div>
    );
  }
}
export default Limits;
