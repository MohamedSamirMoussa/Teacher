import type { ReportTheme } from "@/app/types/reports";

export type ReportThemeConfig = {
  id: ReportTheme;
  label: string;
  header: string;
  footer: string;
  headerWidth: number;
  headerHeight: number;
  footerWidth: number;
  footerHeight: number;
};

export const REPORT_THEMES: ReportThemeConfig[] = [
  {
    id: "theme1",
    label: "التصميم 1",
    header: "/report-header.png",
    footer: "/report-footer.png",
    headerWidth: 1491,
    headerHeight: 205,
    footerWidth: 1491,
    footerHeight: 150,
  },
  {
    id: "theme2",
    label: "التصميم 2",
    header: "/theme2-header-transparent.png",
    footer: "/theme2-footer-transparent.png",
    headerWidth: 1024,
    headerHeight: 235,
    footerWidth: 1024,
    footerHeight: 130,
  },
  {
    id: "theme3",
    label: "التصميم 3",
    header: "/theme3-header-transparent.png",
    footer: "/theme3-footer-transparent.png",
    headerWidth: 1024,
    headerHeight: 220,
    footerWidth: 1024,
    footerHeight: 175,
  },
  {
    id: "theme4",
    label: "التصميم 4",
    header: "/theme4-header-transparent.png",
    footer: "/theme4-footer-transparent.png",
    headerWidth: 1024,
    headerHeight: 225,
    footerWidth: 1024,
    footerHeight: 130,
  },
];

export const getReportTheme = (theme: ReportTheme) =>
  REPORT_THEMES.find((item) => item.id === theme) ?? REPORT_THEMES[0];
