import { userApi } from "@/lib/services/user.service";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: number | null;
  name: string;
  email: string;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  id: null,
  name: "",
  email: "",
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        id: number;
        name: string;
        email: string;
        token: string;
      }>
    ) => {
      const { id, name, email, token } = action.payload;
      state.id = id;
      state.name = name;
      state.email = email;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.id = null;
      state.name = "";
      state.email = "";
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      userApi.endpoints.getUserById.matchFulfilled,
      (state, { payload }) => {
        // Assuming login API returns: { id, name, email, token }
        const { id, name, email } = payload;
        state.id = id;
        state.name = name;
        state.email = email;
        state.isAuthenticated = true;
      }
    );
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
