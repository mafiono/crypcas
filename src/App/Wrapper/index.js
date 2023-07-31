/**
 * This is a wrapper used by the highest-leveled component of the entire app,
 * this specific portion should be used for any global-providers which are not
 * needed during the pre-loading process.
 *
 * The wrapper component should never be re-rendered which makes it a good target
 * for logic that needs to execute once on the applications initialization.
 */
import React, { Component } from "react";
import intl from "react-intl-universal";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../redux/store";
import Main from "../../components/Main";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import locales from "../../locales";
import { getLanguage } from "../../redux/selectors";
import { Typography, Box } from "@material-ui/core";
import { errorLogo } from "../../helpers/images";
import  ApolloProvider from "../../gql/ApolloProvider";
/**
 * This component is displayed when the site could not be loaded properly.
 * This would likely be a client network issue or an internal server error.
 */
@withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
}))
class Error extends Component {
  render() {
    const { maintenance, classes } = this.props;

    let msg = intl
      .get("server.notResponding")
      .defaultMessage("Could not connect to server, please try again later.");
    if (maintenance) {
      msg = intl
        .get("server.maintenance")
        .defaultMessage(
          "Temporarily down for maintenance, please check back shortly."
        );
    }

    return (
      <Box className={classes.root}>
        <Box>
          <img src={errorLogo} alt="" />
        </Box>
        <Box marginTop={1}>
          <Typography>{msg}</Typography>
        </Box>
      </Box>
    );
  }
}

/**
 * This component is what initializes the language and then displays the
 * error component above (if data could not be retrieved from the server),
 * or the Main component (if settings/game/supplier information was retrieved).
 */
@connect((state) => ({
  language: getLanguage(state),
}))
class LanguageWrapper extends Component {
  state = {
    initLanguage: false,
  };

  componentDidMount() {
    this.loadLocales();
  }

  loadLocales() {
    // Get the current locale (provided by the store)
    const currentLocale = this.props.language;
    // Initialize INTL with the current language and map of locale data
    intl
      .init({
        currentLocale,
        locales,
      })
      .then(() => {
        // Language has been initialized.
        this.setState({ initLanguage: true });
      });
  }

  render() {
    const { initLanguage } = this.state;
    const { language, error, maintenance, updateTheme } = this.props;
    return (
      initLanguage &&
      (error ? (
        <Error maintenance={maintenance} />
      ) : (
        <Router>
          <Main language={language} updateTheme={updateTheme} />
        </Router>
      ))
    );
  }
}

/**
 * This is the top-level wrapper component for putting providers
 * which should be accessible to every component, but is not loaded
 * before the preloader.
 */
class Wrapper extends Component {
  render() {
    const { error, maintenance, updateTheme } = this.props;

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Provider store={store}>
          <ApolloProvider>
            <LanguageWrapper
              error={error}
              maintenance={maintenance}
              updateTheme={updateTheme}
            />
          </ApolloProvider>
        </Provider>
      </MuiPickersUtilsProvider>
    );
  }
}

export default Wrapper;
