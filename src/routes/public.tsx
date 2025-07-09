import Login from "@/pages/Login";
import Register from "@/pages/Register";

import { PATHS } from "./paths";
import { RouteConfig } from "./types";

export const publicRoutes: RouteConfig[] = [
  { path: PATHS.LOGIN, element: <Login /> },
  { path: PATHS.REGISTER, element: <Register /> },
];
