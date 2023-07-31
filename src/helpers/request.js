import axios from "axios";
import md5 from "md5";
import store from "../redux/store";
import { siteProcess } from "../redux/slices/notifications";
import { signIn, signOut, updateUser } from "../redux/slices/user";
import {
  retrievedAllSettings,
  retrievedSection,
  setRecaptchaId,
} from "../redux/slices/main";
import { setLanguage as setLanguageAction } from "../redux/slices/language";

// export const baseURL = process.env.REACT_APP_BASE_URL || "/";
export const baseURL = 'http://whitelabel.casinowarehouse1.com:8080/casino-321';
// export const baseURL = 'http://localhost:8080/casino';

let activeUser = null;
let initialized = false;
let keepMeSignedIn = localStorage.keepMeSignedIn === "true";

const NOT_FOUND = -1;

// The path to send the user to upon successfully logging in
let loginRedirect = "";

export function consumeLoginRedirect() {
  const lr = loginRedirect;
  loginRedirect = "";
  return lr;
}

export function setLoginRedirect(path) {
  loginRedirect = path;
}

/**
 * Called in the App's Wrapper component upon mounting
 * returns a promise which is resolved upon completion
 * of all initial network calls (login, load games, etc)
 */
export function init() {
  // Only initialize once
  if (initialized) {
    return;
  }
  // Set the initialized flag
  initialized = true;

  // Check for ClickID
  window.checkCookie("ClickID");
  // Check for Promo
  const promo = window.getParameterByName("promo");
  if (promo) {
    localStorage.registerPromo = promo;
  }
  const forceLang = window.getParameterByName("force_lang");

  if (forceLang) {
    localStorage.locale = forceLang;
  }

  // List of all promises created in this function
  const promises = [];

  // Check if keepMeSignedIn is checked, and we have a token
  if (keepMeSignedIn && localStorage.token) {
    // Attempt to re-authenticate the previous session
    promises.push(syslogin(localStorage.token));
  }
  // Get all settings
  promises.push(loadSiteData());

  // Return the promises created bundled together
  return Promise.all(promises);
}

/**
 * Called by init above, and may also be called to reload site data, such as when changing the language.
 */
export function loadSiteData() {
  // List of all promises created in this function
  const promises = [];
  // Get all settings
  const allSettings = getAllSettings(localStorage.token);

  // For each section returned by "getAllSettings", get their contents
  promises.push(
    new Promise((sectionsResolved, sectionsReject) => {
      allSettings
        .then((res) => {
          const {
            googleAnalytics,
            sections,
            recaptcha_enabled,
            recaptcha_site_key,
          } = res;
          // Google Analytics
          initGA(googleAnalytics.siteId);
          // Crazy Egg
          initCrazyEgg();
          // Sections
          const sectionPromises = [];
          // Google Recaptcha (if specified, must be loaded before the site renders)
          if (recaptcha_enabled) {
            sectionPromises.push(initReCaptcha(recaptcha_site_key));
          }
          // Iterate over all the sections
          for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            // Add into the promises array
            sectionPromises.push(getSection(section.systemTag));
          }
          // Resolve this promise which was awaiting the response of "getAllSettings"
          Promise.all(sectionPromises)
            .then((res) => {
              sectionsResolved();
              return res;
            })
            .catch((res) => {
              sectionsReject("section");
              return res;
            });
          return res;
        })
        .catch((res) => {
          // Failed to get all settings...
          sectionsReject("all");
          return res;
        });
    })
  );

  // Return the promises created bundled together
  return Promise.all(promises);
}

function handleErrorCode(errorCode) {
  if (errorCode === 3200) {
    // Invalid Session Token
    localStorage.token = "";
  }
}

function setUser(responseObject) {
  // Check that the response object is not an error
  if (responseObject.errorCode) {
    handleErrorCode(responseObject.errorCode);
    return responseObject;
  }
  // This is a proper user object
  activeUser = responseObject;
  store.dispatch(signIn(activeUser));
  if (keepMeSignedIn && activeUser && activeUser.token) {
    localStorage.token = activeUser.token;
  }
  return activeUser;
}

