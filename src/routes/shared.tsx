import Index from "@/pages/Index";

import { PATHS } from "./paths";
import { RouteConfig } from "./types";

export const sharedRoutes: RouteConfig[] = [{ path: PATHS.HOME, element: <Index /> }];
