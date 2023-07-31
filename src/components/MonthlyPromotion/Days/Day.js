import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import isAfter from "date-fns/isAfter";
import isBefore from "date-fns/isBefore";

import { makeStyles, Box } from "@material-ui/core";
import { useMonthlyPromotionImages } from "../../../helpers/images";

const giftPosition = (calcSuffix = "- 8px", screen = "default") => {
  const defaultPosition = {
    31: {
      top: `calc(2.5% ${calcSuffix})`,
      left: `calc(45% ${calcSuffix})`,
    },
    30: {
      top: `calc(5% ${calcSuffix})`,
      left: `calc(46.5% ${calcSuffix})`,
    },
    29: {
      top: `calc(7.5% ${calcSuffix})`,
      left: `calc(48% ${calcSuffix})`,
    },
    28: {
      top: `calc(10% ${calcSuffix})`,
      left: `calc(48.8% ${calcSuffix})`,
    },
    27: {
      top: `calc(13% ${calcSuffix})`,
      left: `calc(49% ${calcSuffix})`,
    },
    26: {
      top: `calc(15.5% ${calcSuffix})`,
      left: `calc(50% ${calcSuffix})`,
    },
    25: {
      top: `calc(19% ${calcSuffix})`,
      left: `calc(51% ${calcSuffix})`,
    },
    24: {
      top: `calc(22% ${calcSuffix})`,
      left: `calc(51.8% ${calcSuffix})`,
    },
    23: {
      top: `calc(25% ${calcSuffix})`,
      left: `calc(53.5% ${calcSuffix})`,
    },
    22: {
      top: `calc(27.8% ${calcSuffix})`,
      left: `calc(54.5% ${calcSuffix})`,
    },
    21: {
      top: `calc(34.95% ${calcSuffix})`,
      left: `calc(54.5% ${calcSuffix})`,
    },
    20: {
      top: `calc(38% ${calcSuffix})`,
      left: `calc(54.5% ${calcSuffix})`,
    },
    19: {
      top: `calc(40.9% ${calcSuffix})`,
      left: `calc(54.3% ${calcSuffix})`,
    },
    18: {
      top: `calc(44.3% ${calcSuffix})`,
      left: `calc(54.2% ${calcSuffix})`,
    },
    17: {
      top: `calc(48% ${calcSuffix})`,
      left: `calc(54.2% ${calcSuffix})`,
    },
    16: {
      top: `calc(51.25% ${calcSuffix})`,
      left: `calc(54.2% ${calcSuffix})`,
    },
    15: {
      top: `calc(55% ${calcSuffix})`,
      left: `calc(54.3% ${calcSuffix})`,
    },
    14: {
      top: `calc(58% ${calcSuffix})`,
      left: `calc(55.25% ${calcSuffix})`,
    },
    13: {
      top: `calc(61% ${calcSuffix})`,
      left: `calc(56.5% ${calcSuffix})`,
    },
    12: {
      top: `calc(64.7% ${calcSuffix})`,
      left: `calc(56.45% ${calcSuffix})`,
    },
    11: {
      top: `calc(68.15% ${calcSuffix})`,
      left: `calc(56.5% ${calcSuffix})`,
    },
    10: {
      top: `calc(70.7% ${calcSuffix})`,
      left: `calc(55.5% ${calcSuffix})`,
    },
    9: {
      top: `calc(73.2% ${calcSuffix})`,
      left: `calc(54.9% ${calcSuffix})`,
    },
    8: {
      top: `calc(74.8% ${calcSuffix})`,
      left: `calc(52.8% ${calcSuffix})`,
    },
    7: {
      top: `calc(76% ${calcSuffix})`,
      left: `calc(50.5% ${calcSuffix})`,
    },
    6: {
      top: `calc(78.5% ${calcSuffix})`,
      left: `calc(49.5% ${calcSuffix})`,
    },
    5: {
      top: `calc(81.5% ${calcSuffix})`,
      left: `calc(49.5% ${calcSuffix})`,
    },
    4: {
      top: `calc(84.5% ${calcSuffix})`,
      left: `calc(49.5% ${calcSuffix})`,
    },
    3: {
      top: `calc(87.3% ${calcSuffix})`,
      left: `calc(49.5% ${calcSuffix})`,
    },
    2: {
      top: `calc(90%  ${calcSuffix})`,
      left: `calc(49.5% ${calcSuffix})`,
    },
    1: {
      top: `calc(93% ${calcSuffix})`,
      left: `calc(49.5% ${calcSuffix})`,
    },
  };
  const xsPosition = {
    31: {
      top: `calc(2.5% ${calcSuffix})`,
      left: `calc(29% ${calcSuffix})`,
    },
    30: {
      top: `calc(5% ${calcSuffix})`,
      left: `calc(36.5% ${calcSuffix})`,
    },
    29: {
      top: `calc(7.5% ${calcSuffix})`,
      left: `calc(43% ${calcSuffix})`,
    },
    28: {
      top: `calc(10.5% ${calcSuffix})`,
      left: `calc(42.8% ${calcSuffix})`,
    },
    27: {
      top: `calc(13% ${calcSuffix})`,
      left: `calc(45% ${calcSuffix})`,
    },
    26: {
      top: `calc(15.5% ${calcSuffix})`,
      left: `calc(50% ${calcSuffix})`,
    },
    25: {
      top: `calc(19% ${calcSuffix})`,
      left: `calc(53% ${calcSuffix})`,
    },
    24: {
      top: `calc(22% ${calcSuffix})`,
      left: `calc(57.8% ${calcSuffix})`,
    },
    23: {
      top: `calc(25% ${calcSuffix})`,
      left: `calc(64.5% ${calcSuffix})`,
    },
    22: {
      top: `calc(27.8% ${calcSuffix})`,
      left: `calc(69.5% ${calcSuffix})`,
    },
    21: {
      top: `calc(34% ${calcSuffix})`,
      left: `calc(67.5% ${calcSuffix})`,
    },
    20: {
      top: `calc(37% ${calcSuffix})`,
      left: `calc(66.5% ${calcSuffix})`,
    },
    19: {
      top: `calc(39.9% ${calcSuffix})`,
      left: `calc(66.3% ${calcSuffix})`,
    },
    18: {
      top: `calc(43% ${calcSuffix})`,
      left: `calc(66.2% ${calcSuffix})`,
    },
    17: {
      top: `calc(46% ${calcSuffix})`,
      left: `calc(65.2% ${calcSuffix})`,
    },
    16: {
      top: `calc(49.25% ${calcSuffix})`,
      left: `calc(65.2% ${calcSuffix})`,
    },
    15: {
      top: `calc(53% ${calcSuffix})`,
      left: `calc(65.3% ${calcSuffix})`,
    },
    14: {
      top: `calc(56% ${calcSuffix})`,
      left: `calc(67.25% ${calcSuffix})`,
    },
    13: {
      top: `calc(59% ${calcSuffix})`,
      left: `calc(71.5% ${calcSuffix})`,
    },
    12: {
      top: `calc(62% ${calcSuffix})`,
      left: `calc(75.45% ${calcSuffix})`,
    },
    11: {
      top: `calc(65.5% ${calcSuffix})`,
      left: `calc(75.5% ${calcSuffix})`,
    },
    10: {
      top: `calc(68.7% ${calcSuffix})`,
      left: `calc(75.5% ${calcSuffix})`,
    },
    9: {
      top: `calc(71.2% ${calcSuffix})`,
      left: `calc(70.9% ${calcSuffix})`,
    },
    8: {
      top: `calc(73% ${calcSuffix})`,
      left: `calc(62.8% ${calcSuffix})`,
    },
    7: {
      top: `calc(75% ${calcSuffix})`,
      left: `calc(53.5% ${calcSuffix})`,
    },
    6: {
      top: `calc(77.5% ${calcSuffix})`,
      left: `calc(48.5% ${calcSuffix})`,
    },
    5: {
      top: `calc(80.5% ${calcSuffix})`,
      left: `calc(45.5% ${calcSuffix})`,
    },
    4: {
      top: `calc(83.5% ${calcSuffix})`,
      left: `calc(45.5% ${calcSuffix})`,
    },
    3: {
      top: `calc(86.3% ${calcSuffix})`,
      left: `calc(45.5% ${calcSuffix})`,
    },
    2: {
      top: `calc(89%  ${calcSuffix})`,
      left: `calc(45.5% ${calcSuffix})`,
    },
    1: {
      top: `calc(92% ${calcSuffix})`,
      left: `calc(45.5% ${calcSuffix})`,
    },
  };
  switch (screen) {
    case "xs":
      return { ...defaultPosition, ...xsPosition };
    default:
      return defaultPosition;
  }
};

