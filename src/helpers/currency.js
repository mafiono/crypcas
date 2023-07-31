/**
 * Given an amount and currency, returns a string to display.
 *
 * @param {string} amount - the numerical value
 * @param {String} currency - the shorthand currency (i.e. USD, uBTC, etc)
 */
export function displayCurrency(amount, currency) {
  try {
    // Throws an exception if the provided locale is not correct
    amount = Number(amount).toLocaleString(localStorage.lang, {
      maximumFractionDigits: 20,
    });
  } catch (e) {
    // en-US is known to be valid
    amount = Number(amount).toLocaleString("en-US", {
      maximumFractionDigits: 20,
    });
  }
  return currency ? `${amount} ${currency}` : amount;
}
