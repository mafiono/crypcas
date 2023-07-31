import { get, uniq } from "lodash";

const isBrand321 = process.env.REACT_APP_BRAND_EXT === "-321";

const initialize = ({
  defaultFilter,
  categories,
  games,
  allGames,
  homeGames,
  gameIdMap,
  sectionMap,
  currentSection,
  route,
}) => {
  const { pathname } = (route && route.location) || {};
  const homePage = pathname === undefined || pathname.length <= 1;

  const pathMatch = pathname && pathname.match(/\/games\/(.+)/);
  let part = pathMatch && pathMatch[1];
  if (!part) {
    part = get(
      sectionMap[currentSection],
      ["gamesListData", "categoryList", "0", "category", "systemTag"],
      ""
    );
  }

  // Determine what to use for the home page games list
  const homePageGameList =
    (homeGames && homeGames.length && homeGames) || allGames;

  // Get the game list
  let _games = homePage ? homePageGameList : games;
  // Update games list appropriately
  if (!homePage && part) {
    // Get the current sections game list data
    const categoryLists = get(
      sectionMap[currentSection],
      ["gamesListData", "categoryList"],
      []
    );
    // Filter the category lists down to the one whose system tag matches the part from the url "/games/{part}"
    const lists =
      categoryLists &&
      categoryLists.filter(
        (categoryItem) => get(categoryItem, ["category", "systemTag"]) === part
      );
    // If there was a match, use its games list
    if (lists && lists.length) {
      // Using the matching games list for the order, pull the game objects from the map.
      const gamesToMap = lists[0].games;
      _games =
        gamesToMap &&
        gamesToMap.map((game) => gameIdMap[`id_${game.id}`] || game);
    }
  } else {
    // Use the game data provided from gameIdMap if applicable
    _games = _games && _games.map((game) => gameIdMap[`id_${game.id}`] || game);
  }
  // Filter out any games that are not enabled
  _games = _games && _games.filter((game) => game.enabled);

  const title = homePage ? "" : get(categories, ["tag", part], "");
  const sectionGames = _games;

  let filterable = false;
  let filterOptions = [];
  let filter = "all";

  // Determine if this list can be filtered by provider. The provider is property added in /src/redux/slices/main.js
  const providers =
    (sectionGames &&
      uniq(
        sectionGames
          .filter((game) => !!game.provider)
          .map((game) => game.provider)
      )) ||
    [];
  if (providers.length > 1) {
    filterable = true;
    filterOptions = providers.map((provider) => ({
      name: provider,
      label: provider,
    }));
  }
  // If a filter was remembered, check if it is a valid option, if so apply the filter
  filter = (providers.includes(defaultFilter) && defaultFilter) || "all";
  const filteredGames =
    filter === "all"
      ? sectionGames
      : sectionGames && sectionGames.filter((game) => game.provider === filter);

  return {
    filteredGames,
    sectionGames,
    title,
    filter,
    filterable,
    filterOptions,
  };
};

const initialize321 = ({
  defaultFilter,
  categories,
  games,
  gameIdMap,
  sectionMap,
  currentSection,
  route,
}) => {
  const { pathname } = (route && route.location) || {};

  const pathMatch = pathname && pathname.match(/\/games\/(.+)/);
  let part = pathMatch && pathMatch[1];
  if (!part) {
    part = get(
      sectionMap[currentSection],
      ["gamesListData", "categoryList", "0", "category", "systemTag"],
      ""
    );
  }

  // Get the game list
  let _games = games;

  // Get the current sections game list data
  const categoryLists = get(
    sectionMap[currentSection],
    ["gamesListData", "categoryList"],
    []
  );
  // Filter the category lists down to the one whose system tag matches the part from the url "/games/{part}"
  const lists =
    categoryLists &&
    categoryLists.filter(
      (categoryItem) => get(categoryItem, ["category", "systemTag"]) === part
    );
  // If there was a match, use its games list
  if (lists && lists.length) {
    // Using the matching games list for the order, pull the game objects from the map.
    const gamesToMap = lists[0].games;
    _games =
      gamesToMap &&
      gamesToMap.map((game) => gameIdMap[`id_${game.id}`] || game);
  }

  // Filter out any games that are not enabled
  _games = _games && _games.filter((game) => game.enabled);

  const title = get(categories, ["tag", part], "");
  const sectionGames = _games;

  let filterable = false;
  let filterOptions = [];
  let filter = "all";

  // Determine if this list can be filtered by provider. The provider is property added in /src/redux/slices/main.js
  const providers =
    (sectionGames &&
      uniq(
        sectionGames
          .filter((game) => !!game.provider)
          .map((game) => game.provider)
      )) ||
    [];
  if (providers.length > 1) {
    filterable = true;
    filterOptions = providers.map((provider) => ({
      name: provider,
      label: provider,
    }));
  }
  // If a filter was remembered, check if it is a valid option, if so apply the filter
  filter = (providers.includes(defaultFilter) && defaultFilter) || "all";
  const filteredGames =
    filter === "all"
      ? sectionGames
      : sectionGames && sectionGames.filter((game) => game.provider === filter);

  return {
    filteredGames,
    sectionGames,
    title,
    filter,
    filterable,
    filterOptions,
  };
};

const isEnabledFeature = false;

const forExport = isEnabledFeature && isBrand321 ? initialize321 : initialize;

export default forExport;
