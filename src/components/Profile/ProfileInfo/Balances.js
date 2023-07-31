import React, { useMemo } from "react";
import { Box, Divider, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import UBTCtoUSD from "../../reusable/UBTCConverter/UBTCtoUSD";
import { displayCurrency } from "../../../helpers/currency";
import intl from "react-intl-universal";
import useGetBalance from "../../../gql/useGetBalance";

const useStyles = makeStyles((theme) => ({
  marginBottom: {
    marginBottom: theme.spacing(1),
  },
  ubtcToUsd: {
    fontSize: "0.85rem",
    margin: theme.spacing(0, 1),
    opacity: 0.5,
  },
}));

const Balances = () => {
  const classes = useStyles();
  const { data } = useGetBalance({
    pollInterval: 60000,
  });
  const cash = useMemo(() => {
    if (data?.getBalance) {
      return displayCurrency(
        data?.getBalance.balances.cash.amount,
        data?.getBalance.balances.cash.currency
      );
    }
    return "";
  }, [data]);

  const bonus = useMemo(() => {
    if (data?.getBalance) {
      return displayCurrency(
        data?.getBalance.balances.bonus.amount,
        data?.getBalance.balances.bonus.currency
      );
    }
    return "";
  }, [data]);

  const freeSpins = useMemo(() => {
    if (data?.getBalance) {
      return displayCurrency(
        data?.getBalance.balances.freeSpins.amount,
        data?.getBalance.balances.freeSpins.currency
      );
    }
    return "";
  }, [data]);

  const total = useMemo(() => {
    if (data?.getBalance) {
      return displayCurrency(
        data?.getBalance.balances.totalBalance.amount,
        data?.getBalance.balances.totalBalance.currency
      );
    }
    return "";
  }, [data]);

  const balancesTitle = intl
    .get("profile.info.header.balances")
    .defaultMessage("Balances");
  const cashBalance = intl
    .get("profile.balance.cash", { 0: cash })
    .defaultMessage(`Cash: ${cash}`);
  const bonusBalance = intl
    .get("profile.balance.bonus", { 0: bonus })
    .defaultMessage(`Bonus: ${bonus}`);
  const freeSpinsBalance = intl
    .get("profile.balance.freeSpins", { 0: freeSpins })
    .defaultMessage(`Free Spins: ${freeSpins}`);
  const totalBalance = intl
    .get("profile.balance.total", { 0: total })
    .defaultMessage(`Total Balance: ${total}`);

  return (
    <>
      <Typography variant="h5">{balancesTitle}</Typography>
      <Divider className={classes.marginBottom} />
      <Box display={"flex"} justifyContent={"flex-start"} alignItems={"center"}>
        <Typography>{cashBalance}</Typography>
        {data?.getBalance.balances?.cash?.currency === "UBTC" && (
          <UBTCtoUSD uBTCAmount={data?.getBalance.balances?.cash?.amount || 0}>
            {(cashAmount) =>
              !!cashAmount && (
                <Typography className={classes.ubtcToUsd}>
                  ({displayCurrency(cashAmount, "USD")})
                </Typography>
              )
            }
          </UBTCtoUSD>
        )}
      </Box>
      <Box display={"flex"} justifyContent={"flex-start"} alignItems={"center"}>
        <Typography>{bonusBalance}</Typography>
        {data?.getBalance.balances?.bonus?.currency === "UBTC" && (
          <UBTCtoUSD uBTCAmount={data?.getBalance.balances?.bonus?.amount || 0}>
            {(bonusAmount) =>
              !!bonusAmount && (
                <Typography className={classes.ubtcToUsd}>
                  ({displayCurrency(bonusAmount, "USD")})
                </Typography>
              )
            }
          </UBTCtoUSD>
        )}
      </Box>
      <Box display={"flex"} justifyContent={"flex-start"} alignItems={"center"}>
        <Typography>{freeSpinsBalance}</Typography>
        {data?.getBalance.balances?.freeSpins?.currency === "UBTC" && (
          <UBTCtoUSD
            uBTCAmount={data?.getBalance.balances?.freeSpins?.amount || 0}
          >
            {(usdFreeSpins) =>
              !!usdFreeSpins && (
                <Typography className={classes.ubtcToUsd}>
                  ({displayCurrency(usdFreeSpins, "USD")})
                </Typography>
              )
            }
          </UBTCtoUSD>
        )}
      </Box>
      <Box display={"flex"} justifyContent={"flex-start"} alignItems={"center"}>
        <Typography>{totalBalance}</Typography>
        {data?.getBalance.balances?.totalBalance?.currency === "UBTC" && (
          <UBTCtoUSD
            uBTCAmount={data?.getBalance.balances?.totalBalance?.amount || 0}
          >
            {(usdTotalBalance) =>
              !!usdTotalBalance && (
                <Typography className={classes.ubtcToUsd}>
                  ({displayCurrency(usdTotalBalance, "USD")})
                </Typography>
              )
            }
          </UBTCtoUSD>
        )}
      </Box>
    </>
  );
};

export default Balances;
