import { test, expect } from "@playwright/test"
import { signIn } from "./helpers/auth"

test.describe("Navigation", () => {
  test("navbar links work when logged out", async ({ page }) => {
    await page.goto("/")
    await page.click("text=Find Providers")
    await expect(page).toHaveURL(/providers/)

    await page.goto("/")
    await page.click("text=Service Requests")
    await expect(page).toHaveURL(/service_requests/)

    await page.goto("/")
    await page.click("text=How It Works")
    await expect(page).toHaveURL(/about/)
  })

  test("logo links back to home", async ({ page }) => {
    await page.goto("/providers")
    await page.click("text=HomeHubPH")
    await expect(page).toHaveURL("/")
  })

  test("customer dashboard shows correct sections", async ({ page }) => {
    await signIn(page, "customer1@example.com", "Password123!")
    await expect(page.locator("text=My Requests")).toBeVisible()
    await expect(page.locator("text=Upcoming Appointments")).toBeVisible()
    await expect(page.locator("text=Post New Request")).toBeVisible()
  })

  test("provider dashboard shows correct sections", async ({ page }) => {
    await signIn(page, "provider1@example.com", "Password123!")
    await expect(page.locator("text=Pending Proposals")).toBeVisible()
    await expect(page.locator("text=Upcoming Jobs")).toBeVisible()
    await expect(page.locator("text=Recent Reviews")).toBeVisible()
  })

  test("profile dropdown opens and closes", async ({ page }) => {
    await signIn(page, "customer1@example.com", "Password123!")
    const dropdown = page.locator('[data-controller="dropdown"]').first()
    await dropdown.locator("button").click()
    await expect(page.locator("text=My Profile")).toBeVisible()
    await page.click("body")
    await expect(page.locator("text=My Profile")).not.toBeVisible()
  })

  test("notification bell shows", async ({ page }) => {
    await signIn(page, "customer1@example.com", "Password123!")
    await expect(page.locator('button svg').first()).toBeVisible()
  })

  test("footer has correct links", async ({ page }) => {
    await page.goto("/")
    const footer = page.locator("footer")
    await expect(footer.locator("text=HomeHubPH")).toBeVisible()
    await expect(footer.locator("text=For Customers")).toBeVisible()
    await expect(footer.locator("text=For Providers")).toBeVisible()
  })
})
