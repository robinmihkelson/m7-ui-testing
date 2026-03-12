import { test as setup } from "@playwright/test";
import { STUDENT_AUTH, ADMIN_AUTH } from "./auth-paths.js";

setup("authenticate as student", async ({ page }) => {
  await page.goto("/login");
  await page.getByTestId("login-email").fill("student@test.com");
  await page.getByTestId("login-password").fill("test123");
  await page.getByTestId("login-submit").click();
  await page.waitForURL("/dashboard");
  await page.context().storageState({ path: STUDENT_AUTH });
});

setup("authenticate as admin", async ({ page }) => {
  await page.goto("/login");
  await page.getByTestId("login-email").fill("admin@test.com");
  await page.getByTestId("login-password").fill("admin123");
  await page.getByTestId("login-submit").click();
  await page.waitForURL("/dashboard");
  await page.context().storageState({ path: ADMIN_AUTH });
});
