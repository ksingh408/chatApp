// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import {persistStore , persistReducer} from "redux-persist";
import authReducer from "./redux/authSlice";
import messagesReducer from "./redux/msgSlice";
import storage from "redux-persist/lib/storage"
// frontend\src\redux\authSlice.js

const persistConfig={
  key:"auth",
  storage,
  whitelist:['user']
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer)


export const store = configureStore({
  reducer: {
    messages:messagesReducer,
    auth:persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"], // 👈 ignore persist actions
      },
    }),
});

export const persistor = persistStore(store);





// // src/redux/store.js
// import { configureStore, combineReducers } from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";

// import authReducer from "./redux/authSlice";
// import chatReducer from "./redux/chatSlice";

// const rootReducer = combineReducers({
//   auth: authReducer,
//   chat: chatReducer,
// });

// const persistConfig = {
//   key: "root",   // ✅ root, not "auth"
//   storage,
//   whitelist: ["auth", "chat"], // ✅ persist both slices
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer, // ✅ single persisted rootReducer
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
//       },
//     }),
// });

// export const persistor = persistStore(store);