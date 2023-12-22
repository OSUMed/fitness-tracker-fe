import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "@radix-ui/themes/styles.css";
import { Theme, ThemePanel } from "@radix-ui/themes";
import { UserContextProvider } from "./context/UserContext";
import AppRoutes from "./routes/Routes";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserContextProvider>
      <Theme
        appearance="light"
        accentColor="grass"
        grayColor="gray"
        radius="large"
      >
        <AppRoutes />
        {/* <ThemePanel /> */}
      </Theme>
    </UserContextProvider>
  </React.StrictMode>
);
