import React, { useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";

import { Box, Typography } from "@material-ui/core";

import { getUser } from "../../redux/selectors";

import useFetchPromotion from "./useFetchPromotion";

import Days from "./Days";
import ActiveEventsDialog from "./Dialogs/ActiveEvent";
import PastEventDialog from "./Dialogs/PastEvent";
import FutureEventDialog from "./Dialogs/FutureEvent";
import LoginDialog from "./Dialogs/Login";
import Header from "./Header";
import Loader from "../Loader";

const MonthlyPromotion = () => {
  const user = useSelector(getUser);
  const isLogged = useMemo(() => user.signedIn, [user]);

  const { loading, error, data } = useFetchPromotion();
  const { promoItems, serverTime } = data;

  const [selectedActive, setSelectedActive] = useState(null);
  const [selectedPast, setSelectedPast] = useState(null);
  const [selectedFuture, setSelectedFuture] = useState(null);

  const handleOnSelectedActive = useCallback(
    (id) => {
      const selected = promoItems.find((item) => item.id === id);
      setSelectedActive(selected || null);
    },
    [promoItems]
  );
  const handleOnSelectedPast = useCallback((id) => {
    setSelectedPast(id);
  }, []);
  const handleOnSelectedFuture = useCallback((id) => {
    setSelectedFuture(id);
  }, []);

  return (
    <>
      <Header />
      {loading && (
        <Box my={10} minHeight="264px">
          <Loader />
        </Box>
      )}
      {error && <Typography>{error}</Typography>}
      {!error && !loading && serverTime && promoItems && (
        <Days
          promoItems={promoItems}
          activeOnClick={handleOnSelectedActive}
          pastOnClick={handleOnSelectedPast}
          futureOnClick={handleOnSelectedFuture}
          serverTime={serverTime}
        />
      )}

      {selectedActive && isLogged && (
        <ActiveEventsDialog
          onClose={() => handleOnSelectedActive(null)}
          {...selectedActive}
        />
      )}
      {selectedActive && !isLogged && (
        <LoginDialog onClose={() => handleOnSelectedActive(null)} />
      )}
      {selectedPast && (
        <PastEventDialog onClose={() => handleOnSelectedPast(null)} />
      )}
      {selectedFuture && (
        <FutureEventDialog onClose={() => handleOnSelectedFuture(null)} />
      )}
    </>
  );
};

export default MonthlyPromotion;
