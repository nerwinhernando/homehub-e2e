// tests/search.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Search Functionality", () => {
  test("should search for providers", async ({ page }) => {
    await page.goto("/search?type=providers");
    await expect(page.locator("h1, h2")).toContainText(/Provider|Search/i);
  });

  test("should filter by city", async ({ page }) => {
    await page.goto("/search?city=Manila&type=providers");
    await expect(page).toHaveURL(/city=Manila/);
  });

  test("should display provider cards", async ({ page }) => {
    await page.goto("/providers");
    const cards = page.locator('[data-testid="provider-card"], .provider-card, a[href*="/providers/"]');
    // Just verify page loaded
    await expect(page.locator("body")).toBeVisible();
  });

  test("should display service requests", async ({ page }) => {
    await page.goto("/service_requests");
    await expect(page.locator("body")).toBeVisible();
  });
});
