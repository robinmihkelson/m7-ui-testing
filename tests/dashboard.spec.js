import { test, expect } from "@playwright/test";
import { studentTest, adminTest } from "./helpers.js";

// ─── Positive ────────────────────────────────────────────────────────────────

studentTest("dashboard loads after login", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByTestId("dashboard-title")).toBeVisible();
});

studentTest("student name is shown on dashboard", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByTestId("dashboard-title")).toContainText("Student One");
});

studentTest("student role badge shows 'student'", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByTestId("user-role-badge")).toContainText("student");
});

studentTest("student sees Books navigation link", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByTestId("dashboard-title")).toBeVisible();
  await expect(page.getByTestId("nav-books").first()).toBeVisible();
});

studentTest("student sees My Reservations navigation link", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByTestId("dashboard-title")).toBeVisible();
  await expect(page.getByTestId("nav-my-reservations").first()).toBeVisible();
});

adminTest("admin sees admin books navigation link", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByTestId("dashboard-title")).toBeVisible();
  await expect(page.getByTestId("nav-admin-books").first()).toBeVisible();
});

adminTest("admin sees admin reservations navigation link", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByTestId("dashboard-title")).toBeVisible();
  await expect(page.getByTestId("nav-admin-reservations").first()).toBeVisible();
});

adminTest("admin name is shown on dashboard", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByTestId("dashboard-title")).toBeVisible();
  await expect(page.getByTestId("dashboard-title")).toContainText("Admin User");
});

// ─── Negative ────────────────────────────────────────────────────────────────

studentTest("student does NOT see admin navigation links", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByTestId("dashboard-title")).toBeVisible();
  await expect(page.getByTestId("nav-admin-books")).not.toBeVisible();
  await expect(page.getByTestId("nav-admin-reservations")).not.toBeVisible();
});

test("unauthenticated user visiting /dashboard is redirected to login", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL("/login");
});

studentTest("logout clears session and redirects to login", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByTestId("dashboard-title")).toBeVisible();
  await page.getByTestId("logout-button").click();
  await expect(page).toHaveURL("/login");
});

studentTest("after logout, visiting /dashboard redirects to login", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByTestId("dashboard-title")).toBeVisible();
  await page.getByTestId("logout-button").click();
  await page.waitForURL("/login");
  await page.goto("/dashboard");
  await expect(page).toHaveURL("/login");
});
