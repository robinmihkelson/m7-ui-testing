import { test, expect } from "@playwright/test";
import { studentTest, adminTest } from "./helpers.js";

// ─── Unauthenticated redirects ────────────────────────────────────────────────

test("unauthenticated user visiting / is redirected to login", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL("/login");
});

test("unauthenticated user visiting /dashboard is redirected to login", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL("/login");
});

test("unauthenticated user visiting /books is redirected to login", async ({ page }) => {
  await page.goto("/books");
  await expect(page).toHaveURL("/login");
});

test("unauthenticated user visiting /my-reservations is redirected to login", async ({ page }) => {
  await page.goto("/my-reservations");
  await expect(page).toHaveURL("/login");
});

test("unauthenticated user visiting /admin/books is redirected to login", async ({ page }) => {
  await page.goto("/admin/books");
  await expect(page).toHaveURL("/login");
});

test("unauthenticated user visiting /admin/reservations is redirected to login", async ({ page }) => {
  await page.goto("/admin/reservations");
  await expect(page).toHaveURL("/login");
});

// ─── Student is blocked from admin routes ─────────────────────────────────────

studentTest("student visiting /admin/books is shown 403 page", async ({ page }) => {
  await page.goto("/admin/books");
  await expect(page).toHaveURL("/403");
});

studentTest("student visiting /admin/reservations is shown 403 page", async ({ page }) => {
  await page.goto("/admin/reservations");
  await expect(page).toHaveURL("/403");
});

// ─── Admin has full access ────────────────────────────────────────────────────

adminTest("admin can access /dashboard", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL("/dashboard");
});

adminTest("admin can access /books", async ({ page }) => {
  await page.goto("/books");
  await expect(page).toHaveURL("/books");
});

adminTest("admin can access /admin/books", async ({ page }) => {
  await page.goto("/admin/books");
  await expect(page).toHaveURL("/admin/books");
});

// ─── Session ends after logout ────────────────────────────────────────────────

studentTest("session ends after logout — API returns 401", async ({ page, context }) => {
  await page.goto("/dashboard");
  await expect(page.getByTestId("dashboard-title")).toBeVisible();
  await page.getByTestId("logout-button").click();
  await page.waitForURL("/login");

  const res = await context.request.get("http://localhost:3001/api/me");
  expect(res.status()).toBe(401);
});

studentTest("protected page is inaccessible after logout", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByTestId("dashboard-title")).toBeVisible();
  await page.getByTestId("logout-button").click();
  await page.waitForURL("/login");
  await page.goto("/books");
  await expect(page).toHaveURL("/login");
});
