import React, { Component } from "react";
import intl from "react-intl-universal";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import { Grid, Hidden, Typography, Box } from "@material-ui/core";
import { Link } from "react-router-dom";
import { footerLogo } from "../../helpers/images";
import { getStaticPages } from "../../redux/selectors";
import FooterLogos from "./FooterLogos";
import { themeInDarkMode } from "../../helpers/theme";
import btcLogo from "../../images/icons/payments/bitcoin-btc-logo.png";
import bchLogo from "../../images/icons/payments/bitcoin-cash-bch-logo.png";
import ethLogo from "../../images/icons/payments/ethereum-eth-logo.png";
import ltcLogo from "../../images/icons/payments/litecoin-ltc-logo.png";
import usdtLogo from "../../images/icons/payments/tether-usdt-logo.png";
import chainlinkLogo from "../../images/icons/payments/chainlink_logo.png";
import dogecoinLogo from "../../images/icons/payments/dogecoin_logo.png";
import xrpLogo from "../../images/icons/payments/xrp_logo.png";
import xrpLogoDark from "../../images/icons/payments/xrp_logo_dark.png";
import bnbLogo from "../../images/icons/payments/binance-coin-bnb-logo.png";
import xmrLogo from "../../images/icons/payments/monero-xmr-logo.png";
import trxLogo from "../../images/icons/payments/tron-trx-logo.png";
import vergeLogo from "../../images/icons/payments/verge-xvg-logo.png";
import zilliqaZilLogo from "../../images/icons/payments/zilliqa-zil-logo.png";
import cscSymbolGreen from "../../images/icons/payments/csc_symbol_green.png";

@connect((state) => ({
  staticPages: getStaticPages(state),
}))
@withStyles((theme) => ({
  root: {
    borderTop: `2px solid ${theme.palette.divider}`,
  },
  partPaymentMethods: {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6, 3, 6, 10),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(4, 3),
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2, 1),
    },
  },
  partCompanyLinks: {
    color: "white",
    backgroundColor: "black",
    padding: theme.spacing(6, 10, 6, 3),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(4, 3),
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2, 1),
    },
    [theme.breakpoints.down("xs")]: {
      textAlign: "center",
    },
  },
  logo: {
    height: "192px",
  },
  whiteLink: {
    color: "white",
    textDecoration: "none",
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  svg: {
    fill: theme.palette.text.primary,
  },
}))
class PaymentMethods extends Component {
  /**
   * Renders a link
   * @param {Object} item - an object containing a link and title
   */
  renderItem(item) {
    const { classes } = this.props;
    if (item) {
      let link = (
        <Link to={item.link} className={classes.whiteLink}>
          <Typography variant="subtitle1">{item.title}</Typography>
        </Link>
      );
      if (item.link.startsWith("http")) {
        link = (
          <a href={item.link} className={classes.whiteLink}>
            <Typography variant="subtitle1">{item.title}</Typography>
          </a>
        );
      }
      return (
        <Grid item xs>
          {link}
        </Grid>
      );
    }
    return (
      <Grid item xs>
        &nbsp;
      </Grid>
    );
  }

  /**
   * Used to render items in a two column layout
   * @param {Array} pair - an array containing two items to render
   */
  renderPair(pair) {
    const link1 = pair[0] && pair[0].link;
    const link2 = pair[1] && pair[1].link;
    const key = `${link1}${link2}`;

    return (
      <Grid key={key} item container spacing={2}>
        {this.renderItem(pair[0])}
        {this.renderItem(pair[1])}
      </Grid>
    );
  }

