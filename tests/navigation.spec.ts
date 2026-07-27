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
    await page.click("text=KumpuniHomes")
    await expect(page).toHaveURL("/")
  })

  test("customer dashboard shows correct sections", async ({ page }) => {
    await signIn(page, "customer1@kumpunihomes.com", "Password123!")
    const profileMenu = page.locator('[data-controller="dropdown"]').nth(1).locator('[data-dropdown-target="menu"]')
    await page.locator('[data-controller="dropdown"]').nth(1).locator('button[data-action="click->dropdown#toggle"]').first().click()
    await expect(profileMenu.getByRole("link", { name: "My Profile" })).toBeVisible()
    await expect(profileMenu.getByRole("link", { name: "Post a Request" })).toBeVisible()
    await expect(profileMenu.getByRole("link", { name: "Saved Providers" })).toBeVisible()
  })

  test("provider dashboard shows correct sections", async ({ page }) => {
    await signIn(page, "provider1@kumpunihomes.com", "Password123!")
    const profileMenu = page.locator('[data-controller="dropdown"]').nth(1).locator('[data-dropdown-target="menu"]')
    await page.locator('[data-controller="dropdown"]').nth(1).locator('button[data-action="click->dropdown#toggle"]').first().click()
    await expect(profileMenu.getByRole("link", { name: "My Profile" })).toBeVisible()
    await expect(profileMenu.getByRole("link", { name: "Provider Profile" })).toBeVisible()
    await expect(profileMenu.getByRole("link", { name: "My Availability" })).toBeVisible()
    await expect(profileMenu.getByRole("link", { name: "My Proposals" })).toBeVisible()
  })

  test("profile dropdown opens and closes", async ({ page }) => {
    await signIn(page, "customer1@kumpunihomes.com", "Password123!")
    const profileMenu = page.locator('[data-controller="dropdown"]').nth(1).locator('[data-dropdown-target="menu"]')
    await page.locator('[data-controller="dropdown"]').nth(1).locator('button[data-action="click->dropdown#toggle"]').first().click()
    await expect(profileMenu.getByRole("link", { name: "My Profile" })).toBeVisible()
    await page.click("body")
    await expect(profileMenu).not.toBeVisible()
  })

  test("notification bell shows", async ({ page }) => {
    await signIn(page, "customer1@kumpunihomes.com", "Password123!")
    await expect(page.locator('button svg').first()).toBeVisible()
  })

  test("footer has correct links", async ({ page }) => {
    await page.goto("/")
    const footer = page.locator("footer")
    await expect(footer.getByText(/^KumpuniHomes$/, { exact: true })).toBeVisible()
    await expect(footer.getByText("For Customers")).toBeVisible()
    await expect(footer.getByText("For Providers")).toBeVisible()
  })
})
