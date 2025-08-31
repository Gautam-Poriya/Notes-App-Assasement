import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { store } from "./store";
import { Provider } from "react-redux";
import { FormProvider } from "./component/formContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <FormProvider>
        {" "}
        <App />
      </FormProvider>
    </Provider>
  </StrictMode>
);
