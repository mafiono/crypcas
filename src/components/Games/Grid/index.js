import React, { Component } from "react";
// import intl from 'react-intl-universal';
import withStyles from "@material-ui/core/styles/withStyles";
import { Grid, CircularProgress, Button, Box } from "@material-ui/core";
import InfiniteScroll from "react-infinite-scroller";
import GameCard from "../../GameCard";

// The initial number of rows to display
const initialRows = 5;
// how many rows to load on scroll
const scrollLoadMoreRows = 2;
// how many rows to load on manually clicking load more
const manualLoadMoreRows = 5;

@withStyles((theme) => ({
  loadingMore: {
    padding: theme.spacing(2, 0),
    textAlign: "center",
  },
}))
class Games extends Component {
  state = {
    display: 0,
    hasMore: false,
  };

  componentDidMount() {
    this.initialize();
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.initialize();
    }
  }

  initialize() {
    const { games, itemsPerRow } = this.props;
    if (games) {
      const newDisplay = Math.min(initialRows * itemsPerRow, games.length);
      const hasMore = newDisplay !== games.length;
      this.setState({
        display: newDisplay,
        hasMore,
      });
    }
  }

  // Called when scrolling the page near the bottom
  makeLoadMore(loadMoreCount) {
    return () => {
      const { games } = this.props;
      const { display } = this.state;
      const newDisplay = Math.min(display + loadMoreCount, games.length);
      const hasMore = newDisplay !== games.length;
      this.setState({
        display: newDisplay,
        hasMore,
      });
    };
  }

  renderGames(games, width) {
    return (
      games &&
      games.map((game) => (
        <Grid item key={game.id}>
          <GameCard game={game} cardWidth={width} />
        </Grid>
      ))
    );
  }

  render() {
    const { classes, games, gameCardWidth, itemsPerRow, autoLoadMore } =
      this.props;
    const { display, hasMore } = this.state;

    const loader = (
      <div key="loadMore" className={classes.loadingMore}>
        <CircularProgress />
      </div>
    );

    if (autoLoadMore !== false) {
      return (
        <InfiniteScroll
          pageStart={0}
          loadMore={this.makeLoadMore(scrollLoadMoreRows * itemsPerRow)}
          hasMore={hasMore}
          loader={loader}
        >
          <Grid container spacing={1} justify="center" alignItems="center">
            {games && this.renderGames(games.slice(0, display), gameCardWidth)}
          </Grid>
        </InfiniteScroll>
      );
    } else {
      return (
        <>
          <Grid container spacing={1} justify="center" alignItems="center">
            {games && this.renderGames(games.slice(0, display), gameCardWidth)}
          </Grid>
          {hasMore && (
            <Box m={2} textAlign="center">
              <Button
                color="primary"
                variant="contained"
                onClick={this.makeLoadMore(manualLoadMoreRows * itemsPerRow)}
              >
                Load More
              </Button>
            </Box>
          )}
        </>
      );
    }
  }
}
export default Games;
