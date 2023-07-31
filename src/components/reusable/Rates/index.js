import React, { Component } from "react";
// import intl from 'react-intl-universal';
import withStyles from "@material-ui/core/styles/withStyles";
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { displayCurrency } from "../../../helpers/currency";

@withStyles((theme) => ({
  root: {},
  noWidth: {
    width: "unset",
  },
}))
class Rates extends Component {
  state = {
    rates: this.convertRates(this.props.rates || []),
  };

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

  render() {
    const { rates } = this.state;
    const { classes } = this.props;

    return (
      <TableContainer className={classes.noWidth}>
        <Table size="small" className={classes.noWidth}>
          <TableBody>
            {rates &&
              rates.map((rate, index) => (
                <TableRow key={index} hover>
                  <TableCell size="small">
                    {displayCurrency(rate.fromAmount, rate.fromCurrency)}
                  </TableCell>
                  <TableCell size="small">=</TableCell>
                  <TableCell size="small">
                    {displayCurrency(rate.toAmount, rate.toCurrency)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}
export default Rates;
