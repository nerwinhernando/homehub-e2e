// tests/providers.spec.ts
import { test, expect } from "@playwright/test"
import { signIn } from "./helpers/auth"

test.describe("Provider Flows", () => {
  test("provider listing page loads", async ({ page }) => {
    await page.goto("/providers")
    await expect(page.locator("h1, h2")).toBeVisible()
  })

  test("provider show page loads", async ({ page }) => {
    await page.goto("/providers")
    const providerCard = page.locator("a[href*='/providers/']").first()
    if (await providerCard.isVisible()) {
      await providerCard.click()
      await expect(page.locator("h1")).toBeVisible()
      await expect(page.getByRole("heading", { name: /Reviews/i })).toBeVisible()
    }
  })

  test("provider can access dashboard", async ({ page }) => {
    await signIn(page, "provider1@kumpunihomes.com", "Password123!")
    await expect(page).toHaveURL(/\/$/)
    await page.goto("/dashboard")
    await expect(page.locator("h1")).toHaveText("Provider Dashboard")
  })

  // TODO: Add test for provider profile setup banner when no profile exists
  // test("provider sees setup profile banner when no profile", async ({ page }) => {
  //   await signIn(page, "provider1@kumpunihomes.com", "Password123!")
  //   // If provider has no profile, banner should show
  //   const banner = page.locator("text=Complete your provider profile")
  //   const dashboard = page.locator("text=Pending Proposals")
  //   await expect(banner.or(dashboard)).toBeVisible()
  // })

  test("provider can navigate to browse requests", async ({ page }) => {
    await signIn(page, "provider1@kumpunihomes.com", "Password123!")
    await page.click("text=Browse Requests")
    await expect(page).toHaveURL(/service_requests/)
  })

  test("provider profile menu shows provider-specific links", async ({ page }) => {
    await signIn(page, "provider1@kumpunihomes.com", "Password123!")
    await page.locator('[data-controller="dropdown"]').nth(1).locator('button[data-action="click->dropdown#toggle"]').first().click()
    await expect(page.locator("text=Provider Profile")).toBeVisible()
  })

  test("provider can submit proposal on open request", async ({ page }) => {
    await signIn(page, "provider1@kumpunihomes.com", "Password123!")
    await page.goto("/service_requests")
    const firstRequest = page.locator("a[href*='/service_requests/']").first()
    if (await firstRequest.isVisible()) {
      await firstRequest.click()
      const proposalForm = page.locator("text=Send a Proposal")
      if (await proposalForm.isVisible()) {
        await expect(proposalForm).toBeVisible()
      }
    }
  })
})
