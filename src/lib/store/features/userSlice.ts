import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types/user";

interface UserState {
  id: string;
  email: string;
  name: string;
  is_admin: boolean;
  [key: string]: unknown; // Allow additional properties from User type
}

const initialState: UserState = {
  id: "",
  email: "",
  name: "",
  is_admin: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.is_admin = action.payload.is_admin;
    },
    clearUser: (state) => {
      state.id = "";
      state.email = "";
      state.name = "";
      state.is_admin = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
