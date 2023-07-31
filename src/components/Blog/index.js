import React from "react";
// import intl from 'react-intl-universal';
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Box, Typography } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { useHistory, useLocation } from "react-router-dom";
import sanitize from "dompurify";
import { getLanguage, getNewsletters } from "../../redux/selectors";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    padding: theme.spacing(10, 10, 10, 10),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(6, 5, 6, 5),
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2, 1, 2, 1),
    },
  },
}));

function Blog(props) {
  // Get properties
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const { newsletters } = props;

  // Reverse the articles so they are newest -> oldest
  const orderedArticles = [...newsletters].reverse();
  // Create an array of the article aliases
  const aliases = Object.values(orderedArticles).map((item) =>
    item.title.toLowerCase().replace(/ /g, "-")
  );

  // Determine the default page based on the initial url
  let defaultPage = 1;
  const match = location && location.pathname.match(/\/blog\/([^/?]+)/);
  if (match) {
    for (let i = 0; i < aliases.length; i++) {
      if (aliases[i] === match[1]) {
        defaultPage = i + 1;
        break;
      }
    }
  }

  const [page, setPage] = React.useState(defaultPage);
  const handleChange = (event, page) => {
    setPage(page);
    history.push(`/blog/${aliases[page - 1]}`);
  };

  const article = orderedArticles[page - 1];
  const purifiedHTML = { __html: sanitize(article.fullText) };

  return (
    <Box className={classes.root}>
      <Typography variant="h3">{article.title}</Typography>
      <Box mt={2} mb={2}>
        <Pagination
          count={orderedArticles.length}
          page={page}
          onChange={handleChange}
          color="primary"
        />
      </Box>
      <Typography dangerouslySetInnerHTML={purifiedHTML} />
    </Box>
  );
}

const mapStateToProps = (state) => ({
  language: getLanguage(state),
  newsletters: getNewsletters(state),
});

export default connect(mapStateToProps)(Blog);
