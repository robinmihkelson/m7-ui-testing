import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const STUDENT_AUTH = path.join(__dirname, "playwright/.auth/student.json");
export const ADMIN_AUTH = path.join(__dirname, "playwright/.auth/admin.json");
