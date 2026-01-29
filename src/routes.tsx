import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { lazy } from "react";

/* layouts */
import LayoutBase from "@/layouts/Base";

/* pages */
const Index         = lazy(() => import("@/pages/Index"));
const Login         = lazy(() => import("@/pages/Login"));
const PostAnalytics = lazy(() => import("@/pages/Post/Analytics"));
const Broken        = lazy(() => import("@/pages/Broken"));

export const routes = createBrowserRouter([
    {
        path: ROUTES.INDEX,
        element: <LayoutBase />,
        errorElement: <Broken />,
        children: [
            {
                index: true,
                element: <Index />
            },
            {
                path: ROUTES.LOGIN,
                element: <Login />
            },
            {
                path: ROUTES.POST_ANALYTICS,
                element: <PostAnalytics />
            },
            {
                path: "*",
                element: <Broken />
            }
        ]
    }
]);