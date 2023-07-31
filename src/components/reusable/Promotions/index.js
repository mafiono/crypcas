import React, { Component } from "react";
import intl from "react-intl-universal";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Typography,
  Box,
} from "@material-ui/core";
import { SizeMe } from "react-sizeme";
import { baseURL, getPromoItems } from "../../../helpers/request";
// import { activatePromoCode } from '../../../helpers/request';
import { Link, withRouter } from "react-router-dom";
import sanitize from "dompurify";
import { getLanguage } from "../../../redux/selectors";
import { openSnackbar } from "../../../redux/slices/notifications";
import { imageUrl } from "../../../helpers/url";

const promotionWidth = 400;
const promotionMaxWidth = 800;
const imageBorder = 8;
const imageWidthToHeightRatio = 0.5;
let spacingUnit = 8;

@withRouter
@connect(
  (state) => ({
    language: getLanguage(state),
  }),
  { openSnackbar }
)
@withStyles((theme) => {
  spacingUnit = theme.spacing(1);
  return {
    root: {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
      padding: theme.spacing(10, 10, 10, 10),
      [theme.breakpoints.down("md")]: {
        padding: theme.spacing(6, 5, 6, 5),
      },
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(2, 1, 2, 1),
      },
    },
    largeText: {
      color: "white",
      textAlign: "center",
      fontSize: "6rem",
      [theme.breakpoints.down("md")]: {
        fontSize: "5rem",
      },
      [theme.breakpoints.down("sm")]: {
        fontSize: "4rem",
      },
      [theme.breakpoints.down("xs")]: {
        fontSize: "3rem",
      },
    },
    promotion: {
      textAlign: "center",
      marginLeft: "auto",
      marginRight: "auto",
    },
    promoBannerContentouter: {
      backgroundColor: "black",
      padding: theme.spacing(2),
      borderRadius: "0 0 10px 10px",
      minWidth: "250px",
    },
    promoBannerContentinner: {
      backgroundColor: "#2A2A2A",
      padding: theme.spacing(1),
      color: "white",
    },
    promoBannerImage: {
      backgroundColor: "black",
      borderRadius: "10px 10px 0 0",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      border: `${imageBorder}px solid black`,
      borderBottomWidth: 0,
    },
    dialogText: {
      color: theme.palette.text.primary,
    },
  };
})
class Promotions extends Component {
  state = {
    promoItems: [],
    dialog: false,
    dialogTitle: "",
    dialogContent: "",
  };

  getPromotions() {
    getPromoItems()
      .then((res) => {
        const { promoItems } = res;
        // Filter out promotions with titles starting with double-underscores
        this.setState({
          promoItems: promoItems.filter(
            (promo) => !promo?.linkCallForAction2?.startsWith("/registration")
          ),
        });
      })
      .catch((res) => {
        // TODO: failed to obtain promo items
      });
  }

