export const API_ENDPOINT = {
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
} as const;