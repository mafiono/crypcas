import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { get } from "lodash";

const Sections = ({ sections, currentSection, setCurrentSection, route }) => {
  const pathname = get(route, ["location", "pathname"], "/");
  const hiddenSections = ["live-casino", "home"];
  return (
    <>
      {sections &&
        sections
          .filter((section) => !hiddenSections.includes(section.systemTag))
          .map((section) => {
            let linkTo = "/games";
            let activeTab = false;
            let onClick = () => {};
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
              onClick = () => {
                setCurrentSection(section.systemTag);
              };
              activeTab =
                pathname.startsWith("/games") &&
                currentSection === section.systemTag;
            }
            // Render the tabs
            return (
              <Link
                key={section.systemTag}
                to={linkTo}
                style={{ textDecoration: "none" }}
              >
                <Button
                  color={activeTab ? "primary" : "default"}
                  onClick={onClick}
                >
                  {section.label}
                </Button>
              </Link>
            );
          })}
    </>
  );
};

export default Sections;
