import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { Categories } from "../pages/categories/Categories";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { MediaLibrary } from "../pages/media/MediaLibrary";
import { PostEditor } from "../pages/posts/PostEditor";
import { PostsList } from "../pages/posts/PostsList";
import { UserManagement } from "../pages/users/UserManagement";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <MainLayout />,
		children: [
			{
				index: true,
				element: <Navigate to="/dashboard" replace />,
			},
			{
				path: "dashboard",
				element: <Dashboard />,
			},
			{
				path: "posts",
				children: [
					{
						index: true,
						element: <PostsList />,
					},
					{
						path: "create",
						element: <PostEditor mode="create" />,
					},
					{
						path: "edit/:id",
						element: <PostEditor mode="edit" />,
					},
				],
			},
			{
				path: "categories",
				element: <Categories />,
			},
			{
				path: "media",
				element: <MediaLibrary />,
			},
			{
				path: "users",
				element: <UserManagement />,
			},
		],
	},
]);
