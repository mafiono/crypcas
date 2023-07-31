import React, { Component } from "react";
import intl from "react-intl-universal";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import { withRouter } from "react-router-dom";
import { Container, Grid, Hidden, Box } from "@material-ui/core";
import { backgroundGhostLogo, adPlaceholderImage } from "../../helpers/images";
import {
  login as requestLogin,
  consumeLoginRedirect,
  activatePromoCode,
} from "../../helpers/request";
import {
  getUser,
  getLanguage,
  getLanguages,
  getRecaptchaId,
} from "../../redux/selectors";
import {
  siteProcess,
  openSnackbar,
  openFirstTimeLoginDialog,
  setInvalidLoginCode,
} from "../../redux/slices/notifications";
import { setLanguage } from "../../redux/slices/language";
import { loadSiteData } from "../../helpers/request";
import ResendActivationDialog from "./ResendActivationDialog";
import LoginForm from "./LoginForm";

@withRouter
@connect(
  (state) => ({
    user: getUser(state),
    language: getLanguage(state),
    languages: getLanguages(state),
    recaptchaId: getRecaptchaId(state),
  }),
  {
    siteProcess,
    openSnackbar,
    openFirstTimeLoginDialog,
    setInvalidLoginCode,
    setLanguage,
  }
)
@withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    minHeight: `calc(100vh - ${theme.custom.size.headerHeight} - ${theme.custom.size.footerHeight})`,
    position: "relative",
    display: "flex",
    maxWidth: "unset",
    padding: theme.spacing(2, 10),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(2, 5),
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2, 1),
    },
  },
  image: {
    position: "absolute",
    background: `url('${backgroundGhostLogo}')`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.07,
  },
  advert: {
    flexGrow: 1,
    border: "1px solid #979797",
    background: "black",
    backgroundSize: "auto",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "192px",
    zIndex: 1,
    padding: theme.spacing(12),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(6),
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(3),
    },
  },
  login: {
    flexGrow: 1,
    border: "3px solid #EBAB50",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    padding: theme.spacing(12),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(6),
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(3),
    },
  },
  gridItem: {
    display: "flex",
  },
}))
class Login extends Component {
  state = {
    processing: false,
    reactivate: false,
  };

  makeDoLogin({ login, password, recaptchaResponse, promo }) {
    const { languages } = this.props;
    // openFirstTimeLoginDialog
    const { siteProcess, openSnackbar, setInvalidLoginCode, history } =
      this.props;
    // Prevent the forms redirect

    // Begin Processing
    siteProcess(1);
    this.setState({ processing: true });

    requestLogin(login, password, recaptchaResponse)
      .then((res) => {
        if (res.isFirstLogin) {
          // openFirstTimeLoginDialog();
        }
        // Success
        // Was a promo code provided?
        if (promo) {
          // Attempt to activate the provided promo
          activatePromoCode(promo).catch(() => {
            // If promo could not be activated, take to the bonus page
            setInvalidLoginCode(promo);
            history.push("/profile/bonus");
          });
        }

        if (res.lang) {
          const lngObj = languages.find(({ code }) => code === res.lang);
          if (lngObj && lngObj.localeCode !== localStorage.lang) {
            const langFormated = lngObj.localeCode.replace("_", "-");
            localStorage.lang = langFormated;
            localStorage.locale = lngObj.code;
            const options = intl.getInitOptions();
            intl.init({ ...options, ...{ currentLocale: langFormated } });
            loadSiteData()
              .then(() => {
                siteProcess(-1);
              })
              .catch(() => {
                siteProcess(-1);
              });
            this.props.setLanguage(langFormated);
          }
        }

        const redirectPath = consumeLoginRedirect();
        history.replace(redirectPath || "/");
      })
      .catch((res) => {
        switch (res.errorCode) {
          case 3235:
            this.setState({
              processing: false,
              password: "",
              reactivate: login,
            });
            break;
          default:
            this.setState({
              processing: false,
              password: "",
            });
            // Display an error message
            openSnackbar({
              message: res.errorMessage,
            });
        }
      })
      .finally(() => {
        siteProcess(-1);
      });
  }

  render() {
    const { processing, reactivate } = this.state;
    const { classes, user, recaptchaId } = this.props;

    const ad = (
      <Grid item xs className={classes.gridItem}>
        <div
          className={classes.advert}
          style={{ backgroundImage: `url("${adPlaceholderImage}")` }}
        ></div>
      </Grid>
    );

    const form = (
      <Grid item xs className={classes.gridItem}>
        <div className={classes.login}>
          <LoginForm
            user={user}
            makeDoLogin={this.makeDoLogin.bind(this)}
            processing={processing}
            recaptchaId={recaptchaId}
          />
        </div>
      </Grid>
    );

    return (
      <Container className={classes.root}>
        <div className={classes.image}></div>

        <Hidden lgUp>
          <Container>
            {form}
            <Box marginBottom={8} />
            {ad}
          </Container>
        </Hidden>
        <Hidden mdDown>
          <Grid
            container
            spacing={8}
            direction="row"
            justify="center"
            alignItems="stretch"
          >
            {form}
            {ad}
          </Grid>
        </Hidden>
        {reactivate && (
          <ResendActivationDialog
            recaptchaId={recaptchaId}
            loginName={reactivate}
            onClose={() => {
              this.setState({
                reactivate: false,
              });
            }}
          />
        )}
      </Container>
    );
  }
}

export default Login;
