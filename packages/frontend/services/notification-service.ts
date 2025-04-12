// Mock notification service
export const notificationService = {
  getNotifications: async (projectId: string) => {
    // Mock API call
    return [
      {
        _id: "1",
        project: {
          _id: projectId,
          name: "Web Uygulaması",
        },
        task: {
          _id: "t1",
          title: "Tasarım Revizyonu",
        },
        action: "task_assigned",
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      {
        _id: "2",
        project: {
          _id: projectId,
          name: "Web Uygulaması",
        },
        task: {
          _id: "t2",
          title: "API Entegrasyonu",
        },
        action: "task_status_changed",
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ]
  },

  getUnreadNotifications: async (projectId: string) => {
    // Mock API call
    return [
      {
        _id: "1",
        project: {
          _id: projectId,
          name: "Web Uygulaması",
        },
        task: {
          _id: "t1",
          title: "Tasarım Revizyonu",
        },
        action: "task_assigned",
        isRead: false,
        createdAt: new Date().toISOString(),
      },
    ]
  },

  markAsRead: async (projectId: string) => {
    // Mock API call
    return { success: true }
  },
}
