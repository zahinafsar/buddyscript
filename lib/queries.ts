import { infiniteQueryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const postsQuery = {
  all: ["posts"],
  infinite: () =>
    infiniteQueryOptions({
      queryKey: [...postsQuery.all],
      queryFn: async ({ pageParam }) => {
        const res = await api("posts", {
          method: "GET",
          query: pageParam ? { cursor: pageParam } : {},
        });
        if (!res.ok) {
          throw new Error("Failed to load posts.");
        }
        return res.json();
      },
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }),
};
