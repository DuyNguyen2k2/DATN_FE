/* eslint-disable no-unused-vars */
import { notification } from 'antd';
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderItems: [],
  orderItemSelected: [],
  shippingAddress: {},
  paymentMethod: "",
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
  user: "",
  isPaid: false,
  paidAt: "",
  isDelivered: false,
  deliveredAt: "",
  isError: false,
  isSuccess: false,
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrderProduct: (state, action) => {
      const { orderItem } = action.payload;
      if (!Array.isArray(state.orderItems)) {
        state.orderItems = [];  // Reset to an empty array if not
      }
      const itemOrder = state?.orderItems?.find(
        (item) => item?.product === orderItem.product
      );
      if (itemOrder) {
        if(itemOrder.amount <= itemOrder.countInStock){
          itemOrder.amount += orderItem.amount;
          state.isSuccess = true;
          state.isError = false;
        }else{
          state.isError = true;
        }
        // itemOrder.amount += orderItem?.amount;
      } else {
        state.orderItems.push(orderItem);
      }
    },
    resetOrder: (state) => {
      state.isSuccess = false;
      state.isError = false;
    },
    increAmount: (state, action) => {
      const { idProduct } = action.payload;
      const itemOrder = state?.orderItems?.find(
        (item) => item?.product === idProduct
      );
      const itemOrderSelected = state?.orderItemSelected?.find(
        (item) => item?.product === idProduct
      );
      if (itemOrder) {
        itemOrder.amount++;
      }
      if (itemOrderSelected) {
        itemOrderSelected.amount++;
      }
    },
    decreAmount: (state, action) => {
      const { idProduct } = action.payload;
      const itemOrder = state?.orderItems?.find(
        (item) => item?.product === idProduct
      );
      const itemOrderSelected = state?.orderItemSelected?.find(
        (item) => item?.product === idProduct
      );
      if (itemOrder && itemOrder.amount > 1) {
        itemOrder.amount--;
      } else if (itemOrder && itemOrder.amount === 1) {
        notification.warning({
          message: 'Thông báo',
          description: 'Sản phẩm đã đạt số lượng tối thiểu.',
          placement: 'topRight',
        });
      } else {
        notification.error({
          message: 'Lỗi',
          description: 'Sản phẩm không tồn tại hoặc không thể giảm số lượng.',
          placement: 'topRight',
        });
      }
    
      if (itemOrderSelected && itemOrderSelected.amount > 1) {
        itemOrderSelected.amount--;
      }
    },
    removeOrderProduct: (state, action) => {
      const { idProduct } = action.payload;
      const itemOrder = state?.orderItems?.filter(
        (item) => item?.product !== idProduct
      );
      const itemOrderSelected = state?.orderItemSelected?.filter(
        (item) => item?.product === idProduct
      );
      state.orderItems = itemOrder;
      state.orderItemSelected = itemOrderSelected; 
    },
    removeAllOrderProduct: (state, action) => {
      const { listChecked } = action.payload;
      const itemOrder = state.orderItems?.filter(
        (item) => !listChecked.includes(item.product)
      );
      const itemOrderSelected = state.orderItems?.filter(
        (item) => !listChecked.includes(item.product)
      );
      state.orderItems = itemOrder;
      state.orderItemSelected = itemOrderSelected;
    },
    selectedOrder: (state, action) => {
      const { listChecked } = action.payload;
      const orderSelected = [];
      state.orderItems?.forEach((order) => {
        if (listChecked.includes(order.product)) {
          orderSelected.push(order);
        }
      });
      state.orderItemSelected = orderSelected;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addOrderProduct,
  increAmount,
  decreAmount,
  removeOrderProduct,
  removeAllOrderProduct,
  selectedOrder,
  resetOrder,
} = orderSlice.actions;

export default orderSlice.reducer;
