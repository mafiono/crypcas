import React, { Component } from "react";
import { Button } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import { ChevronLeft } from "@material-ui/icons";

@withStyles((theme) => ({
  button: {
    minWidth: "unset",
    padding: "16px",
    opacity: 1,
    transition: "0.5s opacity",
  },
  chevron: {
    transform: "rotate(90deg)",
  },
}))
class ScrollToTop extends Component {
  state = {
    display: false,
  };

  scroll = null;

  componentWillUnmount() {
    window.removeEventListener("scroll", this.scroll);
  }

  componentDidMount() {
    this.scroll = this.makeScroll();
    window.addEventListener("scroll", this.scroll);
  }

  makeScroll() {
    return () => {
      let display = false;
      if (window.scrollY > window.innerHeight) {
        display = true;
      }
      this.setState({ display });
    };
  }

  /**
   * Scroll the user to the top of the page
   */
  scrollToTop() {
    window.scrollTo && window.scrollTo(0, 0);
  }

  /**
   * Render a button which allows the user to jump to the top of the page
   */
  render() {
    const { display } = this.state;
    const { classes } = this.props;
    const buttonStyle = {};
    if (!display) {
      buttonStyle.opacity = 0;
      buttonStyle.pointerEvents = "none";
    }
    return (
      <Button
        color="primary"
        variant="contained"
        className={classes.button}
        style={buttonStyle}
        onClick={this.scrollToTop}
      >
        <ChevronLeft className={classes.chevron} />
      </Button>
    );
  }
}
export default ScrollToTop;
