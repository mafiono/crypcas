import React from "react";

import { themeInDarkMode } from "../../helpers/theme";

// Category Icons
import category_baccarat from "../../images/icons/categories/baccarat.png";
import category_blackjack from "../../images/icons/categories/blackjack.png";
import category_casino from "../../images/icons/categories/casino.png";
import category_casino_holdem from "../../images/icons/categories/casino-holdem.png";
import category_deposit from "../../images/icons/categories/deposit.png";
import category_dragon_tiger from "../../images/icons/categories/dragon-tiger.png";
import category_evo_baccarat from "../../images/icons/categories/evo-baccarat.png";
import category_evo_blackjack from "../../images/icons/categories/evo-blackjack.png";
import category_evo_caribbean_stud from "../../images/icons/categories/evo-caribbean-stud.png";
import category_evo_casino_holdem from "../../images/icons/categories/evo-casino-holdem.png";
import category_evo_dragon_tiger from "../../images/icons/categories/evo-dragon-tiger.png";
import category_evo_money_wheel from "../../images/icons/categories/evo-money-wheel.png";
import category_evo_roulette from "../../images/icons/categories/evo-roulette.png";
import category_evo_texas_holdem_bonus from "../../images/icons/categories/evo-texas-holdem-bonus.png";
import category_evo_three_card_poker from "../../images/icons/categories/evo-three-card-poker.png";
import category_evo_ultimate_texas_holdem from "../../images/icons/categories/evo-ultimate-texas-holdem.png";
import category_favorite from "../../images/icons/categories/favorite.png";
import category_pennyslots from "../../images/icons/categories/pennyslots.png";
import category_promotions from "../../images/icons/categories/promotions.png";
import category_tournaments from "../../images/icons/categories/tournaments.png";
import category_featured from "../../images/icons/categories/featured.png";
import category_history from "../../images/icons/categories/history.png";
import category_history_play from "../../images/icons/categories/history-play.png";
import category_history_sport from "../../images/icons/categories/history-sport.png";
import category_hot from "../../images/icons/categories/hot.png";
import category_keno from "../../images/icons/categories/keno.png";
import category_live_casino from "../../images/icons/categories/live-casino.png";
import category_lottery from "../../images/icons/categories/lottery.png";
import category_new from "../../images/icons/categories/new.png";
import category_recent from "../../images/icons/categories/recent.png";
import category_roulette from "../../images/icons/categories/roulette.png";
import category_scratch from "../../images/icons/categories/scratch.png";
import category_slots from "../../images/icons/categories/slots.png";
import category_slots_video from "../../images/icons/categories/slots-video.png";
import category_top from "../../images/icons/categories/top.png";
import category_vbl from "../../images/icons/categories/vbl.png";
import category_vdr from "../../images/icons/categories/vdr.png";
import category_vfec from "../../images/icons/categories/vfec.png";
import category_vfl from "../../images/icons/categories/vfl.png";
import category_vflm from "../../images/icons/categories/vflm.png";
import category_vhc from "../../images/icons/categories/vhc.png";
import category_vto from "../../images/icons/categories/vto.png";
import category_withdraw from "../../images/icons/categories/withdraw.png";

