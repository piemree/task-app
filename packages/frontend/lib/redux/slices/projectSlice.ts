import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { projectService } from "@/services/project-service"

type Member = {
  _id: string
  user: {
    _id: string
    firstName: string
    lastName: string
  }
  role: string
}

type Project = {
  _id: string
  name: string
  description: string
  owner: {
    _id: string
    firstName: string
    lastName: string
  }
  members: Member[]
  createdAt: string
}

type ProjectState = {
  projects: Project[]
  currentProject: Project | null
  isLoading: boolean
  error: string | null
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
}

export const fetchProjects = createAsyncThunk("projects/fetchProjects", async (_, { rejectWithValue }) => {
  try {
    const response = await projectService.getProjects()
    return response
  } catch (error) {
    return rejectWithValue("Projeler yüklenemedi.")
  }
})

export const fetchProject = createAsyncThunk("projects/fetchProject", async (id: string, { rejectWithValue }) => {
  try {
    const response = await projectService.getProject(id)
    return response
  } catch (error) {
    return rejectWithValue("Proje detayları yüklenemedi.")
  }
})

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (data: { name: string; description?: string }, { rejectWithValue }) => {
    try {
      const response = await projectService.createProject(data)
      return response
    } catch (error) {
      return rejectWithValue("Proje oluşturulamadı.")
    }
  },
)

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async (
    {
      id,
      data,
    }: {
      id: string
      data: { name?: string; description?: string; members?: { user: string; role: string }[] }
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await projectService.updateProject(id, data)
      return response
    } catch (error) {
      return rejectWithValue("Proje güncellenemedi.")
    }
  },
)

export const deleteProject = createAsyncThunk("projects/deleteProject", async (id: string, { rejectWithValue }) => {
  try {
    await projectService.deleteProject(id)
    return id
  } catch (error) {
    return rejectWithValue("Proje silinemedi.")
  }
})

export const inviteUser = createAsyncThunk(
  "projects/inviteUser",
  async ({ projectId, data }: { projectId: string; data: { email: string; role: string } }, { rejectWithValue }) => {
    try {
      await projectService.inviteUser(projectId, data)
      return { success: true }
    } catch (error) {
      return rejectWithValue("Kullanıcı davet edilemedi.")
    }
  },
)

export const removeMember = createAsyncThunk(
  "projects/removeMember",
  async ({ projectId, userId }: { projectId: string; userId: string }, { rejectWithValue }) => {
    try {
      await projectService.removeMember(projectId, userId)
      return { projectId, userId }
    } catch (error) {
      return rejectWithValue("Üye kaldırılamadı.")
    }
  },
)

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false
        state.projects = action.payload
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchProject.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentProject = action.payload
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(createProject.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false
        state.projects.push(action.payload)
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(updateProject.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentProject = action.payload
        const index = state.projects.findIndex((p) => p._id === action.payload._id)
        if (index !== -1) {
          state.projects[index] = action.payload
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false
        state.projects = state.projects.filter((p) => p._id !== action.payload)
        if (state.currentProject && state.currentProject._id === action.payload) {
          state.currentProject = null
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(inviteUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(inviteUser.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(inviteUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(removeMember.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        state.isLoading = false
        if (state.currentProject) {
          state.currentProject.members = state.currentProject.members.filter(
            (m) => m.user._id !== action.payload.userId,
          )
        }
      })
      .addCase(removeMember.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export default projectSlice.reducer
