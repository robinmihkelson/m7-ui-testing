import { test, expect } from "@playwright/test";
import { studentTest, BOOKS } from "./helpers.js";

// ─── Positive ────────────────────────────────────────────────────────────────

studentTest("details page shows correct book title", async ({ page }) => {
  await page.goto(`/books/${BOOKS.cleanCode}`);
  await expect(page.getByTestId("book-detail-title")).toContainText("Clean Code");
});

studentTest("details page shows correct author", async ({ page }) => {
  await page.goto(`/books/${BOOKS.cleanCode}`);
  await expect(page.getByTestId("book-detail-author")).toContainText("Robert C. Martin");
});

studentTest("details page shows category", async ({ page }) => {
  await page.goto(`/books/${BOOKS.cleanCode}`);
  await expect(page.getByTestId("book-detail-category")).toContainText("Programming");
});

studentTest("details page shows availability status", async ({ page }) => {
  await page.goto(`/books/${BOOKS.cleanCode}`);
  await expect(page.getByTestId("book-detail-status")).toContainText("Available");
});

studentTest("back button returns to books page", async ({ page }) => {
  await page.goto(`/books/${BOOKS.cleanCode}`);
  await expect(page.getByTestId("book-detail-title")).toBeVisible();
  await page.getByTestId("book-detail-back").click();
  await expect(page).toHaveURL("/books");
});

studentTest("reserve action works from details page", async ({ page }) => {
  await page.goto(`/books/${BOOKS.refactoring}`);
  await expect(page.getByTestId("book-detail-reserve")).toBeEnabled();
  await page.getByTestId("book-detail-reserve").click();
  await expect(page.getByTestId("book-detail-status")).toContainText("Unavailable");
  await expect(page.getByTestId("book-detail-reserve")).toBeDisabled();
});

studentTest("reserve button becomes disabled after reserving", async ({ page }) => {
  await page.goto(`/books/${BOOKS.pragmaticProgrammer}`);
  await expect(page.getByTestId("book-detail-reserve")).toBeEnabled();
  await page.getByTestId("book-detail-reserve").click();
  await expect(page.getByTestId("book-detail-reserve")).toBeDisabled();
});

// ─── Negative ────────────────────────────────────────────────────────────────

studentTest("unavailable book has disabled reserve button on details page", async ({ page }) => {
  await page.goto(`/books/${BOOKS.jsGoodParts}`);
  await expect(page.getByTestId("book-detail-status")).toContainText("Unavailable");
  await expect(page.getByTestId("book-detail-reserve")).toBeDisabled();
});

studentTest("invalid book ID shows error message", async ({ page }) => {
  await page.goto("/books/99999");
  await expect(page.getByTestId("error-message")).toBeVisible();
});

test("unauthenticated user cannot access book details page", async ({ page }) => {
  await page.goto(`/books/${BOOKS.cleanCode}`);
  await expect(page).toHaveURL("/login");
});
