/**
 * Usage:
 *
 * <GameRow game={} />
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
import { Link } from "react-router-dom";
import { Button, Grid, Typography } from "@material-ui/core";
import { gameRowPlaceholderImage } from "../../helpers/images";
import { baseURL } from "../../helpers/request";
import { imageUrl } from "../../helpers/url";
import { IS_MOBILE } from "../../helpers/constants";

// Export any static Card Properties that may be useful to its parents
export const defaultCardWidth = 150;
const heightToWidthRatio = 0.625;
const cardHeight = Math.round(defaultCardWidth * heightToWidthRatio);

@withStyles((theme) => ({
  root: {
    wordBreak: "break-word",
    background: theme.palette.background.paper,
    "&:hover": {
      background: theme.palette.background.default,
    },
  },
  imageContainer: {
    display: "flex",
    alignItems: "center",
    background: "black",
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
  gameTitle: {
    margin: theme.spacing(0, 2),
  },
  gameActions: {
    marginBottom: theme.spacing(1),
  },
  gameAction: {
    marginRight: theme.spacing(1),
    textDecoration: "none",
  },
}))
class GameRow extends Component {
  // If a game property was provided, render that otherwise a placeholder
  render() {
    const { classes, game, availableWidth } = this.props;

    const actionPlay = intl.get("game.action.play").defaultMessage("Play");
    const actionDemo = intl.get("game.action.demo").defaultMessage("Demo");

    let gameImageStyles = {
      backgroundImage: `url('${imageUrl(
        `${baseURL}/img/games/${game.image}`
      )}')`,
    };
    if (!game) {
      gameImageStyles = {
        backgroundImage: `url('${gameRowPlaceholderImage}')`,
        backgroundSize: "contain",
        minWidth: `${defaultCardWidth}px`,
      };
    }

    let direction = "row";
    if (availableWidth && availableWidth < 316) {
      direction = "column";
      gameImageStyles.width = availableWidth;
      gameImageStyles.height = Math.round(availableWidth * heightToWidthRatio);
    }

    return (
      <Grid
        container
        direction={direction}
        wrap="nowrap"
        className={classes.root}
      >
        <Grid item className={classes.imageContainer}>
          <div className={classes.gameItem} style={gameImageStyles}></div>
        </Grid>
        <Grid
          item
          container
          spacing={1}
          direction="column"
          justify="space-between"
        >
          <Grid item>
            <Typography variant="h5" className={classes.gameTitle}>
              {game.label}
            </Typography>
          </Grid>
          <Grid
            item
            container
            justify="flex-end"
            alignItems="flex-end"
            className={classes.gameActions}
          >
            <Grid item>
              <Link to={`/game/play/${game.id}`} className={classes.gameAction}>
                <Button color="primary" variant="outlined">
                  {actionPlay}
                </Button>
              </Link>
            </Grid>
            {!IS_MOBILE && (
              <Grid item>
                <Link
                  to={`/game/demo/${game.id}`}
                  className={classes.gameAction}
                >
                  <Button color="secondary" variant="outlined">
                    {actionDemo}
                  </Button>
                </Link>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
export default GameRow;
