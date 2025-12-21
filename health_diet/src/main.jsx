import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import CircularProgress from "@mui/material/CircularProgress";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { history } from "./utills/navigation.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<CircularProgress />} persistor={persistor}>
        <HistoryRouter history={history}>
          <App />
        </HistoryRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);