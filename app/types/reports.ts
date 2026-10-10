export type Gender = "male" | "female";

export type ReportTheme =
  | "theme1"
  | "theme2"
  | "theme3"
  | "theme4";

export type Category = {
  id: string;
  name: string;
};

export type CustomField = {
  id: string;
  label: string;
  value: string;
};

export type ReportFormValues = {
  theme: ReportTheme;

  fontColor: string;

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

  /*
    كل سطر = هدف مستقل
    Maximum = 4
  */
  objectives: string;

  /*
    كل سطر = أثر مستقل
    Maximum = 4
  */
  impact: string;

  activityLeaderName: string;

  supervisorName: string;

  /*
    Maximum = 4
  */
  customFields: CustomField[];

  /*
    2 - 4 images
  */
  evidenceImages: string[];
};