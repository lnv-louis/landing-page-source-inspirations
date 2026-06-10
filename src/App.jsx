import React from "react";
import { RootIndex } from "./components/root-index.jsx";
import { pages } from "./data/source-backed-pages.js";

export function App() {
  return <RootIndex pages={pages} />;
}
