import { useState, useCallback } from "react";
import intl from "react-intl-universal";

import { activatePromoCode } from "../../helpers/request";

const useActivatePromotion = (code) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const errorIntl = intl
    .get("monthlyPromotion.activeEvent.errorMSG")
    .defaultMessage("Sorry, can not activate promotion");

  const activateRequest = useCallback(() => {
    setLoading(true);
    activatePromoCode(code)
      .then((res) => {
        setData(res);
      })
      .catch(() => {
        setError(errorIntl);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setLoading, setError, setData, code, errorIntl]);

  return {
    loading,
    error,
    data,
    activateRequest,
  };
};

export default useActivatePromotion;
