import React, { Component } from "react";
// import intl from 'react-intl-universal';
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import { get } from "lodash";
import { Grid, Hidden, Box } from "@material-ui/core";
import { Route } from "react-router-dom";
import Category from "./Category";
import { categoryFillerImage } from "../../helpers/images";
import {
  // getCategories,
  getSectionMap,
  getCurrentSection,
} from "../../redux/selectors";

const spacingUnit = 8;

@connect((state) => ({
  // categories: getCategories(state),
  sectionMap: getSectionMap(state),
  currentSection: getCurrentSection(state),
}))
@withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    overflowX: "auto",
    display: "flex",
    borderBottom: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(3, 10),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(3, 5),
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(3, 1),
    },
  },
  button: {
    padding: theme.spacing(2, 6),
  },
  noUnderline: {
    textDecoration: "none",
  },
}))
class Categories extends Component {
  createItem(pathname, id, label, highlight, badge) {
    return (
      <Grid item xs key={id}>
        <Category
          linkTo={`/games/${id}`}
          pathname={pathname}
          icon={categoryFillerImage}
          badge={badge}
          title={label}
          highlight={highlight}
        />
      </Grid>
    );
  }

  getItems(route) {
    const { pathname } = route.location;
    // const { categories } = this.props;
    const { sectionMap, currentSection } = this.props;
    const categoryList = get(
      sectionMap[currentSection],
      ["gamesListData", "categoryList"],
      []
    );

    const items = [];
    // Force the first category to be highlighted
    let highlight = !!pathname.match(/^\/games$/);

    categoryList.forEach(({ category }) => {
      items.push(
        this.createItem(
          pathname,
          category.systemTag,
          category.label,
          highlight,
          category.badge
        )
      );
      highlight = false;
    });

    return items;
  }

  renderCategories(items) {
    return (
      <Box flexGrow={1}>
        <Grid
          container
          spacing={3}
          justify="center"
          alignItems="flex-start"
          wrap="nowrap"
        >
          {items}
        </Grid>
      </Box>
    );
  }

  render() {
    const { classes, minHeight } = this.props;

    const style = {};
    if (minHeight) {
      style.minHeight = `${minHeight * spacingUnit}px`;
    }

    return (
      <div style={style}>
        <Hidden smDown>
          <Route
            render={(route) => {
              const items = this.getItems(route);
              if (items.length) {
                return (
                  <>
                    <div className={classes.root}>
                      {this.renderCategories(items)}
                    </div>
                    <Hidden mdUp>
                      <Box mt={1}></Box>
                    </Hidden>
                  </>
                );
              }
              return null;
            }}
          />
        </Hidden>
      </div>
    );
  }
}
export default Categories;
