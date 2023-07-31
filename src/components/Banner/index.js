import React, { Component } from "react";
import intl from "react-intl-universal";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import { Button, Box, Typography, Hidden, Grid } from "@material-ui/core";
import { Link, withRouter } from "react-router-dom";
import { SizeMe } from "react-sizeme";
import ItemsCarousel from "react-items-carousel";
// import PromotedGames from '../PromotedGames';
import {
  bannerFillerImage,
  headerLogoLight,
  headerLogoDark,
} from "../../helpers/images";
import { themeInLightMode } from "../../helpers/theme";
import {
  getAllGameSystemMap,
  getUser,
  getLanguage,
  getSlides,
  getSlideDuration,
} from "../../redux/selectors";
import { baseURL } from "../../helpers/request";
import { imageUrl } from "../../helpers/url";

const scaleBannerWidth = 1920;
const scaleBannerHeight = 400;
let spacingUnit = 8;
const pcMaxMarginTop = 8;

@withRouter
@connect((state) => ({
  gameSystemMap: getAllGameSystemMap(state),
  user: getUser(state),
  language: getLanguage(state),
  slides: getSlides(state),
  slideDuration: getSlideDuration(state),
}))
@withStyles((theme) => {
  spacingUnit = theme.spacing(1);
  const bannerHeight = `${scaleBannerHeight}px`;
  const backgroundRGB = theme.hexToRGB(theme.palette.background.default);

  return {
    root: {
      position: "relative",
      backgroundColor: `rgb(${backgroundRGB})`,
      width: "100%",
      height: bannerHeight,
      display: "flex",
      alignItems: "stretch",
    },
    bannerWrapper: {
      width: "100%",
    },
    banner: {
      position: "relative",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: bannerHeight,
    },
    bannerTitle: {
      position: "absolute",
      textAlign: "center",
      top: theme.spacing(1),
      left: 0,
      right: 0,
    },
    bannerImageContainer: {
      position: "relative",
      maxWidth: "100%",
      height: bannerHeight,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      overflow: "hidden",
    },
    leftFade: {
      position: "absolute",
      top: 0,
      bottom: 0,
      width: "10px",
      left: 0,
      background: `linear-gradient(90deg, rgba(${backgroundRGB},1) 5%, rgba(${backgroundRGB},0) 95%)`,
    },
    rightFade: {
      position: "absolute",
      top: 0,
      bottom: 0,
      width: "10px",
      right: 0,
      background: `linear-gradient(90deg, rgba(${backgroundRGB},0) 5%, rgba(${backgroundRGB},1) 95%)`,
    },
    circularContainer: {
      position: "absolute",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      top: "0",
      bottom: "0",
      borderRadius: "50%",
      backgroundColor: "rgba(255, 255, 255, 0.6)",
      color: "black",
      width: bannerHeight,
      height: bannerHeight,
      left: theme.spacing(10),
      [theme.breakpoints.down("md")]: {
        left: theme.spacing(5),
      },
      [theme.breakpoints.down("sm")]: {
        left: theme.spacing(1),
      },
    },
    circular: {
      margin: "auto",
    },
    squareContainer: {
      position: "absolute",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      top: "0",
      bottom: "0",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      color: "white",
      // backgroundColor: 'rgba(255, 255, 255, 0.6)',
      // color: 'black',
      width: bannerHeight,
      height: bannerHeight,
      right: theme.spacing(10),
      [theme.breakpoints.down("md")]: {
        right: theme.spacing(5),
      },
      [theme.breakpoints.down("sm")]: {
        right: theme.spacing(1),
      },
    },
    square: {
      margin: "auto",
      minWidth: "75%",
    },
    registerLink: {
      textDecoration: "none",
      marginTop: theme.spacing(1),
    },
    promotedContainerContainer: {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
    },
    promotedContainer: {
      position: "relative",
      marginTop: theme.spacing(-pcMaxMarginTop),
    },
    registerButton: {
      fontSize: "1.6rem",
      fontWeight: "bold",
    },
  };
})
class Banner extends Component {
  state = {
    activeItemIndex: 0,
    interval: -1,
    lastChange: new Date().getTime(),
    defaultSlideDuration: 5000,
  };

