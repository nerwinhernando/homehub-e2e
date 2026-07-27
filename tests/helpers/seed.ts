/**
 * Shared test data for KumpuniHomes E2E specs.
 *
 * The SEEDED_* accounts match db/seeds.rb (confirmed, ready to sign in).
 * The TEST_* fixtures are templates for fresh sign-ups — always override
 * `email` with a unique value per test to avoid collisions.
 */

// --- Seeded, confirmed accounts (from db/seeds.rb) ---
export const SEEDED_ADMIN = {
  email: "admin@kumpunihomes.com",
  password: "AdminPass123!",
}

export const SEEDED_CUSTOMER = {
  email: "customer1@kumpunihomes.com",
  password: "Password123!",
}

export const SEEDED_PROVIDER = {
  email: "provider1@kumpunihomes.com",
  password: "Password123!",
}

// --- Templates for new registrations (override email per test) ---
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