const getTop =
  (calcSuffix, screen = "default") =>
  ({ displayDay }) => {
    const position = giftPosition(calcSuffix, screen);
    if (position[displayDay]) {
      return position[displayDay].top;
    }
    return 0;
  };
const getLeft =
  (calcSuffix, screen = "default") =>
  ({ displayDay }) => {
    const position = giftPosition(calcSuffix, screen);
    if (position[displayDay]) {
      return position[displayDay].left;
    }
    return `calc(50% - ${(displayDay % 10) * 5}%)`;
  };

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#FFF",
    textShadow: "1px 1px 1px #000",
    fontFamily: "BrandonBold",
    fontWeight: 900,
    cursor: "pointer",
    transform: "translate(-50%, -50%)",
    width: 65,
    height: 65,
    top: getTop("- 25px"),
    left: getLeft("- 5px"),
    [theme.breakpoints.up("xs")]: {
      width: 27,
      height: 27,
      fontSize: 12,
      top: getTop("- 0px", "xs"),
      left: getLeft("- 0px", "xs"),
    },
    [theme.breakpoints.up("sm")]: {
      fontSize: 8,
      width: 17,
      height: 17,
      top: getTop("- 0px"),
      left: getLeft("- 2px"),
    },
    [theme.breakpoints.up("md")]: {
      fontSize: 12,
      width: 24,
      height: 24,
      top: getTop("- 8px"),
      left: getLeft("- 8px"),
    },
    [theme.breakpoints.up("lg")]: {
      fontSize: 14,
      width: 32,
      height: 32,
      top: getTop("- 10px"),
      left: getLeft("- 8px"),
    },
    [theme.breakpoints.up("xl")]: {
      fontSize: 24,
      width: 50,
      height: 50,
      top: getTop("- 20px"),
      left: getLeft("- 15px"),
    },
  },
  active: {
    backgroundImage: ({ bgActive }) => `url(${bgActive})`,
    zIndex: 99,
  },
  past: {
    backgroundImage: ({ bgPast }) => `url(${bgPast})`,
  },
  future: {
    backgroundImage: ({ bgFuture }) => `url(${bgFuture})`,
  },
}));

