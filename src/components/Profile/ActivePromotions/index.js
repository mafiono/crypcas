import React, { useEffect, useCallback, useState } from "react";
import { Box, Typography, LinearProgress, makeStyles } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";

import { getPromoHistory } from "../../../helpers/request";
import intl from "react-intl-universal";
import CancelPromotion from "./CancelPromotion";

const useStyles = makeStyles((theme) => ({
  flex: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #DBDBDB",
    borderRadius: "10px",
    padding: theme.spacing(2),
  },
  loader: {
    width: "50%",
    marginTop: theme.spacing(1),
  },
  listWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  groupHeader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    width: "100%",
  },
}));

const ActivePromotions = () => {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const sectionTitleIntl = intl
    .get("profile.deposit.ActivePromotion.sectionTitle")
    .defaultMessage("Your Active Promotions");

  const _fetchPromoHistory = useCallback(
    (page) => {
      getPromoHistory({
        status: "active",
        requestedPage: page - 1,
      })
        .then((res) => {
          const promoCodes = res.promoCodes
            ? res.promoCodes.sort((a, b) =>
                a.codeName.localeCompare(b.codeName)
              )
            : [];
          setCount(res.totalPages);
          setData(promoCodes);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [setCount, setData, setLoading]
  );

  useEffect(() => {
    _fetchPromoHistory(page);
  }, [_fetchPromoHistory, page]);

  const renderPromotion = useCallback((promotion) => {
    const { bonusType, minDeposit, depositMultiplier, maxReturn } = promotion;
    if (bonusType === 1) {
      return `${minDeposit} uBTC get ${depositMultiplier}% Bonus`;
    } else if (bonusType === 2) {
      return `${minDeposit} uBTC get ${maxReturn} Free Spins`;
    }
    return "";
  }, []);

  let title = "";

  return (
    !!count && (
      <Box className={classes.flex}>
        <Box mt={2}>
          <Typography variant="h5">{sectionTitleIntl}</Typography>
        </Box>
        {loading && (
          <LinearProgress className={classes.loader} color="primary" />
        )}
        <Box className={classes.listWrapper}>
          {data.reduce((acc, promotion, index) => {
            const item = (
              <Box key={promotion.codeId}>
                <Typography>* {renderPromotion(promotion)}</Typography>
              </Box>
            );
            const groupHeader = (
              <Box
                mt={1}
                key={`${promotion.codeName}-${index}`}
                className={classes.groupHeader}
              >
                <Typography variant="h6">{promotion.codeName}</Typography>
                <CancelPromotion
                  fetchPromoHistory={_fetchPromoHistory}
                  codeName={promotion.codeName}
                />
              </Box>
            );
            if (title !== promotion.codeName) {
              acc = [...acc, ...[groupHeader, item]];
              title = promotion.codeName;
            } else {
              acc = [...acc, ...[item]];
            }

            return acc;
          }, [])}
        </Box>
        {count > 1 && (
          <Box my={2}>
            <Pagination
              size="small"
              count={count}
              page={page}
              onChange={(e, value) => {
                setPage(value);
              }}
            />
          </Box>
        )}
      </Box>
    )
  );
};

export default ActivePromotions;
