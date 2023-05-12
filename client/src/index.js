import React from 'react';
import { createRoot } from "react-dom/client";
import App from "./App";
import Login from "./Login";
import Cookies from 'js-cookie';

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

const authToken = Cookies.get('authToken');

root.render(
  <React.StrictMode>
    {authToken ? <App authToken={authToken} /> : <Login />}
  </React.StrictMode>
);
