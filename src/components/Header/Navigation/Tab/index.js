import React, { Component } from "react";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import { withRouter } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { setCurrentSection } from "../../../../redux/slices/main";

@withRouter
@connect(null, { setCurrentSection })
@withStyles((theme) => ({
  root: {
    textAlign: "center",
    textDecoration: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    color: theme.palette.text.primary,
    padding: theme.spacing(0, 2),
    cursor: "pointer",
  },
  active: {
    backgroundColor: "black",
    color: "white",
  },
  line: {
    backgroundColor: "red",
    height: "2px",
    width: "100%",
  },
  text: {
    whiteSpace: "nowrap",
  },
}))
class Tab extends Component {
  makeNavTo(loc, systemTag) {
    const { history, setCurrentSection } = this.props;
    return () => {
      // Close the menu
      this.setState({ drawerOpen: false });
      // If a systemTag is provided, this is the new section we want to make active
      systemTag && setCurrentSection(systemTag);
      // Don't change pages if it's the same page we're currently on
      if (history.location.pathname !== loc) {
        history.push(loc);
      }
    };
  }

  render() {
    const { classes, activeTab, label, linkTo, systemTag } = this.props;

    const rootClass = `${classes.root} ${activeTab ? classes.active : ""}`;

    return (
      <div className={rootClass} onClick={this.makeNavTo(linkTo, systemTag)}>
        <Typography variant="h6" className={classes.text}>
          {label}
        </Typography>
        {activeTab && <div className={classes.line} />}
      </div>
    );
  }
}
export default Tab;
