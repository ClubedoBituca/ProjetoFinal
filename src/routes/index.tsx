import { Route, Routes } from "react-router-dom";

import NotFound from "@/pages/NotFound";

import { privateRoutes } from "./private";
import { publicRoutes } from "./public";
import { sharedRoutes } from "./shared";
import { PrivateRoute, PublicRoute } from "./wrappers";

export default function AppRoutes() {
  return (
    <Routes>
      {publicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={<PublicRoute>{element}</PublicRoute>} />
      ))}

      {privateRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={<PrivateRoute>{element}</PrivateRoute>} />
      ))}

      {sharedRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
