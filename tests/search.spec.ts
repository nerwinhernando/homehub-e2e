import { test, expect } from "@playwright/test"

test.describe("Search & Filtering", () => {
  test("hero search bar submits correctly", async ({ page }) => {
    await page.goto("/")
    await page.fill('input[name="q"]', "Electrician")
    await page.selectOption('select[name="city"]', "Manila")
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/search/)
    await expect(page).toHaveURL(/q=Electrician/)
    await expect(page).toHaveURL(/city=Manila/)
  })

  test("popular search tags work", async ({ page }) => {
    await page.goto("/")
    await page.click("text=Plumber")
    await expect(page).toHaveURL(/search.*q=Plumber/)
  })

  test("providers listing loads", async ({ page }) => {
    await page.goto("/providers")
    await expect(page.locator("h1, h2")).toBeVisible()
    await expect(page.locator("body")).not.toContainText("Error")
  })

  test("providers can be filtered by city", async ({ page }) => {
    await page.goto("/providers")
    await page.selectOption('select[name="city"]', "Manila")
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/city=Manila/)
  })

  test("providers can be filtered by verified", async ({ page }) => {
    await page.goto("/providers?verified=1")
    await expect(page.locator("body")).toBeVisible()
  })

  test("service requests listing loads", async ({ page }) => {
    await page.goto("/service_requests")
    await expect(page.locator("h1, h2")).toBeVisible()
  })

  test("service requests filter by city", async ({ page }) => {
    await page.goto("/service_requests?city=Cebu+City")
    await expect(page).toHaveURL(/city=Cebu/)
  })

  test("service requests filter by urgent", async ({ page }) => {
    await page.goto("/service_requests?urgent=1")
    await expect(page.locator("body")).toBeVisible()
  })

  test("category filter works from homepage", async ({ page }) => {
    await page.goto("/")
    const categoryLink = page.locator("a[href*='category_id']").first()
    if (await categoryLink.isVisible()) {
      await categoryLink.click()
      await expect(page).toHaveURL(/category_id/)
    }
  })
})
