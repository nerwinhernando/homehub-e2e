// tests/reviews.spec.ts
import { test, expect } from "@playwright/test"
import { signIn } from "./helpers/auth"

test.describe("Review Flows", () => {
  test("review form has star rating", async ({ page }) => {
    await signIn(page, "customer1@example.com", "Password123!")
    await page.goto("/appointments")
    // Navigate to a completed appointment
    const completedLinks = page.locator("text=Leave a Review")
    if (await completedLinks.first().isVisible()) {
      await completedLinks.first().click()
      await expect(page.locator("[data-controller='star-rating']")).toBeVisible()
      await expect(page.locator('textarea[name="review[comment]"]')).toBeVisible()
    }
  })

  test("provider show page displays reviews section", async ({ page }) => {
    await page.goto("/providers")
    const providerLink = page.locator("a[href*='/providers/']").first()
    if (await providerLink.isVisible()) {
      await providerLink.click()
      await expect(page.locator("text=Reviews")).toBeVisible()
    }
  })
})
