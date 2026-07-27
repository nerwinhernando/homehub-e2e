import { Page } from "@playwright/test"

/**
 * Auth helpers for KumpuniHomes E2E specs.
 *
 * Updated for the current UI:
 *  - Sign-in page shows separate email-link and password sign-in forms.
 *  - Sign-up uses role-selection cards (user[role] radios) and, because accounts
 *    are :confirmable, lands on /confirmation-pending rather than the dashboard.
 */

interface SignUpOptions {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  role?: "customer" | "provider"
}

/** Sign in with email + password via the Password tab. Waits for the dashboard. */
export async function signIn(page: Page, email: string, password: string) {
  await page.goto("/users/sign_in")

  const passwordForm = page.locator("form").nth(1)
  await passwordForm.fill('input[name="user[email]"]', email)
  await passwordForm.fill('input[name="user[password]"]', password)
  await passwordForm.getByRole("button", { name: /^Sign In$/ }).click()

  await page.waitForURL(/dashboard/)
}

/** Request a magic link for the given email via the email-link form. */
export async function requestMagicLink(page: Page, email: string) {
  await page.goto("/users/sign_in")

  const magicForm = page.locator("form").first()
  await magicForm.fill('input[name="user[email]"]', email)
  await magicForm.getByRole("button", { name: /Send Magic Link/i }).click()
}

/**
 * Register a new account. Selects the role card, fills the form, and submits.
 * Does NOT wait for the dashboard — new users are :confirmable and are
 * redirected to /confirmation-pending. Callers assert on the destination.
 */
export async function signUp(page: Page, opts: SignUpOptions) {
  await page.goto("/users/sign_up")

  if (opts.role === "provider") {
    // Role cards are label-wrapped radios; check the underlying input.
    await page.check('input[name="user[role]"][value="provider"]', { force: true })
  } else {
    await page.check('input[name="user[role]"][value="customer"]', { force: true })
  }

  await page.fill('input[name="user[first_name]"]', opts.firstName)
  await page.fill('input[name="user[last_name]"]', opts.lastName)
  await page.fill('input[name="user[email]"]', opts.email)
  await page.fill('input[name="user[phone]"]', opts.phone)
  await page.fill('input[name="user[password]"]', opts.password)
  await page.fill('input[name="user[password_confirmation]"]', opts.password)

  await page.getByRole("button", { name: /Create Account/i }).click()
}

/** Open the profile dropdown and sign out. Waits for the landing page. */
export async function signOut(page: Page) {
  // The profile dropdown is the last dropdown in the navbar (notifications is first).
  await page.locator('[data-controller="dropdown"] button').last().click()
  await page.getByRole("button", { name: /Sign Out/i }).click()
  await page.waitForURL(/\/$/)
}
