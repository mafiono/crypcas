import React, { Component } from "react";
import intl from "react-intl-universal";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import { withRouter, Link } from "react-router-dom";
import { Button, Grid, Typography, Hidden, Box } from "@material-ui/core";
import { ArrowBack, Fullscreen } from "@material-ui/icons";
import {
  getUser,
  getAllGames,
  getHeaderCollapsed,
} from "../../redux/selectors";
import { setHeaderCollapsed } from "../../redux/slices/main";
import { baseURL, setLoginRedirect } from "../../helpers/request";
import { IS_MOBILE } from "../../helpers/constants";
import UBTCConverterDialog from "./UBTCConverterDialog";

const titleBarHeight = 50;
const gameMarginTop = 4;
let reservedSpace = 0;

@withRouter
@connect(
  (state) => ({
    user: getUser(state),
    games: getAllGames(state),
    headerCollapsed: getHeaderCollapsed(state),
  }),
  { setHeaderCollapsed }
)
@withStyles((theme) => {
  reservedSpace =
    parseInt(theme.custom.size.headerHeight) + titleBarHeight + gameMarginTop;
  return {
    root: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing(0, 10),
      [theme.breakpoints.down("md")]: {
        padding: theme.spacing(0, 5),
      },
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(0, 1),
      },
    },
    gameArea: {
      width: "100%",
      height: `calc(100vh - ${reservedSpace}px)`,
      marginTop: `${gameMarginTop}px`,
    },
    infoPage: {
      height: "calc(80vh)",
    },
    iframe: {
      borderWidth: 0,
      width: "100%",
      height: "100%",
      backgroundColor: theme.palette.background.default,
    },
    fullscreen: {
      position: "fixed",
      zIndex: 100,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    noUnderline: {
      textDecoration: "none",
    },
    marginRight: {
      marginRight: theme.spacing(2),
    },
  };
})
class GamePage extends Component {
  state = {
    game: this.getGame(),
    fullscreen: false,
  };

  getGame() {
    const { gameId, games } = this.props;

    let game = null;
    for (let i = 0; i < games.length; i++) {
      const tmpGame = games[i];
      if (tmpGame.id === Number(gameId)) {
        game = tmpGame;
        break;
      }
    }

    return game;
  }

  focusGame = null;

  focusWindow = null;

  resize = null;

  componentWillUnmount() {
    this.props.setHeaderCollapsed(false);
    window.removeEventListener("blur", this.focusGame);
    window.removeEventListener("focus", this.focusWindow);
    window.removeEventListener("resize", this.resize);
  }

