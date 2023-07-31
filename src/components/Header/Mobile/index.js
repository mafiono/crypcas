import React, { Component } from "react";
import intl from "react-intl-universal";
import { connect } from "react-redux";
import { get } from "lodash";
import { Link, Route, withRouter } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import { Menu } from "@material-ui/icons";
import {
  Box,
  Button,
  // Divider,
  Drawer,
  Grid,
  Typography,
  List,
  ListItem,
} from "@material-ui/core/";
import {
  getCategories,
  getUser,
  getCurrentSection,
  getSectionMap,
  getSections,
  getNewsletters,
} from "../../../redux/selectors";
import { setCurrentSection } from "../../../redux/slices/main";
// import ProfileOptionList from '../ProfileOptionList';
import Icon from "../../Icon";
import { mobileIconLogo } from "../../../helpers/images";
import LanguageChanger from "../../reusable/LanguageChanger";
import Searchable from "../../reusable/Searchable";

import NavList from "./NavList";

@withRouter
@connect(
  (state) => ({
    user: getUser(state),
    categories: getCategories(state),
    currentSection: getCurrentSection(state),
    sectionMap: getSectionMap(state),
    sections: getSections(state),
    newsletters: getNewsletters(state),
  }),
  { setCurrentSection }
)
@withStyles((theme) => ({
  button: {
    minWidth: "unset",
    marginRight: theme.spacing(2),
  },
  noUnderline: {
    textDecoration: "none",
  },
  accountOption: {
    marginLeft: theme.spacing(1),
  },
  activeTab: {
    backgroundColor: theme.palette.background.default,
  },
}))
class Mobile extends Component {
  state = {
    drawerOpen: false,
  };

  makeToggleDrawer(drawerOpen) {
    return () => {
      this.setState({ drawerOpen });
    };
  }

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

  renderCategoryItem(title, link, activeTab, systemTag, badge) {
    const { classes } = this.props;

    const clazz = activeTab ? classes.activeTab : "";

    return (
      <ListItem
        key={`${link}-${systemTag}`}
        button
        onClick={this.makeNavTo(link, systemTag)}
        className={clazz}
        divider
      >
        <Box mr={1} width="32px" height="32px">
          <Icon src={mobileIconLogo} badge={badge} />
        </Box>
        <Typography>{title}</Typography>
      </ListItem>
    );
  }

  renderNavItem(pathname, tag, label, highlight, badge) {
    const { classes } = this.props;

    const match = pathname.match(/^\/games\/(.+)/);
    const activeTab = match && match[1] === tag;

    const clazz = highlight || activeTab ? classes.activeTab : "";
    const link = `/games/${tag}`;

    return (
      <ListItem
        key={link}
        button
        onClick={this.makeNavTo(link)}
        className={clazz}
        divider
      >
        <Box mr={1} width="32px" height="32px">
          <Icon src={mobileIconLogo} badge={badge} />
        </Box>
        <Typography>{label}</Typography>
      </ListItem>
    );
  }

  renderAccount() {
    const { classes, user } = this.props;

    const actionProfile = intl
      .get("mobile.nav.action.profile")
      .defaultMessage("Profile");
    const actionLogin = intl
      .get("mobile.nav.action.login")
      .defaultMessage("Login");
    const actionRegister = intl
      .get("mobile.nav.action.register")
      .defaultMessage("Register");

    return (
      <Box padding={2}>
        <Grid container spacing={1} wrap="nowrap">
          <Grid item>
            <img src={mobileIconLogo} alt="" />
          </Grid>
          <Grid
            container
            spacing={1}
            direction="column"
            justify="space-between"
            item
          >
            {user.signedIn ? (
              <>
                <Grid item>
                  <Typography>{user.loginName}</Typography>
                </Grid>
                <Grid item>
                  <Link to="/profile/info" className={classes.noUnderline}>
                    <Button
                      color="primary"
                      variant="outlined"
                      onClick={this.makeToggleDrawer(false)}
                    >
                      {actionProfile}
                    </Button>
                  </Link>
                </Grid>
              </>
            ) : (
              <>
                <Grid item>
                  <Link to="/login" className={classes.noUnderline}>
                    <Button
                      color="primary"
                      variant="outlined"
                      fullWidth
                      onClick={this.makeToggleDrawer(false)}
                    >
                      {actionLogin}
                    </Button>
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="/register" className={classes.noUnderline}>
                    <Button
                      color="primary"
                      variant="outlined"
                      fullWidth
                      onClick={this.makeToggleDrawer(false)}
                    >
                      {actionRegister}
                    </Button>
                  </Link>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    );
  }

  renderExtra() {
    return (
      <Box>
        <Grid container justify="space-around" alignItems="center">
          <Grid item>
            <LanguageChanger />
          </Grid>
          <Grid item>
            <Searchable />
          </Grid>
        </Grid>
      </Box>
    );
  }

  renderNavList(route) {
    const { currentSection, sections, newsletters } = this.props;
    const { pathname } = route.location;
    return (
      <NavList
        currentSection={currentSection}
        sections={sections}
        pathname={pathname}
        newsletters={newsletters}
        renderCategoryItem={this.renderCategoryItem.bind(this)}
      />
    );
  }

  renderCategoryList(route) {
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
        this.renderNavItem(
          pathname,
          category.systemTag,
          category.label,
          highlight,
          category.badge
        )
      );
      highlight = false;
    });

    return <List>{items}</List>;
  }

  renderDrawer() {
    const { drawerOpen } = this.state;

    return (
      <Drawer open={drawerOpen} onClose={this.makeToggleDrawer(false)}>
        {/* {this.renderAccount()}
                <Divider />
                {this.renderExtra()}
                <Divider /> */}
        <Route
          render={(route) => (
            <>
              {this.renderNavList(route)}
              {this.renderCategoryList(route)}
              <Box width="200px"></Box>
            </>
          )}
        />
        {/* <ProfileOptionList actionSelected={this.makeToggleDrawer(false)} /> */}
      </Drawer>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <>
        <Button
          color="primary"
          className={classes.button}
          onClick={this.makeToggleDrawer(true)}
        >
          <Menu />
        </Button>
        {this.renderDrawer()}
      </>
    );
  }
}

export default Mobile;
