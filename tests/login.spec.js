import { test, expect } from "@playwright/test";
import { resetStore, STUDENT, ADMIN } from "./helpers.js";

// Login tests don't need pre-authentication — reset store before each
test.beforeEach(async ({ context }) => {
  await resetStore(context);
});

// ─── Positive ────────────────────────────────────────────────────────────────

test("user can open login page", async ({ page }) => {
  await page.goto("/login");
  await expect(page).toHaveURL("/login");
  await expect(page.getByTestId("login-email")).toBeVisible();
  await expect(page.getByTestId("login-password")).toBeVisible();
  await expect(page.getByTestId("login-submit")).toBeVisible();
});

test("student can log in with valid credentials", async ({ page }) => {
  await page.goto("/login");
  await page.getByTestId("login-email").fill(STUDENT.email);
  await page.getByTestId("login-password").fill(STUDENT.password);
  await page.getByTestId("login-submit").click();
  await expect(page).toHaveURL("/dashboard");
});

test("admin can log in with valid admin credentials", async ({ page }) => {
  await page.goto("/login");
  await page.getByTestId("login-email").fill(ADMIN.email);
  await page.getByTestId("login-password").fill(ADMIN.password);
  await page.getByTestId("login-submit").click();
  await expect(page).toHaveURL("/dashboard");
});

test("successful login redirects to dashboard", async ({ page }) => {
  await page.goto("/login");
  await page.getByTestId("login-email").fill(STUDENT.email);
  await page.getByTestId("login-password").fill(STUDENT.password);
  await page.getByTestId("login-submit").click();
  await expect(page).toHaveURL("/dashboard");
  await expect(page.getByTestId("dashboard-title")).toBeVisible();
});

// ─── Negative ────────────────────────────────────────────────────────────────

test("empty email shows validation message", async ({ page }) => {
  await page.goto("/login");
  await page.getByTestId("login-submit").click();
  await expect(page.getByTestId("login-validation-email")).toBeVisible();
  await expect(page.getByTestId("login-validation-email")).toContainText("required");
});

test("empty password shows validation message", async ({ page }) => {
  await page.goto("/login");
  await page.getByTestId("login-email").fill(STUDENT.email);
  await page.getByTestId("login-submit").click();
  await expect(page.getByTestId("login-validation-password")).toBeVisible();
  await expect(page.getByTestId("login-validation-password")).toContainText("required");
});

test("wrong password shows invalid credentials error", async ({ page }) => {
  await page.goto("/login");
  await page.getByTestId("login-email").fill(STUDENT.email);
  await page.getByTestId("login-password").fill("wrongpassword");
  await page.getByTestId("login-submit").click();
  await expect(page.getByTestId("login-error")).toBeVisible();
  await expect(page.getByTestId("login-error")).toContainText("Invalid credentials");
});

test("unknown email shows invalid credentials error", async ({ page }) => {
  await page.goto("/login");
  await page.getByTestId("login-email").fill("nobody@test.com");
  await page.getByTestId("login-password").fill("test123");
  await page.getByTestId("login-submit").click();
  await expect(page.getByTestId("login-error")).toBeVisible();
});

test("user stays on login page after failed login", async ({ page }) => {
  await page.goto("/login");
  await page.getByTestId("login-email").fill("bad@test.com");
  await page.getByTestId("login-password").fill("badpass");
  await page.getByTestId("login-submit").click();
  await expect(page).toHaveURL("/login");
});

// ─── Edge ─────────────────────────────────────────────────────────────────────

test("already logged-in user visiting /login is redirected to dashboard", async ({ page, context }) => {
  // Login via API first
  await context.request.post("http://localhost:3001/api/test/login-as/student");
  await page.goto("/login");
  await expect(page).toHaveURL("/dashboard");
});

test("login button is disabled while request is in progress", async ({ page }) => {
  await page.goto("/login");
  await page.getByTestId("login-email").fill(STUDENT.email);
  await page.getByTestId("login-password").fill(STUDENT.password);

  await page.route("**/api/login", async (route) => {
    await new Promise((r) => setTimeout(r, 500));
    await route.continue();
  });

  await page.getByTestId("login-submit").click();
  await expect(page.getByTestId("login-submit")).toBeDisabled();
});