// Supplier Icons
import supplier_betby from "../../images/icons/suppliers/betby.png";
import supplier_betradar from "../../images/icons/suppliers/betradar.png";
import supplier_betsoft from "../../images/icons/suppliers/betsoft.png";
import supplier_booming from "../../images/icons/suppliers/booming.png";
import supplier_booongo from "../../images/icons/suppliers/booongo.png";
import supplier_dw from "../../images/icons/suppliers/dw.png";
import supplier_endorphina from "../../images/icons/suppliers/endorphina.png";
import supplier_eurasian from "../../images/icons/suppliers/eurasian.png";
import supplier_evolution from "../../images/icons/suppliers/evolution.png";
import supplier_ezugi from "../../images/icons/suppliers/ezugi.png";
import supplier_gameart from "../../images/icons/suppliers/gameart.png";
import supplier_gamevy from "../../images/icons/suppliers/gamevy.png";
import supplier_gluck from "../../images/icons/suppliers/gluck.png";
import supplier_isoftbet from "../../images/icons/suppliers/isoftbet.png";
import supplier_kiron from "../../images/icons/suppliers/kiron.png";
import supplier_mascotgaming from "../../images/icons/suppliers/mascotgaming.png";
import supplier_mrslotty from "../../images/icons/suppliers/mrslotty.png";
import supplier_nucleus from "../../images/icons/suppliers/nucleus.png";
import supplier_platipus from "../../images/icons/suppliers/platipus.png";
import supplier_playson from "../../images/icons/suppliers/playson.png";
import supplier_pragmatic from "../../images/icons/suppliers/pragmatic.png";
import supplier_queenco from "../../images/icons/suppliers/queenco.png";
import supplier_spinomenal from "../../images/icons/suppliers/spinomenal.png";
import supplier_superspadegames from "../../images/icons/suppliers/superspadegames.png";
import supplier_tomhorn from "../../images/icons/suppliers/tomhorn.png";
import supplier_vivo from "../../images/icons/suppliers/vivo.png";
import supplier_wager2go from "../../images/icons/suppliers/wager2go.png";
import supplier_wbg from "../../images/icons/suppliers/wbg.png";
import supplier_onlyplay from "../../images/icons/suppliers/onlyplay.png";
import supplier_habanero from "../../images/icons/suppliers/habanero.png";
import supplier_evoplay from "../../images/icons/suppliers/evoplay.png";

// Supplier Icons (Specifically for Dark Mode)
import supplier_betsoft_dark from "../../images/icons/suppliers/dark/betsoft.png";
import supplier_dw_dark from "../../images/icons/suppliers/dark/dw.png";
import supplier_gameart_dark from "../../images/icons/suppliers/dark/gameart.png";
import supplier_kiron_dark from "../../images/icons/suppliers/dark/kiron.png";
import supplier_mascotgaming_dark from "../../images/icons/suppliers/dark/mascotgaming.png";
import supplier_pragmatic_dark from "../../images/icons/suppliers/dark/pragmatic.png";