  renderLHS() {
    const paymentMethodsTitle = intl
      .get("footer.paymentMethods.title")
      .defaultMessage("Payment Methods");
    const paymentMethodsDesc = intl
      .get("footer.paymentMethods.description", {
        0: "12",
        1: "250",
        2: "100000",
      })
      .defaultMessage(
        'We process all withdrawals within {0} hours, with the exception of our "Express Cashout Club" withdrawals, which are processed immediately.  Minimum deposits and withdrawals are {1} uBTC and maximum deposits and withdrawals are {2} uBTC'
      );

    const iconStyle = { maxWidth: "32px", maxHeight: "32px" };
    const xrp = themeInDarkMode() ? xrpLogoDark : xrpLogo;

    return (
      <>
        <Grid item>
          <Typography variant="h4">{paymentMethodsTitle}</Typography>
          <Typography variant="body1">{paymentMethodsDesc}</Typography>
        </Grid>
        <Grid item>
          <Box mt={1} />
        </Grid>
        <Grid item container spacing={1} justify="space-around">
          <Grid item>
            {/* CSC */}
            <img src={cscSymbolGreen} alt="csc" style={iconStyle} />
          </Grid>
          <Grid item>
            {/* bch */}
            <img src={btcLogo} alt="" style={iconStyle} />
          </Grid>
          <Grid item>
            {/* btc */}
            <img src={bchLogo} alt="" style={iconStyle} />
          </Grid>
          <Grid item>
            {/* eth */}
            <img src={ethLogo} alt="" style={iconStyle} />
          </Grid>
          <Grid item>
            {/* ltc */}
            <img src={ltcLogo} alt="" style={iconStyle} />
          </Grid>
          <Grid item>
            {/* usdt */}
            <img src={usdtLogo} alt="" style={iconStyle} />
          </Grid>
          <Grid item>
            {/* chainlink */}
            <img src={chainlinkLogo} alt="" style={iconStyle} />
          </Grid>
          <Grid item>
            {/* dogecoin */}
            <img src={dogecoinLogo} alt="" style={iconStyle} />
          </Grid>
          <Grid item>
            {/* xrp */}
            <img src={xrp} alt="" style={iconStyle} />
          </Grid>
          <Grid item>
            {/* binance */}
            <img src={bnbLogo} alt="" style={iconStyle} />
          </Grid>
          <Grid item>
            {/* monero */}
            <img src={xmrLogo} alt="" style={iconStyle} />
          </Grid>
          <Grid item>
            {/* tron */}
            <img src={trxLogo} alt="" style={iconStyle} />
          </Grid>
          <Grid item>
            {/* Verge */}
            <img src={vergeLogo} alt="" style={iconStyle} />
          </Grid>
          <Grid item>
            {/* Zilliqa Zil */}
            <img src={zilliqaZilLogo} alt="" style={iconStyle} />
          </Grid>
        </Grid>
      </>
    );
  }

  renderLinks() {
    const { staticPages } = this.props;

    const navAffiliates = intl
      .get("footer.nav.affiliates")
      .defaultMessage("Affiliates");
    const navSupport = intl
      .get("footer.nav.support")
      .defaultMessage("Support / Contact");

    const links = [];
    // Create a link for each static page
    staticPages.forEach((page) => {
      links.push({ link: `/page/${page.alias}`, title: page.title });
    });
    // Add a link for the Support page
    links.push({ link: "/support", title: navSupport });
    // Add a link for the Affiliates Link
    links.push({ link: "https://afs.rnraffiliates.com", title: navAffiliates });

    // Pair the links together for a two column layout
    const pairs = [];
    for (let i = 0; i < links.length; i += 2) {
      const linkA = i < links.length && links[i];
      const linkB = i + 1 < links.length && links[i + 1];
      pairs.push([linkA, linkB]);
    }

    // Render each pair of links
    return pairs.map((pair) => this.renderPair(pair));
  }

  renderXS() {
    const { classes } = this.props;

    return (
      <>
        {/* TOP */}
        <Grid
          container
          direction="column"
          justify="space-between"
          alignItems="center"
          className={classes.partPaymentMethods}
        >
          {this.renderLHS()}
        </Grid>
        {/* BOTTOM */}
        <Box className={classes.partCompanyLinks}>
          <Grid container>{this.renderLinks()}</Grid>
          <Grid container justify="center">
            <Grid item>
              <img src={footerLogo} alt="logo" className={classes.logo} />
            </Grid>
          </Grid>
        </Box>
      </>
    );
  }

  renderSMMD() {
    const { classes } = this.props;

    return (
      <>
        {/* TOP */}
        <Grid
          container
          direction="column"
          justify="space-between"
          alignItems="center"
          className={classes.partPaymentMethods}
        >
          {this.renderLHS()}
        </Grid>
        {/* BOTTOM */}
        <Grid
          container
          justify="center"
          alignItems="center"
          className={classes.partCompanyLinks}
        >
          <Grid item xs container>
            {this.renderLinks()}
          </Grid>
          <Grid item>
            <img src={footerLogo} alt="logo" className={classes.logo} />
          </Grid>
        </Grid>
      </>
    );
  }

  renderLG() {
    const { classes } = this.props;

    return (
      <Grid container>
        {/* LHS */}
        <Grid
          item
          xs
          container
          direction="column"
          justify="space-between"
          alignItems="center"
          className={classes.partPaymentMethods}
        >
          {this.renderLHS()}
        </Grid>
        {/* RHS */}
        <Grid
          item
          xs
          container
          justify="center"
          alignItems="center"
          className={classes.partCompanyLinks}
        >
          <Grid item xs container>
            {this.renderLinks()}
          </Grid>
          <Grid item>
            <img src={footerLogo} alt="logo" className={classes.logo} />
          </Grid>
        </Grid>
      </Grid>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Hidden smUp>{this.renderXS()}</Hidden>
        <Hidden xsDown lgUp>
          {this.renderSMMD()}
        </Hidden>
        <Hidden mdDown>{this.renderLG()}</Hidden>
        <FooterLogos />
      </div>
    );
  }
}

export default PaymentMethods;
