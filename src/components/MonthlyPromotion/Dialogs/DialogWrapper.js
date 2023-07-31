import React from "react";
import useStyles from "./useStyles";
import { Box, Dialog } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const DialogWrapper = ({ children, onClose, ...rest }) => {
  const classes = useStyles();
  return (
    <Dialog open={true} onClose={onClose} {...rest}>
      <Box
        p={2}
        width={["75vw", "60vw", "50vw", "30vw", "20vw"]}
        minHeight={150}
      >
        <Box className={classes.root} minHeight={150}>
          <CloseIcon className={classes.closeBtn} onClick={onClose} />
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            width="90%"
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default DialogWrapper;
