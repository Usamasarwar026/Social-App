import { configureStore } from "@reduxjs/toolkit";
import feedReducer from "./slices/feedSlice";
import authReducer from "./slices/authSlice";
import friendReducer from "./slices/friendSlice";
import usersReducer from "./slices/usersSlice";

export const store = configureStore({
  reducer: {
    feedSlice: feedReducer,
    authSlice: authReducer,
    friendSlice: friendReducer,
    usersSlice: usersReducer,
  },
});
