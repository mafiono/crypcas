import React from "react";
import intl from "react-intl-universal";
import { Typography } from "@material-ui/core";

import useStyles from "./useStyles";
import DialogWrapper from "./DialogWrapper";

const PastEvents = ({ onClose }) => {
  const classes = useStyles();

  const titleIntl = intl
    .get("monthlyPromotion.pastEvent.Title")
    .defaultMessage("This Promotion has ended");
  const descIntl = intl
    .get("monthlyPromotion.pastEvent.Desc")
    .defaultMessage("You can claim an awesome one for today");

  return (
    <DialogWrapper onClose={onClose}>
      <Typography className={classes.title}>{titleIntl}</Typography>
      <Typography className={classes.text}>{descIntl}</Typography>
    </DialogWrapper>
  );
};

export default PastEvents;