const Day = ({
  id,
  displayDay,
  dateFrom,
  dateTo,
  enabled,
  activeOnClick,
  pastOnClick,
  futureOnClick,
  serverTime,
}) => {
  const { viewName } = useParams();
  const {
    activeEvent: bgActive,
    futureEvent: bgFuture,
    pastEvent: bgPast,
  } = useMonthlyPromotionImages(viewName);
  const classes = useStyles({
    displayDay,
    bgActive,
    bgFuture,
    bgPast,
  });
  const props = useMemo(() => {
    if (!enabled) {
      return {
        disabled: true,
      };
    }
    const now = new Date(serverTime);
    const from = new Date(dateFrom);
    const to = new Date(dateTo);

    if (isBefore(to, now)) {
      return {
        className: `${classes.root} ${classes.past}`,
        onClick: () => pastOnClick(id),
      };
    }
    if (isAfter(from, now)) {
      return {
        className: `${classes.root} ${classes.future}`,
        onClick: () => futureOnClick(id),
      };
    }
    return {
      className: `${classes.root} ${classes.active}`,
      onClick: () => activeOnClick(id),
      disabled: false,
    };
  }, [
    enabled,
    serverTime,
    dateFrom,
    dateTo,
    pastOnClick,
    id,
    futureOnClick,
    activeOnClick,
    classes,
  ]);
  return (
    <Box color="primary" aria-label="add" {...props}>
      {displayDay}
    </Box>
  );
};

export default Day;
