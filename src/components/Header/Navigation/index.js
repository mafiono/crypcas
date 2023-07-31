import React, { Component } from "react";
import intl from "react-intl-universal";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import { Route } from "react-router-dom";
import { Grid } from "@material-ui/core";
import Tab from "./Tab";
import {
  getCurrentSection,
  getSections,
  getNewsletters,
} from "../../../redux/selectors";

@connect((state) => ({
  currentSection: getCurrentSection(state),
  sections: getSections(state),
  newsletters: getNewsletters(state),
}))
@withStyles(() => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "stretch",
  },
  noUnderline: {
    textDecoration: "none",
  },
}))
class Navigation extends Component {
  renderTabs(route) {
    const { currentSection, sections, newsletters } = this.props;
    const { pathname } = route.location;

    const labelBlog = intl.get("category.blog").defaultMessage("Blog");
    const iterateSections = sections ? [...sections] : [];
    if (Array.isArray(newsletters) && newsletters.length) {
      iterateSections.push({
        systemTag: "blog",
        label: labelBlog,
      });
    }

    return (
      <Grid
        container
        wrap="nowrap"
        justify="center"
        alignItems="stretch"
        spacing={2}
      >
        {iterateSections.map((section) => {
          let linkTo = "/games";
          let systemTag = null;
          let activeTab = false;
          // Hidden Sections
          if (section.systemTag === "home") {
            return false;
          }
          // Special Sections
          if (
            section.systemTag === "promotions" ||
            section.systemTag === "sportsbook" ||
            section.systemTag === "blog"
          ) {
            linkTo = `/${section.systemTag}`;
            activeTab = pathname === linkTo;
          } else if (section.systemTag === "monthly-event") {
            linkTo = `/${section.systemTag}/${section.viewName}`;
            activeTab = pathname === linkTo;
          } else {
            systemTag = section && section.systemTag;
            activeTab =
              pathname.startsWith("/games") &&
              currentSection === section.systemTag;
          }
          // Render the tabs
          return (
            <Grid key={section.systemTag} item container alignItems="stretch">
              <Tab
                linkTo={linkTo}
                activeTab={activeTab}
                label={section.label}
                systemTag={systemTag}
              />
            </Grid>
          );
        })}
      </Grid>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Route render={(route) => this.renderTabs(route)} />
      </div>
    );
  }
}

export default Navigation;
