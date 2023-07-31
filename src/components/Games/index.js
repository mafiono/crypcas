import React, { Component } from "react";
import intl from "react-intl-universal";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import memoizeOne from "memoize-one";
import { SizeMe } from "react-sizeme";
import {
  Divider,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Box,
  Hidden,
  // Typography,
} from "@material-ui/core";
import {
  getCategories,
  getSuppliers,
  getGames,
  getAllGames,
  getHomeGames,
  getGameIdMap,
  getSectionMap,
  getCurrentSection,
  getSections,
  getFilter,
} from "../../redux/selectors";
import { setFilter } from "../../redux/slices/history";
import { setCurrentSection } from "../../redux/slices/main";
import { defaultCardWidth } from "../GameCard";
import Searchable from "../reusable/Searchable";
import GameGrid from "./Grid";

import Sections from "./Sections";

import initialize from "./initialize";

@connect(
  (state) => ({
    categories: getCategories(state),
    suppliers: getSuppliers(state),
    games: getGames(state),
    allGames: getAllGames(state),
    homeGames: getHomeGames(state),
    gameIdMap: getGameIdMap(state),
    sectionMap: getSectionMap(state),
    currentSection: getCurrentSection(state),
    sections: getSections(state),
    historicFilter: getFilter(state),
  }),
  { setFilter, setCurrentSection }
)
@withStyles((theme) => ({
  root: {
    margin: theme.spacing(3, 10),
    [theme.breakpoints.down("md")]: {
      margin: theme.spacing(2, 5),
    },
    [theme.breakpoints.down("sm")]: {
      margin: theme.spacing(1, 1),
    },
    // color: theme.palette.secondary.main,
  },
  marginBottom: {
    marginBottom: theme.spacing(1),
  },
  loadingMore: {
    padding: theme.spacing(2, 0),
    textAlign: "center",
  },
}))
class Games extends Component {
  state = {
    games: [],
    allGames: [],
    title: "",
    filter: "all",
    filterable: false,
    filterOptions: [],
  };

  initialize(defaultFilter) {
    const {
      categories,
      games,
      allGames,
      homeGames,
      gameIdMap,
      sectionMap,
      currentSection,
      route,
    } = this.props;
    const {
      title,
      filter,
      filterable,
      filterOptions,
      filteredGames,
      sectionGames,
    } = initialize({
      games,
      allGames,
      homeGames,
      gameIdMap,
      sectionMap,
      currentSection,
      route,
      categories,
      defaultFilter,
    });

    // Set the State!
    this.setState({
      games: filteredGames,
      allGames: sectionGames,
      title,
      filter,
      filterable,
      filterOptions,
    });
  }

  componentDidMount() {
    this.initialize(this.props.historicFilter);
  }

  componentDidUpdate(prevProps) {
    // if any properties have changed, and the filter is not the same, re-initialize
    const filterUpdate =
      prevProps !== this.props &&
      this.state.filter !== this.props.historicFilter;
    // if any of these properties have changed, re-initialize
    const mainUpdate =
      prevProps.route !== this.props.route ||
      prevProps.categories !== this.props.categories ||
      prevProps.suppliers !== this.props.suppliers ||
      prevProps.games !== this.props.games;
    // Check if we should re-initialize
    if (filterUpdate) {
      // A new filter has been provided, re-initialize with a default filter provided
      this.initialize(this.props.historicFilter);
    } else if (mainUpdate) {
      // New game information was provided (changed category/section), re-initialize without a default filter (show all)
      this.initialize();
    }
  }

  makeFilterChange() {
    return (e) => {
      const { setFilter } = this.props;
      const { allGames } = this.state;
      const { value: filter } = e.target;
      const games =
        filter === "all"
          ? allGames
          : allGames && allGames.filter((game) => game.provider === filter);
      setFilter(filter);
      this.setState({ filter, games });
    };
  }

  memoizeFilterChange = memoizeOne(this.makeFilterChange);

  renderSections() {
    const { currentSection, sections, route, setCurrentSection } = this.props;

    return (
      <Sections
        sections={sections}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        route={route}
      />
    );
  }

  render() {
    // const { autoLoadMore } = this.props;
    const { classes } = this.props;
    const {
      games,
      // allGames,
      // title,
      filter,
      filterable,
      filterOptions,
    } = this.state;

    const autoLoadMore = false;

    let filterDOM = null;
    // let count = games.length;

    if (filterable) {
      const providerFilterAll = intl
        .get("games.filter.allProviders")
        .defaultMessage("All Providers");
      filterDOM = (
        <Grid item>
          <Box ml={1}>
            <FormControl>
              <Select
                id="filterGames"
                value={filter}
                onChange={this.memoizeFilterChange()}
              >
                <MenuItem value="all">{providerFilterAll}</MenuItem>
                {filterOptions &&
                  filterOptions.map((filterOpt) => (
                    <MenuItem key={filterOpt.name} value={filterOpt.name}>
                      {filterOpt.label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </Grid>
      );
      // if (filter !== 'all') {
      //     count = `${games.length} / ${allGames.length}`;
      // }
    }

    return (
      <div className={classes.root}>
        <Grid container justify="space-between" alignItems="flex-end">
          <Grid item style={{ flexGrow: 1 }}>
            <Hidden lgUp>
              <Grid container justify="space-between">
                <Grid item>{this.renderSections()}</Grid>
                <Grid item>
                  <Searchable />
                </Grid>
              </Grid>
            </Hidden>
          </Grid>
          <Grid item>
            <Grid container alignItems="flex-end">
              <Grid item>
                <Hidden mdDown>
                  <Searchable />
                </Hidden>
              </Grid>
              {filterDOM}
            </Grid>
          </Grid>
        </Grid>
        <Divider className={classes.marginBottom} />
        <SizeMe
          render={({ size }) => {
            if (size.width) {
              // Setup game card sizing variables
              const minCards = 2;
              const spacing = 8;
              const maxWidth = defaultCardWidth;

              const itemsPerRow = Math.max(
                minCards,
                Math.floor(size.width / maxWidth)
              );

              // Calculate the width to use for the game cards
              const gameCardWidth = Math.floor(
                (size.width - itemsPerRow * spacing) / itemsPerRow
              );

              // Render the game grid
              return (
                <GameGrid
                  games={games || []}
                  gameCardWidth={gameCardWidth}
                  itemsPerRow={itemsPerRow}
                  autoLoadMore={autoLoadMore}
                />
              );
            } else {
              // Used to get the initial available size, preventing the Game Grid from rendering
              // until we have the information on how many items per row, and their sizes.
              return <div></div>;
            }
          }}
        />
      </div>
    );
  }
}

export default Games;
