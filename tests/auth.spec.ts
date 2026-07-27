import { test, expect } from "@playwright/test"
import { signIn, signUp, signOut } from "./helpers/auth"
import { TEST_CUSTOMER, TEST_PROVIDER } from "./helpers/seed"

/**
 * Authentication E2E specs for KumpuniHomes.
 *
 * Reflects the current app state:
 *  - Brand is "KumpuniHomes" (not HomeHub PH)
 *  - Sign-in page shows separate email-link and password forms.
 *  - Auth forms submit with `data-turbo="false"` (plain HTML POST)
 *  - Registration uses role-selection cards (customer / provider)
 *  - New sign-ups must confirm their email before reaching the dashboard
 *    (Devise :confirmable) -> redirected to /confirmation-pending
 *  - Banned / suspended accounts are signed out at the door
 */

test.describe("Landing & Public Chrome", () => {
  test("landing page loads with KumpuniHomes branding", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveTitle(/KumpuniHomes/)
    await expect(page.locator("h1")).toContainText("Find Trusted Home")
    await expect(page.locator("nav")).toBeVisible()
    await expect(page.locator("footer")).toBeVisible()
  })

  test("navbar shows Sign In / Get Started when logged out", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("link", { name: "Sign In" })).toBeVisible()
    await expect(page.getByRole("link", { name: "Get Started" })).toBeVisible()
  })

  test("logo links back to home", async ({ page }) => {
    await page.goto("/providers")
    await page.getByRole("link", { name: /Kumpuni\s*Homes/ }).first().click()
    await expect(page).toHaveURL(/\/$|\/$/)
  })

  test("footer shows KumpuniHomes and column headings", async ({ page }) => {
    await page.goto("/")
    const footer = page.locator("footer")
    await expect(footer).toContainText("Kumpuni")
    await expect(footer.getByText("For Customers")).toBeVisible()
    await expect(footer.getByText("For Providers")).toBeVisible()
    await expect(footer.getByText("Company")).toBeVisible()
  })
})

test.describe("Sign In Page", () => {
  test("navigate to sign in from navbar", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: "Sign In" }).click()
    await expect(page).toHaveURL(/sign_in/)
    await expect(page.locator("h1")).toContainText("Welcome back")
  })

  test("shows both email link and password sign-in forms", async ({ page }) => {
    await page.goto("/users/sign_in")

    const magicLinkForm = page.locator("form").first()
    await expect(magicLinkForm.getByRole("button", { name: /Send Magic Link/i })).toBeVisible()
    await expect(magicLinkForm.getByLabel("Email address")).toBeVisible()

    const passwordForm = page.locator("form").nth(1)
    await expect(passwordForm.getByRole("button", { name: /^Sign In$/i })).toBeVisible()
    await expect(passwordForm.getByLabel("Password", { exact: true })).toBeVisible()
  })

  test("password form shows email and password fields", async ({ page }) => {
    await page.goto("/users/sign_in")

    const passwordForm = page.locator("form").nth(1)
    await expect(passwordForm.locator('input[name="user[email]"]')).toBeVisible()
    await expect(passwordForm.locator('input[name="user[password]"]')).toBeVisible()
  })

  test("magic link form shows the email-only flow", async ({ page }) => {
    await page.goto("/users/sign_in")

    const magicLinkForm = page.locator("form").first()
    await expect(magicLinkForm.getByRole("button", { name: /Send Magic Link/i })).toBeVisible()
    await expect(magicLinkForm.getByLabel("Email address")).toBeVisible()
  })

  test("forgot password link exists in the password form", async ({ page }) => {
    await page.goto("/users/sign_in")

    const passwordForm = page.locator("form").nth(1)
    await expect(passwordForm.getByRole("link", { name: /Forgot password/i })).toBeVisible()
  })

  test("magic-link form submits email as user[email]", async ({ page }) => {
    await page.goto("/users/sign_in")

    const magicLinkForm = page.locator("form").first()
    await magicLinkForm.locator('input[name="user[email]"]').fill("customer1@kumpunihomes.com")
    await magicLinkForm.getByRole("button", { name: /Send Magic Link/i }).click()
    // Devise responds with a generic flash regardless of whether the email exists
    await expect(page.locator("body")).toBeVisible()
    await expect(page).not.toHaveURL(/sign_up/)
  })
})

