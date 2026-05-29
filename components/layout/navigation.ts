import {
  BarChart3,
  Bot,
  CalendarDays,
  CheckSquare,
  Clapperboard,
  FileText,
  Home,
  Megaphone,
  PanelsTopLeft,
  PenTool,
  Settings,
  Target,
  Users,
  WandSparkles
} from "lucide-react";

export const navigationGroups = [
  {
    label: "Command Center",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: Home },
      { href: "/today", label: "Hôm nay", icon: CalendarDays },
      { href: "/tasks", label: "Task Marketing", icon: CheckSquare }
    ]
  },
  {
    label: "Content",
    items: [
      { href: "/content/approval", label: "Duyệt nội dung", icon: FileText },
      { href: "/content/calendar", label: "Lịch đăng", icon: CalendarDays },
      { href: "/content/auto-posting", label: "Auto posting", icon: Megaphone },
      { href: "/content/sales-copy", label: "Sales copy", icon: WandSparkles }
    ]
  },
  {
    label: "Creative",
    items: [
      { href: "/creative/design", label: "Thiết kế", icon: PenTool },
      { href: "/creative/video", label: "Video", icon: Clapperboard }
    ]
  },
  {
    label: "Growth",
    items: [
      { href: "/website-seo", label: "Website & SEO", icon: PanelsTopLeft },
      { href: "/campaign-event", label: "Campaign & Event", icon: Target },
      { href: "/ads", label: "Ads", icon: BarChart3 },
      { href: "/crm", label: "CRM", icon: Users }
    ]
  },
  {
    label: "System",
    items: [
      { href: "/reports", label: "Reports", icon: BarChart3 },
      { href: "/ai-assistant", label: "AI Assistant", icon: Bot },
      { href: "/settings", label: "Settings", icon: Settings }
    ]
  }
];
