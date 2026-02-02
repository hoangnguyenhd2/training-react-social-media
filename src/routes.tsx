import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { lazy } from "react";

/* layouts */
import LayoutBase from "@/layouts/Base";
const AdminLayout = lazy(() => import("@/layouts/Admin"));

/* pages */
const Index         = lazy(() => import("@/pages/Index"));
const Login         = lazy(() => import("@/pages/Login"));
const Register      = lazy(() => import("@/pages/Register"));
const PostAnalytics = lazy(() => import("@/pages/Post/Analytics"));
const PostDetail    = lazy(() => import("@/pages/Post/Detail"));
const Broken        = lazy(() => import("@/pages/Broken"));

/* admin pages */
const AdminDashboard = lazy(() => import("@/pages/Admin/Index"));
const AdminUsers     = lazy(() => import("@/pages/Admin/Users"));
const AdminPosts     = lazy(() => import("@/pages/Admin/Posts"));

/* route guards */
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { GuestRoute } from "@/components/auth/GuestRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";

export const routes = createBrowserRouter([
    {
        path: ROUTES.INDEX,
        element: <LayoutBase />,
        errorElement: <Broken />,
        children: [
            { index: true, element: <Index /> },

            {
                element: <ProtectedRoute />,
                children: [
                    { path: ROUTES.POST_ANALYTICS, element: <PostAnalytics /> },
                    { path: ROUTES.POST_DETAIL, element: <PostDetail /> }
                ]
            },

            {
                element: <GuestRoute />,
                children: [
                    { path: ROUTES.LOGIN, element: <Login /> },
                    { path: ROUTES.REGISTER, element: <Register /> }
                ]
            },

            { path: "*", element: <Broken /> }
        ]
    },
    {
        path: ROUTES.ADMIN,
        element: <LayoutBase />,
        errorElement: <Broken />,
        children: [
            {
                element: <AdminRoute />,
                children: [
                    {
                        element: <AdminLayout />,
                        children: [
                            { index: true, element: <AdminDashboard /> },
                            { path: ROUTES.ADMIN_USERS, element: <AdminUsers /> },
                            { path: ROUTES.ADMIN_POSTS, element: <AdminPosts /> }
                        ]
                    }
                ]
            }
        ]
    }
]);
