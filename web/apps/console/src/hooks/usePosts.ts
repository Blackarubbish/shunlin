import { useQuery } from "@tanstack/react-query";
import { postsApi } from "@/apis";
import type { PostListParams } from "@/types/posts";

interface UsePostsOptions {
	params: PostListParams;
}

const POSTS_QUERY_KEYS = {
	posts: (params: PostListParams) => ["posts", params] as const,
};

export const usePosts = (options: UsePostsOptions) => {
	const { data, isLoading, error } = useQuery({
		queryKey: POSTS_QUERY_KEYS.posts(options.params),
		queryFn: () => postsApi.getPosts(options.params),
	});

	return { data, isLoading, error };
};
