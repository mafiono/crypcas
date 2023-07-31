import React, { Component } from "react";
import intl from "react-intl-universal";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import memoizeOne from "memoize-one";
import {
  Box,
  Grid,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  Input,
  Button,
  TextField,
  Typography,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { backgroundGhostLogo } from "../../helpers/images";
import { themeInLightMode } from "../../helpers/theme";
import { submitContact as requestContact } from "../../helpers/request";
import { validateElement } from "../../helpers/validation";
import { getUser, getLanguage, getRecaptchaId } from "../../redux/selectors";
import { siteProcess, openSnackbar } from "../../redux/slices/notifications";

const subjects = [
  "Deposits",
  "Withdrawals",
  "Bitcoin information",
  "Bonuses",
  "Game issue",
  "Bets",
  "Promotions",
  "Terms and Conditions",
  "Account settings",
  "Account security",
];
const subjectsLowercase = subjects.map((item) => item.toLowerCase());
const NOT_FOUND = -1;

@connect(
  (state) => ({
    user: getUser(state),
    language: getLanguage(state),
    recaptchaId: getRecaptchaId(state),
  }),
  { siteProcess, openSnackbar }
)
@withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    position: "relative",
    display: "flex",
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
  form: {
    margin: "auto",
    maxWidth: "1000px",
    width: "100%",
    flexGrow: 1,
    border: "3px solid #EBAB50",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    padding: theme.spacing(12),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(6),
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(3),
    },
  },
  formFieldContainer: {
    alignItems: "flex-end",
    [theme.breakpoints.down("sm")]: {
      alignItems: "stretch",
      flexDirection: "column",
    },
  },
  goldButton: {
    ...theme.custom.button.gold,
  },
}))
class Support extends Component {
  state = {
    // State Properties
    processing: false,
    // Fields
    name:
      `${this?.props?.user?.firstName || ""} ${
        this?.props?.user?.lastName || ""
      }`.trim() || "",
    phone: this?.props?.user?.phone?.replace(/^\+/, "") || "",
    email: this?.props?.user?.email || "",
    subject: "",
    otherSubject: "",
    message: "",
    // Error Flags
    nameError: false,
    phoneError: false,
    emailError: false,
    subjectError: false,
    messageError: false,
    // Helper Texts
    nameHelperText: "",
    phoneHelperText: "",
    emailHelperText: "",
    subjectHelperText: "",
    messageHelperText: "",
  };

  validation = {
    name: {
      required: true,
    },
    email: {
      required: true,
      pattern: /^.+@.+?\..+$/,
    },
    phone: {
      required: false,
      type: "phone",
    },
    subject: {
      required: true,
    },
    message: {
      required: true,
    },
  };

