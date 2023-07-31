import React from "react";
import intl from "react-intl-universal";
import { connect } from "react-redux";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import { closeFirstTimeLoginDialog } from "../../../redux/slices/notifications";
import { useHistory } from "react-router-dom";

function FirstTimeLoginDialog(props) {
  const { closeDialog } = props;
  const history = useHistory();

  // Actions
  const handleClose = () => {
    closeDialog();
  };
  const handlePromotions = () => {
    history.push("/promotions");
    closeDialog();
  };

  // Get locale strings
  const title = intl.get("login.firstLogin.title").defaultMessage("Welcome");
  const content = intl
    .get("login.firstLogin.content")
    .defaultMessage(
      "Welcome to our casino. We have a Welcome Bonus for you if you like. To activate it head over to promotions and simply click the activate button on the Welcome Bonus. Next go to any of the slots that are part of the promotion and your balance will show up in your account. Enjoy and let us know if you require any additional by contacting support."
    );
  const actionPromotions = intl
    .get("login.firstLogin.action.promotions")
    .defaultMessage("Promotions");
  const actionDialogClose = intl
    .get("generic.dialog.action.close")
    .defaultMessage("Close");

  // Dialog displayed on the first login of the account
  return (
    <Dialog aria-labelledby="firstTimeLoginDialogTitle" open={true}>
      <DialogTitle id="firstTimeLoginDialogTitle">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClose}>
          {actionDialogClose}
        </Button>
        <Button color="primary" variant="contained" onClick={handlePromotions}>
          {actionPromotions}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const mapDispatchToProps = (dispatch) => ({
  closeDialog: () => dispatch(closeFirstTimeLoginDialog()),
});
export default connect(null, mapDispatchToProps)(FirstTimeLoginDialog);
