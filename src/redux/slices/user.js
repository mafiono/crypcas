import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: 0,
  token: "",
  externalUserId: "",
  externalUserType: 0,
  email: "",
  password: "",
  loginName: "",
  userBalance: 0,
  bonusBalance: 0,
  currency: "",
  country: "",
  state: "",
  city: "",
  address: "",
  postalCode: "",
  birthDate: "",
  gender: "",
  firstName: "",
  lastName: "",
  phone: "",
  userCode: "",
  ipAddress: "",
  registrationIpAddress: "",
  registrationDate: 0,
  customerGroup: "",
  referral: "",
  tcid: "",
  active: false,
  default: "",
  realityCheckInterval: 0,
  brandName: "",
  cr8_account_id: "",
  isFirstLogin: false,
  lang: "",
  signedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signIn: (state, action) => {
      const {
        // Strings
        token,
        externalUserId,
        email,
        password,
        loginName,
        currency,
        country,
        state: stateProv,
        city,
        address,
        postalCode,
        birthDate,
        gender,
        firstName,
        lastName,
        phone,
        userCode,
        ipAddress,
        registrationIpAddress,
        customerGroup,
        referral,
        tcid,
        default: def,
        brandName,
        cr8_account_id,
        // Numbers
        id,
        externalUserType,
        userBalance,
        bonusBalance,
        registrationDate,
        realityCheckInterval,
        // Booleans
        active,
        isFirstLogin,
        lang,
      } = action.payload;

      return {
        // Strings
        token,
        externalUserId,
        email,
        password,
        loginName,
        currency,
        country,
        state: stateProv,
        city,
        address,
        postalCode,
        birthDate,
        gender,
        firstName,
        lastName,
        phone,
        userCode,
        ipAddress,
        registrationIpAddress,
        customerGroup,
        referral,
        tcid,
        default: def,
        brandName,
        cr8_account_id,
        // Numbers
        id,
        externalUserType,
        userBalance,
        bonusBalance,
        registrationDate,
        realityCheckInterval,
        // Booleans
        active,
        isFirstLogin,
        lang,
        signedIn: true,
      };
    },
    setCR8ActId: (state, action) => ({
      ...state,
      cr8_account_id: action.payload,
    }),
    signOut: (_state, _action) => initialState,
    updateUser: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
});

export const { signIn, signOut, setCR8ActId, updateUser } = userSlice.actions;

export default userSlice.reducer;
