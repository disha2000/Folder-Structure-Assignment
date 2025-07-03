import { configureStore } from '@reduxjs/toolkit';
import { folderSlice } from './slices/folderSlice';
import { fileSlice } from './slices/fileSlice';

export const store = configureStore({
  reducer: {
    [folderSlice.reducerPath]: folderSlice.reducer,
    [fileSlice.reducerPath]: fileSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(folderSlice.middleware).concat(fileSlice.middleware)
});
