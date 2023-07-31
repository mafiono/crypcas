import React, { useMemo } from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import UBTCtoUSD from "../reusable/UBTCConverter/UBTCtoUSD";
import { displayCurrency } from "../../helpers/currency";
import useGetBalance from "../../gql/useGetBalance";

const useStyles = makeStyles((theme) => ({
  ubtcToUsd: {
    fontSize: "0.75rem",
    opacity: 0.5,
  },
}));

const PlayerBalance = () => {
  const { data } = useGetBalance({
    pollInterval: 60000,
  });
  const classes = useStyles();

  const userBalance = useMemo(() => {
    if (data?.getBalance) {
      return displayCurrency(data.getBalance.balance, data.getBalance.currency);
    }
    return "...";
  }, [data]);

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Typography>{userBalance}</Typography>
      {data?.getBalance.currency === "UBTC" && (
        <UBTCtoUSD uBTCAmount={data?.getBalance.balance}>
          {(usdAmount) =>
            !!usdAmount && (
              <Typography className={classes.ubtcToUsd}>
                ({displayCurrency(usdAmount, "USD")})
              </Typography>
            )
          }
        </UBTCtoUSD>
      )}
    </Box>
  );
};

export default PlayerBalance;