// Map of 'badge' names to their icon
const iconMap = {
  baccarat: { icon: category_baccarat, invertForDM: true },
  blackjack: { icon: category_blackjack, invertForDM: true },
  casino: { icon: category_casino, invertForDM: true },
  "casino-holdem": { icon: category_casino_holdem, invertForDM: true },
  deposit: { icon: category_deposit, invertForDM: true },
  "dragon-tiger": { icon: category_dragon_tiger, invertForDM: true },
  "evo-baccarat": { icon: category_evo_baccarat, invertForDM: true },
  "evo-blackjack": { icon: category_evo_blackjack, invertForDM: true },
  "evo-caribbean-stud": {
    icon: category_evo_caribbean_stud,
    invertForDM: true,
  },
  "evo-casino-holdem": { icon: category_evo_casino_holdem, invertForDM: true },
  "evo-dragon-tiger": { icon: category_evo_dragon_tiger, invertForDM: true },
  "evo-money-wheel": { icon: category_evo_money_wheel, invertForDM: true },
  "evo-roulette": { icon: category_evo_roulette, invertForDM: true },
  "evo-texas-holdem-bonus": {
    icon: category_evo_texas_holdem_bonus,
    invertForDM: true,
  },
  "evo-three-card-poker": {
    icon: category_evo_three_card_poker,
    invertForDM: true,
  },
  "evo-ultimate-texas-holdem": {
    icon: category_evo_ultimate_texas_holdem,
    invertForDM: true,
  },
  favorite: { icon: category_favorite, invertForDM: true },
  pennyslots: { icon: category_pennyslots, invertForDM: true },
  promotions: { icon: category_promotions, invertForDM: true },
  tournaments: { icon: category_tournaments, invertForDM: true },
  featured: { icon: category_featured, invertForDM: true },
  history: { icon: category_history, invertForDM: true },
  "history-play": { icon: category_history_play, invertForDM: true },
  "history-sport": { icon: category_history_sport, invertForDM: true },
  hot: { icon: category_hot, invertForDM: true },
  keno: { icon: category_keno, invertForDM: true },
  "live-casino": { icon: category_live_casino, invertForDM: true },
  lottery: { icon: category_lottery, invertForDM: true },
  new: { icon: category_new, invertForDM: true },
  recent: { icon: category_recent, invertForDM: true },
  roulette: { icon: category_roulette, invertForDM: true },
  scratch: { icon: category_scratch, invertForDM: true },
  slots: { icon: category_slots, invertForDM: true },
  "slots-video": { icon: category_slots_video, invertForDM: true },
  sports: { icon: category_vfl, invertForDM: true },
  top: { icon: category_top, invertForDM: true },
  vbl: { icon: category_vbl, invertForDM: true },
  vdr: { icon: category_vdr, invertForDM: true },
  vfec: { icon: category_vfec, invertForDM: true },
  vfl: { icon: category_vfl, invertForDM: true },
  vflm: { icon: category_vflm, invertForDM: true },
  vhc: { icon: category_vhc, invertForDM: true },
  vto: { icon: category_vto, invertForDM: true },
  withdraw: { icon: category_withdraw, invertForDM: true },
  "logo-betby": { icon: supplier_betby },
  "logo-betradar": { icon: supplier_betradar },
  "logo-betsoft": { icon: supplier_betsoft, dark: supplier_betsoft_dark },
  "logo-booming": { icon: supplier_booming },
  "logo-booongo": { icon: supplier_booongo },
  "logo-dw": { icon: supplier_dw, dark: supplier_dw_dark },
  "logo-endorphina": { icon: supplier_endorphina },
  "logo-eurasian": { icon: supplier_eurasian },
  "logo-evolution": { icon: supplier_evolution },
  "logo-ezugi": { icon: supplier_ezugi },
  "logo-gameart": { icon: supplier_gameart, dark: supplier_gameart_dark },
  "logo-gamevy": { icon: supplier_gamevy },
  "logo-gluck": { icon: supplier_gluck },
  "logo-isoftbet": { icon: supplier_isoftbet },
  "logo-kiron": { icon: supplier_kiron, dark: supplier_kiron_dark },
  "logo-mascotgaming": {
    icon: supplier_mascotgaming,
    dark: supplier_mascotgaming_dark,
  },
  "logo-mrslotty": { icon: supplier_mrslotty },
  "logo-nucleus": { icon: supplier_nucleus },
  "logo-platipus": { icon: supplier_platipus },
  "logo-playson": { icon: supplier_playson },
  "logo-pragmatic": { icon: supplier_pragmatic, dark: supplier_pragmatic_dark },
  "logo-queenco": { icon: supplier_queenco },
  "logo-spinomenal": { icon: supplier_spinomenal },
  "logo-superspadegames": { icon: supplier_superspadegames },
  "logo-ssg": { icon: supplier_superspadegames },
  "logo-tomhorn": { icon: supplier_tomhorn },
  "logo-vivo": { icon: supplier_vivo },
  "logo-wager2go": { icon: supplier_wager2go },
  "logo-wbg": { icon: supplier_wbg },
  "logo-onlyplay": { icon: supplier_onlyplay },
  "logo-habanero": { icon: supplier_habanero },
  "logo-evoplay": { icon: supplier_evoplay },
};

function Icon(props) {
  // Get the src and badge properties
  const { src, badge } = props;

  const iconMapKey = badge && badge.replace(/^icon-/, "");
  const iconProps = iconMap[iconMapKey];

  // Image Stylings
  const imgStyle = {
    width: "100%",
    height: "100%",
    maxWidth: "100%",
    maxHeight: "100%",
  };

  if (iconProps) {
    // Get the icons properties
    const { icon, invertForDM, dark } = iconProps;
    // Use the 'icon' by default
    let useIcon = icon;
    // If in Dark Mode
    if (themeInDarkMode()) {
      // Is a specific icon specified for dark mode?
      if (dark) {
        // Use the dark-mode icon
        useIcon = dark;
      } else if (invertForDM) {
        // Invert the icons colour if in dark mode and invertForDM is true
        imgStyle.filter = "invert(1)";
      }
    }
    // Return the icon for the specified 'badge'
    return <img src={useIcon} alt={""} style={imgStyle} />;
  }
  // Return the fallback
  return <img src={src} alt={""} style={imgStyle} />;
}
export default Icon;
