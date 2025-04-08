import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";

const API_URL = "http://127.0.0.1:8000/orders/";

// פונקציה אסינכרונית ליצירת הזמנה חדשה באמצעות createAsyncThunk
export const createOrder = createAsyncThunk(
  "orders/createOrder", // שם הפעולה
  async (orderData, { rejectWithValue }) => {
    try {
      // שליחת בקשת POST ל-API עם נתוני ההזמנה
      const response = await axios.post(API_URL, orderData);
      console.log("Response received:", response.data); // הדפסת התגובה שהתקבלה
      // החזרת האובייקט שנוצר כפי שהתקבל מה-API
      return response.data;
    } catch (error) {
      // טיפול בשגיאות והדפסת הודעת שגיאה
      console.error("Error occurred:", error.response?.data || error.message);
      // החזרת השגיאה באמצעות rejectWithValue
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/orders/');
      return response.data; // מחזיר את הנתונים אם ההצלחה
    } catch (error) {
      // טיפול בשגיאה: אם יש תגובת שגיאה ב-API, מחזיר את המידע שלה
      const errorMessage = error.response?.data || error.message || 'Unknown error';
      return rejectWithValue(errorMessage);
    }
  }
);
export const fetchOrdersBySupplier = createAsyncThunk(
  "orders/fetchOrdersBySupplier",
  async (supplierId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/by-supplier/${supplierId}`
      );
      return response.data;
    } catch (error) {
      console.error("שגיאה בטעינת ההזמנות לפי ספק:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateOrder = createAsyncThunk(
  "orders/updateOrder",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}?id=${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
const initionalState = {
  orders: [],
  currentOrder: null,
  status: "",
  error: null,
};

export const ordersSlice = createSlice({
  name: "orders",
  initialState: initionalState,
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.orders.findIndex(
          (order) => order.id === action.payload.id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});
export const { setCurrentOrder } = ordersSlice.actions;

export default ordersSlice.reducer;
