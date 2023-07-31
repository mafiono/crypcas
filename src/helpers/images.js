import { useMemo } from "react";
// Define the image folder contained within /public
const imageFolder = `${process.env.PUBLIC_URL}/assets/images${process.env.REACT_APP_BRAND_EXT}/`;

// Constants for the various brands
const BRAND_RNR = "";
const BRAND_321 = "-321";

// Specify default filenames
let preloader_Logo_Filename = "logo.png";
let preloader_LogoSecondaryLight_Filename = "logo_text.png";
let preloader_LogoSecondaryDark_Filename = "logo_text_white.png";
let footer_Logo_Filename = "logo.png";
let ad_Placeholder_Filename = "logo.png";
let header_LogoLight_Filename = "logo_text.png";
let header_LogoDark_Filename = "logo_text_white.png";
let logo72_Filename = "logo72.png";
let logo192_Filename = "logo192.png";
let logo512_Filename = "logo512.png";

// Dynamically customize filenames for brands
if (process.env.REACT_APP_BRAND_EXT === BRAND_RNR) {
  // Rock N Rolla
  preloader_Logo_Filename = "logo256-chip-text.png";
  preloader_LogoSecondaryLight_Filename = "logo_text.png";
  preloader_LogoSecondaryDark_Filename = "logo_text_white.png";
  footer_Logo_Filename = "logo256-chip-text.png";
  ad_Placeholder_Filename = "logo256-chip-text.png";
} else if (process.env.REACT_APP_BRAND_EXT === BRAND_321) {
  // 321 Crypto Casino
  preloader_Logo_Filename = "logo256-circular-border.png";
  preloader_LogoSecondaryLight_Filename = "logo_text_black.png";
  preloader_LogoSecondaryDark_Filename = "logo.png";
  footer_Logo_Filename = "favicon-192x192.png";
  ad_Placeholder_Filename = "favicon-192x192.png";
  header_LogoLight_Filename = "logo_text_black.png";
  header_LogoDark_Filename = "logo.png";
  logo72_Filename = "favicon-72x72.png";
  logo192_Filename = "favicon-192x192.png";
  logo512_Filename = "favicon-512x512.png";
}

// Export the Logo's

// Generic Logo Sizes
export const logo72 = `${imageFolder}${logo72_Filename}`;
export const logo192 = `${imageFolder}${logo192_Filename}`;
export const logo512 = `${imageFolder}${logo512_Filename}`;

// Preloader
export const preloaderLogo = `${imageFolder}${preloader_Logo_Filename}`;
export const preloaderLogoSecondaryLight = `${imageFolder}${preloader_LogoSecondaryLight_Filename}`;
export const preloaderLogoSecondaryDark = `${imageFolder}${preloader_LogoSecondaryDark_Filename}`;
// Error Page (for if the loading process fails)
export const errorLogo = preloaderLogo;

// Header Bar
export const headerLogoLight = `${imageFolder}${header_LogoLight_Filename}`;
export const headerLogoDark = `${imageFolder}${header_LogoDark_Filename}`;

// Mobile Sidebar
export const mobileIconLogo = logo72;

// Footer Logo
export const footerLogo = `${imageFolder}${footer_Logo_Filename}`;

// Banner Filler (when a banner does not have an image, this is displayed)
export const bannerFillerImage = logo512;

// Category Filler (when a category does not have an icon, this is displayed)
export const categoryFillerImage = logo72;

// Game Card Placeholder Image
export const gameCardPlaceholderImage = logo192;
// Game Row Placeholder Image
export const gameRowPlaceholderImage = logo192;

// Background Ghost Logo (Found on pages: Support, Login, Register, Profile, RestoreAccount)
export const backgroundGhostLogo = logo512;

// Ad Placeholder Image (Found on pages: Login, Register)
export const adPlaceholderImage = `${imageFolder}${ad_Placeholder_Filename}`;

// Profile Image
export const profileImage = logo192;

// MonthlyPromotion Images hook

export const useMonthlyPromotionImages = (viewName) =>
  useMemo(
    () => ({
      activeEvent: `${imageFolder}monthlyPromotion/${viewName}/active-event.png`,
      bgImage: `${imageFolder}monthlyPromotion/${viewName}/bg-image.png`,
      bgImageMobile: `${imageFolder}monthlyPromotion/${viewName}/background-mobile.jpg`,
      bgTitle: `${imageFolder}monthlyPromotion/${viewName}/bg-title.png`,
      futureEvent: `${imageFolder}monthlyPromotion/${viewName}/future-event.png`,
      pastEvent: `${imageFolder}monthlyPromotion/${viewName}/past-event.png`,
      textPromotion: `${imageFolder}monthlyPromotion/${viewName}/text-promotion.svg`,
      titleText: `${imageFolder}monthlyPromotion/${viewName}/title-text.png`,
    }),
    [viewName]
  );
