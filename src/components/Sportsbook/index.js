import React, { Component } from "react";
// import intl from 'react-intl-universal';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import { Box, CircularProgress } from "@material-ui/core";
import { getSportsbook, getLanguage } from "../../redux/selectors";
import { getSection, setLoginRedirect } from "../../helpers/request";

@withRouter
class SportsbookFrame extends Component {
  state = {
    betsoftFrame: null,
  };

  makeOnRouteChange() {
    return () => {};
  }

  makeOnLogin() {
    const { history } = this.props;
    return () => {
      setLoginRedirect(history.location.pathname);
      history.push("/login");
    };
  }

  makeOnRegister() {
    const { history } = this.props;
    return () => {
      history.push("/register");
    };
  }

  makeOnSessionRefresh() {
    return () => {
      window.location.reload();
    };
  }

  makeOnRecharge() {
    const { history } = this.props;
    return () => {
      history.push("/profile/deposit");
    };
  }

  componentDidMount() {
    const { language, loaded } = this.props;
    getSection("sportsbook").then((sportsbook) => {
      // Trigger loaded
      loaded && loaded();
      // Pull the sportsbook info
      const { betby_brandId, betby_frameKey, betby_theme_name } = sportsbook;
      // eslint-disable-next-line
      const betsoftFrame = new BTRenderer();
      betsoftFrame.initialize({
        brand_id: betby_brandId,
        key: betby_frameKey || "",
        lang: (language || "").split("-")[0],
        target: document.getElementById("bettech"),
        minFrameHeight: 700,
        betSlipOffsetTop: 0,
        betslipZIndex: 999,
        themeName: betby_theme_name,
        // cssUrls: [`${process.env.PUBLIC_URL}/assets/fonts/fonts.css`],
        // fontFamilies: ['AvenirNext, serif', 'BrandonBold, serif'],
        onRouteChange: this.makeOnRouteChange(),
        onLogin: this.makeOnLogin(),
        onRegister: this.makeOnRegister(),
        onSessionRefresh: this.makeOnSessionRefresh(),
        onRecharge: this.makeOnRecharge(),
      });
      this.setState({ betsoftFrame });
    });
  }

  componentWillUnmount() {
    const { betsoftFrame } = this.state;
    betsoftFrame && betsoftFrame.kill();
  }

  render() {
    return <div id="bettech"></div>;
  }
}

@connect((state) => ({
  language: getLanguage(state),
  sportsbook: getSportsbook(state),
}))
@withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    // padding: theme.spacing(0, 10, 3, 10),
    // [theme.breakpoints.down('md')]: {
    //     padding: theme.spacing(0, 5, 2, 5),
    // },
    // [theme.breakpoints.down('sm')]: {
    //     padding: theme.spacing(0, 1, 1, 1),
    // },
  },
}))
class Sportsbook extends Component {
  state = {
    loading: true,
    renderFrame: true,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.language !== this.props.language) {
      this.setState({ renderFrame: false, loading: true });
      setTimeout(this.makeRenderFrame(), 2000);
    }
  }

  makeRenderFrame() {
    return () => this.setState({ renderFrame: true });
  }

  makeLoaded() {
    return () => this.setState({ loading: false });
  }

  render() {
    const { classes, language } = this.props;
    const { loading, renderFrame } = this.state;

    return (
      <Box className={classes.root}>
        {loading && (
          <Box mt={2} mb={10} textAlign="center">
            <CircularProgress />
          </Box>
        )}
        {renderFrame && (
          <SportsbookFrame language={language} loaded={this.makeLoaded()} />
        )}
      </Box>
    );
  }
}
export default Sportsbook;
