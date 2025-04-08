import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = "https://localhost:7227/api/Goods";
export const creategoods = createAsyncThunk(
  "goods/creategoods",
  async (goodsData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, goodsData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const fetchGoods = createAsyncThunk(
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
  goods: [],
  currentgoods: null,
  status: "",
};

export const goodsSlice = createSlice({
  name: "goods",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoods.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchGoods.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.goods = action.payload;
      })
      .addCase(fetchGoods.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(creategoods.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(creategoods.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentgoods = action.payload;
        state.goods.push(action.payload);
      })
      .addCase(creategoods.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {} = goodsSlice.actions;
export default goodsSlice.reducer;
