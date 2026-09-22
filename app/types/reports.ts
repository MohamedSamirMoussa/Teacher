// types/report.ts

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

  categories: {
    id: string;
    name: string;
  }[];

  regionName: string;
  schoolName: string;

  teacherName: string;
  specialization: string;
  grade: string;
  className: string;
  date: string;
  programName: string;

  objectives: string;
  impact: string;

  activityLeaderName: string;
  supervisorName: string;

  evidenceImages: string[];

  customFields: {
    id: string;
    label: string;
    value: string;
  }[];
};
