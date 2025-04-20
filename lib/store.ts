import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "@/lib/features/user/userSlice";
import { userApi } from "./services/user.service";
import { brandApi } from "./services/brand.service";
import { productApi } from "./services/product.service";

// Combine all reducers
const rootReducer = combineReducers({
  user: userReducer,
  [userApi.reducerPath]: userApi.reducer,
  [brandApi.reducerPath]: brandApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
});

// Configure persist (only persisting user slice)
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // only persist the user slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Required for redux-persist to avoid warnings
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(userApi.middleware, brandApi.middleware, productApi.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store); // export persistor for usage

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
