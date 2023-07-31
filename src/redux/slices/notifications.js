import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  processing: false,
  processCount: 0,
  snackbarOpen: false,
  snackbarMsg: "",
  invalidLoginCode: "",
  firstTimeLoginDialogOpen: false,
  nextSnack: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    siteProcess: (state, action) => {
      const processCount = state.processCount + action.payload;
      const processing = processCount > 0;

      return {
        ...state,
        processing,
        processCount,
      };
    },
    openSnackbar: (state, action) => {
      // Get the snackbar data
      const data = action.payload || state.nextSnack;

      // If there is no data, do nothing
      if (!data) {
        return state;
      }

      // If a snackbar is currently displayed, close
      // it and set this as the next one to display
      if (state.snackbarOpen) {
        return {
          ...state,
          snackbarOpen: false,
          nextSnack: data,
        };
      }

      // Pull snackbar properties out of the data object
      const { message } = data;

      // Set the snackbar as open and provide the properties
      return {
        ...state,
        snackbarOpen: true,
        snackbarMsg: message,
        nextSnack: null,
      };
    },
    closeSnackbar: (state, _action) => ({
      ...state,
      snackbarOpen: false,
    }),
    openFirstTimeLoginDialog: (state, _action) => ({
      ...state,
      firstTimeLoginDialogOpen: true,
    }),
    closeFirstTimeLoginDialog: (state, _action) => ({
      ...state,
      firstTimeLoginDialogOpen: false,
    }),
    setInvalidLoginCode: (state, action) => ({
      ...state,
      invalidLoginCode: action.payload,
    }),
  },
});

export const {
  siteProcess,
  openSnackbar,
  closeSnackbar,
  openFirstTimeLoginDialog,
  closeFirstTimeLoginDialog,
  setInvalidLoginCode,
} = notificationSlice.actions;

export default notificationSlice.reducer;
