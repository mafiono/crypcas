import React from "react";
import intl from "react-intl-universal";

import { Typography } from "@material-ui/core";
import useStyles from "./useStyles";
import DialogWrapper from "./DialogWrapper";

const FutureEvent = ({ onClose }) => {
  const classes = useStyles();

  const titleIntl = intl
    .get("monthlyPromotion.futureEvent.Title")
    .defaultMessage("This Promotion isn’t available yet");
  const descIntl = intl
    .get("monthlyPromotion.futureEvent.Desc")
    .defaultMessage("Have you checked today’s promotion?");

  return (
    <DialogWrapper onClose={onClose}>
      <Typography className={classes.title}>{titleIntl}</Typography>
      <Typography className={classes.text}>{descIntl}</Typography>
    </DialogWrapper>
  );
};

export default FutureEvent;
