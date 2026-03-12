import { test, expect } from "@playwright/test";
import { adminTest, studentTest, BOOKS } from "./helpers.js";

// ─── Positive ────────────────────────────────────────────────────────────────

adminTest("admin can open admin books page", async ({ page }) => {
  await page.goto("/admin/books");
  await expect(page.getByTestId("admin-books-list")).toBeVisible();
});

adminTest("admin books list shows all seeded books", async ({ page }) => {
  await page.goto("/admin/books");
  const rows = page.getByTestId("admin-books-list").locator("tbody tr");
  await expect(rows).toHaveCount(10);
});

adminTest("admin can add a valid new book", async ({ page }) => {
  await page.goto("/admin/books");
  await page.getByTestId("admin-book-title").fill("Test Driven Development");
  await page.getByTestId("admin-book-author").fill("Kent Beck");
  await page.getByTestId("admin-book-category").selectOption("Testing");
  await page.getByTestId("admin-book-submit").click();
  await expect(page.getByTestId("admin-books-list")).toContainText("Test Driven Development");
  await expect(page.getByTestId("admin-books-list")).toContainText("Kent Beck");
});

adminTest("newly added book appears in the public books list", async ({ page }) => {
  await page.goto("/admin/books");
  await page.getByTestId("admin-book-title").fill("New Test Book");
  await page.getByTestId("admin-book-author").fill("Some Author");
  await page.getByTestId("admin-book-category").selectOption("Programming");
  await page.getByTestId("admin-book-submit").click();

  await page.goto("/books");
  await expect(page.locator("[data-testid^='book-title-']").filter({ hasText: "New Test Book" })).toBeVisible();
});

adminTest("admin can toggle book availability to unavailable", async ({ page }) => {
  await page.goto("/admin/books");
  await page.getByTestId(`admin-book-toggle-${BOOKS.cleanCode}`).click();
  const row = page.getByTestId("admin-books-list").locator("tr").filter({
    has: page.getByTestId(`admin-book-toggle-${BOOKS.cleanCode}`),
  });
  await expect(row.locator(".badge")).toContainText("Unavailable");
});

adminTest("admin can toggle book availability back to available", async ({ page }) => {
  await page.goto("/admin/books");
  await page.getByTestId(`admin-book-toggle-${BOOKS.cssSecrets}`).click();
  const row = page.getByTestId("admin-books-list").locator("tr").filter({
    has: page.getByTestId(`admin-book-toggle-${BOOKS.cssSecrets}`),
  });
  await expect(row.locator(".badge")).toContainText("Available");
});

adminTest("admin can open admin reservations page", async ({ page }) => {
  await page.goto("/admin/reservations");
  await expect(page.getByTestId("admin-reservations-list")).toBeVisible();
});

adminTest("admin reservations page shows all seeded reservations", async ({ page }) => {
  await page.goto("/admin/reservations");
  const rows = page.getByTestId("admin-reservations-list").locator("tbody tr");
  await expect(rows).toHaveCount(2);
});

adminTest("admin reservations list shows user names and book titles", async ({ page }) => {
  await page.goto("/admin/reservations");
  await expect(page.getByTestId("admin-reservations-list")).toContainText("Student One");
  await expect(page.getByTestId("admin-reservations-list")).toContainText("Student Two");
  await expect(page.getByTestId("admin-reservations-list")).toContainText("You Don't Know JS");
  await expect(page.getByTestId("admin-reservations-list")).toContainText("Domain-Driven Design");
});

// ─── Negative (form validation) ──────────────────────────────────────────────

adminTest("empty title is rejected — list count stays at 10", async ({ page }) => {
  await page.goto("/admin/books");
  await page.getByTestId("admin-book-author").fill("Some Author");
  await page.getByTestId("admin-book-submit").click();
  await expect(page.getByTestId("admin-books-list").locator("tbody tr")).toHaveCount(10);
});

adminTest("empty author is rejected — list count stays at 10", async ({ page }) => {
  await page.goto("/admin/books");
  await page.getByTestId("admin-book-title").fill("Some Title");
  await page.getByTestId("admin-book-submit").click();
  await expect(page.getByTestId("admin-books-list").locator("tbody tr")).toHaveCount(10);
});

// ─── Access control ───────────────────────────────────────────────────────────

studentTest("student is blocked from admin books page", async ({ page }) => {
  await page.goto("/admin/books");
  await expect(page).toHaveURL("/403");
});

studentTest("student is blocked from admin reservations page", async ({ page }) => {
  await page.goto("/admin/reservations");
  await expect(page).toHaveURL("/403");
});
