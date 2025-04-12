// Mock task service
type CreateTaskData = {
  title: string
  description: string
  status?: "pending" | "in_progress" | "completed"
  priority?: "low" | "medium" | "high"
  assignedTo: string
}

type UpdateTaskData = {
  title?: string
  description?: string
}

export const taskService = {
  createTask: async (projectId: string, data: CreateTaskData) => {
    // Mock API call
    return {
      _id: "t1",
      title: data.title,
      description: data.description,
      status: data.status || "pending",
      priority: data.priority || "medium",
      project: projectId,
      assignedTo: {
        _id: data.assignedTo,
        firstName: "Ayşe",
        lastName: "Yılmaz",
      },
      createdBy: {
        _id: "u1",
        firstName: "Emre",
        lastName: "Demir",
      },
      createdAt: new Date().toISOString(),
    }
  },

  getTasks: async (projectId: string) => {
    // Mock API call
    return [
      {
        _id: "t1",
        title: "Tasarım Revizyonu",
        description: "Ana sayfa tasarımında revizyonlar yapılacak",
        status: "pending",
        priority: "high",
        project: projectId,
        assignedTo: {
          _id: "u2",
          firstName: "Ayşe",
          lastName: "Yılmaz",
        },
        createdBy: {
          _id: "u1",
          firstName: "Emre",
          lastName: "Demir",
        },
        createdAt: new Date().toISOString(),
      },
      {
        _id: "t2",
        title: "API Entegrasyonu",
        description: "Ödeme API'si entegrasyonu yapılacak",
        status: "in_progress",
        priority: "medium",
        project: projectId,
        assignedTo: {
          _id: "u1",
          firstName: "Emre",
          lastName: "Demir",
        },
        createdBy: {
          _id: "u1",
          firstName: "Emre",
          lastName: "Demir",
        },
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ]
  },

  getTask: async (projectId: string, taskId: string) => {
    // Mock API call
    return {
      _id: taskId,
      title: "Tasarım Revizyonu",
      description: "Ana sayfa tasarımında revizyonlar yapılacak",
      status: "pending",
      priority: "high",
      project: projectId,
      assignedTo: {
        _id: "u2",
        firstName: "Ayşe",
        lastName: "Yılmaz",
      },
      createdBy: {
        _id: "u1",
        firstName: "Emre",
        lastName: "Demir",
      },
      createdAt: new Date().toISOString(),
    }
  },

  updateTask: async (projectId: string, taskId: string, data: UpdateTaskData) => {
    // Mock API call
    return {
      _id: taskId,
      ...data,
    }
  },

  changeStatus: async (projectId: string, taskId: string, status: string) => {
    // Mock API call
    return { success: true }
  },

  changeAssignee: async (projectId: string, taskId: string, userId: string) => {
    // Mock API call
    return { success: true }
  },

  changePriority: async (projectId: string, taskId: string, priority: string) => {
    // Mock API call
    return { success: true }
  },

  getTaskLogs: async (projectId: string, taskId: string) => {
    // Mock API call
    return [
      {
        _id: "l1",
        task: taskId,
        action: "task_created",
        changedBy: {
          _id: "u1",
          firstName: "Emre",
          lastName: "Demir",
        },
        changes: {},
        createdAt: new Date().toISOString(),
      },
      {
        _id: "l2",
        task: taskId,
        action: "status_changed",
        previousStatus: "pending",
        newStatus: "in_progress",
        changedBy: {
          _id: "u2",
          firstName: "Ayşe",
          lastName: "Yılmaz",
        },
        changes: {
          status: "in_progress",
        },
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ]
  },
}
