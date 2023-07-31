import React, { Component } from "react";
// import intl from 'react-intl-universal';
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import { Box, Divider, Grid } from "@material-ui/core";
import trustTrackerLogo from "../../../images/trusttracker/logo.png";
import trustTrackerLogoDark from "../../../images/trusttracker/logo_dark.png";
import bgaLogo from "../../../images/footer/be_gamble_aware.png";
import bgaLogoDark from "../../../images/footer/be_gamble_aware_dark.png";
import curacaoLogo from "../../../images/footer/curacao.png";
import curacaoLogoDark from "../../../images/footer/curacao_dark.png";
import agdLogo from "../../../images/footer/agd_badge_certified.png";
import askGamblersLogo from "../../../images/footer/AskGamblersRedLogo.svg";
import gamblersPickLogo from "../../../images/footer/gamblers_pick.png";
import gambleScopeLogo from "../../../images/footer/gamble_scope.svg";
import casinosAnalyzerLogo from "../../../images/footer/casinos_analyzer.png";
import { themeInDarkMode } from "../../../helpers/theme";
import Icon from "../../Icon";
import {
  getOperatorId,
  getTrustTrackerURL,
  getCuracao,
} from "../../../redux/selectors";
import ShowOnlyOn321 from "../../reusable/Visibility/ShowOnlyOn321";
import ShowOnlyOnRnR from "../../reusable/Visibility/ShowOnlyOnRnR";

const supplierBadges = [
  // 'logo-betby',
  // 'logo-betradar',
  "logo-betsoft",
  "logo-booming",
  "logo-booongo",
  // 'logo-dw',
  "logo-endorphina",
  "logo-eurasian",
  "logo-evolution",
  "logo-ezugi",
  // 'logo-gameart',
  // 'logo-gamevy',
  // 'logo-gluck',
  // 'logo-isoftbet',
  // 'logo-kiron',
  "logo-mascotgaming",
  "logo-mrslotty",
  // 'logo-nucleus',
  "logo-platipus",
  "logo-playson",
  // 'logo-pragmatic',
  // 'logo-queenco',
  "logo-spinomenal",
  "logo-superspadegames",
  // 'logo-tomhorn',
  // 'logo-vivo',
  "logo-wager2go",
  "logo-wbg",
  "logo-onlyplay",
  "logo-habanero",
  "logo-evoplay",
];

