import React, { PureComponent } from "react";
import intl from "react-intl-universal";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import { withRouter } from "react-router-dom";
import { SizeMe } from "react-sizeme";
import memoizeOne from "memoize-one";
import {
  Container,
  Grid,
  FormControl,
  InputLabel,
  Input,
  Button,
  Typography,
  Checkbox,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputAdornment,
  Hidden,
  Box,
} from "@material-ui/core";
import sanitize from "dompurify";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { backgroundGhostLogo, adPlaceholderImage } from "../../helpers/images";
import { themeInLightMode } from "../../helpers/theme";
import {
  getPromoItems,
  register as requestRegister,
} from "../../helpers/request";
import { validateElement } from "../../helpers/validation";
// import InputField from '../reusable/InputField';
import { siteProcess, openSnackbar } from "../../redux/slices/notifications";
import {
  getCurrencies,
  getCountries,
  getRegisterFormType,
  getStaticPageMap,
  getRecaptchaId,
  getLanguages,
  getLanguage,
} from "../../redux/selectors";

@withRouter
@connect(
  (state) => ({
    formType: getRegisterFormType(state),
    currencies: getCurrencies(state),
    countries: getCountries(state),
    recaptchaId: getRecaptchaId(state),
    pages: getStaticPageMap(state),
    language: getLanguages(state),
    defaultLanguage: getLanguage(state),
  }),
  { siteProcess, openSnackbar }
)
@withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    minHeight: `calc(100vh - ${theme.custom.size.headerHeight} - ${theme.custom.size.footerHeight})`,
    position: "relative",
    display: "flex",
    maxWidth: "unset",
    padding: theme.spacing(2, 10),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(2, 5),
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2, 1),
    },
  },
  image: {
    position: "absolute",
    background: `url('${backgroundGhostLogo}')`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.07,
  },
  promotionItemContainer: {
    display: "inline-block",
    position: "relative",
  },
  promoDetailsBtn: {
    position: "absolute",
    left: "5px",
    right: "5px",
    bottom: "5px",
  },
  promotionItem: {
    position: "absolute",
    top: "10px",
    left: "10px",
    right: "10px",
    bottom: "10px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: "10px",
    cursor: "pointer",
    "&:hover": {
      filter: "brightness(1.25)",
    },
  },
  advert: {
    flexGrow: 1,
    border: "1px solid #979797",
    background: "black",
    backgroundSize: "auto",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "192px",
    zIndex: 1,
    padding: theme.spacing(12),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(6),
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(3),
    },
  },
  register: {
    flexGrow: 1,
    border: "3px solid #EBAB50",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    padding: theme.spacing(4),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(4),
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
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
  row: {
    flexDirection: "row",
  },
  dialogText: {
    color: theme.palette.text.primary,
  },
}))
class Register extends PureComponent {
  state = {
    promoItems: [],
    dialog: false,
    dialogTitle: "",
    dialogContent: "",
    selectedPromo: null,
    registrationComplete: false,
    validated: false,
    processing: false,
    consent: "",
    tacOpen: false,
    recaptchaResponse: "",
    cscAccountId: "",
    // rudimentary method of determining at least 18 years
    // miliseconds in second * seconds in minute * minutes in hour * hours in day * days in year * age (18)
    maxBirthDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 18),
    // Fields
    login: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    stateProvince: "",
    streetAddress: "",
    city: "",
    zipPostal: "",
    phoneNumber: "",
    dateOfBirth: null,
    currency: "",
    lang: "",
    // Error Flags
    loginError: false,
    emailError: false,
    passwordError: false,
    confirmPasswordError: false,
    firstNameError: false,
    lastNameError: false,
    countryError: false,
    stateProvinceError: false,
    streetAddressError: false,
    cityError: false,
    zipPostalError: false,
    phoneNumberError: false,
    dateOfBirthError: false,
    currencyError: false,
    langError: false,
    // Helper Texts
    loginHelperText: "",
    emailHelperText: "",
    passwordHelperText: "",
    confirmPasswordHelperText: "",
    firstNameHelperText: "",
    lastNameHelperText: "",
    countryHelperText: "",
    stateProvinceHelperText: "",
    streetAddressHelperText: "",
    cityHelperText: "",
    zipPostalHelperText: "",
    phoneNumberHelperText: "",
    dateOfBirthHelperText: "",
    currencyHelperText: "",
    langHelperText: "",
    disabledFields: [],
  };

  resize = null;

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  componentDidMount() {
    // Get promo items
    getPromoItems()
      .then((res) => {
        const { promoItems } = res;
        // Filter promotions with titles starting with double-underscores
        this.setState({
          promoItems: promoItems.filter((promo) =>
            promo?.linkCallForAction2?.startsWith("/registration")
          ),
        });
      })
      .catch((res) => {
        // TODO: failed to obtain promo items
      });
    // CR8 Read Params
    const email = window.getParameterByName("email");
    if (email) {
      this.setState((prevState) => ({
        email,
        disabledFields: [...prevState.disabledFields, ...["email"]],
      }));
    }
    const firstName = window.getParameterByName("firstname");
    if (firstName) {
      this.setState((prevState) => ({
        firstName,
        disabledFields: [...prevState.disabledFields, ...["firstName"]],
      }));
    }
    const lastName = window.getParameterByName("lastname");
    if (lastName) {
      this.setState((prevState) => ({
        lastName,
        disabledFields: [...prevState.disabledFields, ...["lastName"]],
      }));
    }
    const dateOfBirth = window.getParameterByName("dateofbirth");
    if (dateOfBirth) {
      this.setState((prevState) => ({
        dateOfBirth,
        disabledFields: [...prevState.disabledFields, ...["dateOfBirth"]],
      }));
    }
    const cscAccountId = window.getParameterByName("accountid");
    if (cscAccountId) {
      this.setState({ cscAccountId });
    }
    // Check the form type
    if (this.props.formType === "short") {
      // A short form does not prompt for your currency, so we make sure it is set
      this.setState({ currency: "uBTC" });
    }
    this.resize = this.makeResize();
    window.addEventListener("resize", this.resize);
    this.initRecaptcha();
  }

  /** Called when the orientation changes to re-initialize the google recaptcha */
  makeResize() {
    return () => {
      this.initRecaptcha();
    };
  }

  initRecaptcha() {
    const { recaptchaId } = this.props;
    // If there is a recaptcha Id
    if (recaptchaId) {
      setTimeout(() => {
        // Get the container
        const reContainer = document.querySelector("#grecaptchaVerification");
        // If the container exists and it wasn't already populated
        if (reContainer && !reContainer.hasChildNodes() && window.grecaptcha) {
          window.grecaptcha.render(reContainer, {
            sitekey: recaptchaId,
            callback: this.makeRecaptchaCallback(),
            theme: themeInLightMode() ? "light" : "dark",
          });
        }
      }, 500);
    }
  }

  validation = {
    login: {
      required: true,
      pattern: /^[a-zA-Z0-9_]+$/,
      min: 4,
      max: 20,
    },
    firstName: {
      required: true,
    },
    lastName: {
      required: true,
    },
    email: {
      required: true,
      pattern: /^.+@.+?\..+$/,
    },
    password: {
      required: true,
    },
    confirmPassword: {
      required: true,
      match: "password",
    },
    country: {
      required: true,
    },
    stateProvince: {
      required: true,
    },
    streetAddress: {
      required: true,
    },
    city: {
      required: true,
    },
    zipPostal: {
      required: true,
    },
    phoneNumber: {
      required: true,
      type: "phone",
    },
    dateOfBirth: {
      required: true,
    },
    currency: {
      required: true,
    },
    lang: {
      required: true,
    },
  };

  makeRecaptchaCallback() {
    return (recaptchaResponse) => {
      this.setState({ recaptchaResponse });
    };
  }

  validateInput(element) {
    const resp = validateElement(element, this.validation, this.state);

    if (resp.inputProps) {
      this.setState({
        validated: true,
        ...resp.inputProps,
      });
    }

    return resp.valid;
  }

  makeOpenTAC() {
    return () => {
      this.setState({ tacOpen: true });
    };
  }

  makeCloseTAC() {
    return () => {
      this.setState({ tacOpen: false });
    };
  }

  makeDateChange() {
    return (date) => {
      this.setState({ dateOfBirth: date });
      this.validateInput({
        name: "dateOfBirth",
        value: date,
      });
    };
  }

  memoizeDateChange = memoizeOne(this.makeDateChange);

  makeInputChange() {
    return (e) => {
      const { name, value } = e.target;
      this.setState({ [name]: value });
      this.validateInput({ name, value });
    };
  }

  memoizeInputChange = memoizeOne(this.makeInputChange);

  makeSelectPromo(index) {
    return () => {
      const { selectedPromo } = this.state;
      this.setState({ selectedPromo: selectedPromo === index ? null : index });
    };
  }

  makeRegister() {
    const { siteProcess, openSnackbar, recaptchaId } = this.props;
    return (event) => {
      // Prevent the forms redirect
      event.preventDefault();

      // Validate all inputs
      let valid = this.state.consent === "true";
      const inputs = event.target.querySelectorAll("input");
      let firstInvalid = null;
      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        const validField = this.validateInput(input);
        valid = valid && validField;
        if (!validField && !firstInvalid) {
          firstInvalid = input;
        }
      }

      if (!valid) {
        firstInvalid && firstInvalid.focus && firstInvalid.focus();
        return false;
      }

      const {
        selectedPromo,
        login,
        firstName,
        lastName,
        email,
        password,
        country,
        city,
        stateProvince,
        streetAddress,
        zipPostal,
        phoneNumber,
        dateOfBirth,
        currency,
        recaptchaResponse,
        cscAccountId,
        lang,
      } = this.state;

      const clickID = (window.getCookie && window.getCookie("ClickID")) || "";
      const referral = clickID
        ? {
            referral: {
              category: "egass",
              click_id: clickID,
            },
          }
        : {};

      const registerData = {
        ...{
          loginName: login,
          firstName,
          lastName,
          email,
          password,
          country,
          city,
          currency,
          lang,
          state: stateProvince,
          address: streetAddress,
          postalCode: zipPostal,
          phone: `+${phoneNumber.trim()}`,
          birthDate: dateOfBirth, // yyyy-mm-dd
        },
        ...referral,
      };

      // CR8 Account Id
      if (cscAccountId) {
        // Send the CSC Account ID as 'csc_account_id'
        registerData.csc_account_id = cscAccountId;
      }

      // Check if the URL has a 'promo' code to apply with registration, or if one has been stored to use
      const usePromoCode =
        window.getParameterByName("promo") || localStorage.registerPromo;
      if (usePromoCode || selectedPromo) {
        registerData.userCode = usePromoCode || selectedPromo;
      }

      // If the recaptcha Id is set, add the recaptcha response to the posted data for server-validation
      if (recaptchaId) {
        registerData["g-recaptcha-response"] = recaptchaResponse;
      }

      siteProcess(1);
      this.setState({ processing: true });
      requestRegister(registerData)
        .then((res) => {
          localStorage.registerPromo = "";
          this.setState({ processing: false, registrationComplete: true });
        })
        .catch((res) => {
          this.setState({ processing: false });
          let message = intl
            .get("register.notify.failure")
            .defaultMessage(
              "Failed to process registration, please try again later."
            );
          // Specific Error Messages
          if (res) {
            if (res.errorCode === 3211) {
              // Login Name taken
              message = intl
                .get("server.code.3211")
                .defaultMessage("Login name is unavailable.");
              this.setState({
                loginError: true,
                loginHelperText: intl
                  .get("register.error.nameTaken")
                  .defaultMessage("this name is not available"),
              });
            } else if (res.errorCode === 3233) {
              // Email unavailable
              message = intl
                .get("server.code.3233")
                .defaultMessage("Email already taken.");
              this.setState({
                emailError: true,
                emailHelperText: intl
                  .get("register.error.emailTaken")
                  .defaultMessage("email unavailable"),
              });
            } else if (res.errorCode === 3240) {
              // Invalid login name
              message = intl
                .get("server.code.3240")
                .defaultMessage("Invalid login name.");
              this.setState({
                emailError: true,
                emailHelperText: intl
                  .get("register.error.loginInvalid")
                  .defaultMessage("login name is invalid"),
              });
            } else if (res.errorCode === 3241) {
              // Email not valid
              message = intl
                .get("server.code.3241")
                .defaultMessage("Email is not valid.");
              this.setState({
                emailError: true,
                emailHelperText: intl
                  .get("register.error.emailInvalid")
                  .defaultMessage("email is invalid"),
              });
            } else if (res.errorCode === 3242) {
              // Email not accepted
              message = intl
                .get("server.code.3242")
                .defaultMessage("Email address is not accepted.");
              this.setState({
                emailError: true,
                emailHelperText: intl
                  .get("register.error.emailInvalid")
                  .defaultMessage("unacceptable email"),
              });
            }
          }
          openSnackbar({ message });
          // Reset the recaptcha if it's enabled
          if (recaptchaId && window.grecaptcha) {
            window.grecaptcha.reset();
          }
        })
        .finally(() => {
          siteProcess(-1);
        });
    };
  }

  render() {
    const {
      classes,
      currencies,
      countries,
      formType,
      pages,
      recaptchaId,
      language,
      defaultLanguage,
    } = this.props;
    const {
      promoItems,
      dialog,
      selectedPromo,
      registrationComplete,
      validated,
      processing,
      maxBirthDate,
      tacOpen,
      // Fields
      firstName,
      lastName,
      login,
      email,
      password,
      confirmPassword,
      country,
      stateProvince,
      streetAddress,
      city,
      zipPostal,
      phoneNumber,
      dateOfBirth,
      currency,
      consent,
      lang,
      // Error Flags
      loginError,
      emailError,
      passwordError,
      confirmPasswordError,
      firstNameError,
      lastNameError,
      countryError,
      stateProvinceError,
      streetAddressError,
      cityError,
      zipPostalError,
      phoneNumberError,
      dateOfBirthError,
      currencyError,
      langError,
      // Helper Texts
      loginHelperText,
      emailHelperText,
      passwordHelperText,
      confirmPasswordHelperText,
      firstNameHelperText,
      lastNameHelperText,
      countryHelperText,
      stateProvinceHelperText,
      streetAddressHelperText,
      cityHelperText,
      zipPostalHelperText,
      phoneNumberHelperText,
      dateOfBirthHelperText,
      currencyHelperText,
      langHelperText,
      disabledFields,
    } = this.state;

    const registerTitle = intl.get("register.title").defaultMessage("Register");
    const registerDesc = intl
      .get("register.description")
      .defaultMessage("Create an account to enjoy this experience:");

    const inputFirstName = intl
      .get("register.input.firstName")
      .defaultMessage("First Name");
    const inputLastName = intl
      .get("register.input.lastName")
      .defaultMessage("Last Name");
    const inputLogin = intl
      .get("register.input.login")
      .defaultMessage("Login Name");
    const inputEmail = intl.get("register.input.email").defaultMessage("Email");
    const inputPassword = intl
      .get("register.input.password")
      .defaultMessage("Password");
    const inputConfirmPassword = intl
      .get("register.input.confirmPassword")
      .defaultMessage("Confirm Password");
    const inputCountry = intl
      .get("register.input.country")
      .defaultMessage("Country");
    const inputStateProvince = intl
      .get("register.input.stateProvince")
      .defaultMessage("State/Province");
    const inputStreetAddress = intl
      .get("register.input.streetAddress")
      .defaultMessage("Street Address");
    const inputCity = intl.get("register.input.city").defaultMessage("City");
    const inputZipPostal = intl
      .get("register.input.zipPostal")
      .defaultMessage("Zip Code/Postal");
    const inputPhoneNumber = intl
      .get("register.input.phoneNumber")
      .defaultMessage("Phone Number");
    const inputDateOfBirth = intl
      .get("register.input.dateOfBirth")
      .defaultMessage("Date of Birth");
    const inputCurrency = intl
      .get("register.input.currency")
      .defaultMessage("Currency");
    const inputLanguage = intl
      .get("register.input.language")
      .defaultMessage("Language");

    const consentTitle = intl
      .get("register.consent.title")
      .defaultMessage("Consent");
    const consentDesc = intl
      .get("register.consent.description")
      .defaultMessage(
        "I confirm that I have read the Privacy Information Notice and give my consent to the processing of my personal data:"
      );
    const consentYes = intl
      .get("register.consent.yes")
      .defaultMessage("I agree");
    const consentNo = intl
      .get("register.consent.no")
      .defaultMessage("I do not agree");
    const consentRequired = intl
      .get("register.consent.error")
      .defaultMessage("You must agree in order to register");

    const newsletterTitle = intl
      .get("register.newsletter.title")
      .defaultMessage("Newsletter");
    const SITE_NAME = process.env.REACT_APP_WEBSITE_NAME_SHORT;
    const newsletterDesc = intl
      .get("register.newsletter.description", { 0: SITE_NAME })
      .defaultMessage(
        `I want to receive the newsletter for ${SITE_NAME} products`
      );

    const registerAction = intl
      .get("register.action.register")
      .defaultMessage("Register");

    const invalidDateFormat = intl
      .get("validation.helper.invalidDateFormat")
      .defaultMessage("Invalid date format");
    const invalidBirthDateMax = intl
      .get("validation.helper.invalidBirthDateMax")
      .defaultMessage("Date exceeds maximum allowable");
    const invalidBirthDateMin = intl
      .get("validation.helper.invalidBirthDateMin")
      .defaultMessage("Date preceeds minimum allowable");

    const actionDialogOk = intl
      .get("generic.dialog.action.ok")
      .defaultMessage("Ok");
    const actionDialogCancel = intl
      .get("generic.dialog.action.cancel")
      .defaultMessage("Cancel");

    const countryMenuItems =
      countries &&
      countries.map((country) => (
        <MenuItem key={country.code} value={country.code}>
          {country.label}
        </MenuItem>
      ));

    const currencyMenuItems =
      currencies &&
      currencies.map((currency) => (
        <MenuItem key={currency.code} value={currency.code}>
          {currency.code}
        </MenuItem>
      ));

    const languageMenuItems =
      language &&
      language
        .filter((lng) => lng.enabled)
        .map((langItem) => (
          <MenuItem key={langItem.code} value={langItem.code}>
            {langItem.longLabel}
          </MenuItem>
        ));

    const defaultLangValue =
      language &&
      language.length > 0 &&
      defaultLanguage &&
      language.find(
        ({ localeCode }) => localeCode === defaultLanguage.replace("-", "_")
      ).code;

    const newsletter = false && (
      <Grid item xs>
        <Typography variant="subtitle1">{newsletterTitle}</Typography>
        <div className={classes.flexCenter}>
          <Checkbox id="registerNewsletter" />
          <InputLabel htmlFor="registerNewsletter">{newsletterDesc}</InputLabel>
        </div>
      </Grid>
    );

    let registerForm;
    if (formType === "short") {
      registerForm = (
        <Grid
          container
          spacing={1}
          direction="column"
          justify="center"
          alignItems="stretch"
        >
          <Grid item xs>
            <Typography variant="h5">{registerTitle}</Typography>
          </Grid>
          <Grid item xs>
            <Typography variant="subtitle1">{registerDesc}</Typography>
          </Grid>

          {/* Login | Email */}

          <Grid item xs>
            <Grid
              container
              spacing={1}
              direction="row"
              justify="center"
              alignItems="stretch"
            >
              <Grid item xs={12} sm={6}>
                <FormControl error={loginError} fullWidth>
                  <InputLabel htmlFor="registerLogin">{inputLogin}</InputLabel>
                  <Input
                    id="registerLogin"
                    name="login"
                    value={login}
                    onChange={this.memoizeInputChange()}
                  />
                  <FormHelperText>{loginHelperText}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl error={emailError} fullWidth>
                  <InputLabel htmlFor="registerEmail">{inputEmail}</InputLabel>
                  <Input
                    disabled={disabledFields.includes("email")}
                    id="registerEmail"
                    type="email"
                    name="email"
                    value={email}
                    onChange={this.memoizeInputChange()}
                  />
                  <FormHelperText>{emailHelperText}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          {/* Password | Confirm Password */}

          <Grid item xs>
            <Grid
              container
              spacing={1}
              direction="row"
              justify="center"
              alignItems="stretch"
            >
              <Grid item xs={12} sm={6}>
                <FormControl error={passwordError} fullWidth>
                  <InputLabel htmlFor="registerPassword">
                    {inputPassword}
                  </InputLabel>
                  <Input
                    id="registerPassword"
                    type="password"
                    name="password"
                    value={password}
                    onChange={this.memoizeInputChange()}
                  />
                  <FormHelperText>{passwordHelperText}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl error={confirmPasswordError} fullWidth>
                  <InputLabel htmlFor="registerConfirmPassword">
                    {inputConfirmPassword}
                  </InputLabel>
                  <Input
                    id="registerConfirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={this.memoizeInputChange()}
                  />
                  <FormHelperText>{confirmPasswordHelperText}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          {/* First Name | Last Name */}

          <Grid item xs>
            <Grid
              container
              spacing={1}
              direction="row"
              justify="center"
              alignItems="stretch"
            >
              <Grid item xs={12} sm={6}>
                <FormControl error={firstNameError} fullWidth>
                  <InputLabel htmlFor="registerFirstName">
                    {inputFirstName}
                  </InputLabel>
                  <Input
                    disabled={disabledFields.includes("firstName")}
                    id="registerFirstName"
                    name="firstName"
                    value={firstName}
                    onChange={this.memoizeInputChange()}
                  />
                  <FormHelperText>{firstNameHelperText}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl error={lastNameError} fullWidth>
                  <InputLabel htmlFor="registerLastName">
                    {inputLastName}
                  </InputLabel>
                  <Input
                    disabled={disabledFields.includes("lastName")}
                    id="registerLastName"
                    name="lastName"
                    value={lastName}
                    onChange={this.memoizeInputChange()}
                  />
                  <FormHelperText>{lastNameHelperText}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          {/* Date of Birth */}

          <Grid item xs>
            <Grid
              container
              spacing={1}
              direction="row"
              justify="center"
              alignItems="stretch"
            >
              <Grid item xs={12}>
                <KeyboardDatePicker
                  fullWidth
                  disableFuture
                  disabled={disabledFields.includes("dateOfBirth")}
                  variant="dialog"
                  format="yyyy-MM-dd"
                  id="registerDateOfBirth"
                  label={inputDateOfBirth}
                  name="dateOfBirth"
                  value={dateOfBirth}
                  onChange={this.memoizeDateChange()}
                  invalidDateMessage={invalidDateFormat}
                  maxDate={maxBirthDate}
                  maxDateMessage={invalidBirthDateMax}
                  minDateMessage={invalidBirthDateMin}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                  okLabel={actionDialogOk}
                  cancelLabel={actionDialogCancel}
                  {...(dateOfBirthError === true
                    ? {
                        error: dateOfBirthError,
                        helperText: dateOfBirthHelperText,
                      }
                    : {})}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Language */}

          <Grid item xs>
            <Grid
              container
              spacing={1}
              direction="row"
              justify="center"
              alignItems="stretch"
            >
              <Grid item xs={12}>
                <FormControl error={langError} fullWidth>
                  <InputLabel htmlFor="registerLang">
                    {inputLanguage}
                  </InputLabel>
                  <Select
                    id="registerLang"
                    name="lang"
                    value={lang || defaultLangValue}
                    onChange={this.memoizeInputChange()}
                  >
                    {languageMenuItems}
                  </Select>
                  <FormHelperText>{langHelperText}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs />
            </Grid>
          </Grid>

          {/* Consent */}

          <Grid item xs>
            <Grid container justify="space-between">
              <Grid item>
                <Typography variant="subtitle1">{consentTitle}</Typography>
              </Grid>
              <Grid item>
                {pages["terms-and-conditions"] && (
                  <Button onClick={this.makeOpenTAC()}>
                    {pages["terms-and-conditions"].title}
                  </Button>
                )}
              </Grid>
            </Grid>
            <Typography>{consentDesc}</Typography>
            <RadioGroup
              aria-label="registerConsent"
              name="consent"
              value={consent}
              onChange={this.memoizeInputChange()}
              className={classes.row}
            >
              <FormControlLabel
                value="true"
                control={<Radio />}
                label={consentYes}
              />
              <FormControlLabel
                value="false"
                control={<Radio />}
                label={consentNo}
              />
            </RadioGroup>
            {(validated || (consent && consent.length)) &&
              consent !== "true" && (
                <FormLabel error>{consentRequired}</FormLabel>
              )}
          </Grid>

          {newsletter}

          {/* Google Recaptcha */}

          {recaptchaId && (
            <Grid item xs>
              <div id="grecaptchaVerification"></div>
            </Grid>
          )}

          {/* Registration Button */}

          <Grid item xs className={classes.alignRight}>
            <Button
              type="submit"
              disabled={processing}
              variant="contained"
              color="primary"
            >
              {registerAction}
            </Button>
          </Grid>
        </Grid>
      );
    } else {
      registerForm = (
        <Grid
          container
          spacing={1}
          direction="column"
          justify="center"
          alignItems="stretch"
        >
          <Grid item xs>
            <Typography variant="h5">{registerTitle}</Typography>
          </Grid>
          <Grid item xs>
            <Typography variant="subtitle1">{registerDesc}</Typography>
          </Grid>

          {/* Login | Email */}

          <Grid item xs>
            <Grid
              container
              spacing={1}
              direction="row"
              justify="center"
              alignItems="stretch"
            >
              <Grid item xs={12} sm={6}>
                <FormControl error={loginError} fullWidth>
                  <InputLabel htmlFor="registerLogin">{inputLogin}</InputLabel>
                  <Input
                    id="registerLogin"
                    name="login"
                    value={login}
                    onChange={this.memoizeInputChange()}
                  />
                  <FormHelperText>{loginHelperText}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl error={emailError} fullWidth>
                  <InputLabel htmlFor="registerEmail">{inputEmail}</InputLabel>
                  <Input
                    id="registerEmail"
                    type="email"
                    name="email"
                    value={email}
                    onChange={this.memoizeInputChange()}
                  />
                  <FormHelperText>{emailHelperText}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          {/* Password | Confirm Password */}

          <Grid item xs>
            <Grid
              container
              spacing={1}
              direction="row"
              justify="center"
              alignItems="stretch"
            >
              <Grid item xs={12} sm={6}>
                <FormControl error={passwordError} fullWidth>
                  <InputLabel htmlFor="registerPassword">
                    {inputPassword}
                  </InputLabel>
                  <Input
                    id="registerPassword"
                    type="password"
                    name="password"
                    value={password}
                    onChange={this.memoizeInputChange()}
                  />
                  <FormHelperText>{passwordHelperText}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl error={confirmPasswordError} fullWidth>
                  <InputLabel htmlFor="registerConfirmPassword">
                    {inputConfirmPassword}
                  </InputLabel>
                  <Input
                    id="registerConfirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={this.memoizeInputChange()}
                  />
                  <FormHelperText>{confirmPasswordHelperText}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          {/* First Name | Last Name */}

          <Grid item xs>
            <Grid
              container
              spacing={1}
              direction="row"
              justify="center"
              alignItems="stretch"
            >
              <Grid item xs={12} sm={6}>
                <FormControl error={firstNameError} fullWidth>
                  <InputLabel htmlFor="registerFirstName">
                    {inputFirstName}
                  </InputLabel>
                  <Input
                    id="registerFirstName"
                    name="firstName"
                    value={firstName}
                    onChange={this.memoizeInputChange()}
                  />
                  <FormHelperText>{firstNameHelperText}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl error={lastNameError} fullWidth>
                  <InputLabel htmlFor="registerLastName">
                    {inputLastName}
                  </InputLabel>
                  <Input
                    id="registerLastName"
                    name="lastName"
                    value={lastName}
                    onChange={this.memoizeInputChange()}
                  />
                  <FormHelperText>{lastNameHelperText}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          {/* Country | State/Province */}

          <Grid item xs>
            <Grid
              container
              spacing={1}
              direction="row"
              justify="center"
              alignItems="stretch"
            >
              <Grid item xs={12} sm={6}>
                <FormControl error={countryError} fullWidth>
                  <InputLabel htmlFor="registerCountry">
                    {inputCountry}
                  </InputLabel>
                  <Select
                    id="registerCountry"
                    name="country"
                    value={country}
                    onChange={this.memoizeInputChange()}
                  >
                    {countryMenuItems}
                  </Select>
                  <FormHelperText>{countryHelperText}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl error={stateProvinceError} fullWidth>
                  <InputLabel htmlFor="registerStateProvince">
                    {inputStateProvince}
                  </InputLabel>
                  <Input
                    id="registerStateProvince"
                    name="stateProvince"
                    value={stateProvince}
                    onChange={this.memoizeInputChange()}
                  />
                  <FormHelperText>{stateProvinceHelperText}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          {/* Street Address 1 */}

          <Grid item xs>
            <FormControl error={streetAddressError} fullWidth>
              <InputLabel htmlFor="registerstreetAddress">
                {inputStreetAddress}
              </InputLabel>
              <Input
                id="registerstreetAddress"
                name="streetAddress"
                value={streetAddress}
                onChange={this.memoizeInputChange()}
              />
              <FormHelperText>{streetAddressHelperText}</FormHelperText>
            </FormControl>
          </Grid>

          {/* City | Postal/Zip Code */}

          <Grid item xs>
            <Grid
              container
              spacing={1}
              direction="row"
              justify="center"
              alignItems="stretch"
            >
              <Grid item xs={12} sm={6}>
                <FormControl error={cityError} fullWidth>
                  <InputLabel htmlFor="registerCity">{inputCity}</InputLabel>
                  <Input
                    id="registerCity"
                    name="city"
                    value={city}
                    onChange={this.memoizeInputChange()}
                  />
                  <FormHelperText>{cityHelperText}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl error={zipPostalError} fullWidth>
                  <InputLabel htmlFor="registerZipPostal">
                    {inputZipPostal}
                  </InputLabel>
                  <Input
                    id="registerZipPostal"
                    name="zipPostal"
                    value={zipPostal}
                    onChange={this.memoizeInputChange()}
                  />
                  <FormHelperText>{zipPostalHelperText}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          {/* Phone Number | Date of Birth */}

          <Grid item xs>
            <Grid
              container
              spacing={1}
              direction="row"
              justify="center"
              alignItems="stretch"
            >
              <Grid item xs={12} sm={6}>
                <FormControl error={phoneNumberError} fullWidth>
                  <InputLabel htmlFor="registerPhoneNumber">
                    {inputPhoneNumber}
                  </InputLabel>
                  <Input
                    id="registerPhoneNumber"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={this.memoizeInputChange()}
                    startAdornment={
                      <InputAdornment position="start">+</InputAdornment>
                    }
                  />
                  <FormHelperText>{phoneNumberHelperText}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <KeyboardDatePicker
                  fullWidth
                  disableFuture
                  variant="dialog"
                  format="yyyy-MM-dd"
                  id="registerDateOfBirth"
                  label={inputDateOfBirth}
                  name="dateOfBirth"
                  value={dateOfBirth}
                  onChange={this.memoizeDateChange()}
                  invalidDateMessage={invalidDateFormat}
                  maxDate={maxBirthDate}
                  maxDateMessage={invalidBirthDateMax}
                  minDateMessage={invalidBirthDateMin}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                  okLabel={actionDialogOk}
                  cancelLabel={actionDialogCancel}
                  {...(dateOfBirthError === true
                    ? {
                        error: dateOfBirthError,
                        helperText: dateOfBirthHelperText,
                      }
                    : {})}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Currency */}

          <Grid item xs>
            <Grid
              container
              spacing={1}
              direction="row"
              justify="center"
              alignItems="stretch"
            >
              <Grid item xs={12}>
                <FormControl error={currencyError} fullWidth>
                  <InputLabel htmlFor="registerCurrency">
                    {inputCurrency}
                  </InputLabel>
                  <Select
                    id="registerCurrency"
                    name="currency"
                    value={currency}
                    onChange={this.memoizeInputChange()}
                  >
                    {currencyMenuItems}
                  </Select>
                  <FormHelperText>{currencyHelperText}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs />
            </Grid>
          </Grid>

          {/* Language */}

          <Grid item xs>
            <Grid
              container
              spacing={1}
              direction="row"
              justify="center"
              alignItems="stretch"
            >
              <Grid item xs={12}>
                <FormControl error={langError} fullWidth>
                  <InputLabel htmlFor="registerLang">
                    {inputLanguage}
                  </InputLabel>
                  <Select
                    id="registerLang"
                    name="lang"
                    value={lang || defaultLangValue}
                    onChange={this.memoizeInputChange()}
                  >
                    {languageMenuItems}
                  </Select>
                  <FormHelperText>{langHelperText}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs />
            </Grid>
          </Grid>

          {/* Consent */}

          <Grid item xs>
            <Typography variant="subtitle1">{consentTitle}</Typography>
            <Typography>{consentDesc}</Typography>
            <RadioGroup
              aria-label="registerConsent"
              name="consent"
              value={consent}
              onChange={this.memoizeInputChange()}
              className={classes.row}
            >
              <FormControlLabel
                value="true"
                control={<Radio />}
                label={consentYes}
              />
              <FormControlLabel
                value="false"
                control={<Radio />}
                label={consentNo}
              />
            </RadioGroup>
            {(validated || (consent && consent.length)) &&
              consent !== "true" && (
                <FormLabel error>{consentRequired}</FormLabel>
              )}
          </Grid>

          {newsletter}

          {/* Google Recaptcha */}

          {recaptchaId && (
            <Grid item xs>
              <div id="grecaptchaVerification"></div>
            </Grid>
          )}

          {/* Registration Button */}

          <Grid item xs className={classes.alignRight}>
            <Button
              type="submit"
              disabled={processing}
              className={classes.goldButton}
            >
              {registerAction}
            </Button>
          </Grid>
        </Grid>
      );
    }

    const registrationPromo = intl
      .get("register.label.promo")
      .defaultMessage("Choose your welcome bonus!");

    const promotions = (
      <SizeMe
        render={({ size }) => {
          if (size && size.width) {
            // Half the available width to allow for two items/row
            let promoSize = Math.floor(size.width / 2);
            let promoLblVariant = "h4";
            const containerStyle = {};
            // If the item would be less than this, make it use the full width per row
            if (promoSize < 200) {
              promoSize = Math.floor(size.width * 0.75);
              promoLblVariant = "h5";
              containerStyle.display = "block";
              containerStyle.margin = "auto";
            }
            return (
              <Box>
                {!!promoItems.length && (
                  <Typography variant={promoLblVariant} align="center">
                    {registrationPromo}
                  </Typography>
                )}
                {promoItems.map((promo) => {
                  // Match the action to get the promo code
                  const codeMatch = promo?.linkCallForAction2?.match(
                    /\/registration\/(\w+)/
                  );
                  // Set the code
                  const code = (codeMatch && codeMatch[1]) || "";
                  // Set the background image
                  const promoItemStyle = {
                    backgroundImage: `url("${promo.image}")`,
                  };
                  // If this is not the selected promotion, unset the border which is set by default
                  if (selectedPromo !== code) {
                    promoItemStyle.border = "unset";
                  }
                  let button = null;
                  if (promo.btnReadMore) {
                    button = (
                      <Box className={classes.promoDetailsBtn}>
                        <Button
                          variant="contained"
                          color="primary"
                          style={{ display: "block", margin: "auto" }}
                          onClick={this.makeDialogOpen(
                            promo.title,
                            promo.fullText
                          )}
                        >
                          {promo.btnReadMore}
                        </Button>
                      </Box>
                    );
                  }
                  return (
                    <Box
                      key={promo.title}
                      width={promoSize}
                      height={promoSize}
                      className={classes.promotionItemContainer}
                      style={containerStyle}
                    >
                      <Box
                        className={classes.promotionItem}
                        style={promoItemStyle}
                        onClick={this.makeSelectPromo(code)}
                      >
                        {button}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            );
          }
          return <Box></Box>;
        }}
      />
    );

    // If there are no promotion items, render a background image
    const advertStyle = promoItems.length
      ? {}
      : { backgroundImage: `url("${adPlaceholderImage}")` };

    // Renders the promo area
    const promoArea = (
      <Grid item xs className={classes.gridItem}>
        <div className={classes.advert} style={advertStyle}>
          {promotions}
        </div>
      </Grid>
    );

    const form = (
      <Grid item xs className={classes.gridItem}>
        <form className={classes.register} onSubmit={this.makeRegister()}>
          {registerForm}
        </form>
      </Grid>
    );

    return (
      <Container className={classes.root}>
        <div className={classes.image}></div>

        <Hidden lgUp>
          <Container>
            {promoArea}
            <Box marginBottom={8} />
            {form}
          </Container>
        </Hidden>
        <Hidden mdDown>
          <Grid
            container
            spacing={8}
            direction="row"
            justify="center"
            alignItems="stretch"
          >
            {form}
            {promoArea}
          </Grid>
        </Hidden>
        {registrationComplete && this.renderRegisterCompleteDialog()}
        {tacOpen && this.renderTACDialog()}
        {dialog && this.renderDialog()}
      </Container>
    );
  }

  makeDialogClose() {
    return () => {
      this.setState({ dialog: false });
    };
  }

  makeDialogOpen(dialogTitle, dialogContent) {
    return () => {
      this.setState({ dialog: true, dialogTitle, dialogContent });
    };
  }

  renderDialog() {
    const { dialogTitle, dialogContent } = this.state;
    const { classes } = this.props;

    const actionDialogClose = intl
      .get("generic.dialog.action.ok")
      .defaultMessage("Ok");

    const desc = { __html: sanitize(dialogContent) };

    return (
      <Dialog
        aria-labelledby="dialogTitle"
        open={true}
        onClose={this.makeDialogClose()}
      >
        <DialogTitle id="dialogTitle">{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography
              dangerouslySetInnerHTML={desc}
              className={classes.dialogText}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            onClick={this.makeDialogClose()}
          >
            {actionDialogClose}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  renderTACDialog() {
    const { classes, pages } = this.props;

    const tac = pages["terms-and-conditions"];
    const desc = { __html: sanitize(tac.fullText) };

    const actionDialogOk = intl
      .get("generic.dialog.action.ok")
      .defaultMessage("Ok");

    return (
      <Dialog
        aria-labelledby="TACDialogTitle"
        open={true}
        onClose={this.makeCloseTAC()}
      >
        <DialogTitle id="TACDialogTitle">{tac.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography
              component="div"
              dangerouslySetInnerHTML={desc}
              className={classes.dialogText}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            onClick={this.makeCloseTAC()}
          >
            {actionDialogOk}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  /**
   * Dialog confirming the successful registration of the account
   */
  renderRegisterCompleteDialog() {
    const { email } = this.state;

    const title = intl
      .get("register.complete.title")
      .defaultMessage("Registration Complete");
    const content = intl
      .get("register.complete.content", { 0: email })
      .defaultMessage(
        `An activation email has been sent to ${email}, you must activate your account before you may log in.`
      );

    const actionDialogOk = intl
      .get("generic.dialog.action.ok")
      .defaultMessage("Ok");

    return (
      <Dialog aria-labelledby="registrationCompletedDialogTitle" open={true}>
        <DialogTitle id="registrationCompletedDialogTitle">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            onClick={this.makeRegistrationComplete()}
          >
            {actionDialogOk}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  makeRegistrationComplete() {
    return () => {
      const { history } = this.props;
      history.push("/login");
    };
  }
}

export default Register;
