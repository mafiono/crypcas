import { makeStyles } from "@material-ui/core";

export const useDialogStyles = makeStyles({
  paper: {
    overflowY: "inherit",
  },
});
const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    border: "1px solid #808080",
    position: "relative",
  },
  title: {
    maxWidth: "95%",
    color: "#FFF",
    fontSize: 25,
    fontWeight: 700,
    textAlign: "center",
    textTransform: "uppercase",
    overflowWrap: "break-word",
  },
  innerPtext: {
    "& p": {
      fontSize: 18,
      textAlign: "center",
      overflowWrap: "break-word",
    },
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    overflowWrap: "break-word",
  },
  loginBtn: {
    margin: "5% auto",
    width: 178,
  },
  closeBtn: {
    position: "absolute",
    top: "3%",
    right: "3%",
    zIndex: 9999,
    cursor: "pointer",
  },
  buttonClaim: {
    height: "40px",
    width: "178px",
    borderRadius: 5,
    backgroundColor: "#4EA84E",
    color: "#FFF",
    fontSize: "18px",
    fontWeight: 700,
    lineHeight: "22px",
    textAlign: "center",
  },
  tcLink: {
    color: "#FFF",
    fontSize: 12,
    textAlign: "center",
    cursor: "pointer",
    textTransform: "uppercase",
  },
});
export default useStyles;
