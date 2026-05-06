// tests/helpers/seed.ts
export const TEST_CUSTOMER = {
  firstName: "Juan",
  lastName: "dela Cruz",
  email: "e2e-customer@test.com",
  phone: "09123456789",
  password: "Password123!",
  role: "customer" as const,
}

export const TEST_PROVIDER = {
  firstName: "Maria",
  lastName: "Santos",
  email: "e2e-provider@test.com",
  phone: "09987654321",
  password: "Password123!",
  role: "provider" as const,
}
