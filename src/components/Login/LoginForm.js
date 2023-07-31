import React, { useCallback, useMemo, useState, useRef } from "react";
import { Formik } from "formik";
import { Checkbox, makeStyles, TextField } from "@material-ui/core";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  Typography,
} from "@material-ui/core";
import intl from "react-intl-universal";
import ForgotPasswordDialog from "./ForgotPasswordDialog";
import ReCAPTCHA from "react-google-recaptcha";
import * as yup from "yup";

import { setKeepMeSignedIn } from "../../helpers/request";

const useStyles = makeStyles((theme) => ({
  fullWidth: {
    width: "100%",
  },
  gridItem: {
    display: "flex",
  },
  flexCenter: {
    display: "flex",
    alignItems: "center",
  },
  alignRight: {
    textAlign: "right",
  },
}));

const initialValues = {
  login: "",
  password: "",
  recaptchaResponse: "",
  promo: "",
};

const LoginForm = ({ processing, makeDoLogin, recaptchaId, user }) => {
  const classes = useStyles();
  const loginTitle = intl.get("login.title").defaultMessage("Login");
  const loginDesc = intl
    .get("login.description")
    .defaultMessage(
      "Please enter your login name and password to access your account:"
    );

  const inputLogin = intl.get("login.input.login").defaultMessage("Login Name");
  const inputPassword = intl
    .get("login.login.password")
    .defaultMessage("Password");
  const inputPromo = intl.get("login.input.promo").defaultMessage("Promo Code");

  const optionKeepSignedIn = intl
    .get("login.option.keepSignedIn")
    .defaultMessage("Keep me signed in");
  const actionLogin = intl.get("login.action.login").defaultMessage("Login");

  const [keepSignedIn, setKeepSignedIn] = useState(false);

  const recaptchaRef = useRef(null);

  const handleKeepSignedInChange = useCallback(() => {
    setKeepSignedIn((prev) => {
      setKeepMeSignedIn(!prev);
      return !prev;
    });
  }, [setKeepSignedIn]);

  const validation = useMemo(
    () =>
      recaptchaId
        ? yup.object({
            login: yup.string("Enter your login").required("Login is required"),
            password: yup
              .string("Enter your password")
              .required("Password is required"),
            recaptchaResponse: yup
              .string("Confirm Recaptcha")
              .required("Confirm Recaptcha is required"),
            promo: yup.string("Enter Promo code"),
          })
        : yup.object({
            login: yup.string("Enter your login").required("Login is required"),
            password: yup
              .string("Enter your password")
              .required("Password is required"),
            promo: yup.string("Enter Promo code"),
          }),
    [recaptchaId]
  );

  const handleOnSubmit = useCallback(
    (values, { resetForm, validateForm }) => {
      makeDoLogin(values);
      recaptchaRef.current.reset();
      resetForm();
      validateForm();
    },
    [makeDoLogin, recaptchaRef]
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleOnSubmit}
      validationSchema={validation}
      validateOnMount={true}
    >
      {({
        handleSubmit,
        values,
        handleChange,
        touched,
        errors,
        setFieldValue,
        isValid,
      }) => (
        <form onSubmit={handleSubmit} className={classes.fullWidth}>
          <Grid
            container
            spacing={1}
            direction="column"
            justify="center"
            alignItems="stretch"
          >
            <Grid item xs>
              <Typography variant="h5">{loginTitle}</Typography>
            </Grid>
            <Grid item xs>
              <Typography variant="subtitle1">{loginDesc}</Typography>
            </Grid>
            <Grid item xs>
              <FormControl fullWidth>
                <TextField
                  required={true}
                  id="loginName"
                  name="login"
                  label={inputLogin}
                  value={values.login}
                  onChange={handleChange}
                  error={touched.login && Boolean(errors.login)}
                  helperText={touched.login && errors.login}
                />
              </FormControl>
            </Grid>
            <Grid item xs>
              <FormControl fullWidth>
                <TextField
                  required={true}
                  type="password"
                  id="loginPassword"
                  name="password"
                  label={inputPassword}
                  value={values.password}
                  onChange={handleChange}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
              </FormControl>
            </Grid>
            <Grid item xs>
              <FormControl fullWidth>
                <TextField
                  type="promo"
                  id="promoCode"
                  name="promo"
                  label={inputPromo}
                  value={values.promo}
                  onChange={handleChange}
                  error={touched.promo && Boolean(errors.promo)}
                  helperText={touched.promo && errors.promo}
                />
              </FormControl>
            </Grid>
            <Grid item xs>
              <Grid
                container
                spacing={0}
                direction="row"
                justify="center"
                alignItems="center"
              >
                <Grid item xs className={classes.gridItem}>
                  <div className={classes.flexCenter}>
                    <Checkbox
                      id="loginKeepSignedIn"
                      color="primary"
                      onChange={handleKeepSignedInChange}
                      checked={keepSignedIn}
                    />
                    <InputLabel htmlFor="loginKeepSignedIn" color="primary">
                      {optionKeepSignedIn}
                    </InputLabel>
                  </div>
                </Grid>
                <Grid item xs className={classes.alignRight}>
                  <ForgotPasswordDialog
                    loginName={values.login}
                    recaptchaId={recaptchaId}
                  />
                </Grid>
              </Grid>
            </Grid>
            {recaptchaId && (
              <Grid item xs>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  theme="dark"
                  sitekey={recaptchaId}
                  onChange={(captcha) => {
                    setFieldValue("recaptchaResponse", captcha, true);
                  }}
                />
              </Grid>
            )}
            <Grid item xs>
              <Button
                type="submit"
                disabled={processing || user.signedIn || !isValid}
                variant="contained"
                color={"primary"}
              >
                {actionLogin}
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default LoginForm;
