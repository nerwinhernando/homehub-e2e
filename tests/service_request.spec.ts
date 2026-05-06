// tests/service_request.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Service Requests", () => {
  test("should show service requests listing", async ({ page }) => {
    await page.goto("/service_requests");
    await expect(page.locator("h1, h2")).toBeVisible();
  });

  test("should require auth to post request", async ({ page }) => {
    await page.goto("/service_requests/new");
    await expect(page).toHaveURL(/sign_in|login/);
  });
});
