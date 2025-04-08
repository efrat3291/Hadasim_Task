import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const loginUser = createAsyncThunk(
  'login/loginUser',
  async ({ telephone, password }, thunkAPI) => {
    try {
      const response = await axios.post('http://localhost:8000/suppliers/login', {
        telephone, 
        password
      });
      return response.data;  // מחזיר את המידע של הספק
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    loading: false,
    error: null,
    supplier: null,  // שדה חדש לאחסון פרטי הספק
  },
  reducers: {
    logout: (state) => {
      state.supplier = null;  // מנקה את פרטי הספק כאשר יוצאים
      localStorage.removeItem('supplierId'); 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.supplier = action.payload;
        localStorage.setItem('supplierId', action.payload.id);  // שומר את פרטי הספק במצב
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;
