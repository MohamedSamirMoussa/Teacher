export type Gender =
  | "male"
  | "female";

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

  /*
    كل سطر غير فارغ = هدف
    Maximum 4
  */
  objectives: string;

<<<<<<< HEAD
=======
  /*
    كل سطر غير فارغ = أثر
    Maximum 4
  */
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
  impact: string;

  activityLeaderName: string;

  supervisorName: string;

  /*
    Maximum 4
  */
  customFields: CustomField[];

  /*
    2 - 4 Images
  */
  evidenceImages: string[];
};