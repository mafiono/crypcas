import React, { Component, Suspense } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import Loader from "../components/Loader";
import createTheme from "../components/Theme";
import { init } from "../helpers/request";
import { themeInDarkMode } from "../helpers/theme";

// This component wraps the src/components/Main with any top-level requirements
// such as providers, which do not need to be present while loading
const Wrapper = React.lazy(() => import("./Wrapper"));

// Used to get the initial dark mode state on site load
 function isDarkMode() {
    let darkMode = false;

    // Check if the user has explicitly changed the theme of our site
    if (localStorage.darkMode !== undefined) {
        // Check if the value is set to dark mode
        darkMode = localStorage.darkMode === 'true';
    } else {
        // The user has not specified a theme, check their system properties
        try {
            const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const isLightMode = window.matchMedia('(prefers-color-scheme: light)').matches;
            const isNotSpecified = window.matchMedia('(prefers-color-scheme: no-preference)').matches;
            const hasNoSupport = !isDarkMode && !isLightMode && !isNotSpecified;
            // If their browser supports color schemes, check if dark mode is set
            if (!hasNoSupport && isDarkMode) {
                darkMode = true;
            }
        } catch (e) {
            // Nothing to do if the browser does not support preferred color schemes, will fall back on default
        }
    }

    return darkMode;
} 

class App extends Component {
    constructor() {
        super(App);
    }

    state = {
    initialized: false,
    error: false,
    maintenance: false,
    darkMode: isDarkMode(),
    // darkMode: themeInDarkMode(),
  };

  makeUpdateTheme() {
    return () => {
      // Update the local storage variable
      localStorage.theme = themeInDarkMode() ? "light" : "dark";
      // Update the state
      this.setState({ darkMode: themeInDarkMode() });
    };
  }

  componentDidMount() {
    // init makes all necessary server calls to be completed before attempting to render anything
    init()
      .then(() => {
        // All calls came back successfully
        const initialized = true;
        return this.setState({ initialized });
      })
      .catch((reason) => {
        // All (or some) calls failed to return (client network error or internal server issue?)
        const initialized = true;
        const error = true;
        let maintenance = false;
        // Reasons: 'all', 'section'
        window._reason = reason;
        if (reason === "all") {
          // First call to 'all' settings failed - assume maintenance
          maintenance = true;
        }
        return this.setState({ initialized, error, maintenance });
      });
  }

  render() {
    const { initialized, error, maintenance, darkMode } = this.state;

    return (
      <MuiThemeProvider theme={createTheme(darkMode)}>
        <Suspense fallback={<Loader />}>
          {initialized ? (
            <Wrapper
              error={error}
              maintenance={maintenance}
              updateTheme={this.makeUpdateTheme()}
            />
          ) : (
            <Loader />
          )}
        </Suspense>
      </MuiThemeProvider>
    );
  }
}

export default new(App);
