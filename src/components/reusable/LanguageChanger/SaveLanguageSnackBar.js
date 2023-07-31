import React, { useMemo, useCallback } from "react";
import { Button, Snackbar, makeStyles } from "@material-ui/core";

import { setLanguage } from "../../../helpers/request";
import intl from "react-intl-universal";

const useStyles = makeStyles((theme) => ({
  anchorOriginTopRight: {
    top: theme.spacing(1),
  },
}));

const SaveLanguageSnackBar = ({
  setIsOpenSnackBar,
  language,
  languageOptions,
}) => {
  const clasess = useStyles();

  const lng = useMemo(() => {
    const formattedLocale = language.replace("-", "_");
    return languageOptions.find(
      ({ localeCode }) => localeCode === formattedLocale
    );
  }, [language, languageOptions]);

  const handleOnClickSave = useCallback(() => {
    setIsOpenSnackBar(false);
    setLanguage(lng.code).then();
  }, [lng.code, setIsOpenSnackBar]);

  const saveChangeLanguageIntl = intl
    .get("settings.saveChangeLanguage", { 0: lng.longLabel })
    .defaultMessage(`Set ${lng.longLabel} as default language`);

  return (
    <Snackbar
      classes={clasess}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={true}
      autoHideDuration={16000}
      onClose={() => setIsOpenSnackBar(false)}
    >
      <Button
        color="primary"
        variant="contained"
        aria-label="save"
        onClick={handleOnClickSave}
      >
        {saveChangeLanguageIntl}
      </Button>
    </Snackbar>
  );
};

export default SaveLanguageSnackBar;
