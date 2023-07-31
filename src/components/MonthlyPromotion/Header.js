import React from "react";
import { useParams } from "react-router-dom";
import { Box, makeStyles } from "@material-ui/core";

import { useMonthlyPromotionImages } from "../../helpers/images";

const useStyles = makeStyles((theme) => ({
  bgImage: {
    backgroundImage: ({ bgTitle }) => `url(${bgTitle})`,
    backgroundSize: "70% auto",
    backgroundRepeat: "no-repeat",
    backgroundPositionX: "center",
    backgroundPositionY: "30%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.palette.background.default,
  },
  titleText: {
    width: "100%",
    height: "auto",
    maxWidth: "20vw",
    [theme.breakpoints.up("xs")]: {
      maxWidth: "35vw",
    },
    [theme.breakpoints.up("sm")]: {
      maxWidth: "20vw",
    },
    [theme.breakpoints.up("md")]: {
      maxWidth: "15vw",
    },
    [theme.breakpoints.up("lg")]: {
      maxWidth: "15vw",
    },
    [theme.breakpoints.up("xl")]: {
      maxWidth: "15vw",
    },
  },
}));

const Header = () => {
  const { viewName } = useParams();
  const { bgTitle, titleText, textPromotion } =
    useMonthlyPromotionImages(viewName);

  const classes = useStyles({
    bgTitle,
  });
  return (
    <Box className={classes.bgImage} p={3}>
      <img className={classes.titleText} src={titleText} alt="text" />
      <img className={classes.titleText} src={textPromotion} alt="promo-text" />
    </Box>
  );
};

export default Header;
