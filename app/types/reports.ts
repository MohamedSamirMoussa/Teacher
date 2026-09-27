export type Gender = "male" | "female";

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