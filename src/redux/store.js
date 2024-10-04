import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";
import userReducer from "./slices/userSlice";
import productReducer from './slices/productSlice';
import orderReducer from "./slices/orderSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    product: productReducer, 
    order: orderReducer,
  },
});
