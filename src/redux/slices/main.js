import { createSlice } from "@reduxjs/toolkit";
import { get, union } from "lodash";

// Each providers different prefix
const systemIdPrefixes = [
  ["BS", "Betsoft"],
  ["BG", "Booming Games"],
  ["BO_PS_", "Playson"],
  ["BO", "Booongo"],
  ["DW", "DW Games"],
  ["EN", "Endorphina"],
  ["EA", "EURASIAN Gaming"],
  ["MC", "Mascot Games"],
  ["MS", "MrSlotty"],
  ["PL", "Platipus"],
  ["PP", "Pragmatic"],
  ["SP", "Spinomenal"],
  ["SS", "Super Spade Games"],
  ["VI_TH_", "Tom Horn Games"],
  ["VI", "Vivo"],
  ["WG", "Wager2Go"],
  ["WB", "Wild Bunch Gaming"],
  ["OP", "Onlyplay"],
  ["EZ_EV_", "Evo"],
  ["PT", "Playstar"],
  ["HN", "Habanero"],
  ["EP", "Evoplay"],
];

const initialState = {
  // --------------------------------------------------
  // -------------------- New Data --------------------
  headerCollapsed: false,
  sectionMap: {},
  sectionMeta: {},
  sportsbook: null,
  recaptchaId: null,

  // The current active sections games/categories
  games: [],
  categories: {},
  gameIdMap: {},
  gameSystemMap: {},

  // The total unique games/categories across all sections
  _games: [],
  _gameIdMap: {},
  _categories: {},
  _gameSystemMap: {},
  _homeGames: null,

  // --------------------------------------------------
  // --- "api/site/settings/all" API Response Items ---
  languages: [],
  googleAnalyticsSiteId: "",
  suppliers: [],
  currentLocale: "",
  currentSection: "",
  socialMediaIcons: [],
  countries: [],
  slideDuration: "",
  sections: [],
  site_copyright: "",
  site_logo: "",
  curacao: {},
  pages: [],
  googleAnalytics: {},
  site_registrationForm: "",
  paymentMethods: [],
  site_logoEnabled: "",
  affiliate_tracking_domain: "",
  site_enableLeftMenu: "",
  site_gamesView: "",
  currencies: [],

  // -------------------------------------------------------------
  // --- "api/site/section/${section-name}" API Response Items ---
  slides: [],
};

