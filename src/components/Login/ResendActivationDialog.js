import React, { useCallback, useRef, useState } from "react";
import { Formik } from "formik";
import ReCAPTCHA from "react-google-recaptcha";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  LinearProgress,
  TextField,
  Typography,
} from "@material-ui/core";

import { resendActivation } from "../../helpers/request";
import useInitialValues from "./useInitalValues";
import useValidation from "./useValidation";
import intl from "react-intl-universal";

const ResendActivationDialog = ({ onClose, recaptchaId, loginName }) => {
  const title = intl
    .get("login.resendActivationDialog.title")
    .defaultMessage("Your account is not activated");
  const description = intl
    .get("login.resendActivationDialog.description")
    .defaultMessage("Do you need activation email?");
  const actionResendActivation = intl
    .get("login.resendActivationDialog.actionResendActivation")
    .defaultMessage("Resend activation code");

  const actionCancel = intl
    .get("generic.dialog.action.cancel")
    .defaultMessage("Cancel");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const recaptchaRef = useRef(null);
  const handleOnClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const initValues = useInitialValues({
    recaptchaId,
    defaultValues: { loginName },
  });

  const validationSchema = useValidation({ recaptchaId });

  const handleOnsubmit = useCallback(
    async (values, { restForm, validateForm }) => {
      setLoading(true);
      setError("");
      setSuccess("");
      try {
        const res = await resendActivation({
          loginName: values.loginName,
          recaptchaResponse: values.gRecaptchaResponse,
        });
        setSuccess(res.message);
      } catch (e) {
        setError(e.errorMessage);
      } finally {
        setLoading(false);
        recaptchaRef.current.reset();
        restForm(initValues);
        validateForm();
      }
    },
    [setLoading, setError, setSuccess, recaptchaRef, initValues]
  );

  return (
    <Dialog open={true} onClose={handleOnClose}>
      <DialogTitle>{title}</DialogTitle>
      <Formik
        initialValues={initValues}
        onSubmit={handleOnsubmit}
        validationSchema={validationSchema}
        validateOnMount={true}
      >
        {({
          handleSubmit,
          values,
          handleChange,
          touched,
          errors,
          isValid,
          setFieldValue,
        }) => (
          <>
            <DialogContent>
              <DialogContentText>{description}</DialogContentText>
              <FormControl fullWidth>
                <TextField
                  required={true}
                  id="reactivate"
                  name="loginName"
                  label="Login"
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
              {loading && <LinearProgress />}
              {success && (
                <Typography variant="h6" align="center">
                  {success}
                </Typography>
              )}
              {error && (
                <Typography align="center" color="error" noWrap={false}>
                  {error}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleOnClose}>{actionCancel}</Button>
              <Button
                disabled={!isValid || !!success}
                color="primary"
                variant="contained"
                onClick={handleSubmit}
              >
                {actionResendActivation}
              </Button>
            </DialogActions>
          </>
        )}
      </Formik>
    </Dialog>
  );
};

export default ResendActivationDialog;
