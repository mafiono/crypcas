// common locale data
require("intl/locale-data/jsonp/en.js");
require("intl/locale-data/jsonp/es.js");
require("intl/locale-data/jsonp/fr.js");
require("intl/locale-data/jsonp/ru.js");
require("intl/locale-data/jsonp/hr.js");
require("intl/locale-data/jsonp/fi.js");
require("intl/locale-data/jsonp/de.js");
require("intl/locale-data/jsonp/hi.js");
require("intl/locale-data/jsonp/ko.js");
require("intl/locale-data/jsonp/pt.js");
require("intl/locale-data/jsonp/tr.js");
require("intl/locale-data/jsonp/it.js");
require("intl/locale-data/jsonp/pl.js");
require("intl/locale-data/jsonp/zh.js");

const bundleFolder = `bundles${process.env.REACT_APP_BRAND_EXT}`;

// app locale data
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  "en-US": require(`./${bundleFolder}/en-US.json`), // English
  "es-ES": require(`./${bundleFolder}/es-ES.json`), // Spanish
  "fr-FR": require(`./${bundleFolder}/fr-FR.json`), // French
  "ru-RU": require(`./${bundleFolder}/ru-RU.json`), // Russian
  "hr-HR": require(`./${bundleFolder}/hr-HR.json`), // Croatian
  "fi-FI": require(`./${bundleFolder}/fi-FI.json`), // Finnish
  "de-DE": require(`./${bundleFolder}/de-DE.json`), // German
  "hi-HI": require(`./${bundleFolder}/hi-HI.json`), // Hindi
  "ko-KO": require(`./${bundleFolder}/ko-KO.json`), // Korean
  "pt-PT": require(`./${bundleFolder}/pt-PT.json`), // Portuguese
  "tr-TR": require(`./${bundleFolder}/tr-TR.json`), // Turkish
  "it-IT": require(`./${bundleFolder}/it-IT.json`), // Italian
  "pl-PL": require(`./${bundleFolder}/pl-PL.json`), // Polish
  "zh-CN": require(`./${bundleFolder}/zh-CN.json`), // Chinese (Simplified)
  "zh-TW": require(`./${bundleFolder}/zh-TW.json`), // Chinese (Traditional)
};
