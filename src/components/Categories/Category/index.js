import React, { Component } from "react";
import { Typography } from "@material-ui/core/";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import Icon from "../../Icon";

@withStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    padding: theme.spacing(1),
    width: "50px",
    height: "50px",
    border: "3px solid #BBBBBB",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    backgroundColor:
      theme.palette.type === "dark"
        ? theme.palette.background.default
        : theme.palette.background.paper,
  },
  goldBorder: {
    borderColor: theme.custom.color.gold,
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
  noUnderline: {
    textAlign: "center",
    textDecoration: "none",
  },
  link: {
    color: theme.palette.text.primary,
    fontWeight: "bold",
  },
  goldColor: {
    color: theme.custom.color.gold,
  },
}))
class Category extends Component {
  render() {
    const { classes, linkTo, pathname, icon, badge, title, highlight } =
      this.props;

    let iconClass = classes.icon;
    let linkClass = classes.link;
    if (linkTo === pathname || highlight) {
      iconClass = `${classes.icon} ${classes.goldBorder}`;
      linkClass = `${classes.link} ${classes.goldColor}`;
    }

    return (
      <div className={classes.root}>
        <Link to={linkTo} className={classes.noUnderline}>
          <div className={iconClass}>
            <Icon src={icon} badge={badge} />
          </div>
          <Typography variant="subtitle1" className={linkClass}>
            {title}
          </Typography>
        </Link>
      </div>
    );
  }
}
export default Category;