  componentDidMount() {
    this.getPromotions();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.language !== this.props.language) {
      this.getPromotions();
    }
  }

  makeActivatePromo(promoCode) {
    const { history } = this.props;
    return () => {
      // Navigate to the promo-code page which will attempt to activate the code
      // requesting them login if they are not, or contact support if the code does not work.
      history.push(`/promo-code/${promoCode}`);
      /* script to activate the code on this page
            activatePromoCode(promoCode).then(res => {
                // Promo code activated
                const message = intl.get('profile.bonus.notify.activatedPromoCode').defaultMessage('Promo code activated.');
                this.props.openSnackbar({ message });
            }).catch(res => {
                // Get the error code
                const errorCode = res && res.errorCode;
                // Default 3502: unknown promo code
                let message = intl.get('profile.bonus.notify.invalidCode').defaultMessage('Invalid promo code.');
                if (errorCode === 3504) {
                    // 3504: Promo code already activated
                    message = intl.get('profile.bonus.notify.alreadyActive').defaultMessage('Promo code already activated.');
                }
                this.props.openSnackbar({ message });
            });
            */
    };
  }

  makeDialogClose() {
    return () => {
      this.setState({ dialog: false });
    };
  }

  makeDialogOpen(dialogTitle, dialogContent) {
    return () => {
      this.setState({ dialog: true, dialogTitle, dialogContent });
    };
  }

  renderDialog() {
    const { dialogTitle, dialogContent } = this.state;
    const { classes } = this.props;

    const actionDialogClose = intl
      .get("generic.dialog.action.ok")
      .defaultMessage("Ok");

    const desc = { __html: sanitize(dialogContent) };

    return (
      <Dialog
        aria-labelledby="dialogTitle"
        open={true}
        onClose={this.makeDialogClose()}
      >
        <DialogTitle id="dialogTitle">{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography
              dangerouslySetInnerHTML={desc}
              className={classes.dialogText}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            onClick={this.makeDialogClose()}
          >
            {actionDialogClose}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  renderPromotion(promotion, availableWidth) {
    const { classes } = this.props;

    const actionPlay = intl
      .get("promotions.action.play")
      .defaultMessage("Play Now");
    const actionActivate = intl
      .get("promotions.action.activate")
      .defaultMessage("Activate");
    const actionReadMore = intl
      .get("promotions.action.readMore")
      .defaultMessage("Read More");
    const actionTerms = intl
      .get("promotions.action.terms")
      .defaultMessage("Terms & Conditions");

    let promoCode = "";
    // Get the promo code from a call to action link built as such: "promo"<ANYTHING><SLASH><CODE><OPTIONAL-SLASH>
    //
    // VALID Examples:
    // "/promo/bonus250" - code is "bonus250"
    // "/promo/bonus250/" - code is "bonus250"
    // "/promo-code/bonus250" - code is "bonus250"
    // "/promo-code/bonus250/" - code is "bonus250"
    // "/promotions/bonus250/anything" - code is "bonus250"
    //
    // INVALID Example:
    // "/pro/bonus250" - NO MATCH, must begin with "promo"
    const promoRegex = /(?:promo.*?\/(.+?)\/)|(?:promo.*?\/(.+))/;
    // If there is a match, the code is either the first [1] or second [2] capture group
    // there are two capture groups as the regex is looking for the code where a trailing
    // slash may or may not follow it; the two conditions are required because of the way
    // the lazy capture group works.

    let p1m =
      promotion.linkCallForAction1 &&
      promotion.linkCallForAction1.match(promoRegex);
    let p2m =
      promotion.linkCallForAction2 &&
      promotion.linkCallForAction2.match(promoRegex);
    if (p1m) {
      // Get the promo code from the FIRST Call to Action
      promoCode = p1m[1] || p1m[2];
    } else if (p2m) {
      // Get the promo code from the SECOND Call to Action
      promoCode = p2m[1] || p2m[2];
    }
    // Trim any spaces
    promoCode = promoCode && promoCode.trim();

    let playId = "";
    // Refer to the comments for 'promoRegex' above in order to better understand this as well.
    const playRegex = /(?:play.*?\/(.+?)\/)|(?:play.*?\/(.+))/;
    p1m =
      promotion.linkCallForAction1 &&
      promotion.linkCallForAction1.match(playRegex);
    p2m =
      promotion.linkCallForAction2 &&
      promotion.linkCallForAction2.match(playRegex);
    if (p1m) {
      playId = p1m[1] || p1m[2];
    } else if (p2m) {
      playId = p2m[1] || p2m[2];
    }
    // Trim any spaces
    playId = playId && playId.trim();

    // The container of the content/image
    const promoItemStyles = {};
    // The content container
    const contentStyles = {};
    // The image container
    const bgStyles = {
      backgroundImage: `url("${imageUrl(baseURL + promotion.image)}")`,
    };
    // If a width was provided, calculate proportional scaling
    if (availableWidth) {
      promoItemStyles.width = `${availableWidth}px`;
      bgStyles.width = availableWidth - imageBorder * 2;
      bgStyles.height = bgStyles.width * imageWidthToHeightRatio;
    }

    const image = (
      <Grid item className={classes.promoBannerImage} style={bgStyles} />
    );

    const promoDesc = { __html: sanitize(promotion.description) };

    const contents = (
      <Grid
        item
        container
        className={classes.promoBannerContentouter}
        style={contentStyles}
      >
        <Grid
          item
          container
          spacing={1}
          direction="column"
          justify="space-between"
          alignItems="center"
          className={classes.promoBannerContentinner}
        >
          <Grid item>
            <Typography variant="h4">{promotion.title}</Typography>
          </Grid>
          <Grid item>
            <Typography dangerouslySetInnerHTML={promoDesc} />
          </Grid>
          <Grid item container spacing={1} justify="center">
            {playId && (
              <Grid item>
                <Link
                  to={`/game/play/${playId}`}
                  className={classes.noUnderline}
                >
                  <Button color="primary" variant="contained">
                    {actionPlay}
                  </Button>
                </Link>
              </Grid>
            )}
            {promoCode && (
              <Grid item>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={this.makeActivatePromo(promoCode)}
                >
                  {actionActivate}
                </Button>
              </Grid>
            )}
            {promotion.fullText && (
              <Grid item>
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={this.makeDialogOpen(
                    promotion.title,
                    promotion.fullText
                  )}
                >
                  {actionReadMore}
                </Button>
              </Grid>
            )}
            {promotion.termsAndConditions && (
              <Grid item>
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={this.makeDialogOpen(
                    promotion.title,
                    promotion.termsAndConditions
                  )}
                >
                  {actionTerms}
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    );

    // Return the grid promotion for the provided object
    return (
      <Grid
        item
        key={promotion.id}
        className={classes.promotion}
        style={promoItemStyles}
      >
        <Grid
          item
          container
          direction="column"
          justify="center"
          alignItems="stretch"
        >
          {image}
          {contents}
        </Grid>
      </Grid>
    );
  }

  render() {
    const { promoItems, dialog } = this.state;
    const { classes } = this.props;

    // const title = intl.get('promotions.title').defaultMessage('PROMOTIONS');

    const promoSpacing = 2;
    const pxBetweenItems = promoSpacing * spacingUnit;

    return (
      <Box className={classes.root}>
        {/* <Typography variant="h1" className={classes.largeText}>{title}</Typography> */}
        <SizeMe
          render={({ size }) => {
            let availableWidth = null;
            if (size && size.width) {
              let maxItemsPerLine = Math.min(
                Math.floor(size.width / promotionWidth),
                promoItems.length
              );
              if (
                maxItemsPerLine === 0 ||
                maxItemsPerLine + (maxItemsPerLine - 1) * pxBetweenItems >
                  size.width
              ) {
                maxItemsPerLine = 1;
              }
              availableWidth = Math.floor(size.width / maxItemsPerLine);
              availableWidth = Math.min(availableWidth, promotionMaxWidth);
            }
            return (
              <Grid container spacing={promoSpacing}>
                {promoItems &&
                  promoItems.map((item) =>
                    this.renderPromotion(item, availableWidth)
                  )}
              </Grid>
            );
          }}
         children=""/>
        {dialog && this.renderDialog()}
      </Box>
    );
  }
}

export default Promotions;