function loggedOut(res) {
  activeUser = null;
  localStorage.token = "";
  store.dispatch(signOut());
  return res;
}

export function setKeepMeSignedIn(keepSignedIn) {
  // Update the Keep Me Signed In option
  keepMeSignedIn = keepSignedIn;
  localStorage.keepMeSignedIn = keepMeSignedIn;
  // Ensure the token is stored/cleared appropriately
  const token = (activeUser && activeUser.token) || "";
  localStorage.token = keepMeSignedIn ? token : "";
}

function objectToParams(data) {
  return (
    (data &&
      Object.entries(data)
        .map(([key, val]) => `${key}=${encodeURI(val)}`)
        .join("&")) ||
    ""
  );
}

// baseURL: '/casino', '/casino/api/site', '/casino/api/sys'
// headers: { 'Access-Control-Allow-Origin': '*' }
const instance = axios.create({
  timeout: 20000,
  baseURL,
});

/**
 * Used to execute every server call, provides a place to implement pre/post actions
 *
 * @param {Object} config
 */
function callServer(config) {
  const locale = localStorage.locale || "en";

  // Append the locale if it is not present
  if (config.url.indexOf("?") === NOT_FOUND) {
    config.url += `?locale=${locale}`;
  } else if (config.url.indexOf("locale=") === NOT_FOUND) {
    config.url += `&locale=${locale}`;
  }

  // Make the request
  return instance
    .request(config)
    .then(
      // Return the server response
      (response) => response.data
    )
    .catch((error) => {
      // Throw the servers response data
      // to be caught and handled further down
      throw error && error.response && error.response.data;
    });
}

// TODO: COMPLETE
export function search() {
  return callServer();
}

/**
 * Used to get the Balance for the current signed-in user
 */
export function getBalance() {
  return callServer({
    method: "post",
    url: "/api/site/get-balance",
    data: `sessionId=${activeUser && activeUser.token}`,
  });
}

/**
 * Used to get the users account history
 *
 * @param {Object} data
 */
export function getAccountHistory(data) {
  const { dateFrom, dateTo, page } = data;
  // const dateFrom = '2010-01-01';
  // const dateTo = '2020-12-31';
  // const page = 0;
  return callServer({
    method: "post",
    url: "/api/site/get-account-history",
    data: `sessionId=${
      activeUser && activeUser.token
    }&dateFrom=${dateFrom}&dateTo=${dateTo}&page=${page}`,
  });
}

/**
 * Used to get the users transaction history
 *
 * @param {Object} data
 */
export function getTransactionHistory(data) {
  const { dateFrom, dateTo, action, requestedPage, requestedRecords } = data;
  // const dateFrom = '2010-01-01';
  // const dateTo = '2020-12-31';
  // const action = ''; // DEPOSIT/WITHDRAW
  // const requestedPage = 0;
  // const requestedRecords = 10;
  return callServer({
    method: "post",
    url: "/api/site/get-transaction-history",
    data: `sessionId=${
      activeUser && activeUser.token
    }&dateFrom=${dateFrom}&dateTo=${dateTo}&action=${action}&requestedPage=${requestedPage}&requestedRecords=${requestedRecords}`,
  });
}

export function cancelTransaction(transactionId) {
  return callServer({
    method: "post",
    url: "api/site/payments/cancel-transaction",
    data: `sessionId=${
      activeUser && activeUser.token
    }&transactionId=${transactionId}`,
  });
}

export function getPaymentGroup() {
  return callServer({
    method: "post",
    url: "api/site/user/get-payment-group",
    data: `sessionId=${activeUser && activeUser.token}`,
  });
}

/**
 * Used to get the users round history
 *
 * @param {Object} data
 */
export function getRoundsHistory(data) {
  const { dateFrom, dateTo, page } = data;
  // const dateFrom = '2010-01-01';
  // const dateTo = '2020-12-31';
  // const page = 0;
  return callServer({
    method: "post",
    url: "/api/site/get-rounds-history",
    data: `sessionId=${
      activeUser && activeUser.token
    }&dateFrom=${dateFrom}&dateTo=${dateTo}&page=${page}`,
  });
}

