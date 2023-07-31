import React, { useMemo } from "react";
import intl from "react-intl-universal";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Button, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { displayCurrency } from "../../../helpers/currency";
import UBTCtoUSD from "../UBTCConverter/UBTCtoUSD";
import useGetBalance from "../../../gql/useGetBalance";

const useStyles = makeStyles((theme) => ({
  balanceTypography: {
    fontSize: "0.7rem",
    opacity: 0.5,
  },
  depositButton: {
    padding: "4px 10px",
    ...theme.custom.button.deposit,
  },
}));

const PlayerBalance = () => {
  const { data } = useGetBalance({
    pollInterval: 60000,
  });
  const classes = useStyles();
  const total = useMemo(() => {
    if (data?.getBalance?.balances?.totalBalance) {
      return displayCurrency(
        data.getBalance.balances.totalBalance.amount,
        data.getBalance.balances.totalBalance.currency
      );
    }
    return "";
  }, [data]);

  const totalBalance = intl
    .get("profile.balance.total", { 0: "" })
    .defaultMessage("Total Balance:");
  const navDeposit = intl.get("account.nav.deposit").defaultMessage("Deposit");

  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      justifyContent="center"
      alignItems="center"
      marginY={1}
    >
      <Box
        flex={1}
        display={"flex"}
        flexDirection={"row"}
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="body2">{totalBalance}</Typography>
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent="center"
          alignItems="center"
          marginX={1}
        >
          <Typography variant="body2">{total}</Typography>
          {data?.getBalance?.balances?.totalBalance.currency === "UBTC" && (
            <UBTCtoUSD
              uBTCAmount={data.getBalance.balances.totalBalance.amount}
            >
              {(usdAmount) =>
                !!usdAmount && (
                  <Typography
                    className={classes.balanceTypography}
                    variant="body2"
                  >
                    ({displayCurrency(usdAmount, "USD")})
                  </Typography>
                )
              }
            </UBTCtoUSD>
          )}
        </Box>
      </Box>

      <Button
        variant={"contained"}
        className={classes.depositButton}
        component={Link}
        to="/profile/deposit"
      >
        {navDeposit}
      </Button>
    </Box>
  );
};

export default PlayerBalance;
