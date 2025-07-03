import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const fileSlice = createApi({
  reducerPath: 'fileApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/' }),
  tagTypes: ['Tree'],
  endpoints: (builder) => ({
    uploadFile: builder.mutation({
      query: (formData) => ({
        url: 'files',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Tree'],
    }),
  }),
});

export const { useUploadFileMutation } = fileSlice;
