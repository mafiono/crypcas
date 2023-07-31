import React from "react";
import useGetDefaultUBTConvertRate from "./useGetDefaultUBTConvertRate";

const UBTCtoUSD = ({ children, uBTCAmount }) => {
  const rate = useGetDefaultUBTConvertRate();
  return (
    <>{children(rate ? parseFloat(`${uBTCAmount * rate}`).toFixed(2) : 0)}</>
  );
};

export default UBTCtoUSD;
