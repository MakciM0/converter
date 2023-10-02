import { configureStore } from "@reduxjs/toolkit";
import ConverterSlice from "./ConverterSlice";

const store = configureStore({
  reducer: {
    converter: ConverterSlice
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
