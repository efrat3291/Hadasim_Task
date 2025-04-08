import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = "http://127.0.0.1:8000/GoodsInOrder";
export const createGoodInOrder = createAsyncThunk(
  "goods/creategoods",
  async (goodInOrder, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, goodInOrder);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const fetchGoodsInOrder = createAsyncThunk(
  "goods/fetchGoods",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
const initialState = {
  goodsInOrder: [],
  currentGoodInOrder: null,
  status: "",
};
export const goodInOrderSlice = createSlice({
  name: "goods",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoodsInOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchGoodsInOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.goodsInOrder = action.payload;
      })
      .addCase(fetchGoodsInOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createGoodInOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createGoodInOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentGoodInOrder = action.payload;
        state.goodsInOrder.push(action.payload);
      })
      .addCase(createGoodInOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});
export const {} = goodInOrderSlice.actions;
export default goodInOrderSlice.reducer;
