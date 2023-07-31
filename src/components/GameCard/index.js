/**
 * Usage:
 *
 * <GameCard game={} />
 *
 * Game: {
 *     id: Number,
 *     label: String,
 *     image: String, // full path to the hosted image
 *     launchReal: String, // full path to the real money game
 *     launchFun: String, // full path to the demo version of the game
 * }
 *
 * If no game object is provided, a placeholder with the Rock N Rolla logo is displayed.
 */
import React, { Component } from "react";
import intl from "react-intl-universal";
import withStyles from "@material-ui/core/styles/withStyles";
import withTheme from "@material-ui/core/styles/withTheme";
import { Link } from "react-router-dom";
import {
  Button,
  Grid,
  Typography,
  Box,
  Link as MUILink,
} from "@material-ui/core";
import { gameCardPlaceholderImage } from "../../helpers/images";
import { imageUrl } from "../../helpers/url";
import { IS_MOBILE } from "../../helpers/constants";
import { connect } from "react-redux";
import { getUser } from "../../redux/selectors";
import { baseURL } from "../../helpers/request";
// Export any static Card Properties that may be useful to its parents
export const defaultCardWidth = 240;
const heightToWidthRatio = 0.625;
const cardHeight = Math.round(defaultCardWidth * heightToWidthRatio);

const defaultRibbonColor = "#ffa500"; // orange
const ribbonColorMap = {
  orange: "#ffa500",
  green: "#008000",
  red: "#ff0000",
};

@connect((state) => ({
  user: getUser(state),
}))
@withTheme
@withStyles((theme) => ({
  gameItemContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  gameItem: {
    position: "relative",
    width: `${defaultCardWidth}px`,
    height: `${cardHeight}px`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundColor: "black",
  },
  hoverInfo: {
    position: "absolute",
    display: "flex",
    textAlign: "center",
    top: 0,
    left: 0,
    right: 0,
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    transition: "all 0.25s",
    opacity: 0,
    "&:hover": {
      opacity: 1,
      zIndex: 1,
    },
  },
  noUnderline: {
    textDecoration: "none",
  },
  ribbonContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },
  ribbon: {
    position: "absolute",
    textAlign: "center",
    transform: "rotate(45deg)",
    top: "30px",
    right: "-60px",
    width: "200px",
    border: "1px solid black",
  },
}))
class GameCard extends Component {
  // Renders the Game Placeholder Card
  renderPlaceholder() {
    const { classes } = this.props;

    return (
      <div
        className={classes.gameItem}
        style={{
          backgroundImage: `url('${gameCardPlaceholderImage}')`,
          backgroundSize: "contain",
          minWidth: `${defaultCardWidth}px`,
        }}
      ></div>
    );
  }

  getRedirectUrl() {
    const { user, game } = this.props;
    const sessionId = (user && user.token) || "";
    const locale = localStorage.locale || "en";
    return `${baseURL}/api/site/launcher/${game.systemId}?force=money&sessionId=${sessionId}&mobile=${IS_MOBILE}&lobbyURL=${window.location.origin}&locale=${locale}`;
  }

  // Renders the Game Card
  renderGame() {
    const { classes, game, user, cardWidth, theme } = this.props;

    const actionPlay = intl.get("game.action.play").defaultMessage("Play");
    const actionDemo = intl.get("game.action.demo").defaultMessage("Demo");

    const gameItemStyle = {
      backgroundImage: `url('${imageUrl(
        `${baseURL}/img/games/${game.image}`
      )}')`,
    };

    const hoverBoxHeight = {
      minHeight: `calc(${
        (cardWidth || defaultCardWidth) * heightToWidthRatio
      }px - 16px)`,
    };
    const extraStyles = {};

    if (cardWidth) {
      gameItemStyle.width = `${cardWidth}px`;
      gameItemStyle.height = `${cardWidth * heightToWidthRatio}px`;
      if (cardWidth < 200) {
        extraStyles.padding = "3px 8px";
        extraStyles.minWidth = "unset";
      }
    }

    // Ribbon Element - text overlay for the card
    let ribbonElement = null;
    // Check if there is a ribbon to use
    if (Array.isArray(game.ribbons) && game.ribbons.length) {
      // Get the ribbon properties
      const [ribbon] = game.ribbons;
      const color = ribbonColorMap[ribbon.color] || defaultRibbonColor;
      const textColor = theme.palette.getContrastText(color);
      // Define the ribbon element
      ribbonElement = (
        <Box className={classes.ribbonContainer}>
          <Box className={classes.ribbon} bgcolor={color} color={textColor}>
            <Typography>{ribbon.label}</Typography>
          </Box>
        </Box>
      );
    }

    return (
      <div className={classes.gameItem} style={gameItemStyle}>
        {ribbonElement}
        <Box className={classes.hoverInfo}>
          <Box margin={1} width="100%" display="flex" style={hoverBoxHeight}>
            <Grid
              container
              spacing={1}
              direction="column"
              justify="space-between"
              wrap="nowrap"
            >
              <Grid item>
                <Typography variant="subtitle1">{game.label}</Typography>
              </Grid>
              <Grid
                container
                item
                justify={IS_MOBILE ? "center" : "space-between"}
              >
                <Grid item>
                  {IS_MOBILE &&
                  game.classAdditions === "mob-new-tab" &&
                  user.signedIn ? (
                    <Button
                      href={this.getRedirectUrl()}
                      target="_blank"
                      as={MUILink}
                      color="primary"
                      variant="contained"
                      style={extraStyles}
                    >
                      {actionPlay}
                    </Button>
                  ) : (
                    <Link
                      to={`/game/play/${game.id}`}
                      className={classes.noUnderline}
                    >
                      <Button
                        color="primary"
                        variant="contained"
                        style={extraStyles}
                      >
                        {actionPlay}
                      </Button>
                    </Link>
                  )}
                </Grid>
                {!IS_MOBILE && (
                  <Grid item>
                    <Link
                      to={`/game/demo/${game.id}`}
                      className={classes.noUnderline}
                    >
                      <Button
                        color="secondary"
                        variant="contained"
                        style={extraStyles}
                      >
                        {actionDemo}
                      </Button>
                    </Link>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Box>
        </Box>
      </div>
    );
  }

  // If a game property was provided, render that otherwise a placeholder
  render() {
    const { classes, game } = this.props;
    return (
      <div className={classes.gameItemContainer}>
        {game ? this.renderGame() : this.renderPlaceholder()}
      </div>
    );
  }
}

export default GameCard;
