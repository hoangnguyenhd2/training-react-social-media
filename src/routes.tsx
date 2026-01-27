import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

/* layouts */
import LayoutBase from "@/layouts/Base";

import { lazy } from 'react';

/* pages */
const Index         = lazy(() => import("@/pages/Index"));
const Login         = lazy(() => import("@/pages/Login"));
const Broken        = lazy(() => import("@/pages/Broken"));
const PostAnalytics = lazy(() => import("@/pages/Post/Analytics"));

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
                path: '*',
                element: <Broken />
            }
        ]
    }
]);