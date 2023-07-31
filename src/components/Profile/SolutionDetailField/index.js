import React, { Component } from "react";
import intl from "react-intl-universal";
import withStyles from "@material-ui/core/styles/withStyles";
import { TextField, InputAdornment } from "@material-ui/core";
import { get } from "lodash";

@withStyles((theme) => ({
  root: {},
}))
class SolutionDetailField extends Component {
  state = {
    error: false,
    helperText: "",
    ...this.stateFromProps(),
  };

  /**
   * Provides the following properties to the state:
   * startAdornment - the fields start adornment, currently a currency
   * minNum - undefined if not set, otherwise a number used as the mininum
   * maxNum - undefined if not set, otherwise a number used as the maximum
   * regex - the pattern to verify the fields format
   */
  stateFromProps() {
    // Initialize the object which will be returned
    const stateProps = {};

    // Check if currency list exists, if so get the first one
    const currency = get(this.props, ["field", "currency", "0"], "");
    // Get the range of the currency, if it was provided
    const range = get(
      this.props,
      ["field", "data", "currencyDependencies", currency, "rules", "range"],
      []
    );
    // Get the regular expression to match
    const regex = get(this.props, ["field", "rules", "regexp"], "");

    // Get the min and max ranges
    const min = range && range.length > 0 && range[0];
    const max = range && range.length > 1 && range[1];

    // add the currency as a start adornment, and change the type to number
    if (currency) {
      stateProps.currency = currency;
      stateProps.startAdornment = currency;
      stateProps.type = "number";
    }
    // add the minNum property
    if (min) {
      stateProps.minNum = Number(min);
    }
    // add the maxNum property
    if (max) {
      stateProps.maxNum = Number(max);
    }
    // add the regex property
    if (regex) {
      stateProps.regex = regex;
    }

    // Return the properties to be destructured into the state
    return stateProps;
  }

  /**
   * Given the new fields value, checks if it is valid, sets the helper text if it is not.
   *
   * @param {String} value - the fields text value
   */
  checkForErrors(value) {
    const { type, minNum, maxNum, regex } = this.state;
    let error = false;
    let helperText = "";

    if (type === "number") {
      const numValue = Number(value);

      if (minNum !== undefined && numValue < minNum) {
        error = true;
        helperText = intl
          .get("validation.helper.mustBeGreaterThan", { 0: minNum })
          .defaultMessage(`must be greater than ${minNum}`);
      }
      if (maxNum !== undefined && numValue > maxNum) {
        error = true;
        helperText = intl
          .get("validation.helper.mustBeLessThan", { 0: maxNum })
          .defaultMessage(`must be less than ${maxNum}`);
      }
    }

    if (!error && regex) {
      error = !value.match(regex);
      if (error) {
        helperText = intl
          .get("validation.helper.invalidFormat")
          .defaultMessage("invalid format");
      }
    }

    // Set the state
    this.setState({ error, helperText });
    // Return the error state
    return error;
  }

  makeOnChange() {
    const { onChange } = this.props;
    return (e) => {
      const { currency } = this.state;
      const { value } = e.target;
      const error = this.checkForErrors(value);
      onChange({ value, currency, error });
    };
  }

  render() {
    const { error, helperText, startAdornment, type } = this.state;
    const { classes, field } = this.props;

    const inputProps = {};
    if (startAdornment) {
      inputProps.startAdornment = (
        <InputAdornment position="start">{startAdornment}</InputAdornment>
      );
    }

    return (
      <div className={classes.root}>
        <TextField
          type={type || "text"}
          label={field.message.label}
          onChange={this.makeOnChange()}
          error={error}
          helperText={helperText}
          fullWidth
          InputProps={inputProps}
        />
      </div>
    );
  }
}
export default SolutionDetailField;
