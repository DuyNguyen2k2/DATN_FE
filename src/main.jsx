import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./style.css";
import "./index.css";
import { persistor, store } from "./redux/store.js";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { PersistGate } from "redux-persist/integration/react";
const queryClient = new QueryClient();
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <PayPalScriptProvider
      options={{
        "client-id":
          "ATc33oP7L-MKu7BtZ1glb8xNFTmMu_UYeOEfjdWPh7Q-8A7TBuzlYIUEwapXViE0TWgXbZFturVuXSaU",
      }}
    >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </PayPalScriptProvider>
  </QueryClientProvider>
  // </React.StrictMode>
);
