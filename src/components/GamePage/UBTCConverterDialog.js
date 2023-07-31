import React, { useCallback, useState } from "react";
import { Box, Button, Dialog, makeStyles } from "@material-ui/core";
import intl from "react-intl-universal";
import UBTCConverter from "../reusable/UBTCConverter";

const useStyles = makeStyles({
  root: {
    textTransform: "none",
  },
});

const UBTCConverterDialog = () => {
  const classes = useStyles();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, [setIsModalOpen]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  const intlCloseBtn = intl
    .get("generic.dialog.action.close")
    .defaultMessage("Close");
  const intlUBTCConverterTitle = intl
    .get("uBTCConverter.title")
    .defaultMessage("uBTC Converter");

  return (
    <>
      <Button
        classes={classes}
        color="primary"
        variant={"outlined"}
        onClick={handleOpenModal}
      >
        {intlUBTCConverterTitle}
      </Button>
      {isModalOpen && (
        <Dialog open={true} onClose={handleCloseModal}>
          <Box margin={2}>
            <UBTCConverter />
          </Box>
          <Box margin={2} display={"flex"} justifyContent={"flex-end"}>
            <Button
              color={"secondary"}
              variant={"contained"}
              size={"small"}
              onClick={handleCloseModal}
            >
              {intlCloseBtn}
            </Button>
          </Box>
        </Dialog>
      )}
    </>
  );
};

export default UBTCConverterDialog;
