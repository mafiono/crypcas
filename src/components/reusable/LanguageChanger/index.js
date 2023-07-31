import React, { Component } from "react";
import intl from "react-intl-universal";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import {
  Button,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  Typography,
  Popover,
} from "@material-ui/core";
import { Language } from "@material-ui/icons";
import { getLanguage, getLanguages, getUser } from "../../../redux/selectors";
import { setLanguage } from "../../../redux/slices/language";
import { siteProcess } from "../../../redux/slices/notifications";
import { loadSiteData } from "../../../helpers/request";

import SaveLanguageSnackBar from "./SaveLanguageSnackBar";

@connect(
  (state) => ({
    language: getLanguage(state),
    languageOptions: getLanguages(state),
    user: getUser(state),
  }),
  { siteProcess, setLanguage }
)
@withStyles((theme) => ({
  noMinWidth: {
    minWidth: "unset",
  },
}))
class LanguageChanger extends Component {
  state = {
    anchorEl: null,
    changeLanguage: false,
    isOpenSnackbar: false,
  };

  makeOpenLanguage() {
    return (e) => {
      this.setState({ changeLanguage: true, anchorEl: e.currentTarget });
    };
  }

  makeCloseDialog() {
    return () => {
      this.setState({ changeLanguage: false, anchorEl: null });
    };
  }

  setIsOpenSnackBar = (value) => {
    this.setState({
      isOpenSnackbar: value,
    });
  };

  /**
   * The language toggler, which is simply the 'Language' Icon wrapped in a button.
   *
   * Upon clicking, it can open either a popover or dialog:
   *   - renderPopover
   *   - renderDialog
   */
  render() {
    const { changeLanguage, isOpenSnackbar } = this.state;
    const { classes, language, languageOptions } = this.props;

    return (
      <div>
        <Button
          color="primary"
          className={classes.noMinWidth}
          onClick={this.makeOpenLanguage()}
        >
          <Language />
        </Button>
        {changeLanguage && this.renderPopover()}
        {isOpenSnackbar && (
          <SaveLanguageSnackBar
            setIsOpenSnackBar={this.setIsOpenSnackBar}
            language={language}
            languageOptions={languageOptions}
          />
        )}
      </div>
    );
  }

  /**
   * Popover with list of languages to switch to
   */
  renderPopover() {
    const { languageOptions } = this.props;
    const { anchorEl } = this.state;

    return (
      <Popover
        open={true}
        anchorEl={anchorEl}
        onClose={this.makeCloseDialog()}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <List>
          {languageOptions &&
            languageOptions
              .filter((locale) => locale.enabled)
              .map((locale) => (
                <ListItem
                  key={locale.localeCode}
                  button
                  onClick={this.makeOnSelectLocale(locale.localeCode)}
                >
                  <Typography>{locale.longLabel}</Typography>
                </ListItem>
              ))}
        </List>
      </Popover>
    );
  }

  /**
   * Dialog with list of languages to switch to
   */
  renderDialog() {
    const { languageOptions } = this.props;
    const changeLanguageStr = intl
      .get("settings.changeLanguage")
      .defaultMessage("Change Language");

    return (
      <Dialog
        onClose={this.makeCloseDialog()}
        aria-labelledby="changeLanguageDialogTitle"
        open={true}
      >
        <DialogTitle id="changeLanguageDialogTitle">
          {changeLanguageStr}
        </DialogTitle>
        <List>
          {languageOptions &&
            languageOptions.map((locale) => (
              <ListItem
                key={locale.localeCode}
                button
                onClick={this.makeOnSelectLocale(locale.localeCode)}
              >
                <Typography>{locale.longLabel}</Typography>
              </ListItem>
            ))}
        </List>
      </Dialog>
    );
  }

  /**
   * Creates the function used to change the language.
   *
   * @param language
   */
  makeOnSelectLocale(language) {
    return () => {
      // Enforce Format from: "en_US", to: "en-US"
      const formattedLanguage = language.replace("_", "-");

      if (this.props.language === formattedLanguage) {
        this.makeCloseDialog()();
        return;
      }

      //  take a code "en_US" => "en"
      const languageCode = formattedLanguage.substr(0, 2);

      // Set the local storage language
      localStorage.lang = formattedLanguage;
      localStorage.locale = languageCode;

      // Get the options, change the current locale, and re-initialize
      const options = intl.getInitOptions();
      options.currentLocale = formattedLanguage;
      intl.init(options);

      // Reload the site data for the new locale
      this.props.siteProcess(1);
      loadSiteData()
        .then(() => {
          this.props.siteProcess(-1);
        })
        .catch(() => {
          this.props.siteProcess(-1);
        });

      // Set the language (Which triggers a re-render)
      this.props.setLanguage(formattedLanguage);
      this.setState({
        changeLanguage: false,
        // open SnackBar if user logged in and language are different
        isOpenSnackbar:
          this.props.user.signedIn && this.props.user.lang !== languageCode,
      });
    };
  }
}

export default LanguageChanger;
