import React from "react";
import { List } from "@material-ui/core";
import intl from "react-intl-universal";

const NavList = ({
  currentSection,
  sections,
  pathname,
  newsletters,
  renderCategoryItem,
}) => {
  const labelHome = intl.get("category.home").defaultMessage("Home");
  const labelBlog = intl.get("category.blog").defaultMessage("Blog");
  const home = renderCategoryItem(labelHome, "/", pathname === "/", null);
  const blog = renderCategoryItem(labelBlog, "/blog", pathname === "/", null);

  return (
    <List>
      {home}
      {sections &&
        sections.map((section) => {
          let linkTo = "/games";
          let systemTag = null;
          let activeTab = false;
          // Hidden Sections
          if (section.systemTag === "home") {
            return false;
          }
          // Special Sections
          if (
            section.systemTag === "promotions" ||
            section.systemTag === "sportsbook"
          ) {
            linkTo = `/${section.systemTag}`;
            activeTab = pathname === linkTo;
          } else if (section.systemTag === "monthly-event") {
            linkTo = `/${section.systemTag}/${section.viewName}`;
            activeTab = pathname === linkTo;
          } else {
            systemTag = section && section.systemTag;
            activeTab =
              pathname.startsWith("/games") &&
              currentSection === section.systemTag;
          }
          // Render the tabs
          return renderCategoryItem(
            section.label,
            linkTo,
            activeTab,
            systemTag,
            section.badge
          );
        })}
      {Array.isArray(newsletters) && !!newsletters.length && blog}
    </List>
  );
};

export default NavList;
