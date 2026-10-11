export type Gender = "male" | "female";

export type ReportTheme = "theme1" | "theme2" | "theme3" | "theme4";

export type Category = {
  id: string;
  name: string;
};

export type CustomField = {
  id: string;
  label: string;
  value: string;
};

export type ReportTextColors = {
  reportTitle: string;
  categoryTitle: string;
  fieldLabels: string;
  fieldValues: string;
  sectionTitles: string;
  listText: string;
  listNumbers: string;
  schoolHeader: string;
  signatures: string;
};

export type ReportTextColorKey = keyof ReportTextColors;

export const DEFAULT_REPORT_TEXT_COLORS: ReportTextColors = {
  reportTitle: "#111111",
  categoryTitle: "#111111",
  fieldLabels: "#1d2826",
  fieldValues: "#111111",
  sectionTitles: "#173c38",
  listText: "#111111",
  listNumbers: "#176c65",
  schoolHeader: "#064f4a",
  signatures: "#173c38",
};

export type ReportFormValues = {
  theme: ReportTheme;
  textColors: ReportTextColors;
  gender: Gender;
  selectedCategory: string;
  categories: Category[];
  regionName: string;
  schoolName: string;
  teacherName: string;
  specialization: string;
  grade: string;
  className: string;
  period: string;
  day: string;
  gregorianDate: string;
  hijriDate: string;
  programName: string;
  location: string;
  attendance: string;
  absence: string;
  objectives: string;
  impact: string;
  activityLeaderName: string;
  supervisorName: string;
  customFields: CustomField[];
  evidenceImages: string[];
};
