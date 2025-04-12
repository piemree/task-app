// Mock project service
type CreateProjectData = {
  name: string
  description?: string
}

type UpdateProjectData = {
  name?: string
  description?: string
  members?: {
    user: string
    role: string
  }[]
}

type InviteUserData = {
  email: string
  role: string
}

export const projectService = {
  createProject: async (data: CreateProjectData) => {
    // Mock API call
    return {
      _id: "1",
      name: data.name,
      description: data.description,
      owner: {
        _id: "u1",
        firstName: "Emre",
        lastName: "Demir",
      },
      members: [
        {
          _id: "m1",
          user: {
            _id: "u1",
            firstName: "Emre",
            lastName: "Demir",
          },
          role: "admin",
        },
      ],
      createdAt: new Date().toISOString(),
    }
  },

  getProjects: async () => {
    // Mock API call
    return [
      {
        _id: "1",
        name: "Web Uygulaması",
        description: "Müşteri için web uygulaması geliştirme projesi",
        owner: {
          _id: "u1",
          firstName: "Emre",
          lastName: "Demir",
        },
        members: [
          {
            _id: "m1",
            user: {
              _id: "u1",
              firstName: "Emre",
              lastName: "Demir",
            },
            role: "admin",
          },
          {
            _id: "m2",
            user: {
              _id: "u2",
              firstName: "Ayşe",
              lastName: "Yılmaz",
            },
            role: "developer",
          },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        _id: "2",
        name: "Mobil Uygulama",
        description: "iOS ve Android için mobil uygulama geliştirme",
        owner: {
          _id: "u1",
          firstName: "Emre",
          lastName: "Demir",
        },
        members: [
          {
            _id: "m1",
            user: {
              _id: "u1",
              firstName: "Emre",
              lastName: "Demir",
            },
            role: "admin",
          },
        ],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ]
  },

  getProject: async (id: string) => {
    // Mock API call
    return {
      _id: id,
      name: "Web Uygulaması",
      description: "Müşteri için web uygulaması geliştirme projesi",
      owner: {
        _id: "u1",
        firstName: "Emre",
        lastName: "Demir",
      },
      members: [
        {
          _id: "m1",
          user: {
            _id: "u1",
            firstName: "Emre",
            lastName: "Demir",
          },
          role: "admin",
        },
        {
          _id: "m2",
          user: {
            _id: "u2",
            firstName: "Ayşe",
            lastName: "Yılmaz",
          },
          role: "developer",
        },
      ],
      createdAt: new Date().toISOString(),
    }
  },

  updateProject: async (id: string, data: UpdateProjectData) => {
    // Mock API call
    return {
      _id: id,
      ...data,
    }
  },

  deleteProject: async (id: string) => {
    // Mock API call
    return { success: true }
  },

  inviteUser: async (projectId: string, data: InviteUserData) => {
    // Mock API call
    return { success: true }
  },

  acceptInvite: async (token: string) => {
    // Mock API call
    return { success: true }
  },

  removeMember: async (projectId: string, userId: string) => {
    // Mock API call
    return { success: true }
  },
}
