// tests/auth.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should show landing page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/KumpuniHomes/);
    await expect(page.locator("h1")).toContainText("Find Trusted Home");
  });

  test("should navigate to sign in page", async ({ page }) => {
    await page.goto("/");
    await page.click("text=Sign In");
    await expect(page).toHaveURL(/sign_in/);
    await expect(page.locator("h1")).toContainText("Welcome back");
  });

  test("should show registration form", async ({ page }) => {
    await page.goto("/users/sign_up");
    await expect(page.locator("h1")).toContainText("Create your account");
    await expect(page.locator('input[name="user[email]"]')).toBeVisible();
    await expect(page.locator('input[name="user[password]"]')).toBeVisible();
  });

  test("should register new customer", async ({ page }) => {
    await page.goto("/users/sign_up");
    await page.fill('input[name="user[first_name]"]', "Juan");
    await page.fill('input[name="user[last_name]"]', "dela Cruz");
    await page.fill('input[name="user[email]"]', `test${Date.now()}@example.com`);
    await page.fill('input[name="user[phone]"]', "09123456789");
    await page.fill('input[name="user[password]"]', "Password123!");
    await page.fill('input[name="user[password_confirmation]"]', "Password123!");
    await page.click('input[type="submit"]');
    // Should redirect to confirmation or dashboard
    await expect(page.url()).not.toContain("sign_up");
  });
});