test.describe("Registration (role cards)", () => {
  test("registration form shows role cards and fields", async ({ page }) => {
    await page.goto("/users/sign_up")
    await expect(page.locator("h1")).toContainText("Create your account")
    await expect(page.locator('input[name="user[role]"][value="customer"]')).toBeAttached()
    await expect(page.locator('input[name="user[role]"][value="provider"]')).toBeAttached()
    await expect(page.getByText("Customer", { exact: true })).toBeVisible()
    await expect(page.getByText("Provider", { exact: true })).toBeVisible()
    await expect(page.getByLabel("Email address")).toBeVisible()
    await expect(page.getByLabel("Password", { exact: true })).toBeVisible()
    await expect(page.getByLabel("Confirm Password")).toBeVisible()
  })

  test("customer sign-up redirects to confirmation-pending", async ({ page }) => {
    const email = `customer-${Date.now()}@test.com`
    await signUp(page, { ...TEST_CUSTOMER, email })
    // :confirmable means no dashboard yet — user lands on the pending page
    await expect(page).toHaveURL(/confirmation-pending|confirmation_pending/)
    await expect(page.getByText(/Check your email/i)).toBeVisible()
  })

  test("provider sign-up redirects to confirmation-pending", async ({ page }) => {
    const email = `provider-${Date.now()}@test.com`
    await signUp(page, { ...TEST_PROVIDER, email })
    await expect(page).toHaveURL(/confirmation-pending|confirmation_pending/)
  })

  test("confirmation-pending page offers a resend link", async ({ page }) => {
    await page.goto("/confirmation-pending")
    await expect(page.getByRole("link", { name: /Resend confirmation/i })).toBeVisible()
  })

  test("sign-up link and sign-in link cross-reference each other", async ({ page }) => {
    await page.goto("/users/sign_up")
    await expect(page.locator('main').getByRole("link", { name: /Sign in/i })).toBeVisible()
    await page.goto("/users/sign_in")
    await expect(page.getByRole("link", { name: /Create (one|account)/i })).toBeVisible()
  })
})

test.describe("Sign In / Sign Out (seeded, confirmed accounts)", () => {
  test("password sign-in with valid credentials reaches the home page", async ({ page }) => {
    await signIn(page, "customer1@kumpunihomes.com", "Password123!")
    await expect(page).toHaveURL(/\/$/)
    await expect(page.locator("nav")).toContainText(/Welcome|customer1|Juan|Maria/i)
  })

  test("password sign-in fails with a wrong password", async ({ page }) => {
    await page.goto("/users/sign_in")
    const passwordForm = page.locator("form").nth(1)
    await passwordForm.locator('input[name="user[email]"]').fill("customer1@kumpunihomes.com")
    await passwordForm.locator('input[name="user[password]"]').fill("WrongPassword!")
    await passwordForm.getByRole("button", { name: /^Sign In$/ }).click()
    // Layout renders flash messages inside elements with data-controller="flash"
    await expect(page.locator('[data-controller="flash"]')).toBeVisible()
    await expect(page).not.toHaveURL(/dashboard/)
  })

  test("sign out returns to the landing page", async ({ page }) => {
    await signIn(page, "customer1@kumpunihomes.com", "Password123!")
    await signOut(page)
    await expect(page).toHaveURL(/\/$/)
    await expect(page.locator('nav').getByRole("link", { name: "Sign In" })).toBeVisible()
  })

  test("profile menu shows the correct role badge", async ({ page }) => {
    await signIn(page, "provider1@kumpunihomes.com", "Password123!")
    await page.locator('[data-controller="dropdown"]').nth(1).locator('button[data-action="click->dropdown#toggle"]').first().click()
    await expect(page.getByText("provider profile", { exact: false })).toBeVisible()
  })
})

test.describe("Access Control", () => {
  test("dashboard requires authentication", async ({ page }) => {
    await page.goto("/dashboard")
    await expect(page).toHaveURL(/sign_in/)
  })

  test("posting a request requires authentication", async ({ page }) => {
    await page.goto("/service_requests/new")
    await expect(page).toHaveURL(/sign_in/)
  })

  test("appointments require authentication", async ({ page }) => {
    await page.goto("/appointments")
    await expect(page).toHaveURL(/sign_in/)
  })

  test("admin area is not reachable by a customer", async ({ page }) => {
    await signIn(page, "customer1@kumpunihomes.com", "Password123!")
    await page.goto("/admin")
    // require_admin! bounces non-admins away from the admin namespace
    await expect(page).not.toHaveURL(/\/admin\/?$/)
  })
})
