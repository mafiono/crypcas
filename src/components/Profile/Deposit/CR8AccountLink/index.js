import React, { useState } from "react";
import intl from "react-intl-universal";
import { connect } from "react-redux";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  FormControl,
  FormHelperText,
  InputLabel,
  Input,
  InputAdornment,
  DialogActions,
  IconButton,
} from "@material-ui/core";
import { Edit as EditIcon } from "@material-ui/icons";
import { getUser } from "../../../../redux/selectors";
import { setCR8ActId } from "../../../../redux/slices/user";
import { linkCR8Account } from "../../../../helpers/request";

function CR8AccountLink(props) {
  const { user, setCR8ActId } = props;
  const { cr8_account_id } = user;
  // The dialogs open state
  const [dialogOpen, setDialogOpen] = useState(false);
  // User's input of their 'accountId'
  const [accountId, setAccountId] = useState("");
  // If the call is being processed
  const [processing, setProcessing] = useState(false);
  // If an error occured while linking
  const [error, setError] = useState(false);

  // Handles the user action to link the account
  const handleLink = () => {
    // Processing Start
    setProcessing(true);
    linkCR8Account(accountId)
      .then(() => {
        // Linked successfully
        setCR8ActId(accountId);
        setDialogOpen(false);
      })
      .catch(() => {
        // Error linking
        setError(true);
      })
      .finally(() => {
        // Processing Complete
        setProcessing(false);
      });
  };

  // Locale Strings
  const actionLink = intl
    .get("cr8.action.linkAccount")
    .defaultMessage("Link CR8 Account");

  const title = intl
    .get("cr8.linkDialog.title")
    .defaultMessage("Link your CR8 Account");
  const description = intl
    .get("cr8.linkDialog.description")
    .defaultMessage(
      'In order to connect your Account with your CR8 wallet, please put in your CR8 account ID and click "Link CR8 account"'
    );
  const linkError = intl.get("cr8.error.link").defaultMessage("Unable to link");

  const inputAccountId = intl
    .get("cr8.input.accountId")
    .defaultMessage("CR8 Account Id");

  const actionCancel = intl
    .get("generic.dialog.action.cancel")
    .defaultMessage("Cancel");

  const dialogContents = (
    <>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
        <FormControl fullWidth error={error}>
          <InputLabel htmlFor="linkAccount" color="primary">
            {inputAccountId} *
          </InputLabel>
          <Input
            id="linkAccount"
            value={accountId}
            onChange={(event) => {
              setAccountId(event.target.value);
              setError(false);
            }}
          />
          <FormHelperText>{error ? linkError : ""}</FormHelperText>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDialogOpen(false)}>{actionCancel}</Button>
        <Button
          color="primary"
          variant="contained"
          onClick={handleLink}
          disabled={processing}
        >
          {actionLink}
        </Button>
      </DialogActions>
    </>
  );

  const field = cr8_account_id ? (
    <FormControl fullWidth>
      <InputLabel htmlFor="cr8AcctId" color="primary">
        {inputAccountId}
      </InputLabel>
      <Input
        id="cr8AcctId"
        name="phone"
        value={cr8_account_id}
        endAdornment={
          <InputAdornment position="end">
            <IconButton color="primary" onClick={() => setDialogOpen(true)}>
              <EditIcon />
            </IconButton>
          </InputAdornment>
        }
        readOnly
      />
    </FormControl>
  ) : (
    <Button
      color="primary"
      variant="contained"
      onClick={() => setDialogOpen(true)}
    >
      {actionLink}
    </Button>
  );
  return (
    <>
      {field}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{title}</DialogTitle>
        {dialogContents}
      </Dialog>
    </>
  );
}

const mapStateToProps = (state) => ({
  user: getUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  setCR8ActId: (id) => dispatch(setCR8ActId(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CR8AccountLink);
