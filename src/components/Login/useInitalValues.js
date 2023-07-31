import { useMemo } from "react";

const useInitialValues = ({ recaptchaId, defaultValues = {} }) => {
  const init = useMemo(
    () =>
      recaptchaId
        ? {
            loginName: "",
            gRecaptchaResponse: "",
          }
        : { loginName: "" },
    [recaptchaId]
  );
  return { ...init, ...defaultValues };
};

export default useInitialValues;
