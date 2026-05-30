export const SHEET_MODULES = {
  MAIN: "MAIN",
  CONTENT: "CONTENT",
  VIDEO: "VIDEO",
  ADS: "ADS",
  LEADS: "LEADS",
  EVENT: "EVENT"
} as const;

export type SheetModule = (typeof SHEET_MODULES)[keyof typeof SHEET_MODULES];

export const SHEET_MODULE_VALUES = Object.values(SHEET_MODULES);

export function isSheetModule(value: string | null): value is SheetModule {
  return SHEET_MODULE_VALUES.includes(value as SheetModule);
}
