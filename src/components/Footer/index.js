import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import intl from "react-intl-universal";
import { Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { getCopyright, getLanguage } from "../../redux/selectors";

@connect((state) => ({
  language: getLanguage(state),
  copyright: getCopyright(state),
}))
@withStyles((theme) => ({
  root: {
    position: "relative",
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderTop: `2px solid ${theme.palette.divider}`,
  },
}))
class Footer extends Component {
  render() {
    const { classes, copyright } = this.props;
    const copyrightMsg = intl
      .get("footer.copyright", { 0: copyright, 1: new Date().getFullYear() })
      .defaultMessage(
        `Copyright © ${new Date().getFullYear()} ${copyright} All rights reserved.`
      );
    return <Typography className={classes.root}>{copyrightMsg}</Typography>;
  }
}
export default Footer;
