// ISSUE:
// https://github.com/vitejs/vite-plugin-react/issues/11#discussion_r430879201
//@ts-expect-error is fine
window.$RefreshReg$ = () => {};
//@ts-expect-error is fine
window.$RefreshSig$ = () => (type) => type;
//@ts-expect-error is fine
window.__vite_plugin_react_preamble_installed__ = true;

///////

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import { WalletProvider } from "./provider/WalletProvider.tsx";

import "./index.css";

const root = document.createElement("div");
root.style.flexShrink = "0";
root.style.right = "0";
root.style.top = "0";
root.style.flexShrink = "1";
root.id = "root";
document.body.style.display = "flex";
document.body.appendChild(root);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <WalletProvider>
      <App />
    </WalletProvider>
  </React.StrictMode>
);
