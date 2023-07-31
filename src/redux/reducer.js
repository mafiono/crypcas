import { combineReducers } from "redux";

import main from "./slices/main";
import language from "./slices/language";
import user from "./slices/user";
import notifications from "./slices/notifications";
import history from "./slices/history";

export default combineReducers({
  main,
  language,
  user,
  notifications,
  history,
});
