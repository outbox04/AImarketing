export type AccessLevel = "FULL" | "STAFF";
export type Department = "LEADERSHIP" | "MARKETING" | "SALE";
export type WorkPermission = "DIGITAL" | "CONTENT" | "VIDEO" | "IMAGE" | "WEBSITE" | "CRM";

export type EmployeeProfile = {
  id: string;
  fullName: string;
  employeeCode: string;
  position: string;
  department?: Department;
  accessLevel: AccessLevel;
  permissions: WorkPermission[];
};

export type EmployeeCredential = EmployeeProfile & {
  password: string;
};
