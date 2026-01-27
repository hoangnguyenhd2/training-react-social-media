import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

/* layouts */
import LayoutBase from "@/layouts/Base";

/* pages */
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Broken from "@/pages/Broken";

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
                path: '*',
                element: <Broken />
            }
        ]
    }
]);