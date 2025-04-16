import { authService } from "@/services/auth-service";
import { type PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { LoginInput, LoginResponse, RegisterInput, RegisterResponse, UserResponse } from "@schemas/auth.schema";

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

export const login = createAsyncThunk<LoginResponse, LoginInput>(
	"auth/login",
	async (loginData, { rejectWithValue }) => {
		try {
			const response = await authService.login(loginData);
			// Token'ı localStorage ve cookie'ye kaydet
			localStorage.setItem("token", response.token);
			document.cookie = `token=${response.token}; path=/; max-age=86400`;
			return response;
		} catch (error) {
			return rejectWithValue(error instanceof Error ? error.message : "Giriş yapılırken bir hata oluştu");
		}
	},
);

export const register = createAsyncThunk<RegisterResponse, RegisterInput>(
	"auth/register",
	async (registerData, { rejectWithValue }) => {
		try {
			const response = await authService.register(registerData);
			return response;
		} catch (error) {
			return rejectWithValue(error instanceof Error ? error.message : "Kayıt olurken bir hata oluştu");
		}
	},
);

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
		// Login reducers
		builder.addCase(login.pending, (state) => {
			state.isLoading = true;
			state.error = null;
		});
		builder.addCase(login.fulfilled, (state, action) => {
			state.isLoading = false;
			state.user = action.payload.user;
			state.token = action.payload.token;
			state.error = null;
		});
		builder.addCase(login.rejected, (state, action) => {
			state.isLoading = false;
			state.error = action.payload as string;
		});

		// Register reducers
		builder.addCase(register.pending, (state) => {
			state.isLoading = true;
			state.error = null;
		});
		builder.addCase(register.fulfilled, (state) => {
			state.isLoading = false;
			state.error = null;
		});
		builder.addCase(register.rejected, (state, action) => {
			state.isLoading = false;
			state.error = action.payload as string;
		});

		// Logout reducer
		builder.addCase(logout.fulfilled, (state) => {
			state.user = null;
			state.token = null;
		});

		// GetProfile reducer
		builder.addCase(getProfile.fulfilled, (state, action) => {
			state.user = action.payload;
		});
	},
});

export const { updateUser, updateToken } = authSlice.actions;

export default authSlice.reducer;