@connect((state) => ({
  operatorId: getOperatorId(state),
  trustTrackerURL: getTrustTrackerURL(state),
  curacao: getCuracao(state),
}))
@withStyles((theme) => ({
  // root: {
  //     color: theme.palette.secondary.main,
  // },
}))
class FooterLogos extends Component {
  render() {
    // Get the trust tracker properties
    const { operatorId, trustTrackerURL, curacao } = this.props;
    // Determine if trust tracker is enabled by checking if its properties are set
    const trustTrackerEnabled = !!(operatorId && trustTrackerURL);
    // Determine if the light/dark mode logo of trust tracker should be used
    const ttLogo = themeInDarkMode() ? trustTrackerLogoDark : trustTrackerLogo;
    const bLogo = themeInDarkMode() ? bgaLogoDark : bgaLogo;
    const cLogo = themeInDarkMode() ? curacaoLogoDark : curacaoLogo;
    // Get the Curacao Id
    const curacaoId = (curacao && curacao.siteId) || "";
    return (
      <>
        <Divider />
        <Box m={2} textAlign="center">
          <Box mb={2}>
            <Grid container justify="center" alignItems="center" spacing={2}>
              {/* Be Gamble Aware Logo */}
              <Grid item>
                <a href="https://www.begambleaware.org/">
                  <img
                    src={bLogo}
                    alt=""
                    style={{ maxWidth: "90vw", maxHeight: "50px" }}
                  />
                </a>
              </Grid>
              {/* Curacao License Logo */}
              <Grid item>
                <a
                  href={`https://licensing.gaming-curacao.com/validation/?lh=${curacaoId}`}
                >
                  <img
                    src={cLogo}
                    alt=""
                    style={{ maxWidth: "90vw", maxHeight: "100px" }}
                  />
                </a>
              </Grid>
              {/* Ask Gamblers Logo */}
              <ShowOnlyOn321>
                <Grid item>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.askgamblers.com/online-casinos/321crypto-casino-review"
                  >
                    <img
                      src={askGamblersLogo}
                      alt="Ask Gamblers Logo"
                      style={{ maxWidth: "90vw", maxHeight: "100px" }}
                    />
                  </a>
                </Grid>
              </ShowOnlyOn321>
              {/* Gamblers Pick Logo */}
              <ShowOnlyOn321>
                <Grid item>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.gamblerspick.com/online-casinos/321crypto-casino-review-r1811"
                  >
                    <img
                      src={gamblersPickLogo}
                      alt="Gamblers Pick Logo"
                      style={{ maxWidth: 250, maxHeight: "100px" }}
                    />
                  </a>
                </Grid>
              </ShowOnlyOn321>
              {/* Gamble Scope Logo */}
              <ShowOnlyOn321>
                <Grid item>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://gamblescope.com/casino/321cryptocasino.html"
                  >
                    <img
                      src={gambleScopeLogo}
                      alt="Gamble Scope Logo"
                      style={{
                        width: 200,
                        maxWidth: "90vw",
                        maxHeight: "100px",
                      }}
                    />
                  </a>
                </Grid>
              </ShowOnlyOn321>
              {/* Display the Trust Tracker logo, if enabled */}
              {/* TODO: Trust Tracker is temporary disabled. remove false if you want enable functionalities */}
              {true && trustTrackerEnabled && (
                <Grid item>
                  <a href="https://trusttracker.com/">
                    <img
                      src={ttLogo}
                      alt=""
                      style={{ maxWidth: "90vw", maxHeight: "100px" }}
                    />
                  </a>
                </Grid>
              )}
              {/* Affiliate Guard Dog */}
              <Grid item>
                <img
                  src={agdLogo}
                  alt=""
                  style={{ maxWidth: "90vw", maxHeight: "100px" }}
                />
              </Grid>
              {/*  BestBitcoinCasino On 321 */}
              <ShowOnlyOn321>
                <Grid item>
                  <a
                    title="Rated as BestBitcoinCasino"
                    href="https://www.bestbitcoincasino.com/review/321crypto-casino/"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-bbc-casino-id="33593"
                    data-bbc="BBC-SEAL3"
                  >
                    <img
                      title="Rated as BestBitcoinCasino"
                      src="https://www.bestbitcoincasino.com/wp-content/uploads/2021/08/Green-Seal-250x250-2.png"
                      alt="Rated as BestBitcoinCasino"
                      style={{ maxWidth: "90vw", maxHeight: "100px" }}
                    />
                  </a>
                </Grid>
              </ShowOnlyOn321>
              {/*  BestBitcoinCasino On RnR */}
              <ShowOnlyOnRnR>
                <Grid item>
                  <a
                    title="Rated as BestBitcoinCasino"
                    href="https://www.bestbitcoincasino.com/review/rocknrolla-casino/"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-bbc-casino-id="33669"
                    data-bbc="BBC-SEAL4"
                  >
                    <img
                      title="Rated as BestBitcoinCasino"
                      src="https://www.bestbitcoincasino.com/wp-content/uploads/2021/08/Green-Seal-250x250-2.png"
                      alt="Rated as BestBitcoinCasino"
                      style={{ maxWidth: "90vw", maxHeight: "100px" }}
                    />
                  </a>
                </Grid>
              </ShowOnlyOnRnR>
              {/*   Casinos Analyzer */}
              <Grid item>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://casinosanalyzer.com/free-slots-online"
                >
                  <img
                    src={casinosAnalyzerLogo}
                    alt="Casinos Analyzer Logo"
                    style={{ maxWidth: "90vw", maxHeight: "100px" }}
                  />
                </a>
              </Grid>
            </Grid>
          </Box>
          {/* Display the supplier logos */}
          <Grid container justify="center" spacing={2}>
            {supplierBadges.map((badge) => (
              <Grid key={badge} item>
                <Box style={{ width: "64px", height: "64px" }}>
                  <Icon badge={badge} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </>
    );
  }
}

export default FooterLogos;
