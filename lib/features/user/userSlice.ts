// src/redux/slices/userSlice.ts
import { UserDto } from "@/utils/models/user.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: UserDto | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserDto>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    updateUser: (state, action: PayloadAction<Partial<UserDto>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setUser, logout, updateUser } = userSlice.actions;

export default userSlice.reducer;
