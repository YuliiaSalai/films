import React from "react";
import ReactDOM from "react-dom";
import App from "App";
import "semantic-ui-css/semantic.min.css";
import { AppProviders } from "contexts";

ReactDOM.render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
  document.getElementById("root")
);