  componentDidMount() {
    this.focusGame = this.makeFocusGame();
    this.focusWindow = this.makeFocusWindow();
    this.resize = this.makeResize();
    window.addEventListener("blur", this.focusGame);
    window.addEventListener("focus", this.focusWindow);
    window.addEventListener("resize", this.resize);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.gameId !== this.props.gameId) {
      this.setState({ game: this.getGame() });
    }
  }

  /**
   * Called when the game is focused, hide the header if the windows has a small height (landscape mode)
   * and center the game/buttons within the available view space.
   */
  makeFocusGame() {
    return () => {
      if (
        document.activeElement &&
        document.activeElement.id === "gameContainer"
      ) {
        if (window.innerHeight < 500) {
          this.props.setHeaderCollapsed(true);
        }
        const bottomSpace = 6;
        const gameBCR = document.activeElement.getBoundingClientRect();
        const top =
          window.scrollY + gameBCR.top - (reservedSpace - bottomSpace);
        window.scrollTo(0, top);
      }
    };
  }

  /**
   * Called when the game loses focus, show the header if it was hidden.
   */
  makeFocusWindow() {
    return () => {
      this.props.headerCollapsed && this.props.setHeaderCollapsed(false);
    };
  }

  /**
   * Called when the orientation changes to show/hide the header and focus the game appropriately.
   */
  makeResize() {
    return (event) => {
      this.props.setHeaderCollapsed(false);
      // Give the browser a moment to re-measure before focusing the game
      setTimeout(this.makeFocusGame(), 500);
    };
  }

  makeSetLoginRedirect() {
    return () => {
      const { history } = this.props;
      setLoginRedirect(history.location.pathname);
    };
  }

  makeGoBack() {
    return () => {
      const { history } = this.props;
      history.goBack();
    };
  }

  makeSwitchMode() {
    return () => {
      const { gameId, isDemo, history } = this.props;
      this.setState({ fullscreen: false });
      history.push(`/game/${isDemo ? "play" : "demo"}/${gameId}`);
    };
  }

  makeSetFullscreen() {
    return () => {
      const iframe = document.querySelector("iframe#gameContainer");
      if (iframe) {
        if (iframe.requestFullscreen) {
          iframe.requestFullscreen();
        } else {
          this.setState({ fullscreen: true });
        }
      }
    };
  }

  renderGameHead() {
    const { game } = this.state;
    const { isDemo } = this.props;

    const demoLabel = intl.get("gamepage.label.demo").defaultMessage("Demo");
    const realLabel = intl.get("gamepage.label.real").defaultMessage("Real");
    const switchToDemo = intl
      .get("gamepage.action.switchToDemo")
      .defaultMessage("Play the Demo");
    const switchToReal = intl
      .get("gamepage.action.switchToReal")
      .defaultMessage("Play for Real");

    const backItem = (
      <Grid item>
        <Button
          color="secondary"
          variant="contained"
          onClick={this.makeGoBack()}
        >
          <ArrowBack />
        </Button>
      </Grid>
    );

    const switchItem = (
      <Grid item>
        <Button
          color="secondary"
          variant="contained"
          onClick={this.makeSwitchMode()}
        >
          {isDemo ? switchToReal : switchToDemo}
        </Button>
      </Grid>
    );

    const fullscreenItem = (
      <Grid item>
        <Button
          color="primary"
          variant="contained"
          onClick={this.makeSetFullscreen()}
        >
          <Fullscreen />
        </Button>
      </Grid>
    );

    return (
      <>
        <Hidden smDown>
          <Box width="100%" marginTop={1}>
            <Grid item container spacing={1} alignItems="center">
              {backItem}
              <Grid item xs>
                <Typography variant="h4">
                  {game.label} - {isDemo ? demoLabel : realLabel}
                </Typography>
              </Grid>
              {switchItem}
              {fullscreenItem}
              <Grid item>
                <UBTCConverterDialog />
              </Grid>
            </Grid>
          </Box>
        </Hidden>
        <Hidden mdUp>
          <Box width="100%" marginTop={1}>
            <Grid item container spacing={1} direction="column">
              <Grid item>
                <Typography variant="h4">
                  {game.label} - {isDemo ? demoLabel : realLabel}
                </Typography>
              </Grid>
              <Grid item container spacing={1} justify="space-between">
                <Grid item xs container>
                  {backItem}
                </Grid>
                {switchItem}
                {fullscreenItem}
                <Grid item>
                  <UBTCConverterDialog />
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Hidden>
      </>
    );
  }

  renderGame() {
    const { game, fullscreen } = this.state;
    const { classes, isDemo, user, headerCollapsed } = this.props;

    const mode = isDemo ? "fun" : "money";
    const sessionId = (user && user.token) || "";
    const locale = localStorage.locale || "en";
    const gameSrc = `${baseURL}/api/site/launcher/${game.systemId}?force=${mode}&sessionId=${sessionId}&mobile=${IS_MOBILE}&locale=${locale}`;

    let iFrameClasses = classes.iframe;
    if (fullscreen) {
      iFrameClasses += ` ${classes.fullscreen}`;
    }

    const gameAreaStyle = headerCollapsed
      ? { height: `calc(100vh - ${titleBarHeight + gameMarginTop}px)` }
      : {};

    return (
      <>
        {this.renderGameHead(game)}
        <div className={classes.gameArea} style={gameAreaStyle}>
          <iframe
            title={game.label}
            id="gameContainer"
            src={gameSrc}
            className={iFrameClasses}
            allowFullScreen
          />
        </div>
      </>
    );
  }

  renderMustLogin() {
    const { game } = this.state;
    const { classes } = this.props;

    const title = intl
      .get("gamepage.realreq.title")
      .defaultMessage("Login to Play");
    const description = intl
      .get("gamepage.realreq.description")
      .defaultMessage("You must login to play for real.");
    const actionLogin = intl
      .get("gamepage.realreq.action.login")
      .defaultMessage("Login");
    const actionRegister = intl
      .get("gamepage.realreq.action.register")
      .defaultMessage("Register");

    return (
      <Grid container direction="column">
        {this.renderGameHead(game)}
        <Grid
          item
          container
          direction="column"
          justify="center"
          alignItems="center"
          className={classes.infoPage}
        >
          <Grid item>
            <Typography variant="h3">{title}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1">{description}</Typography>
          </Grid>
          <Grid item>
            <Link
              to="/login"
              className={`${classes.noUnderline} ${classes.marginRight}`}
            >
              <Button
                color="primary"
                variant="contained"
                onClick={this.makeSetLoginRedirect()}
              >
                {actionLogin}
              </Button>
            </Link>
            <Link to="/register" className={classes.noUnderline}>
              <Button color="secondary" variant="contained">
                {actionRegister}
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  render404() {
    const { classes } = this.props;

    const description = intl
      .get("gamepage.404.description")
      .defaultMessage("This is not the game you are looking for.");
    const title = intl.get("gamepage.404.title").defaultMessage("404");
    const actionBack = intl
      .get("gamepage.404.action.back")
      .defaultMessage("Take me back");

    return (
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.infoPage}
      >
        <Grid item>
          <Typography variant="subtitle1">{description}</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h1">{title}</Typography>
        </Grid>
        <Grid>
          <Button
            color="primary"
            variant="contained"
            onClick={this.makeGoBack()}
          >
            {actionBack}
          </Button>
        </Grid>
      </Grid>
    );
  }

  redirectToNewTab() {
    const { game } = this.state;
    const { isDemo, user } = this.props;

    const mode = isDemo ? "fun" : "money";
    const sessionId = (user && user.token) || "";
    const locale = localStorage.locale || "en";
    const gameSrc = `${baseURL}/api/site/launcher/${game.systemId}?force=${mode}&sessionId=${sessionId}&mobile=${IS_MOBILE}&lobbyURL=${window.location.origin}&locale=${locale}`;
    window.location = gameSrc;
  }

  render() {
    const { game } = this.state;
    const { classes, isDemo, user } = this.props;

    let renderedItem;

    if (game) {
      // Game Exists
      if (!user.signedIn && !isDemo) {
        // Must be logged in to play for real
        renderedItem = this.renderMustLogin();
      } else if (IS_MOBILE && game.classAdditions === "mob-new-tab") {
        this.redirectToNewTab();
      } else {
        // Render the game
        renderedItem = this.renderGame();
      }
    } else {
      // Game Id does not exist
      renderedItem = this.render404();
    }

    return <div className={classes.root}>{renderedItem}</div>;
  }
}

export default GamePage;
