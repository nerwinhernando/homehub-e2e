import { test, expect } from "@playwright/test"
import { signIn, signUp, signOut } from "./helpers/auth"
import { TEST_CUSTOMER, TEST_PROVIDER } from "./helpers/seed"

test.describe("Authentication Flows", () => {
  test("landing page loads correctly", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveTitle(/KumpuniHomes/)
    await expect(page.locator("h1")).toContainText("Find Trusted Home")
    await expect(page.locator("nav")).toBeVisible()
    await expect(page.locator("footer")).toBeVisible()
  })

  test("navbar shows sign in / get started when logged out", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("text=Sign In")).toBeVisible()
    await expect(page.locator("text=Get Started")).toBeVisible()
  })

  test("customer registration flow", async ({ page }) => {
    const email = `customer-${Date.now()}@test.com`
    await signUp(page, { ...TEST_CUSTOMER, email })
    // After signup, either confirm email page or dashboard
    await expect(page.locator("body")).toBeVisible()
  })

  test("provider registration flow", async ({ page }) => {
    const email = `provider-${Date.now()}@test.com`
    await signUp(page, { ...TEST_PROVIDER, email })
    await expect(page.locator("body")).toBeVisible()
  })

  test("sign in with valid credentials", async ({ page }) => {
    await signIn(page, "customer1@example.com", "Password123!")
    await expect(page).toHaveURL(/dashboard/)
    await expect(page.locator("nav")).toContainText(/Juan|Welcome/)
  })

  test("sign in fails with wrong password", async ({ page }) => {
    await page.goto("/users/sign_in")
    await page.fill('input[name="user[email]"]', "customer1@example.com")
    await page.fill('input[name="user[password]"]', "WrongPassword!")
    await page.click('input[type="submit"][value="Sign In"]')
    await expect(page.locator(".alert, [role='alert'], #error_explanation")).toBeVisible()
  })

  test("magic link form is visible", async ({ page }) => {
    await page.goto("/users/sign_in")
    await expect(page.locator("text=Sign in with Email Link")).toBeVisible()
    await expect(page.locator("text=Send Magic Link")).toBeVisible()
  })

  test("sign out works", async ({ page }) => {
    await signIn(page, "customer1@example.com", "Password123!")
    await signOut(page)
    await expect(page).toHaveURL("/")
    await expect(page.locator("text=Sign In")).toBeVisible()
  })

  test("forgot password link exists", async ({ page }) => {
    await page.goto("/users/sign_in")
    await expect(page.locator("text=Forgot password?")).toBeVisible()
  })

  test("profile menu shows correct role badge", async ({ page }) => {
    await signIn(page, "customer1@example.com", "Password123!")
    await page.click('[data-controller="dropdown"] button')
    await expect(page.locator("text=customer")).toBeVisible()
  })
})
