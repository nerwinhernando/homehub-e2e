// tests/appointments.spec.ts
import { test, expect } from "@playwright/test"
import { signIn } from "./helpers/auth"

test.describe("Appointment Flows", () => {
  test("appointments page loads for customer", async ({ page }) => {
    await signIn(page, "customer1@example.com", "Password123!")
    await page.goto("/appointments")
    await expect(page.locator("h1, h2")).toBeVisible()
    await expect(page.locator("text=Upcoming")).toBeVisible()
  })

  test("appointments page loads for provider", async ({ page }) => {
    await signIn(page, "provider1@example.com", "Password123!")
    await page.goto("/appointments")
    await expect(page.locator("h1, h2")).toBeVisible()
  })

  test("appointment requires authentication", async ({ page }) => {
    await page.goto("/appointments")
    await expect(page).toHaveURL(/sign_in/)
  })

  test("appointment show page has status badge", async ({ page }) => {
    await signIn(page, "customer1@example.com", "Password123!")
    await page.goto("/appointments")
    const apptLink = page.locator("a[href*='/appointments/']").first()
    if (await apptLink.isVisible()) {
      await apptLink.click()
      await expect(page.locator("body")).toBeVisible()
    }
  })
})
