import { authService } from "@/services/auth-service";
import { type PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { UserResponse } from "@schemas/auth.schema";

type AuthState = {
	user: UserResponse | null;
	token: string | null;
	isLoading: boolean;
	error: string | null;
};

const initialState: AuthState = {
	user: null,
	token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
	isLoading: false,
	error: null,
};

export const logout = createAsyncThunk("auth/logout", async () => {
	localStorage.removeItem("token");
	document.cookie = "token=; path=/; max-age=0";
	return null;
});

export const getProfile = createAsyncThunk("auth/getProfile", async () => {
	const response = await authService.getProfile();
	return response;
});

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		updateUser: (state, action: PayloadAction<UserResponse>) => {
			state.user = action.payload;
		},
		updateToken: (state, action: PayloadAction<string>) => {
			state.token = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(logout.fulfilled, (state) => {
			state.user = null;
			state.token = null;
		});
		builder.addCase(getProfile.fulfilled, (state, action) => {
			state.user = action.payload;
		});
	},
});

export const { updateUser, updateToken } = authSlice.actions;

export default authSlice.reducer;
