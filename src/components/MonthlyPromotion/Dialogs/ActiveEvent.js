import React, { useState, useCallback } from "react";
import intl from "react-intl-universal";
import { Link as RRLink } from "react-router-dom";

import { Typography, Button, Link, Box } from "@material-ui/core";
import DialogWrapper from "./DialogWrapper";

import useStyles, { useDialogStyles } from "./useStyles";
import useActivatePromotion from "../useActivatePromotion";

const ActiveEvents = ({
  onClose,
  title,
  descriptionText,
  termsAndConditions,
  linkCallForAction1,
  callForAction2,
  linkCallForAction2,
}) => {
  const classes = useStyles();
  const dialogClasses = useDialogStyles();

  const [isOpenTC, setIsOpenTC] = useState(false);
  const { loading, error, data, activateRequest } =
    useActivatePromotion(linkCallForAction1);

  const claimIntl = intl
    .get("monthlyPromotion.activeEvent.Claim")
    .defaultMessage("CLAIM");
  const backIntl = intl
    .get("monthlyPromotion.activeEvent.Back")
    .defaultMessage("Back");
  const activatingIntl = intl
    .get("monthlyPromotion.activeEvent.Activating")
    .defaultMessage("Activating");
  const detailsIntl = intl
    .get("monthlyPromotion.activeEvent.details")
    .defaultMessage("Details");

  const handleOnClickClaim = useCallback(() => {
    activateRequest();
  }, [activateRequest]);

  return (
    <DialogWrapper onClose={onClose} classes={dialogClasses}>
      {!isOpenTC && !data && (
        <>
          <Box mt={8} mb={3}>
            <Typography className={classes.title}>{title}</Typography>
          </Box>
          <Box
            className={classes.innerPtext}
            dangerouslySetInnerHTML={{ __html: descriptionText }}
          />
          <Box my={5} display="flex" alignItems="flex-end">
            <Box flex="1" display="flex" justifyContent="center">
              <Button
                disabled={loading}
                variant="contained"
                size="large"
                className={classes.buttonClaim}
                onClick={handleOnClickClaim}
              >
                {claimIntl}
              </Button>
            </Box>
            <Box flex="0">
              <Link
                className={classes.tcLink}
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpenTC(true);
                }}
              >
                {detailsIntl}
              </Link>
            </Box>
          </Box>
        </>
      )}
      {isOpenTC && !data && (
        <Box
          mt={7}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Box
            dangerouslySetInnerHTML={{ __html: termsAndConditions }}
            className={classes.innerPtext}
          />
          <Box mt={4} mb={2} display="flex" justifyContent="center">
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setIsOpenTC(false)}
            >
              {backIntl}
            </Button>
          </Box>
        </Box>
      )}
      {data && (
        <Box
          mt={7}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItem="center"
        >
          <Box mt={2} mb={1}>
            <Typography className={classes.title}>
              Activation is successful
            </Typography>
          </Box>
          <Box mt={2} mb={2} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              component={RRLink}
              to={linkCallForAction2}
            >
              {callForAction2}
            </Button>
          </Box>
        </Box>
      )}
      {loading && (
        <Typography className={classes.text}>{activatingIntl}</Typography>
      )}
      {error && <Typography className={classes.text}>{error}</Typography>}
    </DialogWrapper>
  );
};

export default ActiveEvents;
