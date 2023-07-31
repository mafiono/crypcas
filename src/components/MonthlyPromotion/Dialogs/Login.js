import React, { useCallback } from "react";
import intl from "react-intl-universal";
import { useHistory, useLocation } from "react-router-dom";
import { Typography, Button, Box } from "@material-ui/core";

import { setLoginRedirect } from "../../../helpers/request";

import useStyles from "./useStyles";
import DialogWrapper from "./DialogWrapper";

const Login = ({ onClose }) => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const handleOnLoginClick = useCallback(() => {
    setLoginRedirect(location.pathname);
    history.push("/login");
  }, [location.pathname, history]);

  const titleIntl = intl
    .get("monthlyPromotion.login.Title")
    .defaultMessage("Do you have an account?");
  const descIntl = intl
    .get("monthlyPromotion.login.Desc")
    .defaultMessage("To see this promotion please log into your account");
  const loginIntl = intl.get("login.action.login").defaultMessage("Login");

  return (
    <DialogWrapper onClose={onClose}>
      <Box my={3}>
        <Typography className={classes.title}>{titleIntl}</Typography>
        <Typography className={classes.text}>{descIntl}</Typography>
      </Box>

      <Button
        onClick={handleOnLoginClick}
        variant="contained"
        color="primary"
        className={classes.loginBtn}
      >
        {loginIntl}
      </Button>
    </DialogWrapper>
  );
};

export default Login;
