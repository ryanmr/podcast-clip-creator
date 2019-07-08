import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { PodcastClipCreator } from "./components/podcast-clip-creator/PodcastClipCreator";
import { GlobalStyle } from "./components/GlobalStyle";

function NotFound() {
  return (
    <div>
      <h1>Not Found</h1>
    </div>
  );
}

export function AppRouter() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={PodcastClipCreator} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default function App() {
  return (
    <>
      <GlobalStyle />
      <AppRouter />
    </>
  );
}
