import { queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const postsQuery = {
  all: ["posts"],
  list: () =>
    queryOptions({
      queryKey: [...postsQuery.all],
      queryFn: async () => {
        const res = await api("posts", { method: "GET" });
        if (!res.ok) {
          throw new Error("Failed to load posts.");
        }
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      },
    }),
  likers: (postId: number) =>
    queryOptions({
      queryKey: [...postsQuery.all, postId, "likers"],
      queryFn: async () => {
        const res = await api("posts/[id]/likes", {
          method: "GET",
          params: { id: String(postId) },
        });
        if (!res.ok) {
          throw new Error("Failed to load likes.");
        }
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      },
    }),
};