  componentDidMount() {
    const interval = setInterval(() => {
      // Get the servers configured slide duration
      const { slideDuration } = this.props;
      // Get the last time it was changed, and the default slide duration
      const { activeItemIndex, lastChange, defaultSlideDuration } = this.state;
      // Use the server configuration if set, otherwise the default
      const diff = isNaN(slideDuration) ? defaultSlideDuration : slideDuration;
      // Calculate if the required time has elapsed
      const now = new Date().getTime();
      // Check if the window is focused
      const focused = document.hasFocus ? document.hasFocus() : true;
      // If the window is focused and enough time has elapsed
      if (focused && now - lastChange >= diff) {
        this.setState({
          activeItemIndex: activeItemIndex + 1,
          lastChange: now,
        });
      }
    }, 100);
    this.setState({ interval });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  // Used by the Swipe Event of the ItemsCarousel
  makeSetActiveIndex() {
    return (newIndex) => {
      this.setState({
        activeItemIndex: newIndex,
        lastChange: new Date().getTime(),
      });
    };
  }

  makeOnBannerClick(slide) {
    const { history, gameSystemMap } = this.props;
    const { link, type } = slide;
    return () => {
      if (type === "game") {
        // Match the link, finding the system Id
        const match = link.match(/(\w+)\?force=(\w+)/);
        if (match) {
          // Capture Groups:
          // 1st: Full match
          // 2nd: System Id
          // 3rd: The force parameter (fun/real)
          const [, systemId, force] = match;
          // Set the mode based on the 'force' param
          const mode = force === "fun" ? "demo" : "play";
          // Get the game from the game system map
          const game = gameSystemMap[`id_${systemId}`];
          // If the game was found, navigate to its demo
          if (game) {
            history.push(`/game/${mode}/${game.id}`);
          }
        }
      } else if (type === "link") {
        // Specify noopener to prevent the opened window from having a reference back
        // to this site via the window.opener property that is set otherwise.
        window.open(link, null, "noopener");
      }
    };
  }

  renderBanner(slide, overrideHeight) {
    const { classes } = this.props;
    const { id, bgImage } = slide;

    const src =
      bgImage === "fillerLogo"
        ? bannerFillerImage
        : imageUrl(baseURL + bgImage);

    const bannerImageContainerStyle = {
      backgroundImage: `url("${src}")`,
      ...overrideHeight,
    };

    const bannerStyle = {
      cursor: slide.link ? "pointer" : "unset",
      ...overrideHeight,
    };

    // The inner image is used to grow the container to the appropriate size
    // The displayed image comes from the containers background image
    return (
      <div
        key={id}
        className={classes.banner}
        style={bannerStyle}
        onClick={this.makeOnBannerClick(slide)}
      >
        <div
          className={classes.bannerImageContainer}
          style={bannerImageContainerStyle}
        >
          <img
            src={src}
            width="auto"
            height="100%"
            style={{ visibility: "hidden" }}
            alt=""
          />
          <div className={classes.leftFade}></div>
          <div className={classes.rightFade}></div>
        </div>
      </div>
    );
  }

  render() {
    const { activeItemIndex } = this.state;
    const { classes, user, slides } = this.props;

    const SITE_NAME = process.env.REACT_APP_WEBSITE_NAME_SHORT;

    let registerTitle = intl
      .get("banner.register.title", { 0: SITE_NAME })
      .defaultMessage(`Join ${SITE_NAME} Now`);
    let registerDesc = intl
      .get("banner.register.desc", { 0: SITE_NAME })
      .defaultMessage(`Because a real ${SITE_NAME} wants the whole lot.`);
    const registerNav = intl
      .get("banner.register.nav")
      .defaultMessage("Register");

    const welcome = intl.get("banner.greeting").defaultMessage("Welcome");

    let infoContents = null;
    if (!user.signedIn) {
      if (process.env.REACT_APP_BRAND_EXT === "-321") {
        const logo = themeInLightMode() ? headerLogoLight : headerLogoDark;
        const line1 = intl
          .get("banner.register.321.line1")
          .defaultMessage("3. Email");
        const line2 = intl
          .get("banner.register.321.line2")
          .defaultMessage("2. Username");
        const line3 = intl
          .get("banner.register.321.line3")
          .defaultMessage("1. Password");
        // 321 Crypto Casino
        infoContents = (
          <Box width="75%" margin="auto" textAlign="center">
            <Grid item>
              <Typography variant="h4">{registerTitle}</Typography>
            </Grid>
            <Grid item>
              <Box mt={1} mb={1}>
                <img
                  src={logo}
                  alt=""
                  style={{ maxHeight: "50px", maxWidth: "75%" }}
                />
              </Box>
            </Grid>
            <Grid item>
              <Box mt={5} mb={5}>
                <Box textAlign="left" display="inline-block">
                  <Typography variant="h5">{line1}</Typography>
                  <Typography variant="h5">{line2}</Typography>
                  <Typography variant="h5">{line3}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item>
              <Link to="/register" className={classes.registerLink}>
                <Button
                  color="primary"
                  variant="contained"
                  className={classes.registerButton}
                >
                  {registerNav}
                </Button>
              </Link>
            </Grid>
          </Box>
        );
      } else {
        // Rock N Rolla Casino
        registerTitle = registerTitle.replace(
          /RockNRolla/,
          'Rock<span style="color: red;">N</span>Rolla'
        );
        registerDesc = registerDesc.replace(
          /RockNRolla/,
          'Rock<span style="color: red;">N</span>Rolla'
        );
        infoContents = (
          <Box width="75%" margin="auto" textAlign="center">
            <Grid item>
              <Typography
                variant="h4"
                dangerouslySetInnerHTML={{ __html: registerTitle }}
              />
            </Grid>
            <Grid item>
              <Box mt={5} mb={5}>
                <Typography
                  variant="h5"
                  dangerouslySetInnerHTML={{ __html: registerDesc }}
                />
              </Box>
            </Grid>
            <Grid item>
              <Link to="/register" className={classes.registerLink}>
                <Button
                  color="primary"
                  variant="contained"
                  className={classes.registerButton}
                >
                  {registerNav}
                </Button>
              </Link>
            </Grid>
          </Box>
        );
      }
    } else {
      infoContents = (
        <>
          <Grid item>
            <Typography variant="h4">{welcome}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="h5">{user.loginName}</Typography>
          </Grid>
        </>
      );
    }

    const slideContents = slides || [
      {
        id: 1,
        bgImage: "fillerLogo", // '/img/upload/slider-bg-1.jpg',
        link: "", // 'SPSCATTEREDTOHELL?force=fun',
        type: "game",
      },
      {
        id: 2,
        bgImage: "fillerLogo", // '/img/upload/slider-bg-1.jpg',
        link: "", // 'SPSCATTEREDTOHELL?force=fun',
        type: "game",
      },
    ];

    return (
      <SizeMe
        render={({ size }) => {
          // Apply to classes: root, banner, bannerImageContainer
          const overrideHeight = {};
          // Apply to class: circularContainer
          const overrideInfoStyle = {};
          // Apply to promotedContainer
          const promotedContainerStyle = {};
          // If the size is below the scale threshold
          if (size && size.width) {
            // Determine the scale
            const scale = size.width / scaleBannerWidth;
            // Determine the new height based on the scale
            const newHeight = scaleBannerHeight * scale;
            // Set the height override
            overrideHeight.height = `${newHeight}px`;
            // Set the width and height override
            overrideInfoStyle.width = `${newHeight}px`;
            overrideInfoStyle.height = `${newHeight}px`;
            // Set the margin top of the promoted games section
            const marginTop = Math.round(pcMaxMarginTop * spacingUnit * scale);
            promotedContainerStyle.marginTop = `-${marginTop}px`;
          }
          return (
            <>
              <div className={classes.root} style={overrideHeight}>
                <div className={classes.bannerWrapper}>
                  <ItemsCarousel
                    requestToChangeActive={this.makeSetActiveIndex()}
                    activeItemIndex={activeItemIndex}
                    numberOfCards={1}
                    gutter={0}
                    infiniteLoop
                  >
                    {slideContents.map((slide) =>
                      this.renderBanner(slide, overrideHeight)
                    )}
                  </ItemsCarousel>
                </div>
                {/* <Hidden smDown>
                                <div className={classes.circularContainer} style={overrideInfoStyle}>
                                    <div className={classes.circular}>
                                        {infoContents}
                                    </div>
                                </div>
                            </Hidden> */}
                <Hidden smDown>
                  <div
                    className={classes.squareContainer}
                    style={overrideInfoStyle}
                  >
                    <div className={classes.square}>{infoContents}</div>
                  </div>
                </Hidden>
              </div>
              {/* <div className={classes.promotedContainerContainer}>
                            <div className={classes.promotedContainer} style={promotedContainerStyle}>
                                <PromotedGames />
                            </div>
                        </div> */}
            </>
          );
        }}
      />
    );
  }
}

export default Banner;