/**
 * Used to get the users Cash Bonus History
 *
 * @param {Object} data
 */
export function getCashBonusHistory(data) {
  const { dateFrom, dateTo, requestedPage, requestedRecords } = data;
  // const dateFrom = '2010-01-01';
  // const dateTo = '2020-12-31';
  // const requestedPage = 0;
  // const requestedRecords = 10;
  return callServer({
    method: "post",
    url: "/api/site/bonuses/cash/list",
    data: `sessionId=${
      activeUser && activeUser.token
    }&dateFrom=${dateFrom}&dateTo=${dateTo}&requestedPage=${requestedPage}&requestedRecords=${requestedRecords}`,
  });
}

/**
 * Used to get the users Free Spin Bonus History
 *
 * @param {Object} data
 */
export function getFreeSpinBonusHistory(data) {
  const { dateFrom, dateTo, requestedPage, requestedRecords } = data;
  // const dateFrom = '2010-01-01';
  // const dateTo = '2020-12-31';
  // const requestedPage = 0;
  // const requestedRecords = 10;
  return callServer({
    method: "post",
    url: "/api/site/bonuses/freespins/list",
    data: `sessionId=${
      activeUser && activeUser.token
    }&dateFrom=${dateFrom}&dateTo=${dateTo}&requestedPage=${requestedPage}&requestedRecords=${requestedRecords}`,
  });
}

// TODO: COMPLETE
export function resetCache() {
  return callServer();
}

/**
 * Attempts to login if the user is not already logged in, otherwise returns the existing session.
 *
 * @param {String} username
 * @param {String} password
 * @param {String} recaptchaResponse
 */
export async function login(username, password, recaptchaResponse = "") {
  if (activeUser && activeUser.token) {
    const loginData = await syslogin(activeUser.token);
    if (loginData && loginData.loginName !== undefined) {
      return Promise.resolve(activeUser);
    }
  }
  password = password && md5(password);

  return callServer({
    method: "post",
    url: "/api/site/login",
    data: `login=${username}&password=${password}&g-recaptcha-response=${recaptchaResponse}`,
  }).then((res) => {
    // On successful login, reload site data (to get user-specific data)
    // Increment the processing count to provide loading notification
    store.dispatch(siteProcess(1));
    loadSiteData()
      .then(() => {
        // All calls successful (no longer processing)
        store.dispatch(siteProcess(-1));
      })
      .catch(() => {
        // One or more calls failed (no longer processing)
        store.dispatch(siteProcess(-1));
      });
    return setUser(res);
  });
}

/**
 * Attempts to logout if the user is logged in, otherwise returns false.
 */
export function logout() {
  if (!activeUser || !activeUser.token) {
    return Promise.resolve(false);
  }
  return callServer({
    method: "post",
    url: "/logout",
    data: `sessionId=${activeUser && activeUser.token}`,
  })
    .then((res) => {
      loadSiteData();
      return loggedOut(res);
    })
    .catch((res) => loggedOut(res));
}

/**
 * Used to re-authenticate a previous session.
 *
 * @param {String} token - an existing token to re-establish a session with
 */
export function syslogin(token) {
  return callServer({
    method: "post",
    url: "/api/site/syslogin",
    data: `sessionId=${token}`,
  })
    .then((res) => setUser(res))
    .catch((res) => {
      // TODO: Error Handling
      console.error(res);
    });
}

/**
 * Used to register a user in the system.
 *
 * @param {Object} data - contains key value pairs to post for registration
 */
