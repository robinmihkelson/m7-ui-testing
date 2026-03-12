import { test, expect } from "@playwright/test";
import { studentTest, BOOKS, RESERVATIONS } from "./helpers.js";

// ─── Positive ────────────────────────────────────────────────────────────────

studentTest("my reservations page loads", async ({ page }) => {
  await page.goto("/my-reservations");
  await expect(page.getByTestId("reservations-list")).toBeVisible();
});

studentTest("seeded reservation is shown for student", async ({ page }) => {
  await page.goto("/my-reservations");
  await expect(page.getByTestId("reservations-list")).toBeVisible();
  await expect(page.getByTestId(`reservation-row-${RESERVATIONS.student1Book3}`)).toBeVisible();
  await expect(
    page.getByTestId(`reservation-book-title-${RESERVATIONS.student1Book3}`)
  ).toContainText("You Don't Know JS");
});

studentTest("user can reserve available book and it appears in My Reservations", async ({ page }) => {
  await page.goto("/books");
  await expect(page.getByTestId(`book-reserve-${BOOKS.refactoring}`)).toBeEnabled();
  await page.getByTestId(`book-reserve-${BOOKS.refactoring}`).click();

  await page.goto("/my-reservations");
  await expect(
    page.locator("[data-testid^='reservation-book-title-']").filter({ hasText: "Refactoring" })
  ).toBeVisible();
});

studentTest("user can cancel reservation and it disappears from list", async ({ page }) => {
  await page.goto("/my-reservations");
  await expect(page.getByTestId("reservations-list")).toBeVisible();
  const row = page.getByTestId(`reservation-row-${RESERVATIONS.student1Book3}`);
  await expect(row).toBeVisible();
  await page.getByTestId(`reservation-cancel-${RESERVATIONS.student1Book3}`).click();
  await expect(row).not.toBeVisible();
});

studentTest("empty state shown when user has no reservations", async ({ page }) => {
  await page.goto("/my-reservations");
  await expect(page.getByTestId("reservations-list")).toBeVisible();
  await page.getByTestId(`reservation-cancel-${RESERVATIONS.student1Book3}`).click();
  await expect(page.getByTestId("reservations-empty")).toBeVisible();
  await expect(page.getByTestId("reservations-list")).not.toBeVisible();
});

studentTest("reservation count on dashboard reflects seeded reservation", async ({ page }) => {
  await page.goto("/dashboard");
  const countEl = page
    .locator(".stat-card")
    .filter({ hasText: "My Reservations" })
    .locator(".stat-value");
  await expect(countEl).toContainText("1");
});

studentTest("reservation persists after navigating away and back", async ({ page }) => {
  await page.goto("/books");
  await expect(page.getByTestId(`book-reserve-${BOOKS.eloquentJs}`)).toBeEnabled();
  await page.getByTestId(`book-reserve-${BOOKS.eloquentJs}`).click();

  await page.goto("/dashboard");
  await page.goto("/my-reservations");
  await expect(
    page.locator("[data-testid^='reservation-book-title-']").filter({ hasText: "Eloquent JavaScript" })
  ).toBeVisible();
});

// ─── Negative ────────────────────────────────────────────────────────────────

studentTest("duplicate reservation is blocked", async ({ page, context }) => {
  // Reserve book 4 via UI first
  await page.goto(`/books/${BOOKS.refactoring}`);
  await expect(page.getByTestId("book-detail-reserve")).toBeEnabled();
  await page.getByTestId("book-detail-reserve").click();
  await page.waitForTimeout(300);

  // Try to reserve the same book again via API (UI button is now disabled)
  const response = await context.request.post("http://localhost:3001/api/reservations", {
    data: { bookId: BOOKS.refactoring },
  });
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.error).toContain("already reserved");
});

studentTest("student only sees their own reservations", async ({ page }) => {
  await page.goto("/my-reservations");
  await expect(page.getByTestId("reservations-list")).toBeVisible();
  // student2's reservation (id=2) must NOT appear for student1
  await expect(page.getByTestId(`reservation-row-${RESERVATIONS.student2Book7}`)).not.toBeVisible();
});

test("unauthenticated user cannot access my-reservations", async ({ page }) => {
  await page.goto("/my-reservations");
  await expect(page).toHaveURL("/login");
});
