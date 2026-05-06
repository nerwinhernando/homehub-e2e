// tests/helpers/auth.ts
import { Page } from "@playwright/test"

export async function signIn(page: Page, email: string, password: string) {
  await page.goto("/users/sign_in")
  await page.fill('input[name="user[email]"]', email)
  await page.fill('input[name="user[password]"]', password)
  await page.click('input[type="submit"][value="Sign In"]')
  await page.waitForURL(/dashboard/)
}

export async function signUp(
  page: Page,
  opts: {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    role?: "customer" | "provider"
  }
) {
  await page.goto("/users/sign_up")
  if (opts.role === "provider") {
    await page.click('input[name="user[role]"][value="provider"]')
  }
  await page.fill('input[name="user[first_name]"]', opts.firstName)
  await page.fill('input[name="user[last_name]"]', opts.lastName)
  await page.fill('input[name="user[email]"]', opts.email)
  await page.fill('input[name="user[phone]"]', opts.phone)
  await page.fill('input[name="user[password]"]', opts.password)
  await page.fill('input[name="user[password_confirmation]"]', opts.password)
  await page.click('input[type="submit"]')
}

export async function signOut(page: Page) {
  await page.click('[data-controller="dropdown"] button')
  await page.click('text=Sign Out')
  await page.waitForURL("/")
}
