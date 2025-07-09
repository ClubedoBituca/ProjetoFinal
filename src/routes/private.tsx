import Dashboard from "@/pages/Dashboard";
import Decks from "@/pages/Deck";

import { PATHS } from "./paths";
import { RouteConfig } from "./types";

export const privateRoutes: RouteConfig[] = [
  { path: PATHS.DECK_DETAILS(":deckId"), element: <Decks /> },
  { path: PATHS.DASHBOARD, element: <Dashboard /> },
];