  resize = null;

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  componentDidMount() {
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

  makeSubjectSelection() {
    return (e, value) => {
      // Set the subject, unset the other subject
      this.setState({
        subject: value,
        otherSubject: "",
      });
      this.validateInput({ name: "subject", value });
    };
  }

  makeSubjectChange() {
    return (e) => {
      const { value } = e.target;
      // Default to other subject
      let subject = "other";
      let otherSubject = value;
      // Check if the value was found in the subjects list
      const subValIndx = subjectsLowercase.indexOf(
        value && value.toLowerCase()
      );
      if (subValIndx !== NOT_FOUND) {
        // The manually typed subject matches one provided
        subject = subjects[subValIndx];
        otherSubject = "";
      }
      // Set the subject, unset the other subject
      this.setState({ subject, otherSubject });
      this.validateInput({ name: "subject", value });
    };
  }

  makeInputChange() {
    return (e) => {
      const { name, value } = e.target;
      this.setState({ [name]: value });
      this.validateInput({ name, value });
    };
  }

  memoizeInputChange = memoizeOne(this.makeInputChange);

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

  makeRecaptchaCallback() {
    return (recaptchaResponse) => {
      this.setState({ recaptchaResponse });
    };
  }

  makeSendContactForm() {
    const { siteProcess, openSnackbar, user, recaptchaId } = this.props;
    return (event) => {
      // Prevent the forms redirect
      event.preventDefault();

      // Validate all inputs
      let valid = true;
      const inputs = event.target.querySelectorAll("input, textarea");
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

      const userId = (user && user.id) || "";

      // Get the form data to submit from the state
      const {
        name,
        phone,
        email,
        subject,
        otherSubject,
        message,
        recaptchaResponse,
      } = this.state;

      // Bundle the form submission data
      const data = {
        "g-recaptcha-response": "",
        name,
        phone,
        email,
        subject,
        "other-subject": otherSubject,
        message,
        userId,
        type: "contact-us",
      };

      // If the recaptcha Id is set, add the recaptcha response to the posted data for server-validation
      if (recaptchaId) {
        data["g-recaptcha-response"] = recaptchaResponse;
      }

      // Begin Processing
      siteProcess(1);
      this.setState({ processing: true });

      requestContact(data)
        .then((res) => {
          // Success
          this.setState({
            processing: false,
            // Reset fields
            name: "",
            phone: "",
            email: "",
            subject: "",
            otherSubject: "",
            message: "",
          });
          // Display an error message
          const message = intl
            .get("support.form.sent")
            .defaultMessage("Your message was sent successfully.");
          openSnackbar({ message });
        })
        .catch((res) => {
          // Failure
          this.setState({
            processing: false,
          });
          // Display an error message
          const message = intl
            .get("support.error.generic")
            .defaultMessage("Your message could not be sent at this time.");
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
      processing,
      // Fields
      name,
      phone,
      email,
      subject,
      // otherSubject,
      message,
      // Error Flags
      nameError,
      phoneError,
      emailError,
      subjectError,
      messageError,
      // Helper Texts
      nameHelperText,
      phoneHelperText,
      emailHelperText,
      subjectHelperText,
      messageHelperText,
    } = this.state;
    const { classes, recaptchaId } = this.props;

    const pageTitle = intl.get("support.title").defaultMessage("Contact Us");
    const pageDesc = intl
      .get("support.description")
      .defaultMessage("Give us feedback or request support:");

    const inputName = intl
      .get("support.input.name")
      .defaultMessage("Full Name");
    const inputPhone = intl
      .get("support.input.phone")
      .defaultMessage("Mobile Number");
    const inputEmail = intl.get("support.input.email").defaultMessage("Email");
    const inputSubject = intl
      .get("support.input.subject")
      .defaultMessage("Subject");
    const inputMessage = intl
      .get("support.input.message")
      .defaultMessage("Message");

    const actionSend = intl.get("support.action.send").defaultMessage("Send");

    const form = (
      <form onSubmit={this.makeSendContactForm()} className={classes.form}>
        <Grid container spacing={1} direction="column" justify="center">
          {/* Title and Description */}
          <Grid item xs={12}>
            <Typography variant="h5">{pageTitle}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">{pageDesc}</Typography>
          </Grid>

          <Grid
            item
            xs={12}
            container
            spacing={2}
            className={classes.formFieldContainer}
          >
            <Grid item xs={12} md={6} container spacing={1} direction="column">
              {/* Full Name */}
              <Grid item xs={12}>
                <FormControl error={nameError} fullWidth>
                  <InputLabel htmlFor="supportName" color="primary">
                    {inputName} *
                  </InputLabel>
                  <Input
                    id="supportName"
                    name="name"
                    value={name}
                    onChange={this.memoizeInputChange()}
                  />
                  <FormHelperText>{nameHelperText || " "}</FormHelperText>
                </FormControl>
              </Grid>

              {/* Mobile Number */}
              <Grid item xs={12}>
                <FormControl error={phoneError} fullWidth>
                  <InputLabel htmlFor="supportPhone" color="primary">
                    {inputPhone}
                  </InputLabel>
                  <Input
                    id="supportPhone"
                    name="phone"
                    value={phone}
                    onChange={this.memoizeInputChange()}
                    startAdornment={
                      <InputAdornment position="start">+</InputAdornment>
                    }
                  />
                  <FormHelperText>{phoneHelperText || " "}</FormHelperText>
                </FormControl>
              </Grid>

              {/* Email */}
              <Grid item xs={12}>
                <FormControl error={emailError} fullWidth>
                  <InputLabel htmlFor="supportEmail" color="primary">
                    {inputEmail} *
                  </InputLabel>
                  <Input
                    id="supportEmail"
                    name="email"
                    value={email}
                    onChange={this.memoizeInputChange()}
                  />
                  <FormHelperText>{emailHelperText || " "}</FormHelperText>
                </FormControl>
              </Grid>

              {/* Subject */}
              <Grid item xs={12}>
                {/* <FormControl error={subjectError} fullWidth>
                                    <InputLabel htmlFor="supportSubject" color="primary">{inputSubject} *</InputLabel>
                                    <Input id="supportSubject" name="subject" value={subject} onChange={this.memoizeInputChange()} />
                                    <FormHelperText>{subjectHelperText}</FormHelperText>
                                </FormControl> */}

                <Autocomplete
                  options={subjects}
                  getOptionLabel={(subject) => subject}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="supportSubject"
                      label={`${inputSubject} *`}
                      name="subject"
                      value={subject}
                      onChange={this.makeSubjectChange()}
                      fullWidth
                      error={subjectError}
                      helperText={subjectHelperText || " "}
                    />
                  )}
                  onChange={this.makeSubjectSelection()}
                  freeSolo
                />
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              {/* Message */}
              {/* <FormControl error={messageError} fullWidth>
                                <InputLabel htmlFor="supportMessage" color="primary">{inputMessage} *</InputLabel>
                                <Input id="supportMessage" name="message" value={message} onChange={this.memoizeInputChange()} multiline rows="8" />
                                <FormHelperText>{messageHelperText}</FormHelperText>
                            </FormControl> */}
              <TextField
                id="supportMessage"
                label={`${inputMessage} *`}
                variant="outlined"
                name="message"
                value={message}
                onChange={this.memoizeInputChange()}
                rows="13"
                multiline
                fullWidth
                error={messageError}
                helperText={messageHelperText || " "}
              />
            </Grid>
          </Grid>

          {/* Google Recaptcha */}

          {recaptchaId && (
            <Grid item xs>
              <div id="grecaptchaVerification"></div>
            </Grid>
          )}

          {/* Send */}
          <Grid item xs={12}>
            <Button
              type="submit"
              disabled={processing}
              className={classes.goldButton}
            >
              {actionSend}
            </Button>
          </Grid>
        </Grid>
      </form>
    );

    return (
      <Box className={classes.root}>
        <div className={classes.image}></div>
        {form}
      </Box>
    );
  }
}
export default Support;
