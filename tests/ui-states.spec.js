import { test, expect } from "@playwright/test";
import { studentTest, BOOKS } from "./helpers.js";

// ─── Loading spinner ──────────────────────────────────────────────────────────

studentTest("loading spinner is shown while books are loading", async ({ page }) => {
  // Delay the books API response long enough to catch the spinner
  await page.route("**/api/books", async (route) => {
    await new Promise((r) => setTimeout(r, 1500));
    await route.continue();
  });

  await page.goto("/books");
  await expect(page.getByTestId("loading-spinner")).toBeVisible();
});

studentTest("loading spinner disappears after books load", async ({ page }) => {
  await page.goto("/books");
  await expect(page.getByTestId("loading-spinner")).not.toBeVisible();
  await expect(page.getByTestId("books-list")).toBeVisible();
});

// ─── Toast notifications ──────────────────────────────────────────────────────

studentTest("success toast is shown after reserving a book", async ({ page }) => {
  await page.goto("/books");
  await expect(page.getByTestId(`book-reserve-${BOOKS.eloquentJs}`)).toBeEnabled();
  await page.getByTestId(`book-reserve-${BOOKS.eloquentJs}`).click();
  await expect(page.getByTestId("reservation-toast")).toBeVisible();
  await expect(page.getByTestId("reservation-toast")).toContainText("reserved");
});

studentTest("success toast disappears after a few seconds", async ({ page }) => {
  await page.goto("/books");
  await page.getByTestId(`book-reserve-${BOOKS.eloquentJs}`).click();
  await expect(page.getByTestId("reservation-toast")).toBeVisible();
  await expect(page.getByTestId("reservation-toast")).not.toBeVisible({ timeout: 5000 });
});

studentTest("success toast is shown after reserving from book details page", async ({ page }) => {
  await page.goto(`/books/${BOOKS.eloquentJs}`);
  await expect(page.getByTestId("book-detail-reserve")).toBeEnabled();
  await page.getByTestId("book-detail-reserve").click();
  await expect(page.getByTestId("reservation-toast")).toBeVisible();
});

// ─── Error states ─────────────────────────────────────────────────────────────

studentTest("error message shown when books API fails", async ({ page }) => {
  await page.route("**/api/books", (route) => route.abort());
  await page.goto("/books");
  await expect(page.getByTestId("error-message")).toBeVisible();
});

studentTest("retry button reloads books after failure", async ({ page }) => {
  let failed = false;
  await page.route("**/api/books", async (route) => {
    if (!failed) {
      failed = true;
      await route.abort();
    } else {
      await route.continue();
    }
  });

  await page.goto("/books");
  await expect(page.getByTestId("error-message")).toBeVisible();
  await page.getByTestId("error-retry").click();
  await expect(page.getByTestId("books-list")).toBeVisible();
});

studentTest("error message shown when reservations API fails", async ({ page }) => {
  await page.route("**/api/my-reservations", (route) => route.abort());
  await page.goto("/my-reservations");
  await expect(page.getByTestId("error-message")).toBeVisible();
});

studentTest("toast does NOT appear when reservation API fails", async ({ page }) => {
  await page.route("**/api/reservations", (route) =>
    route.fulfill({ status: 400, body: JSON.stringify({ error: "Book is not available" }) })
  );

  await page.goto("/books");
  await expect(page.getByTestId(`book-reserve-${BOOKS.eloquentJs}`)).toBeEnabled();
  await page.getByTestId(`book-reserve-${BOOKS.eloquentJs}`).click();

  // Toast must NOT show on failure
  await page.waitForTimeout(500);
  await expect(page.getByTestId("reservation-toast")).not.toBeVisible();
});

// ─── 404 / 403 pages ─────────────────────────────────────────────────────────

test("visiting an unknown route shows 404 page", async ({ page }) => {
  await page.goto("/this-does-not-exist");
  await expect(page.locator("h1")).toContainText("404");
});

studentTest("visiting /403 shows the forbidden page", async ({ page }) => {
  await page.goto("/403");
  await expect(page.locator("h1")).toContainText("403");
});
