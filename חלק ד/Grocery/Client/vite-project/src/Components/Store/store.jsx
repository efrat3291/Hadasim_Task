import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../Features/UserSlice';
import loginReducer from '../Features/LoginSlice';
import goodsReducer from '../Features/GoodsSlice';
import ordersReducer from '../Features/OrderSlice';
import goodsInOrderReducer from '../Features/GoodsInOrderSlice';

const store = configureStore({
  reducer: {
    users: userReducer,
    login: loginReducer,
     goods: goodsReducer,
     orders: ordersReducer,
     goodsInOrder: goodsInOrderReducer,
  },
});

export default store;
