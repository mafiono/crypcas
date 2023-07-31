import React, { Component } from "react";
// import intl from 'react-intl-universal';
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import { Typography, CircularProgress } from "@material-ui/core";
import { getPage } from "../../../helpers/request";
import sanitize from "dompurify";
import { getStaticPageMap } from "../../../redux/selectors";

@connect((state) => ({
  pages: getStaticPageMap(state),
}))
@withStyles((theme) => ({
  root: {
    textAlign: "center",
    padding: theme.spacing(10),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(5),
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1),
    },
  },
  title: {
    marginBottom: theme.spacing(2),
  },
}))
class StaticPage extends Component {
  state = {
    title: "",
    purifiedHTML: null,
  };

  componentDidMount() {
    this.useStaticPage();
    // this.getStaticPage();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.staticPage !== this.props.staticPage) {
      this.useStaticPage();
      // this.setState({ title: '', purifiedHTML: null });
      // this.getStaticPage();
    }
  }

  /**
   * Sets the title and content from the stored static pages
   */
  useStaticPage() {
    // Get the current static page, and all the stored pages
    const { staticPage, pages } = this.props;
    // Get the page from the map, given its  static page alias
    const page = pages[staticPage] || { title: "", fullText: "" };
    // Get the title and content from the page
    const { title, fullText } = page;
    // Sanitize the HTML of any potential script, allowing only stylistic use
    const purifiedHTML = { __html: sanitize(fullText) };
    // Set the state for rendering
    this.setState({ title, purifiedHTML });
  }

  /**
   * Fetches the title and content from an endpoint for the specifically requested page.
   */
  getStaticPage() {
    getPage(this.props.staticPage).then((res) => {
      // Pull title and contents from the response
      const { title, fullText } = res;
      // Purify the Full Text
      const purifiedHTML = { __html: sanitize(fullText) };
      // Set the state
      this.setState({ title, purifiedHTML });
    });
  }

  render() {
    const { title, purifiedHTML } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        {title && purifiedHTML ? (
          <>
            <Typography variant="h3" className={classes.title}>
              {title}
            </Typography>
            <Typography dangerouslySetInnerHTML={purifiedHTML} />
          </>
        ) : (
          <CircularProgress />
        )}
      </div>
    );
  }
}
export default StaticPage;
