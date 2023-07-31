import React, { useState, useCallback } from "react";

import {
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  makeStyles,
  LinearProgress,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import { cancelPromotion } from "../../../helpers/request";
import intl from "react-intl-universal";

const useStyles = makeStyles({
  cancelBtn: {
    position: "absolute",
    top: "10%",
    right: 0,
    fontSize: "0.6rem",
  },
  closeBtn: {
    position: "absolute",
    top: "1%",
    right: "1%",
    cursor: "pointer",
  },
});

const CancelPromotion = ({ fetchPromoHistory, codeName }) => {
  const cancelPromotionTitleIntl = intl
    .get("profile.deposit.CancelPromotion.Title")
    .defaultMessage("Cancel Promotion");

  const cancelPromotionTextIntl = intl
    .get("profile.deposit.CancelPromotion.Text", { 0: codeName })
    .defaultMessage(
      `This will cancel the promotion "${codeName}" and it is not reversible`
    );

  const cancelPromotionErrorIntl = intl
    .get("profile.deposit.CancelPromotion.Error")
    .defaultMessage("Sorry, at the moment we can not cancel promotion");

  const dialogActionOkIntl = intl
    .get("generic.dialog.action.ok")
    .defaultMessage("Ok");

  const cancelBtnIntl = intl
    .get("generic.dialog.action.cancel")
    .defaultMessage("Cancel");

  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [cancelingError, setCancelingError] = useState("");

  const handleCloseDialog = useCallback(() => {
    setCancelingError("");
    setIsOpen(false);
  }, [setCancelingError, setIsOpen]);

  const handleCancelPromotion = useCallback(() => {
    setCanceling(true);
    cancelPromotion(codeName)
      .then(() => {
        fetchPromoHistory(1);
        setCancelingError("");
        setIsOpen(false);
      })
      .catch(() => {
        setCancelingError(cancelPromotionErrorIntl);
      })
      .finally(() => {
        setCanceling(false);
      });
  }, [
    setCanceling,
    setCancelingError,
    setIsOpen,
    fetchPromoHistory,
    codeName,
    cancelPromotionErrorIntl,
  ]);

  return (
    <>
      <Button
        size="small"
        color="secondary"
        variant="outlined"
        className={classes.cancelBtn}
        onClick={() => setIsOpen(true)}
        title={cancelPromotionTitleIntl}
      >
        {cancelBtnIntl}
      </Button>
      {isOpen && (
        <Dialog
          aria-labelledby="cancelPromotionDialog"
          open={true}
          onClose={handleCloseDialog}
          onBackdropClick={handleCloseDialog}
        >
          {canceling && <LinearProgress color="primary" />}
          <DialogTitle disableTypography>
            <IconButton
              color="secondary"
              onClick={handleCloseDialog}
              className={classes.closeBtn}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
            <Typography variant="h6" align="center">
              {cancelPromotionTitleIntl}
            </Typography>
          </DialogTitle>
          <DialogContent>
            {!cancelingError && (
              <Typography>{cancelPromotionTextIntl}</Typography>
            )}
            {cancelingError && <Typography>{cancelingError}</Typography>}
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCancelPromotion}
              disabled={canceling}
            >
              {dialogActionOkIntl}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default CancelPromotion;
