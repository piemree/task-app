// Mock auth service
type RegisterData = {
  firstName: string
  lastName: string
  email: string
  password: string
}

export const authService = {
  register: async (data: RegisterData) => {
    // Mock API call
    return { success: true }
  },

  login: async (email: string, password: string) => {
    // Mock API call
    return {
      token: "mock-jwt-token",
      user: {
        _id: "u1",
        firstName: "Emre",
        lastName: "Demir",
        email: email,
      },
    }
  },

  getProfile: async () => {
    // Mock API call
    return {
      _id: "u1",
      firstName: "Emre",
      lastName: "Demir",
      email: "emre.demir@sirket.com",
    }
  },
}
