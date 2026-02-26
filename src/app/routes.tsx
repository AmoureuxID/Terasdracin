import { createBrowserRouter } from "react-router";
import React from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import DramaDetail from "./pages/DramaDetail";
import Watch from "./pages/Watch";
import Search from "./pages/Search";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "drama/:bookId", element: <DramaDetail /> },
      { path: "watch/:bookId/:episodeIndex", element: <Watch /> },
      { path: "search", element: <Search /> },
    ],
  },
]);