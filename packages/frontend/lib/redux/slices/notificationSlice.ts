import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { notificationService } from "@/services/notification-service"

type Notification = {
  _id: string
  project: {
    _id: string
    name: string
  }
  task?: {
    _id: string
    title: string
  }
  action: string
  isRead: boolean
  createdAt: string
}

type NotificationState = {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  error: string | null
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
}

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await notificationService.getNotifications(projectId)
      return response
    } catch (error) {
      return rejectWithValue("Bildirimler yüklenemedi.")
    }
  },
)

export const fetchUnreadNotifications = createAsyncThunk(
  "notifications/fetchUnreadNotifications",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await notificationService.getUnreadNotifications(projectId)
      return response
    } catch (error) {
      return rejectWithValue("Okunmamış bildirimler yüklenemedi.")
    }
  },
)

export const markNotificationsAsRead = createAsyncThunk(
  "notifications/markNotificationsAsRead",
  async (projectId: string, { rejectWithValue }) => {
    try {
      await notificationService.markAsRead(projectId)
      return { success: true }
    } catch (error) {
      return rejectWithValue("Bildirimler okundu olarak işaretlenemedi.")
    }
  },
)

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false
        state.notifications = action.payload
        state.unreadCount = action.payload.filter((n: Notification) => !n.isRead).length
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchUnreadNotifications.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUnreadNotifications.fulfilled, (state, action) => {
        state.isLoading = false
        state.unreadCount = action.payload.length
      })
      .addCase(fetchUnreadNotifications.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(markNotificationsAsRead.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(markNotificationsAsRead.fulfilled, (state) => {
        state.isLoading = false
        state.notifications = state.notifications.map((n) => ({ ...n, isRead: true }))
        state.unreadCount = 0
      })
      .addCase(markNotificationsAsRead.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export default notificationSlice.reducer
