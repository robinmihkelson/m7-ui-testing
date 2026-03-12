import { test as base } from "@playwright/test";

const API = "http://localhost:3001/api";

// Re-login via the test API before each test using the browser context's cookie jar.
// context.request shares cookies with the browser, so the session cookie is set automatically.
async function loginAs(context, role) {
  await context.request.post(`${API}/test/login-as/${role}`);
}

export async function resetStore(context) {
  await context.request.post(`${API}/test/reset`);
}

// Student-authenticated test: resets store and logs in as student before each test
export const studentTest = base.extend({
  page: async ({ page, context }, use) => {
    await resetStore(context);
    await loginAs(context, "student");
    await use(page);
  },
});

// Admin-authenticated test: resets store and logs in as admin before each test
export const adminTest = base.extend({
  page: async ({ page, context }, use) => {
    await resetStore(context);
    await loginAs(context, "admin");
    await use(page);
  },
});

// Seed credentials (for plain login tests)
export const STUDENT = { email: "student@test.com", password: "test123" };
export const STUDENT2 = { email: "student2@test.com", password: "test123" };
export const ADMIN = { email: "admin@test.com", password: "admin123" };

// Seed book IDs
export const BOOKS = {
  cleanCode: 1,           // available
  eloquentJs: 2,          // available
  youDontKnowJs: 3,       // available, reserved by student1
  refactoring: 4,         // available
  pragmaticProgrammer: 5, // available
  jsGoodParts: 6,         // UNAVAILABLE
  ddd: 7,                 // available, reserved by student2
  cssSecrets: 8,          // UNAVAILABLE
  longTitle: 9,           // available
  designPatterns: 10,     // available (lowercase title)
};

// Seed reservation IDs
export const RESERVATIONS = {
  student1Book3: 1,
  student2Book7: 2,
};
