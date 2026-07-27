import { test, expect } from "@playwright/test"
import { signIn } from "./helpers/auth"

test.describe("Service Request Flows", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, "customer1@kumpunihomes.com", "Password123!")
  })

  test("customer can navigate to new request form", async ({ page }) => {
    await page.goto("/dashboard")
    await page.click("text=Post New Request")
    await expect(page).toHaveURL(/service_requests\/new/)
  })

  test("new service request form has all fields", async ({ page }) => {
    await page.goto("/service_requests/new")
    await expect(page.locator('input[name="service_request[title]"]')).toBeVisible()
    await expect(page.locator('textarea[name="service_request[description]"]')).toBeVisible()
    await expect(page.locator('select[name="service_request[category_id]"]')).toBeVisible()
    await expect(page.locator('select[name="service_request[city]"]')).toBeVisible()
    await expect(page.locator('input[name="service_request[budget_min]"]')).toBeVisible()
    await expect(page.locator('input[name="service_request[budget_max]"]')).toBeVisible()
  })

  test("creating a service request with valid data", async ({ page }) => {
    await page.goto("/service_requests/new")
    await page.fill('input[name="service_request[title]"]', "Need electrician for panel upgrade")
    await page.fill('textarea[name="service_request[description]"]',
      "My electrical panel needs upgrading. Looking for licensed electrician with at least 5 years experience."
    )
    await page.selectOption('select[name="service_request[category_id]"]', { index: 1 })
    await page.selectOption('select[name="service_request[city]"]', "Manila")
    await page.fill('input[name="service_request[budget_min]"]', "3000")
    await page.fill('input[name="service_request[budget_max]"]', "8000")
    await page.click('input[type="submit"]')
    await expect(page.locator('[data-controller="flash"]')).toBeVisible()
  })

  test("service request validation shows errors", async ({ page }) => {
    await page.goto("/service_requests/new")
    await page.click('input[type="submit"]')
    await expect(page.getByText(/errors prevented this from being saved/i)).toBeVisible()
    await expect(page.getByText(/Category must exist/i)).toBeVisible()
    await expect(page.getByText(/Title can't be blank/i)).toBeVisible()
    await expect(page.getByText(/Description can't be blank/i)).toBeVisible()
    await expect(page.getByText(/City can't be blank/i)).toBeVisible()
  })

  test("service request show page has correct sections", async ({ page }) => {
    await page.goto("/service_requests")
    const firstRequest = page.locator("a[href*='/service_requests/']").first()
    if (await firstRequest.isVisible()) {
      await firstRequest.click()
      await expect(page.locator("h1")).toBeVisible()
      await expect(page.locator("text=Proposals")).toBeVisible()
      await expect(page.locator("text=Posted by")).toBeVisible()
    }
  })

  test("customer can edit their own request", async ({ page }) => {
    await page.goto("/service_requests")
    // navigate to a request owned by this user
    await page.goto("/dashboard")
    const ownRequest = page.locator("a[href*='/service_requests/']").first()
    if (await ownRequest.isVisible()) {
      const href = await ownRequest.getAttribute("href")
      await page.goto(`${href}/edit`)
      await expect(page.locator("h1, h2")).toContainText(/Edit|Update/)
    }
  })

  test("post request CTA visible in navbar profile menu", async ({ page }) => {
    const profileMenu = page.locator('[data-controller="dropdown"]').nth(1).locator('[data-dropdown-target="menu"]')
    await page.locator('[data-controller="dropdown"]').nth(1).locator('button[data-action="click->dropdown#toggle"]').first().click()
    await expect(profileMenu.getByRole("link", { name: "Post a Request" })).toBeVisible()
  })
})
