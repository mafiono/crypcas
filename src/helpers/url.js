/**
 * Given an image path, this function determines if it should point to origin.
 *
 * @param {String} url - the path to the image asset to display
 */
export function imageUrl(url) {
  // Init the new url as the provided url
  let newUrl = url;
  // Get the Base Urls
  const baseTrail = process.env.REACT_APP_BASE_URL_TRAIL;
  const newBase = process.env.REACT_APP_BASE_IMAGE_URL;
  // If the new base url is defined, replace the newUrl's base with it
  if (newBase) {
    // http:// (4) https:// (5)
    const cssIndex = newUrl.indexOf("://");
    if (cssIndex < 6) {
      // Strip the colon slash slash and everything before
      newUrl = newUrl.substring(cssIndex + 3);
      // Strip the first slash and everything before
      const slashIndex = newUrl.indexOf("/");
      if (slashIndex !== -1) {
        newUrl = newUrl.substring(slashIndex + 1);
      }
      // Strip the base trail (casino) portion if the url starts with it
      const urlTrail = newUrl.indexOf(baseTrail);
      if (urlTrail === 0) {
        newUrl = newUrl.substring(urlTrail + baseTrail.length);
      }
      // Ensure the newUrl starts with a slash, before appending to the base
      if (newUrl.charAt(0) !== "/") {
        newUrl = `/${newUrl}`;
      }
      // Append the new base url
      newUrl = newBase + newUrl;
    }
  }
  return newUrl;
}
