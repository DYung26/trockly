export const API_ENDPOINTS = {
  auth: {
    signup: "/auth/signup",
    login: "/auth/login",
    email: {
      verify: "/auth/verify-email",
    },
    password: {
      forgot: "/auth/password/forgot",
      verifyOtp: "/auth/password/verify-otp",
      reset: "/auth/password/reset",
    },
  },

  files: {
    uploadUrl: "/files/upload-url",
    create: "/files",
    getAll: "/files",
    getById: (id: string) => `/files/${id}`,
  },
  offers: {
    create: "/offer",
    getAll: "/offer"
  },
  trocklerProfile: {
    create: "/trockler-profile"
  },
} as const;