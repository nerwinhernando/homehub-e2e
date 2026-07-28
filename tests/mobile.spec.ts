// tests/mobile.spec.ts
import { test, expect, devices } from "@playwright/test"
import { signIn } from "./helpers/auth"

test.use({ ...devices["iPhone 14"] })

test.describe("Mobile Responsiveness", () => {
  test("landing page renders on mobile", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("h1")).toBeVisible()
    await expect(page.locator("nav")).toBeVisible()
  })

  test("search bar works on mobile", async ({ page }) => {
    await page.goto("/")
    await page.fill('input[name="q"]', "Plumber")
    await page.tap('button[type="submit"]')
    await expect(page).toHaveURL(/search/)
  })

  test("mobile sign in form is usable", async ({ page }) => {
    await page.goto("/users/sign_in")
    const passwordForm = page.locator("form").nth(1)
    await expect(passwordForm).toBeVisible()
    await expect(passwordForm.locator('input[name="user[email]"]')).toBeVisible()
    await expect(passwordForm.locator('input[name="user[password]"]')).toBeVisible()
  })

  test("dashboard is accessible on mobile", async ({ page }) => {
    await signIn(page, "customer1@kumpunihomes.com", "Password123!")
    await expect(page.locator("body")).toBeVisible()
    await expect(page.locator("nav")).toBeVisible()
  })
})
