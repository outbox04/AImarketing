import type { MarketingData } from "@/lib/data/marketing-data";
import type { ContentType } from "@/types/content";
import type { EmployeeProfile, WorkPermission } from "@/types/employee";
import type { Task } from "@/types/task";

const taskTypesByPermission: Record<WorkPermission, Task["type"][]> = {
  DIGITAL: ["Ads", "Event", "Report"],
  CONTENT: ["Content"],
  VIDEO: ["Video"],
  IMAGE: ["Design"],
  WEBSITE: ["Website"],
  CRM: ["CRM"]
};

const contentTypesByPermission: Partial<Record<WorkPermission, ContentType[]>> = {
  CONTENT: ["CONTENT"],
  VIDEO: ["VIDEO"],
  IMAGE: ["IMAGE"],
  WEBSITE: ["WEBSITE"]
};

const sharedStaffRoutes = ["/dashboard", "/today", "/tasks"];

const routesByPermission: Record<WorkPermission, string[]> = {
  DIGITAL: ["/ads", "/campaign-event"],
  CONTENT: ["/content/calendar", "/content/sales-copy"],
  VIDEO: ["/creative/video"],
  IMAGE: ["/creative/design"],
  WEBSITE: ["/website-seo"],
  CRM: ["/crm"]
};

export function hasFullAccess(user?: EmployeeProfile | null) {
  return user?.accessLevel === "FULL";
}

export function canAccessHref(user: EmployeeProfile | null | undefined, href: string) {
  if (!user) return false;
  if (hasFullAccess(user)) return true;

  const allowedRoutes = [
    ...sharedStaffRoutes,
    ...user.permissions.flatMap((permission) => routesByPermission[permission] ?? [])
  ];

  return allowedRoutes.some((route) => href === route || href.startsWith(`${route}/`));
}

export function filterNavigationGroups<T extends { items: Array<{ href: string }> }>(groups: T[], user: EmployeeProfile | null | undefined) {
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canAccessHref(user, item.href))
    }))
    .filter((group) => group.items.length > 0);
}

export function filterMarketingDataForUser(data: MarketingData, user: EmployeeProfile): MarketingData {
  if (hasFullAccess(user)) return data;

  const allowedTaskTypes = new Set(user.permissions.flatMap((permission) => taskTypesByPermission[permission] ?? []));
  const allowedContentTypes = new Set(user.permissions.flatMap((permission) => contentTypesByPermission[permission] ?? []));

  if (user.department === "SALE" || user.permissions.includes("CRM")) {
    return {
      ...data,
      tasks: data.tasks.filter((task) => allowedTaskTypes.has(task.type)),
      contentPosts: [],
      approvalItems: [],
      campaignEvents: [],
      adsReports: []
    };
  }

  return {
    ...data,
    tasks: data.tasks.filter((task) => allowedTaskTypes.has(task.type)),
    contentPosts: data.contentPosts.filter((item) => allowedContentTypes.has(item.type)),
    approvalItems: [],
    campaignEvents: user.permissions.includes("DIGITAL") ? data.campaignEvents : [],
    adsReports: user.permissions.includes("DIGITAL") ? data.adsReports : [],
    leads: []
  };
}

export function permissionLabel(permission: WorkPermission) {
  const labels: Record<WorkPermission, string> = {
    DIGITAL: "Digital/Campaign",
    CONTENT: "Content",
    VIDEO: "Video",
    IMAGE: "Hình ảnh/Design",
    WEBSITE: "Website/SEO",
    CRM: "CRM/Sale"
  };
  return labels[permission];
}
