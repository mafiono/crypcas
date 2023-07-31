import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import intl from "react-intl-universal";
import { Box, Typography, Button, makeStyles } from "@material-ui/core";

import Loader from "../Loader";
import { getPaymentGroup } from "../../helpers/request";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
});

const ExpressCashOut = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    setLoading(true);
    getPaymentGroup()
      .then((res) => {
        setData(res);
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setLoading, setData, setError]);

  const notMemberTitleIntl = intl
    .get("expressCashOut.notMember.Title")
    .defaultMessage("Welcome to Express Cashout Beta");

  const notMemberDescIntl = intl.get("expressCashOut.notMember.Desc", {
    0: "fastbet@checkbetcasino.tech",
  })
    .defaultMessage(`If you are seeing this message you are not eligible yet for our Express Cashout program and
                            you can email support (fastbet@checkbetcasino.tech) to find out how you can become eligible
                            for this exclusive program.`);

  const memberDescIntl = intl
    .get("expressCashOut.member.Desc", { 0: data?.group })
    .defaultMessage(`You are member of ${data?.group} Express Cash Out group`);

  const navWithdraw = intl
    .get("account.nav.withdraw")
    .defaultMessage("Withdraw");

  return loading ? (
    <Box minHeight="70vh" className={classes.root} my={10}>
      <Loader />
    </Box>
  ) : (
    <Box minHeight="40vh" className={classes.root} my={10}>
      {error && <Typography> Sorry, can not fetch data</Typography>}
      {data && data.group === null && (
        <Box className={classes.root} width="55%">
          <Box my={4}>
            <Typography variant="h4" align="center">
              {notMemberTitleIntl}
            </Typography>
          </Box>
          <Typography align="center">{notMemberDescIntl}</Typography>
        </Box>
      )}
      {data && data.group !== null && (
        <Box className={classes.root}>
          <Box my={4}>{memberDescIntl}</Box>
          <Button
            component={Link}
            to="/profile/withdraw"
            variant="contained"
            color="primary"
          >
            {navWithdraw}
          </Button>
        </Box>
      )}
    </Box>
  );
};
export default ExpressCashOut;
