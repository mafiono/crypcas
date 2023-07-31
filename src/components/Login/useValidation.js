import { useMemo } from "react";
import * as yup from "yup";

const useValidation = ({ recaptchaId }) =>
  useMemo(
    () =>
      recaptchaId
        ? yup.object({
            loginName: yup
              .string("Enter your login")
              .required("Login is required"),
            gRecaptchaResponse: yup
              .string("Confirm Recaptcha")
              .required("Confirm Recaptcha is required"),
          })
        : yup.object({
            loginName: yup
              .string("Enter your login")
              .required("Login is required"),
          }),
    [recaptchaId]
  );

export default useValidation;
