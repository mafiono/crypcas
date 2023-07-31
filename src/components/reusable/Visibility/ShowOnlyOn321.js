import React from "react";

const shouldShow = process.env.REACT_APP_BRAND_EXT === "-321";

const ShowOnlyOn321 = ({ children }) => shouldShow && <>{children}</>;

export default ShowOnlyOn321;
