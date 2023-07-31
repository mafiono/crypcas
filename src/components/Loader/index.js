/**
 * This is the Loader component, it is the very first thing
 * loaded, and should therefor be as minimalistic as possible
 * should also not contain any text as the i18n's will not be
 * loaded at this point.
 */
import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { themeInLightMode } from "../../helpers/theme";
import {
  preloaderLogo,
  preloaderLogoSecondaryLight,
  preloaderLogoSecondaryDark,
} from "../../helpers/images";
import { CircularProgress } from "@material-ui/core";

@withStyles((theme) => ({
  root: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.palette.background.paper,
  },
  container: {
    position: "relative",
    width: "264px",
    height: "264px",
  },
  logo: {
    position: "absolute",
    top: "4px",
    left: "4px",
    maxWidth: "256px",
    maxHeight: "256px",
  },
  textLogo: {
    maxHeight: "40px",
    maxWidth: "300px",
    marginTop: theme.spacing(2),
  },
  circle: {
    position: "absolute",
  },
}))
class Loader extends Component {
  render() {
    const { classes } = this.props;
    const textLogo = themeInLightMode()
      ? preloaderLogoSecondaryLight
      : preloaderLogoSecondaryDark;
    return (
      <div className={classes.root}>
        <div className={classes.container}>
          <CircularProgress
            className={classes.circle}
            style={{
              width: "264px",
              height: "264px",
            }}
          />
          <img src={preloaderLogo} alt="logo" className={classes.logo} />
        </div>
        <img src={textLogo} alt="logo" className="lasses.textLogo" />
      </div>
    );
  }
}
export default Loader;
