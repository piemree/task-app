import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { authService } from "@/services/auth-service"

type User = {
  _id: string
  firstName: string
  lastName: string
  email: string
}

type AuthState = {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  isLoading: false,
  error: null,
}

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password)
      localStorage.setItem("token", response.token)
      document.cookie = `token=${response.token}; path=/; max-age=86400`
      return response
    } catch (error) {
      return rejectWithValue("Giriş başarısız. E-posta veya şifre hatalı.")
    }
  },
)

export const register = createAsyncThunk(
  "auth/register",
  async (data: { firstName: string; lastName: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.register(data)
      return response
    } catch (error) {
      return rejectWithValue("Kayıt başarısız. Lütfen tekrar deneyin.")
    }
  },
)

export const getProfile = createAsyncThunk("auth/getProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await authService.getProfile()
    return response
  } catch (error) {
    return rejectWithValue("Profil bilgileri alınamadı.")
  }
})

export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token")
  document.cookie = "token=; path=/; max-age=0"
  return null
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
      })
  },
})

export const { updateUser } = authSlice.actions

export default authSlice.reducer
