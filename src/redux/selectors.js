// --------------------------------------------------
// --------------------------------------------------
// ---------------------- Main ----------------------
// All game and category information
export const getAllGames = (store) => store.main._games;
export const getHomeGames = (store) => store.main._homeGames;
export const getAllGameIdMap = (store) => store.main._gameIdMap;
export const getAllGameSystemMap = (store) => store.main._gameSystemMap;
export const getAllCategories = (store) => store.main._categories;
export const getRecaptchaId = (store) => store.main.recaptchaId;

// Game and category information for the currently active section
export const getGames = (store) => store.main.games;
export const getGameIdMap = (store) => store.main.gameIdMap;
export const getGameSystemMap = (store) => store.main.gameSystemMap;
export const getCategories = (store) => store.main.categories;

// Supplier information
export const getSuppliers = (store) => store.main.suppliers;

// Slide information for the top banner
export const getSlides = (store) => store.main.slides;
export const getSlideDuration = (store) => Number(store.main.slideDuration);

// Section information
export const getSections = (store) => store.main.sections;
export const getSectionMap = (store) => store.main.sectionMap;
export const getCurrentSection = (store) => store.main.currentSection;

// Registration information
export const getRegisterFormType = (store) => store.main.site_registrationForm;

// Lists of available information from the CMS
export const getLanguages = (store) => store.main.languages;
export const getCurrencies = (store) => store.main.currencies;
export const getCountries = (store) => store.main.countries;

// Contains static page information (pages linked in the footer)
export const getStaticPages = (store) => store.main.pages;
export const getStaticPageMap = (store) => store.main.pageMap;
export const getCopyright = (store) => store.main.site_copyright;

// The array of newsletters for the "Blog" section
export const getNewsletters = (store) => store.main.newsletter;

// The header collapsed state (if true, header should not be visible)
export const getHeaderCollapsed = (store) => store.main.headerCollapsed;

// Sportsbook
export const getSportsbook = (store) => store.main.sportsbook;

// Curacao
export const getCuracao = (store) => store.main.curacao;

// Trust Tracker
export const getOperatorId = (store) => store.main.trusttracker_operator_id;
export const getTrustTrackerURL = (store) => store.main.trusttracker_api_url;

// --------------------------------------------------
// --------------------------------------------------
// ----------------- Notifications ------------------
export const getProcessing = (store) => store.notifications.processing;
export const getSnackbarOpen = (store) => store.notifications.snackbarOpen;
export const getSnackbarMsg = (store) => store.notifications.snackbarMsg;
export const getFirstTimeLoginDialogOpen = (store) =>
  store.notifications.firstTimeLoginDialogOpen;
export const getInvalidLoginCode = (store) =>
  store.notifications.invalidLoginCode;

// --------------------------------------------------
// --------------------------------------------------
// -------------------- Language --------------------
export const getLanguage = (store) => store.language;

// --------------------------------------------------
// --------------------------------------------------
// ---------------------- User ----------------------
export const getUser = (store) => store.user;

// --------------------------------------------------
// --------------------------------------------------
// -------------------- History ---------------------
export const getFilter = (store) => store.history.filter;
