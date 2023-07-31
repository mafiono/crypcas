import { createTheme } from "@material-ui/core/styles";
// import { blue } from '@material-ui/core/colors';

// Constants for the various brands
// const BRAND_RNR = '';
const BRAND_321 = "-321";

// Background
const lightBackgroundPaper = "#FFFFFF";
const lightBackgroundDefault = "#DBDBDB";
let darkBackgroundPaper = "#424242";
let darkBackgroundDefault = "#303030";
let profileGradientLHS =
  "linear-gradient(135deg, rgba(24,10,53,1) 0%, rgba(22,80,90,1) 100%)";

// Dynamically customize filenames for brands
if (process.env.REACT_APP_BRAND_EXT === BRAND_321) {
  darkBackgroundPaper = "#121212";
  darkBackgroundDefault = "#070707";
  profileGradientLHS =
    "linear-gradient(135deg, rgba(22,22,22,1) 0%, rgba(44,44,44,1) 100%)";
}

/**
 * ========== Typography ==========
 * Title: Baskerville
 * Body: AvenirNext
 * Tag: GeorgiaBold
 */
//  import/no-anonymous-default-export
export default (darkMode) =>
  createTheme({
    typography: {
      fontFamily: "AvenirNext, serif",
      h1: { fontFamily: "BrandonBold, serif" },
      h2: { fontFamily: "BrandonBold, serif" },
      h3: { fontFamily: "BrandonBold, serif" },
      h4: { fontFamily: "BrandonBold, serif" },
      h5: { fontFamily: "BrandonBold, serif" },
      h6: { fontFamily: "BrandonBold, serif" },
    },
    palette: {
      type: darkMode ? "dark" : "light",
      primary: {
        // main: '#17B073', // green
        main: "#ff6600", // orange
        contrastText: "#fff",
      },
      secondary: {
        main: "#FF3535",
        contrastText: "#fff",
      },
      background: {
        paper: darkMode ? darkBackgroundPaper : lightBackgroundPaper,
        default: darkMode ? darkBackgroundDefault : lightBackgroundDefault,
      },
    },
    custom: {
      size: {
        headerHeight: "96px",
        footerHeight: "58px",
      },
      color: {
        gold: "#EBAB50",
      },
      button: {
        black: {
          color: "#fff",
          backgroundColor: "#1A1A1A",
          "&:hover": {
            backgroundColor: "#000000",
          },
        },
        gold: {
          color: "#fff",
          backgroundColor: "#EBAB50",
          "&:hover": {
            backgroundColor: "#BD8940",
          },
        },
        deposit: {
          color: "#fff",
          backgroundColor: "#22bc22",
          "&:hover": {
            backgroundColor: "#22bc22",
          },
        },
      },
    },
    profileGradientLHS,
    hexToRGB: (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(
            result[3],
            16
          )}`
        : null;
    },
  });
