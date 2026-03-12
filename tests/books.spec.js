import { test, expect } from "@playwright/test";
import { studentTest, BOOKS } from "./helpers.js";

// ─── Positive ────────────────────────────────────────────────────────────────

studentTest("books page loads", async ({ page }) => {
  await page.goto("/books");
  await expect(page.getByTestId("books-list")).toBeVisible();
});

studentTest("all 10 seeded books are displayed", async ({ page }) => {
  await page.goto("/books");
  const cards = page.getByTestId("books-list").locator("[data-testid^='book-card-']");
  await expect(cards).toHaveCount(10);
});

studentTest("each book shows title and author", async ({ page }) => {
  await page.goto("/books");
  await expect(page.getByTestId(`book-title-${BOOKS.cleanCode}`)).toContainText("Clean Code");
  await expect(page.getByTestId(`book-author-${BOOKS.cleanCode}`)).toContainText("Robert C. Martin");
});

studentTest("available book has enabled reserve button", async ({ page }) => {
  await page.goto("/books");
  await expect(page.getByTestId(`book-reserve-${BOOKS.refactoring}`)).toBeEnabled();
});

studentTest("unavailable book has disabled reserve button", async ({ page }) => {
  await page.goto("/books");
  await expect(page.getByTestId(`book-reserve-${BOOKS.jsGoodParts}`)).toBeDisabled();
});

studentTest("unavailable book shows 'Unavailable' status badge", async ({ page }) => {
  await page.goto("/books");
  await expect(page.getByTestId(`book-status-${BOOKS.jsGoodParts}`)).toContainText("Unavailable");
});

studentTest("available book shows 'Available' status badge", async ({ page }) => {
  await page.goto("/books");
  await expect(page.getByTestId(`book-status-${BOOKS.cleanCode}`)).toContainText("Available");
});

studentTest("clicking details opens the book details page", async ({ page }) => {
  await page.goto("/books");
  await page.getByTestId(`book-details-${BOOKS.cleanCode}`).click();
  await expect(page).toHaveURL(`/books/${BOOKS.cleanCode}`);
  await expect(page.getByTestId("book-detail-title")).toContainText("Clean Code");
});

// ─── Search / filter ─────────────────────────────────────────────────────────

studentTest("search by exact title works", async ({ page }) => {
  await page.goto("/books");
  await expect(page.getByTestId("books-list")).toBeVisible();
  await page.getByTestId("books-search").fill("Clean Code");
  const cards = page.getByTestId("books-list").locator("[data-testid^='book-card-']");
  await expect(cards).toHaveCount(1);
  await expect(page.getByTestId(`book-title-${BOOKS.cleanCode}`)).toBeVisible();
});

studentTest("search by partial title works", async ({ page }) => {
  await page.goto("/books");
  await expect(page.getByTestId("books-list")).toBeVisible();
  await page.getByTestId("books-search").fill("Eloquent");
  await expect(page.getByTestId(`book-card-${BOOKS.eloquentJs}`)).toBeVisible();
});

studentTest("search by author works", async ({ page }) => {
  await page.goto("/books");
  await expect(page.getByTestId("books-list")).toBeVisible();
  await page.getByTestId("books-search").fill("Martin Fowler");
  await expect(page.getByTestId(`book-card-${BOOKS.refactoring}`)).toBeVisible();
});

studentTest("search is case-insensitive", async ({ page }) => {
  await page.goto("/books");
  await expect(page.getByTestId("books-list")).toBeVisible();
  await page.getByTestId("books-search").fill("clean code");
  await expect(page.getByTestId(`book-card-${BOOKS.cleanCode}`)).toBeVisible();
});

studentTest("category filter shows only matching books", async ({ page }) => {
  await page.goto("/books");
  await expect(page.getByTestId("books-list")).toBeVisible();
  await page.getByTestId("books-category-filter").selectOption("CSS");
  const cards = page.getByTestId("books-list").locator("[data-testid^='book-card-']");
  await expect(cards).toHaveCount(1);
  await expect(page.getByTestId(`book-card-${BOOKS.cssSecrets}`)).toBeVisible();
});

studentTest("availability filter 'Available' shows only available books", async ({ page }) => {
  await page.goto("/books");
  await expect(page.getByTestId("books-list")).toBeVisible();
  await page.getByTestId("books-availability-filter").selectOption("Available");
  const cards = page.getByTestId("books-list").locator("[data-testid^='book-card-']");
  await expect(cards).toHaveCount(8);
});

studentTest("availability filter 'Unavailable' shows only unavailable books", async ({ page }) => {
  await page.goto("/books");
  await expect(page.getByTestId("books-list")).toBeVisible();
  await page.getByTestId("books-availability-filter").selectOption("Unavailable");
  const cards = page.getByTestId("books-list").locator("[data-testid^='book-card-']");
  await expect(cards).toHaveCount(2);
});

studentTest("clearing search input restores full book list", async ({ page }) => {
  await page.goto("/books");
  await expect(page.getByTestId("books-list")).toBeVisible();
  await page.getByTestId("books-search").fill("Clean Code");
  await expect(page.getByTestId("books-list").locator("[data-testid^='book-card-']")).toHaveCount(1);
  await page.getByTestId("books-search").clear();
  await expect(page.getByTestId("books-list").locator("[data-testid^='book-card-']")).toHaveCount(10);
});

studentTest("resetting category filter to All restores full list", async ({ page }) => {
  await page.goto("/books");
  await expect(page.getByTestId("books-list")).toBeVisible();
  await page.getByTestId("books-category-filter").selectOption("CSS");
  await page.getByTestId("books-category-filter").selectOption("All");
  const cards = page.getByTestId("books-list").locator("[data-testid^='book-card-']");
  await expect(cards).toHaveCount(10);
});

// ─── Negative ────────────────────────────────────────────────────────────────

studentTest("no-results empty state shown when search has no matches", async ({ page }) => {
  await page.goto("/books");
  await expect(page.getByTestId("books-list")).toBeVisible();
  await page.getByTestId("books-search").fill("xyznotabook");
  await expect(page.getByTestId("books-empty")).toBeVisible();
  await expect(page.getByTestId("books-list")).not.toBeVisible();
});

test("unauthenticated user visiting /books is redirected to login", async ({ page }) => {
  await page.goto("/books");
  await expect(page).toHaveURL("/login");
});