export function register(data) {
  const body = JSON.stringify(data);

  return callServer({
    method: "post",
    url: "/api/site/register",
    data: body,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * Used to submit the Contact Us form
 *
 * @param {Object} data - contains key value pairs to post for registration
 */
export function submitContact(data) {
  return callServer({
    method: "post",
    url: "/api/site/support",
    data: objectToParams(data),
  });
}

/**
 * Obtains the list of available deposit/withdraw methods for the user
 */
export function getUserAvailablePaymentMethods() {
  return callServer({
    method: "post",
    url: "/api/site/payments/get-available-methods",
    data: `sessionId=${activeUser && activeUser.token}`,
  });
}

/**
 * Obtains the required details for a deposit/withdraw request.
 *
 * @param {String} action - 'deposit' or 'withdraw'
 * @param {String} methodLinkName - the link name of an available deposit/withdraw method (see: "getUserAvailablePaymentMethods")
 */
export function getPaymentSolutionDetails(action, methodLinkName) {
  return callServer({
    method: "post",
    url: "/api/site/payments/get-solution-details",
    data: `sessionId=${
      activeUser && activeUser.token
    }&action=${action}&methodLinkName=${methodLinkName}`,
  });
}

/**
 * Submits a deposit/withdraw request.
 *
 * @param {String} action - 'deposit' or 'withdraw'
 * @param {String} methodLinkName - the link name of an available deposit/withdraw method (see: "getUserAvailablePaymentMethods")
 * @param {Object} data - object containing the fields fetched from "getPaymentSolutionDetails"
 */
export function preparePayment(action, methodLinkName, data) {
  return callServer({
    method: "post",
    url: `/api/site/payments/prepare-payment?sessionId=${
      activeUser && activeUser.token
    }&action=${action}&methodLinkName=${methodLinkName}`,
    data,
  });
}

// TODO: COMPLETE
export function checkTransaction() {
  return callServer();
}

/**
 * Used to update the users password from what it currently is to a new one
 *
 * @param {Object} data
 */
export function changePassword(data) {
  data.oldPassword = md5(data.oldPassword);
  data.newPassword = md5(data.newPassword);
  data.newPasswordRepeat = md5(data.newPasswordRepeat);
  data.sessionId = activeUser && activeUser.token;

  return callServer({
    method: "post",
    url: "/api/site/user/change-password",
    data: objectToParams(data),
  });
}

export function setLanguage(languageCode) {
  return callServer({
    method: "post",
    url: "/api/site/user/set-language",
    data: `sessionId=${activeUser && activeUser.token}&lang=${languageCode}`,
  }).then(() => {
    store.dispatch(updateUser({ lang: languageCode }));
  });
}

/**
 * Used to restore an accounts password via an email token
 *
 * @param {Object} data - contains: token, email, password
 */
export function restoreAccount(data) {
  data.password = md5(data.password);
  return callServer({
    method: "post",
    url: "/api/site/user/confirm-password",
    data: objectToParams(data),
  });
}

/**
 * Attempts to verify the provided token for account activation.
 *
 * @param {String} token - the activation token to consume
 */
export function verifyEmail(token) {
  return callServer({
    method: "post",
    url: "/api/site/email-validation/",
    data: `token=${token}`,
  });
}

/**
 * Used to recover a password if a user forgets it.
 *
 * @param {String} loginName - the login name of the users account to request a password change for
 */
export function restorePassword({ loginName, recaptchaResponse }) {
  return callServer({
    method: "post",
    url: "/api/site/user/restore-password",
    data: `loginName=${loginName}&g-recaptcha-response=${recaptchaResponse}`,
  });
}

export function resendActivation({ loginName, recaptchaResponse }) {
  return callServer({
    method: "post",
    url: "/api/site/user/resend-activation",
    data: `loginName=${loginName}&g-recaptcha-response=${recaptchaResponse}`,
  });
}

// TODO: VERIFY
export function checkToken(token) {
  return callServer({
    method: "post",
    url: "/api/site/user/check-token",
    data: `token=${token}`,
  });
}

// TODO: COMPLETE
export function confirmPassword() {
  return callServer();
}

// TODO: COMPLETE
export function setRealityCheckInterval() {
  return callServer();
}

// TODO: COMPLETE
export function setUserLimits(limits) {
  return callServer({
    method: "post",
    url: `/api/site/user/set-limits?sessionId=${
      activeUser && activeUser.token
    }`,
    data: limits,
  });
}

// TODO: COMPLETE
export function getUserLimits() {
  return callServer({
    method: "post",
    url: "/api/site/user/get-limits",
    data: `sessionId=${activeUser && activeUser.token}`,
  });
}

// TODO: COMPLETE
export function activateUserLimits() {
  return callServer();
}

// TODO: COMPLETE
export function removeUserLimits(limits) {
  return callServer({
    method: "post",
    url: `/api/site/user/remove-limits?sessionId=${
      activeUser && activeUser.token
    }`,
    data: limits,
  });
}

/**
 * Link the users CR8 Account
 *
 * @param {Number} accountId - the users CR8 Account Id
 */
export function linkCR8Account(accountId) {
  return callServer({
    method: "post",
    url: "/api/site/user/set-cr8-account",
    data: `sessionId=${activeUser && activeUser.token}&accountId=${accountId}`,
  });
}

/**
 * Used to get the promotions displayed on the promotions page
 */
export function getPromoItems() {
  return callServer({
    method: "post",
    url: "/api/site/promo/get-items",
    data: `sessionId=${activeUser && activeUser.token}`,
  });
}

/**
 * Used to activate a specific promotion for the logged in user
 *
 * @param {String} code
 */
export function activatePromoCode(code) {
  return callServer({
    method: "post",
    url: "/api/site/promo/activate-code",
    data: `sessionId=${activeUser && activeUser.token}&promoCode=${code}`,
  });
}

export function getPromoHistory(data) {
  const parameter = objectToParams({
    ...data,
    ...(activeUser && activeUser.token
      ? {
          sessionId: activeUser.token,
        }
      : {}),
  });
  return callServer({
    method: "get",
    url: `/api/site/promo/get-history?${parameter}`,
    data: objectToParams(data),
  });
}

export function cancelPromotion(code) {
  return callServer({
    method: "post",
    url: `/api/site/promo/${code}/cancel`,
    data: `sessionId=${activeUser && activeUser.token}`,
  });
}

/**
 * Used to get the content of a static page (e.g. Terms and Conditions)
 *
 * @param {String} page
 */
export function getPage(page) {
  return callServer({
    method: "post",
    url: `/api/site/page/${page}`,
    data: `sessionId=${activeUser && activeUser.token}`,
  });
}

/**
 * Initial call to get all website settings
 */
export function getAllSettings(token) {
  return callServer({
    method: "post",
    url: "/api/site/settings/all",
    data: `sessionId=${(activeUser && activeUser.token) || token}`,
  }).then((res) => {
    store.dispatch(retrievedAllSettings(res));

    const forceLang = window.getParameterByName("force_lang");

    if (forceLang) {
      const language = (res.languages || []).find(
        (lng) => lng.code === forceLang
      );
      const lngFormatted = language && language.localeCode.replace("_", "-");
      lngFormatted && store.dispatch(setLanguageAction(lngFormatted));
    }

    return res;
  });
}

/**
 * Loads sections such as "Sportsbook", "Slots", etc.
 *
 * @param {Object} section
 */
export function getSection(section) {
  return callServer({
    method: "post",
    url: `/api/site/section/${section}`,
    data: `sessionId=${activeUser && activeUser.token}`,
  }).then((res) => {
    // Special Section Logic (Load the betby script)
    if (res.currentSection === "sports") {
      if (res.betby_betslip_url) {
        const betbyScript = document.createElement("script");
        betbyScript.src = res.betby_betslip_url;
        document.head.appendChild(betbyScript);
      }
    }
    // Dispatch the section retrieved
    store.dispatch(retrievedSection(res));
    return res;
  });
}

export function getDefaultPromotions(link) {
  return callServer({
    method: "post",
    url: link,
    data: `sessionId=${activeUser && activeUser.token}`,
  });
}

/**
 * Initializes google reCaptcha
 *
 * @param {String} reId - the google reCaptcha Id
 */
function initReCaptcha(reId) {
  return new Promise((reCaptchaResolved, reCaptchaReject) => {
    // Skip if invalid/dummy data
    if (!reId || reId === "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX") {
      // Recaptcha is not specified, resolve the promise immediately.
      reCaptchaResolved();
      return;
    }
    // Set the recaptchaId in the store
    store.dispatch(setRecaptchaId(reId));
    // Create a callback function googles recaptcha can execute to let us know it has loaded
    const globalCallbackName = `gr_${Date.now()}_OnLoad`;
    window[globalCallbackName] = function () {
      // Recaptcha has been loaded and called this callback, resolve the promise.
      reCaptchaResolved();
    };
    // Load the google tag manager
    const recScript = document.createElement("script");
    recScript.src = `https://www.google.com/recaptcha/api.js?onload=${globalCallbackName}&render=explicit`;
    document.head.appendChild(recScript);
    // Set a timeout to reject the promise if the recaptcha script hasn't loaded in 10 seconds.
    setTimeout(() => {
      reCaptchaReject();
    }, 10000);
  });
}

/**
 * Initializes google analytics
 *
 * @param {String} siteId - the google analytic id (XX-XXXXXXXXX-X)
 */
function initGA(siteId) {
  // Skip if invalid/dummy data, or initialized
  if (
    !siteId ||
    siteId === "XX-XXXXXXXXX-X" ||
    window.__gaInitialized === true
  ) {
    return;
  }
  // Load the google tag manager
  const gaScript = document.createElement("script");
  gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${siteId}`;
  document.head.appendChild(gaScript);
  // Initialize the data layer array
  window.dataLayer = window.dataLayer || [];
  window.gtag = () => window.dataLayer.push(arguments);
  window.gtag("js", new Date());
  window.gtag("config", siteId);
  window.__gaInitialized = true;
}

/**
 * Initializes crazy egg
 */
function initCrazyEgg() {
  const ceId = process.env.REACT_APP_CRAZY_EGG_ID;
  if (ceId) {
    // Skip if initialized
    if (window.__ceInitialized === true) {
      return;
    }
    // Load the google tag manager
    const ceScript = document.createElement("script");
    ceScript.src = `https://script.crazyegg.com/pages/scripts/${ceId}.js`;
    document.head.appendChild(ceScript);
    window.__ceInitialized = true;
  }
}

// Get query parameter by its key (name).
window.getParameterByName = function (name) {
  name = name.replace(/[[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
  const results = regex.exec(window.location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
};
// Create a cookie.
window.createCookie = function (cname, cvalue, daysToExpire) {
  const d = new Date();
  d.setTime(d.getTime() + daysToExpire * 24 * 60 * 60 * 1000);
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${cname}=${cvalue};${expires};path=/`;
};
// Get a cookie by its name
window.getCookie = function (cname) {
  // Create a variable (name) with the text to search for (cname + "=").
  const name = `${cname}=`;
  // Decode the cookie string, to handle cookies with special characters, e.g. '$'
  const decodedCookie = decodeURIComponent(document.cookie);
  // Split document.cookie on semicolons into an array called ca (ca = decodedCookie.split(';')).
  const ca = decodedCookie.split(";");
  // Loop through the ca array (i = 0; i < ca.length; i++), and read out each value c = ca[i]).
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    // If the cookie is found (c.indexOf(name) === 0), return the value of the cookie (c.substring(name.length, c.length).
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  // If the cookie is not found, return "".
  return "";
};
// INCOME ACCESS
window.checkCookie = function (cname) {
  // Check if cookie exists first
  let cvalue = window.getCookie(cname);
  // If it doesn't exist, we need to get it from the query paramater and set it.
  if (cvalue === "") {
    cvalue = window.getParameterByName(cname);
    // if query parameter exist
    if (cvalue) {
      // Create a cookie with the passed in name and with the value from the query parameter with the same name passed in and set it for 90 days.
      window.createCookie(cname, cvalue, 90);
    }
  }
  return window.getCookie(cname);
};
