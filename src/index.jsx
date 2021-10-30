import React from "react";
import ReactDOM from "react-dom";
import App from "App";
import "semantic-ui-css/semantic.min.css";
import { AppProviders } from "contexts";
import { ChakraProvider } from "@chakra-ui/react"

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <AppProviders>
        <App />
      </AppProviders>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
