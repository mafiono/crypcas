import useGetUBTConvertRate from "../../../gql/useGetUBTConvertRate";
import { useMemo } from "react";

const defaultAmount = 1000;

const useGetDefaultUBTConvertRate = () => {
  const { data } = useGetUBTConvertRate({
    variables: {
      currency: "USD",
      amount: 1000,
    },
    pollInterval: 1800 * 1000,
  });
  const amount = data?.getUBTConvertRate?.amount;

  return useMemo(() => {
    if (!amount) {
      return null;
    }
    return amount / defaultAmount;
  }, [amount]);
};

export default useGetDefaultUBTConvertRate;
