import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { StarknetProvider } from "./components/starknet-provider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <StarknetProvider>
        <App />
      </StarknetProvider>
    </BrowserRouter>
  </React.StrictMode>
);
