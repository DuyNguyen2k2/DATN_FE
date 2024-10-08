import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./style.css";
import "./index.css";
import { persistor, store } from "./redux/store.js";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { PersistGate } from 'redux-persist/integration/react'
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </QueryClientProvider>
  // </React.StrictMode>
);