const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    retrievedAllSettings: (state, action) => {
      // This method simply overwrites the state with everything returned by the "all settings" API
      const { sections, pages } = action.payload;
      // Set the current section to the first one found
      let currentSection = get(sections, [0, "systemTag"], "");

      // if the current section is sportsbook or home, get the next section
      let nextSection = 1;
      while (currentSection === "sportsbook" || currentSection === "home") {
        currentSection = get(sections, [nextSection++, "systemTag"], "");
      }

      let i;
      const sectionMap = {};
      for (i = 0; i < sections.length; i++) {
        const section = sections[i];
        sectionMap[section.systemTag] = section;
      }

      const pageMap = {};
      for (i = 0; i < pages.length; i++) {
        const page = pages[i];
        pageMap[page.alias] = page;
      }

      const newState = {
        ...state,
        ...action.payload,
        sectionMap,
        currentSection,
        pageMap,
      };
      return newState;
    },
    retrievedSection: (state, action) => {
      // This method constructs the games, categories, and slides objects
      const { slides, currentSection, metaTags, gamesListData } =
        action.payload;
      // If this is the sportsbook section
      if (currentSection === "sports") {
        return {
          ...state,
          sportsbook: { ...action.payload },
        };
      }
      // If this is the home section
      if (currentSection === "home") {
        return {
          ...state,
          _homeGames: get(gamesListData, ["categoryList", 0, "games"], null),
        };
      }
      // If it's missing information
      if (!slides || !currentSection || !metaTags || !gamesListData) {
        return {
          ...state,
        };
      }
      // Initialize the new state with the current states properties
      const newState = {
        ...state,
      };

      // Slides
      if (!(newState.slides && newState.slides.length)) {
        newState.slides = slides;
      }

      // Section MetaTags
      if (currentSection && metaTags) {
        const sectionMeta = {
          ...newState.sectionMeta,
        };
        sectionMeta[currentSection] = metaTags;
        newState.sectionMeta = sectionMeta;
      }

      // Games
      const sectionCategories = {};
      const newCategories = {
        ...newState._categories,
      };
      const sectionGameIdMap = {};
      const newGameIdMap = {
        ...newState._gameIdMap,
      };
      const sectionGameSystemMap = {};
      const newGameSystemMap = {
        ...newState._gameSystemMap,
      };
      const { categoryList } = gamesListData;
      // Iterate each category
      if (categoryList && categoryList.length) {
        for (let i = 0; i < categoryList.length; i++) {
          const categoryItem = categoryList[i];
          // Get the Category info
          const { category } = categoryItem;
          // Check if the category is enabled
          if (category.enabled) {
            // NOTE [category.type] was replaced with ['tag']
            // Check if the categories group exists
            if (!newCategories["tag"]) {
              // Does not exist, create the category group (special/tag/provider)
              newCategories["tag"] = {};
            }
            // Add this category to its respective group
            newCategories["tag"] = {
              ...newCategories["tag"],
              [category.systemTag]: category.label,
            };

            // ----- REPEAT FOR SECTION INFO -----

            // Check if the categories group exists
            if (!sectionCategories["tag"]) {
              // Does not exist, create the category group (special/tag/provider)
              sectionCategories["tag"] = {};
            }
            // Add this category to its respective group
            sectionCategories["tag"] = {
              ...sectionCategories["tag"],
              [category.systemTag]: category.label,
            };
          }
          // Get the Cateogry games
          if (categoryItem.games) {
            // Iterate over each game in the category
            for (let ii = 0; ii < categoryItem.games.length; ii++) {
              // Get the game
              const game = categoryItem.games[ii];
              // Check if the game is enabled
              if (game.enabled) {
                const existing = newGameIdMap[`id_${game.id}`];
                // Get or initialize the game object to update
                const updatedGame = {
                  ...(existing || game),
                };
                // If the game had already been encountered, union their ribbons
                if (
                  existing &&
                  Array.isArray(game.ribbons) &&
                  game.ribbons.length
                ) {
                  updatedGame.ribbons = union(
                    updatedGame.ribbons,
                    game.ribbons
                  );
                }
                // Update the games info
                if (category.type === "special") {
                  // Add unique specials (new, top, etc)
                  updatedGame.special = union(updatedGame.special || [], [
                    category.systemTag,
                  ]);
                } else if (category.type === "tag") {
                  // Add unique tags (slot, casino, etc)
                  updatedGame.tags = union(updatedGame.tags || [], [
                    category.systemTag,
                  ]);
                }
                // If there is no provider, determine which it is
                if (!updatedGame.provider) {
                  for (let iii = 0; iii < systemIdPrefixes.length; iii++) {
                    const [prefix, provider] = systemIdPrefixes[iii];
                    if (updatedGame.systemId.startsWith(prefix)) {
                      // Set provider
                      updatedGame.provider = provider;
                      break;
                    }
                  }
                }
                // Set the game
                newGameIdMap[`id_${game.id}`] = updatedGame;
                newGameSystemMap[`id_${game.systemId}`] = updatedGame;
                // Section game info
                sectionGameIdMap[`id_${game.id}`] = updatedGame;
                sectionGameSystemMap[`id_${game.systemId}`] = updatedGame;
              }
            }
          }
        }
      }
      // Set all games info
      newState._categories = newCategories;
      newState._gameIdMap = newGameIdMap;
      newState._gameSystemMap = newGameSystemMap;
      newState._games = Object.values(newGameIdMap);

      // Section Map - add game info
      const newSectionMap = {
        ...newState.sectionMap,
      };
      if (currentSection && gamesListData) {
        newSectionMap[currentSection] = {
          ...newSectionMap[currentSection],
          gamesListData,
          categories: sectionCategories,
          gameIdMap: sectionGameIdMap,
          gameSystemMap: sectionGameSystemMap,
          games: Object.values(sectionGameIdMap),
        };
        // This retrieved section is the default selected section
        // so set the active section as the displayable games
        if (currentSection === newState.currentSection) {
          newState.categories = sectionCategories;
          newState.gameIdMap = sectionGameIdMap;
          newState.gameSystemMap = sectionGameSystemMap;
          newState.games = Object.values(sectionGameIdMap);
        }
      }
      newState.sectionMap = newSectionMap;

      // Return the updated state
      return newState;
    },
    setCurrentSection: (state, action) => {
      // This method sets the current section
      const { categories, gameIdMap, gameSystemMap, games } =
        state.sectionMap[action.payload];

      const newState = {
        ...state,
        categories,
        gameIdMap,
        gameSystemMap,
        games,
        currentSection: action.payload,
      };
      return newState;
    },
    setHeaderCollapsed: (state, action) => {
      // This method sets the headerCollapsed property
      const newState = {
        ...state,
        headerCollapsed: action.payload,
      };
      return newState;
    },
    setRecaptchaId: (state, action) => {
      // This method sets the recaptchaId
      const newState = {
        ...state,
        recaptchaId: action.payload,
      };
      return newState;
    },
  },
});

export const {
  retrievedAllSettings,
  retrievedSection,
  setCurrentSection,
  setHeaderCollapsed,
  setRecaptchaId,
} = mainSlice.actions;

export default mainSlice.reducer;
