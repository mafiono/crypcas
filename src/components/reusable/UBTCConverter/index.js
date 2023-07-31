import React, { useCallback, useState } from "react";
import * as yup from "yup";
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  IconButton,
} from "@material-ui/core";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import intl from "react-intl-universal";

import useGetDefaultUBTConvertRate from "./useGetDefaultUBTConvertRate";

const validationSchema = yup.number().required();

const UBTCConverter = () => {
  const intlUBTCConverterTitle = intl
    .get("uBTCConverter.title")
    .defaultMessage("uBTC Converter");
  const intlUBTCConverterSwitchCurrency = intl
    .get("uBTCConverter.switchCurrency")
    .defaultMessage("Switch Currency positions");
  const intlUBTCConverterInvalidAmount = intl
    .get("uBTCConverter.invalidAmount")
    .defaultMessage("Invalid amount");

  const [valueToConvert, setValueToConvert] = useState(1);
  const [validationError, setValidationError] = useState("");
  const [isInversion, setIsInversion] = useState(false);

  const rate = useGetDefaultUBTConvertRate();

  const handleOnValueToConvertChange = async (e) => {
    const value = e.target.value.trim();
    const isValid = await validationSchema.isValid(value);
    if (isValid) {
      if (validationError) {
        setValidationError("");
      }
    } else {
      setValidationError(intlUBTCConverterInvalidAmount);
    }
    setValueToConvert(value);
  };

  const handleOnSwitchInverse = useCallback(() => {
    setIsInversion((v) => !v);
  }, [setIsInversion]);

  const convertedValue = validationError
    ? validationError
    : parseFloat(
        `${isInversion ? valueToConvert / rate : valueToConvert * rate}`
      ).toFixed(2);

  return rate ? (
    <Box border={"1px solid #DBDBDB"} borderRadius={"10px"} padding={2}>
      <Typography align="center" variant="h5">
        {intlUBTCConverterTitle}
      </Typography>
      <Box display="flex" justifyContent="space-around" alignItems="center">
        <Box flex={0.4}>
          <TextField
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {isInversion ? "USD" : "uBTC"}
                </InputAdornment>
              ),
            }}
            value={valueToConvert}
            onChange={handleOnValueToConvertChange}
          />
        </Box>
        <IconButton
          size="small"
          title={intlUBTCConverterSwitchCurrency}
          onClick={handleOnSwitchInverse}
        >
          <SwapHorizIcon />
        </IconButton>
        <Box flex={0.4}>
          <TextField
            variant={"outlined"}
            error={!!validationError}
            color={"secondary"}
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {isInversion ? "uBTC" : "USD"}
                </InputAdornment>
              ),
            }}
            value={`${convertedValue}`}
            disabled={true}
          />
        </Box>
      </Box>
    </Box>
  ) : null;
};

export default UBTCConverter;
