import { cookies } from "next/headers";
import { authCookieName } from "@/lib/auth/constants";
import { findEmployeeByCode, sanitizeEmployee } from "@/lib/auth/users";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const employeeCode = cookieStore.get(authCookieName)?.value;
  if (!employeeCode) return null;

  const user = findEmployeeByCode(employeeCode);
  return user ? sanitizeEmployee(user) : null;
}
