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
      staleTime: Infinity
    }),
};

export const commentsQuery = {
  all: (postId: number) => ["comments", postId],
  infinite: (postId: number) =>
    infiniteQueryOptions({
      queryKey: commentsQuery.all(postId),
      queryFn: async ({ pageParam }) => {
        const res = await api("posts/[id]/comments", {
          method: "GET",
          params: { id: String(postId) },
          query: pageParam ? { cursor: pageParam } : {},
        });
        if (!res.ok) {
          throw new Error("Failed to load comments.");
        }
        return res.json();
      },
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }),
};

export const repliesQuery = {
  all: (commentId: number) => ["replies", commentId],
  infinite: (commentId: number, startCursor: string) =>
    infiniteQueryOptions({
      queryKey: repliesQuery.all(commentId),
      queryFn: async ({ pageParam }) => {
        const res = await api("comments/[id]/replies", {
          method: "GET",
          params: { id: String(commentId) },
          query: { cursor: pageParam },
        });
        if (!res.ok) {
          throw new Error("Failed to load replies.");
        }
        return res.json();
      },
      initialPageParam: startCursor,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }),
};
