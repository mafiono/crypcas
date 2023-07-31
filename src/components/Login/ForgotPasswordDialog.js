import React, { useCallback, useRef, useState } from "react";
import { Box, makeStyles, TextField, Typography } from "@material-ui/core";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  LinearProgress,
  Link as MatLink,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import intl from "react-intl-universal";

import ReCAPTCHA from "react-google-recaptcha";

import { restorePassword } from "../../helpers/request";

import useInitialValues from "./useInitalValues";
import useValidation from "./useValidation";

const useStyles = makeStyles({
  noUnderline: {
    textDecoration: "none",
  },
  clickable: {
    cursor: "pointer",
  },
});

const ForgotPasswordDialog = ({ recaptchaId, loginName }) => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [recoveryRequest, setRecoveryRequest] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [forgotPasswordFailure, setForgotPasswordFailure] = useState(false);
  const classes = useStyles();

  const title = intl
    .get("login.forgotDialog.title")
    .defaultMessage("Forgot Password");
  const description = intl
    .get("login.forgotDialog.description")
    .defaultMessage("Provide your login name to request a password reset.");
  const descriptionSent = intl
    .get("login.forgotDialog.recoverySent")
    .defaultMessage("Password recovery email sent.");
  const descriptionFail = intl
    .get("login.forgotDialog.recoveryError")
    .defaultMessage("User not found, please contact support.");
  const actionRecover = intl
    .get("login.forgotDialog.action.recover")
    .defaultMessage("Recover");
  const actionSupport = intl
    .get("login.forgotDialog.action.support")
    .defaultMessage("Support");
  const actionCancel = intl
    .get("generic.dialog.action.cancel")
    .defaultMessage("Cancel");
  const actionOkay = intl.get("generic.dialog.action.ok").defaultMessage("Ok");
  const actionForgotPassword = intl
    .get("login.action.forgot")
    .defaultMessage("Forgot your Password?");

  const inputLogin = intl.get("login.input.login").defaultMessage("Login Name");

  const initValues = useInitialValues({
    recaptchaId,
    defaultValues: { loginName },
  });

  const validationSchema = useValidation({ recaptchaId });

  const recaptchaRef = useRef(null);

  const handleOnSubmit = useCallback(
    async (values, { resetForm, validateForm }) => {
      setRecoveryRequest(true);
      try {
        await restorePassword({
          loginName: values.loginName,
          recaptchaResponse: values.gRecaptchaResponse,
        });
        setForgotPasswordSuccess(true);
      } catch (e) {
        setForgotPasswordFailure(true);
      } finally {
        setRecoveryRequest(false);
        recaptchaRef.current.reset();
        resetForm();
        validateForm();
      }
    },
    [
      setRecoveryRequest,
      setForgotPasswordFailure,
      setForgotPasswordSuccess,
      recaptchaRef,
    ]
  );
  const handleToggleDialog = useCallback(() => {
    setIsOpenDialog((prev) => !prev);
    if (!isOpenDialog) {
      setForgotPasswordFailure(false);
      setForgotPasswordSuccess(false);
    }
  }, [
    setIsOpenDialog,
    isOpenDialog,
    setForgotPasswordFailure,
    setForgotPasswordSuccess,
  ]);

  return (
    <>
      <MatLink onClick={handleToggleDialog}>
        <Typography variant="subtitle1" className={classes.clickable}>
          {actionForgotPassword}
        </Typography>
      </MatLink>
      <Dialog open={isOpenDialog} onClose={handleToggleDialog}>
        <DialogTitle>{title}</DialogTitle>
        {forgotPasswordSuccess && (
          <>
            <DialogContent>
              <DialogContentText>{descriptionSent}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                color="primary"
                variant="contained"
                onClick={handleToggleDialog}
              >
                {actionOkay}
              </Button>
            </DialogActions>
          </>
        )}
        {forgotPasswordFailure && (
          <>
            <DialogContent>
              <DialogContentText>{descriptionFail}</DialogContentText>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleToggleDialog}>{actionCancel}</Button>
              <Link to="/support" className={classes.noUnderline}>
                <Button color="primary" variant="contained">
                  {actionSupport}
                </Button>
              </Link>
            </DialogActions>
          </>
        )}

        {!forgotPasswordFailure && !forgotPasswordSuccess && (
          <Formik
            initialValues={initValues}
            validationSchema={validationSchema}
            onSubmit={handleOnSubmit}
            validateOnMount={true}
          >
            {({
              values,
              touched,
              errors,
              handleChange,
              handleSubmit,
              setFieldValue,
              isValid,
            }) => (
              <>
                <DialogContent>
                  <DialogContentText>{description}</DialogContentText>
                  <FormControl fullWidth>
                    <TextField
                      required={true}
                      id="forgotLogin"
                      name="loginName"
                      label={inputLogin}
                      value={values.loginName}
                      onChange={handleChange}
                      error={touched.loginName && Boolean(errors.loginName)}
                      helperText={touched.loginName && errors.loginName}
                    />
                  </FormControl>
                  {recaptchaId && (
                    <Box marginY={2}>
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        theme="dark"
                        sitekey={recaptchaId}
                        onChange={(captcha) => {
                          setFieldValue("gRecaptchaResponse", captcha, true);
                        }}
                      />
                    </Box>
                  )}
                  {recoveryRequest && <LinearProgress />}
                </DialogContent>

                <DialogActions>
                  <Button onClick={handleToggleDialog}>{actionCancel}</Button>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!isValid}
                  >
                    {actionRecover}
                  </Button>
                </DialogActions>
              </>
            )}
          </Formik>
        )}
      </Dialog>
    </>
  );
};

export default ForgotPasswordDialog;
