import React from "react";
import { useParams } from "react-router-dom";
import { Box, makeStyles } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Day from "./Day";
import { useMonthlyPromotionImages } from "../../../helpers/images";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
  },
  bgImg: {
    minHeight: "100%",
    width: "100%",
    height: "auto",
  },
}));

const Days = ({
  promoItems,
  activeOnClick,
  pastOnClick,
  futureOnClick,
  serverTime,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("xs"));
  const { viewName } = useParams();
  const { bgImageMobile, bgImage } = useMonthlyPromotionImages(viewName);

  const bg = matches ? bgImageMobile : bgImage;
  return (
    <Box className={classes.root}>
      <img className={classes.bgImg} src={bg} alt="bg" />
      {promoItems.map(({ id, day, dateFrom, dateTo, enabled }) => (
        <Day
          key={id}
          displayDay={day}
          id={id}
          activeOnClick={activeOnClick}
          pastOnClick={pastOnClick}
          futureOnClick={futureOnClick}
          dateFrom={dateFrom}
          dateTo={dateTo}
          enabled={enabled}
          serverTime={serverTime}
        />
      ))}
    </Box>
  );
};

export default Days;
