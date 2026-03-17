import { test, expect } from "@playwright/test";
import { studentTest, BOOKS } from "./helpers.js";

studentTest("books page loads", async ({ page }) => {
    await page.goto("/books");
    await expect(page.getByTestId("books-list")).toBeVisible();
});

studentTest("all 10 seeded books are displayed", async ({ page }) => {
    await page.goto("/books");
    const cards = page.getByTestId("books-list").locator("[data-testid^='book-card-']");
    await expect(cards).toHaveCount(10)
});

studentTest.fixme("each book shows title and author", async ({ page }) => {
  // TODO
});

studentTest.fixme("available book has enabled reserve button", async ({ page }) => {
  // TODO
});

studentTest.fixme("unavailable book has disabled reserve button", async ({ page }) => {
  // TODO
});

studentTest.fixme("unavailable book shows 'Unavailable' status badge", async ({ page }) => {
  // TODO
});

studentTest.fixme("available book shows 'Available' status badge", async ({ page }) => {
  // TODO
});

studentTest.fixme("clicking details opens the book details page", async ({ page }) => {
  // TODO
});

studentTest.fixme("search by exact title works", async ({ page }) => {
  // TODO
});

studentTest.fixme("search by partial title works", async ({ page }) => {
  // TODO
});

studentTest.fixme("search by author works", async ({ page }) => {
  // TODO
});

studentTest.fixme("search is case-insensitive", async ({ page }) => {
  // TODO
});

studentTest.fixme("category filter shows only matching books", async ({ page }) => {
  // TODO
});

studentTest.fixme("availability filter 'Available' shows only available books", async ({ page }) => {
  // TODO
});

studentTest.fixme("availability filter 'Unavailable' shows only unavailable books", async ({ page }) => {
  // TODO
});

studentTest.fixme("clearing search input restores full book list", async ({ page }) => {
  // TODO
});

studentTest.fixme("resetting category filter to All restores full list", async ({ page }) => {
  // TODO
});

studentTest.fixme("no-results empty state shown when search has no matches", async ({ page }) => {
  // TODO
});

test.fixme("unauthenticated user visiting /books is redirected to login", async ({ page }) => {
  // TODO
});
