import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "@/apis";
import type {
  CategoryListParams,
  CreateCategoryForm,
  UpdateCategoryForm,
} from "@/types/categories";

const CATEGORIES_QUERY_KEYS = {
  all: ["categories"] as const,
  lists: () => [...CATEGORIES_QUERY_KEYS.all, "list"] as const,
  list: (params: CategoryListParams) =>
    [...CATEGORIES_QUERY_KEYS.lists(), params] as const,
};

// 获取分类列表
export const useCategories = (params: CategoryListParams = {}) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: CATEGORIES_QUERY_KEYS.list(params),
    queryFn: () => categoriesApi.getCategories(params),
  });

  return { data, isLoading, error, refetch };
};

// 创建分类
export const useCreateCategory = (
  options: { onSuccess?: () => void; onError?: (error: Error) => void } = {}
) => {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryForm) =>
      categoriesApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CATEGORIES_QUERY_KEYS.lists(),
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error("创建分类失败:", error);
      onError?.(error);
    },
  });
};

// 更新分类
export const useUpdateCategory = (
  options: { onSuccess?: () => void; onError?: (error: Error) => void } = {}
) => {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryForm }) =>
      categoriesApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CATEGORIES_QUERY_KEYS.lists(),
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error("更新分类失败:", error);
      onError?.(error);
    },
  });
};

// 删除分类
export const useDeleteCategory = (
  options: { onSuccess?: () => void; onError?: (error: Error) => void } = {}
) => {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoriesApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CATEGORIES_QUERY_KEYS.lists(),
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error("删除分类失败:", error);
      onError?.(error);
    },
  });
};
