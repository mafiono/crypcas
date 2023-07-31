import React, { Component } from "react";
import intl from "react-intl-universal";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { Box, Button, Snackbar } from "@material-ui/core";
import FirstTimeLoginDialog from "./FirstTimeLoginDialog";
import StaticPage from "./StaticPage";
import VerifyEmail from "./VerifyEmail";
import PromoCode from "./PromoCode";
import RestoreAccount from "./RestoreAccount";
import Header from "../Header";
import Footer from "../Footer";
import Categories from "../Categories";
import PaymentMethods from "../PaymentMethods";
import Login from "../Login";
import Register from "../Register";
import ExpressCashOut from "../ExpressCashOut";
import Profile from "../Profile";
import Games from "../Games";
import GamePage from "../GamePage";
// import Casino from '../Casino';
// import FeaturedGames from '../FeaturedGames';
import Banner from "../Banner";
import Support from "../Support";
import Sportsbook from "../Sportsbook";
import Promotions from "../reusable/Promotions";
import Blog from "../Blog";
import Chat from "../Chat";
import MonthlyPromotion from "../MonthlyPromotion";

import {
  getUser,
  getSnackbarOpen,
  getSnackbarMsg,
  getFirstTimeLoginDialogOpen,
} from "../../redux/selectors";
import { openSnackbar, closeSnackbar } from "../../redux/slices/notifications";
import { back } from "../../redux/slices/history";
import { setFilter } from "../../redux/slices/history";
import ScrollToTop from "./ScrollToTop";
import ShowOnlyOn321 from "../reusable/Visibility/ShowOnlyOn321";

@withRouter
@connect(
  (state) => ({
    user: getUser(state),
    snackbarOpen: getSnackbarOpen(state),
    snackbarMsg: getSnackbarMsg(state),
    firstTimeLoginDialogOpen: getFirstTimeLoginDialogOpen(state),
  }),
  { openSnackbar, closeSnackbar, setFilter, back }
)
@withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    minHeight: "100vh",
  },
}))
class Main extends Component {
  componentDidMount() {
    const { history } = this.props;
    history.listen((location, action) => {
      if (action === "POP") {
        this.props.back();
      } else {
        this.props.setFilter("");
      }
    });
  }

  /**
   * Facilitates opening a new snackbar while one was already open, by not providing a parameter
   * it will open the new snackbar; this is done after the current one has closed.
   */
  makeOpenSnack() {
    return () => {
      this.props.openSnackbar();
    };
  }

  /**
   * This closes the snackbar, called after the auto hide duration elapses
   * or when the user clicks the close button.
   */
  makeCloseSnack() {
    return (event, reason) => {
      if (reason !== "clickaway") {
        this.props.closeSnackbar();
      }
    };
  }

  renderInfoRoutes() {
    return <></>;
  }

  render() {
    const {
      classes,
      snackbarOpen,
      snackbarMsg,
      firstTimeLoginDialogOpen,
      user,
      updateTheme,
    } = this.props;

    const actionAcknowledge = intl
      .get("generic.snackbar.acknowledge")
      .defaultMessage("Okay");

    const myRoutes = (
      <Switch>
        {/* Redirects when logged in */}
        {user.signedIn && <Redirect from="/login" to="/profile" />}
        {user.signedIn && <Redirect from="/register" to="/profile" />}

        {/* Redirects when not logged in */}
        {!user.signedIn && <Redirect from="/profile" to="/login" />}

        {/* User Pages */}
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route
          path="/profile"
          render={(route) => (
            <Profile route={route} updateTheme={updateTheme} />
          )}
        />

        <Route path="/express-cash-out" exact>
          <ShowOnlyOn321>
            {user.signedIn ? (
              <ExpressCashOut />
            ) : (
              <Redirect from="/express-cash-out" to="/login" />
            )}
          </ShowOnlyOn321>
        </Route>

        {/* Games */}
        <Route
          path="/games"
          render={(route) => (
            <>
              <Categories />
              <Games route={route} />
              <PaymentMethods />
            </>
          )}
        />
        <Route
          path="/game/play/:id"
          render={(route) => <GamePage gameId={route.match.params.id} />}
        />
        <Route
          path="/game/demo/:id"
          render={(route) => <GamePage gameId={route.match.params.id} isDemo />}
        />

        {/* Support */}
        <Route path="/support">
          <Categories />
          <Support />
          <PaymentMethods />
        </Route>

        {/* Promotions */}
        <Route path="/promotions">
          <Promotions />
          <PaymentMethods />
        </Route>

        {/* Blog */}
        <Route path="/blog">
          <Blog />
          <PaymentMethods />
        </Route>

        {/* Sportsbook */}
        <Route path="/sportsbook">
          <Sportsbook />
          <PaymentMethods />
        </Route>

        {/* MonthlyPromotion */}
        <Route path="/monthly-event/:viewName">
          <MonthlyPromotion />
        </Route>

        {/* Static Pages */}
        <Route
          path="/page/:name"
          render={(route) => (
            <>
              <Categories />
              <StaticPage staticPage={route.match.params.name} />
              <PaymentMethods />
            </>
          )}
        />

        {/* Email Validation */}
        <Route
          path="/email-validation/:token"
          render={(route) => (
            <>
              <Categories />
              <VerifyEmail token={route.match.params.token} />
              <PaymentMethods />
            </>
          )}
        />

        {/* Restore Account */}
        <Route
          path="/restore-password/:token"
          render={(route) => (
            <>
              <Categories />
              <RestoreAccount token={route.match.params.token} />
              <PaymentMethods />
            </>
          )}
        />

        {/* Restore Account */}
        <Route
          path="/promo-code/:code"
          render={(route) => (
            <>
              <Categories />
              <PromoCode code={route.match.params.code} />
              <PaymentMethods />
            </>
          )}
        />

        {/* Catch All: Home Page */}
        <Route path="/">
          <Banner />
          <Categories />
          {/* <FeaturedGames /> */}
          {/* <Casino /> */}
          <Games autoLoadMore={false} />
          <PaymentMethods />
        </Route>
      </Switch>
    );

    return (
      <div className={classes.root}>
        <Header />
        <Route
          path="/"
          render={(route) => {
            window.scrollTo(0, 0);
            return myRoutes;
          }}
        />
        <Footer />
        <Box position="fixed" bottom="0" left="0" m={2}>
          <ScrollToTop />
        </Box>

        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={this.makeCloseSnack()}
          onExited={this.makeOpenSnack()}
          message={snackbarMsg}
          action={
            <Button
              color="primary"
              variant="contained"
              aria-label="close"
              onClick={this.makeCloseSnack()}
            >
              {actionAcknowledge}
            </Button>
          }
        />
        {firstTimeLoginDialogOpen && <FirstTimeLoginDialog />}
        <Chat />
      </div>
    );
  }
}

export default Main;
