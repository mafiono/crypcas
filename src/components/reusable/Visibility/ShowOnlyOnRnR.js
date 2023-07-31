import React from "react";

const shouldShow = process.env.REACT_APP_BRAND_EXT === "";

const ShowOnlyOnRnR = ({ children }) => shouldShow && <>{children}</>;

export default ShowOnlyOnRnR;
