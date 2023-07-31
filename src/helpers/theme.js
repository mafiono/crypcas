// Define the function used to determine if light or dark mode
const isLightMode = () => localStorage.theme === "light";

// Export functions which can be used to check if the theme is currently in light or dark mode
export const themeInLightMode = () => isLightMode();
export const themeInDarkMode = () => !isLightMode();
