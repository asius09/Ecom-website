import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types/user";

interface UserState extends Partial<User> {
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  id: "",
  email: "",
  name: "",
  is_admin: false,
  loading: false,
  error: null,
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
      state.loading = false;
      state.error = null;
    },
    clearUser: (state) => {
      state.id = "";
      state.email = "";
      state.name = "";
      state.is_admin = false;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setUser, clearUser, setLoading, setError } = userSlice.actions;

export default userSlice.reducer;
