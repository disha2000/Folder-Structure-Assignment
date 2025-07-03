import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const folderSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api/" }),
  tagTypes: ["Tree"],

  endpoints: (builder) => ({
    getTree: builder.query({
      query: () => "folders/tree",
      providesTags: ["Tree"],
    }),

    getSpecificTree: builder.query({
      query: (filters) => {
        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(
            ([_, v]) => v !== null && v !== undefined && v !== ""
          )
        );
        const params = new URLSearchParams(cleanFilters).toString();
        return `folders/specifictree?${params}`;
      },
      serializeQueryArgs: ({ queryArgs }) => JSON.stringify(queryArgs),
      providesTags: ["Tree"],
    }),

    createFolder: builder.mutation({
      query: (body) => ({
        url: "folders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tree"],
    }),

    getFolderStats: builder.query({
      query: () => "folders/stats",
    }),
  }),
});

export const {
  useGetTreeQuery,
  useCreateFolderMutation,
  useGetSpecificTreeQuery,
  useGetFolderStatsQuery,
} = folderSlice;
