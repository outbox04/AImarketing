import type { Department, EmployeeCredential, EmployeeProfile } from "@/types/employee";

export const employeeUsers: EmployeeCredential[] = [
  {
    id: "emp-lead-1",
    fullName: "Nguyễn Minh Quân",
    employeeCode: "BLD001",
    position: "Ban lãnh đạo",
    department: "LEADERSHIP",
    accessLevel: "FULL",
    permissions: ["DIGITAL", "CONTENT", "VIDEO", "IMAGE", "WEBSITE", "CRM"],
    password: "123456"
  },
  {
    id: "emp-manager-1",
    fullName: "Trần Hoài An",
    employeeCode: "TP001",
    position: "Trưởng phòng Marketing",
    department: "MARKETING",
    accessLevel: "FULL",
    permissions: ["DIGITAL", "CONTENT", "VIDEO", "IMAGE", "WEBSITE"],
    password: "123456"
  },
  {
    id: "emp-mkt-1",
    fullName: "Lê Khánh Linh",
    employeeCode: "MKT001",
    position: "Digital Marketing",
    department: "MARKETING",
    accessLevel: "STAFF",
    permissions: ["DIGITAL", "CONTENT"],
    password: "123456"
  },
  {
    id: "emp-sale-1",
    fullName: "Phạm Quốc Huy",
    employeeCode: "SALE001",
    position: "Nhân viên Sale",
    department: "SALE",
    accessLevel: "STAFF",
    permissions: ["CRM"],
    password: "123456"
  }
];

export function sanitizeEmployee(user: EmployeeCredential): EmployeeProfile {
  const { password, ...profile } = user;
  return profile;
}

export function findEmployeeByCode(employeeCode: string) {
  return employeeUsers.find((user) => user.employeeCode.toLowerCase() === employeeCode.trim().toLowerCase());
}

export function authenticateEmployee(employeeCode: string, password: string) {
  const user = findEmployeeByCode(employeeCode);
  if (!user || user.password !== password) return null;
  return sanitizeEmployee(user);
}

export function departmentLabel(department?: Department) {
  if (department === "MARKETING") return "Marketing";
  if (department === "SALE") return "Sale";
  if (department === "LEADERSHIP") return "Ban lãnh đạo";
  return "Toàn công ty";
}
