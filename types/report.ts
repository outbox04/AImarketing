export type ReportMetric = {
  id: string;
  label: string;
  value: string;
  change: string;
  tone: "success" | "warning" | "danger" | "info";
};
