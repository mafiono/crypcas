import React, { Component } from "react";
// import intl from 'react-intl-universal';
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import memoizeOne from "memoize-one";
import { getAllGames } from "../../../redux/selectors";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  List,
  Popover,
  TextField,
  Typography,
  InputAdornment,
} from "@material-ui/core";
import { Search, Clear } from "@material-ui/icons";
import { SizeMe } from "react-sizeme";
import InfiniteScroll from "react-infinite-scroller";
import GameRow from "../../GameRow";

const loadedAtATime = 10;

@connect((state) => ({
  games: getAllGames(state),
}))
@withStyles((theme) => ({
  noMinWidth: {
    minWidth: "unset",
  },
  clearButton: {
    marginRight: theme.spacing(-1),
    minWidth: "unset",
  },
}))
class Searchable extends Component {
  state = {
    anchorEl: null,
    searching: false,
    maxResults: loadedAtATime,
    searchResults: [],
    searchValue: "",
  };

  componentDidUpdate(prevProps) {
    // If the path changes (page navigation), close the search
    if (this.state.searching && prevProps.path !== this.props.path) {
      this.setState({ searching: false });
    }
  }

  makeShowMore() {
    return () => {
      this.setState({
        maxResults: this.state.maxResults + loadedAtATime,
      });
    };
  }

  makeClearSearch() {
    return () => {
      this.setState({
        searchValue: "",
        maxResults: loadedAtATime,
        searchResults: [],
      });
    };
  }

  memoizeSearchClear = memoizeOne(this.makeClearSearch);

  makeSearchChange() {
    return (e) => {
      const { games } = this.props;

      const searchValue = e.target.value;
      const searchResults = [];

      if (searchValue && searchValue.length > 0) {
        gameLoop: for (let i = 0; i < games.length; i++) {
          const game = games[i];

          try {
            // Try regex search
            const regex = new RegExp(searchValue, "i");
            // Match label
            if (game.label.match(regex)) {
              searchResults.push(game);
              continue;
            }
            // Match provider
            if (game.provider && game.provider.match(regex)) {
              searchResults.push(game);
              continue;
            }
            // Match tags
            if (game.tags) {
              for (let ii = 0; ii < game.tags.length; ii++) {
                const tag = game.tags[ii];
                if (tag.match(regex)) {
                  searchResults.push(game);
                  continue gameLoop;
                }
              }
            }
            // Match special (recent, top, new)
            if (game.special) {
              for (let ii = 0; ii < game.special.length; ii++) {
                const special = game.special[ii];
                if (special.match(regex)) {
                  searchResults.push(game);
                  continue gameLoop;
                }
              }
            }
          } catch (e) {
            // Fallback on contains search
            // Match label
            if (game.label.indexOf(searchValue) !== -1) {
              searchResults.push(game);
              continue;
            }
            // Match provider
            if (game.provider && game.provider.indexOf(searchValue) !== -1) {
              searchResults.push(game);
              continue;
            }
            // Match tags
            if (game.tags) {
              for (let ii = 0; ii < game.tags.length; ii++) {
                const tag = game.tags[ii];
                if (tag.indexOf(searchValue) !== -1) {
                  searchResults.push(game);
                  continue gameLoop;
                }
              }
            }
            // Match special (recent, top, new)
            if (game.special) {
              for (let ii = 0; ii < game.special.length; ii++) {
                const special = game.special[ii];
                if (special.indexOf(searchValue) !== -1) {
                  searchResults.push(game);
                  continue gameLoop;
                }
              }
            }
          }
        }
      }

      this.setState({
        searchValue,
        maxResults: loadedAtATime,
        searchResults,
      });
    };
  }

  memoizeSearchChange = memoizeOne(this.makeSearchChange);

  makeStartSearch() {
    return (e) => {
      this.setState({ searching: true, anchorEl: e.currentTarget });
    };
  }

  makeEndSearch() {
    return () => {
      this.setState({ searching: false, anchorEl: null });
    };
  }

  renderSearchResults() {
    const { maxResults, searchResults } = this.state;

    const resultsLabel = `${searchResults.length} Results`;

    const searchResultsToMap =
      (searchResults && searchResults.slice(0, maxResults)) || [];

    return (
      <Box mt={1}>
        <Typography>{resultsLabel}</Typography>
        <SizeMe
          render={({ size }) => {
            let availableWidth = null;
            if (size && size.width && window.innerWidth < 500) {
              availableWidth = size.width;
            }
            return (
              <List>
                <Divider component="li" />
                {searchResultsToMap.map((game) => (
                  <li key={game.id}>
                    <GameRow game={game} availableWidth={availableWidth} />
                    <Divider />
                  </li>
                ))}
              </List>
            );
          }}
        />
      </Box>
    );
  }

  /**
   * Popover Search Menu
   */
  renderPopover() {
    const { searching, anchorEl, searchValue, searchResults, maxResults } =
      this.state;
    const { classes } = this.props;

    const hasMore = searchResults.length > maxResults;
    const loader = (
      <Box key="loadMore" textAlign="center" margin={1}>
        <CircularProgress />
      </Box>
    );

    const inputProps = {
      startAdornment: (
        <InputAdornment position="start">
          <Search color="primary" />
        </InputAdornment>
      ),
      endAdornment: (
        <InputAdornment position="start">
          <Button
            onClick={this.memoizeSearchClear()}
            className={classes.clearButton}
          >
            <Clear />
          </Button>
        </InputAdornment>
      ),
    };

    return (
      <Popover
        open={searching}
        anchorEl={anchorEl}
        onClose={this.makeEndSearch()}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <InfiniteScroll
          pageStart={0}
          loadMore={this.makeShowMore()}
          hasMore={hasMore}
          loader={loader}
          useWindow={false}
        >
          <Box padding={2}>
            <Grid container direction="column">
              <Grid item>
                <TextField
                  id="searchInput"
                  label="Search"
                  value={searchValue}
                  onChange={this.memoizeSearchChange()}
                  InputProps={inputProps}
                  autoFocus
                  fullWidth
                />
              </Grid>
              <Grid item style={{ maxWidth: "100%" }}>
                {searchValue && this.renderSearchResults()}
              </Grid>
            </Grid>
          </Box>
        </InfiniteScroll>
      </Popover>
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <Box>
        <Button
          color="primary"
          className={classes.noMinWidth}
          onClick={this.makeStartSearch()}
        >
          <Search />
        </Button>
        {this.renderPopover()}
      </Box>
    );
  }
}
export default Searchable;
