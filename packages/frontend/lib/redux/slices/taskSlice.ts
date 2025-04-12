import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { taskService } from "@/services/task-service"

type Task = {
  _id: string
  title: string
  description: string
  status: "pending" | "in_progress" | "completed"
  priority: "low" | "medium" | "high"
  project: string
  assignedTo: {
    _id: string
    firstName: string
    lastName: string
  }
  createdBy: {
    _id: string
    firstName: string
    lastName: string
  }
  createdAt: string
}

type TaskLog = {
  _id: string
  task: string
  action: string
  previousStatus?: string
  newStatus?: string
  previousPriority?: string
  newPriority?: string
  previousAssignee?: {
    _id: string
    firstName: string
    lastName: string
  }
  newAssignee?: {
    _id: string
    firstName: string
    lastName: string
  }
  changedBy: {
    _id: string
    firstName: string
    lastName: string
  }
  changes: {
    title?: string
    description?: string
    status?: string
    priority?: string
    assignedTo?: string
  }
  createdAt: string
}

type TaskState = {
  tasks: Task[]
  currentTask: Task | null
  taskLogs: TaskLog[]
  isLoading: boolean
  error: string | null
}

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  taskLogs: [],
  isLoading: false,
  error: null,
}

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (projectId: string, { rejectWithValue }) => {
  try {
    const response = await taskService.getTasks(projectId)
    return response
  } catch (error) {
    return rejectWithValue("Görevler yüklenemedi.")
  }
})

export const fetchTask = createAsyncThunk(
  "tasks/fetchTask",
  async ({ projectId, taskId }: { projectId: string; taskId: string }, { rejectWithValue }) => {
    try {
      const response = await taskService.getTask(projectId, taskId)
      return response
    } catch (error) {
      return rejectWithValue("Görev detayları yüklenemedi.")
    }
  },
)

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (
    {
      projectId,
      data,
    }: {
      projectId: string
      data: {
        title: string
        description: string
        status?: "pending" | "in_progress" | "completed"
        priority?: "low" | "medium" | "high"
        assignedTo: string
      }
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await taskService.createTask(projectId, data)
      return response
    } catch (error) {
      return rejectWithValue("Görev oluşturulamadı.")
    }
  },
)

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (
    {
      projectId,
      taskId,
      data,
    }: {
      projectId: string
      taskId: string
      data: {
        title?: string
        description?: string
      }
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await taskService.updateTask(projectId, taskId, data)
      return response
    } catch (error) {
      return rejectWithValue("Görev güncellenemedi.")
    }
  },
)

export const changeTaskStatus = createAsyncThunk(
  "tasks/changeTaskStatus",
  async (
    {
      projectId,
      taskId,
      status,
    }: {
      projectId: string
      taskId: string
      status: "pending" | "in_progress" | "completed"
    },
    { rejectWithValue },
  ) => {
    try {
      await taskService.changeStatus(projectId, taskId, status)
      return { taskId, status }
    } catch (error) {
      return rejectWithValue("Görev durumu değiştirilemedi.")
    }
  },
)

export const changeTaskAssignee = createAsyncThunk(
  "tasks/changeTaskAssignee",
  async ({ projectId, taskId, userId }: { projectId: string; taskId: string; userId: string }, { rejectWithValue }) => {
    try {
      await taskService.changeAssignee(projectId, taskId, userId)
      return { taskId, userId }
    } catch (error) {
      return rejectWithValue("Görev ataması değiştirilemedi.")
    }
  },
)

export const changeTaskPriority = createAsyncThunk(
  "tasks/changeTaskPriority",
  async (
    {
      projectId,
      taskId,
      priority,
    }: {
      projectId: string
      taskId: string
      priority: "low" | "medium" | "high"
    },
    { rejectWithValue },
  ) => {
    try {
      await taskService.changePriority(projectId, taskId, priority)
      return { taskId, priority }
    } catch (error) {
      return rejectWithValue("Görev önceliği değiştirilemedi.")
    }
  },
)

export const fetchTaskLogs = createAsyncThunk(
  "tasks/fetchTaskLogs",
  async ({ projectId, taskId }: { projectId: string; taskId: string }, { rejectWithValue }) => {
    try {
      const response = await taskService.getTaskLogs(projectId, taskId)
      return response
    } catch (error) {
      return rejectWithValue("Görev günlükleri yüklenemedi.")
    }
  },
)

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false
        state.tasks = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchTask.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTask.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentTask = action.payload
      })
      .addCase(fetchTask.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(createTask.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false
        state.tasks.push(action.payload)
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false
        if (state.currentTask && state.currentTask._id === action.payload._id) {
          state.currentTask = { ...state.currentTask, ...action.payload }
        }
        const index = state.tasks.findIndex((t) => t._id === action.payload._id)
        if (index !== -1) {
          state.tasks[index] = { ...state.tasks[index], ...action.payload }
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(changeTaskStatus.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(changeTaskStatus.fulfilled, (state, action) => {
        state.isLoading = false
        if (state.currentTask && state.currentTask._id === action.payload.taskId) {
          state.currentTask.status = action.payload.status
        }
        const index = state.tasks.findIndex((t) => t._id === action.payload.taskId)
        if (index !== -1) {
          state.tasks[index].status = action.payload.status
        }
      })
      .addCase(changeTaskStatus.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(changeTaskAssignee.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(changeTaskAssignee.fulfilled, (state, action) => {
        state.isLoading = false
        // In a real app, we would need to fetch the updated task or user details
      })
      .addCase(changeTaskAssignee.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(changeTaskPriority.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(changeTaskPriority.fulfilled, (state, action) => {
        state.isLoading = false
        if (state.currentTask && state.currentTask._id === action.payload.taskId) {
          state.currentTask.priority = action.payload.priority
        }
        const index = state.tasks.findIndex((t) => t._id === action.payload.taskId)
        if (index !== -1) {
          state.tasks[index].priority = action.payload.priority
        }
      })
      .addCase(changeTaskPriority.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchTaskLogs.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTaskLogs.fulfilled, (state, action) => {
        state.isLoading = false
        state.taskLogs = action.payload
      })
      .addCase(fetchTaskLogs.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export default taskSlice.reducer
