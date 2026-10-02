"use client";

<<<<<<< HEAD
import {
  useEffect,
  useState,
} from "react";
=======
import { useEffect, useState } from "react";
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c

import { useFormik } from "formik";

import Image from "next/image";

import toast from "react-hot-toast";

import ReportPreview from "../ReportPreview/ReportPreview";

import CategorySelector from "../CategorySelector/CategorySelector";

import {
  Gender,
  ReportFormValues,
} from "@/app/types/reports";

/* =========================================
   Defaults
========================================= */

const DEFAULT_ACTIVITY_LEADER = "أ.عمر سعيد الصاعدي";

const DEFAULT_SCHOOL_MANAGER = "أ.عبدالعزيز عوض العلوي";

const DEFAULT_SCHOOL = "مدرسة ابتدائية أبيار الماشي";

const DEFAULT_REGION = "المدينة المنورة";

/* =========================================
   Gregorian -> Hijri
========================================= */

const convertToHijri = (gregorianDate: string) => {
  if (!gregorianDate) {
    return "";
  }

  const [year, month, day] = gregorianDate.split("-").map(Number);

  if (
    !year ||
    !month ||
    !day
  ) {
    return "";
  }

  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", {
    day: "2-digit",

    month: "2-digit",

    year: "numeric",
  }).format(date);
};

/* =========================================
   Component
========================================= */

const ReportForm = () => {
<<<<<<< HEAD
  const [preview, setPreview] =
    useState(false);
=======
  const [preview, setPreview] = useState(false);

  /* =====================================
     Preview
  ====================================== */
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c

  /* =====================================
     Preview
  ====================================== */

  const openPreview = () => {
    setPreview(true);
  };

  const closePreview = () => {
    setPreview(false);
  };

  useEffect(() => {
    if (preview) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [preview]);

  useEffect(() => {
<<<<<<< HEAD
    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
=======
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
        closePreview();
      }
    };

    if (preview) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [preview]);

  /* =====================================
     Formik
  ====================================== */

<<<<<<< HEAD
  const formik =
    useFormik<ReportFormValues>({
      initialValues: {
        gender:
          "male",
=======
  const formik = useFormik<ReportFormValues>({
    initialValues: {
      gender: "male",
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c

      selectedCategory: "citizenship",

<<<<<<< HEAD
        categories: [
          {
            id: "citizenship",
            name: "مجال المواطنة والحياة",
          },

          {
            id: "sports",
            name: "مجال الرياضة والصحة",
          },

          {
            id: "scouting",
            name: "مجال النشاط الكشفي",
          },

          {
            id: "culture",
            name: "مجال الثقافة والفنون",
          },

          {
            id: "science",
            name: "مجال العلوم والتقنية",
          },

          {
            id: "events",
            name: "مجال الأيام والمناسبات",
          },
        ],

        /*
          القيم الافتراضية
          تظهر للمعلم فقط.
        */

        regionName:
          DEFAULT_REGION,
=======
      categories: [
        {
          id: "citizenship",

          name: "مجال المواطنة والحياة",
        },
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c

        {
          id: "sports",

<<<<<<< HEAD
        teacherName:
          "",

        specialization:
          "",

        grade:
          "",

        className:
          "",

        period:
          "",

        day:
          "",

        gregorianDate:
          "",

        hijriDate:
          "",

        programName:
          "",

        location:
          "",

        attendance:
          "",

        absence:
          "",

        objectives:
          "",

        impact:
          "",
=======
          name: "مجال الرياضة والصحة",
        },

        {
          id: "scouting",

          name: "مجال النشاط الكشفي",
        },

        {
          id: "culture",

          name: "مجال الثقافة والفنون",
        },

        {
          id: "science",

          name: "مجال العلوم والتقنية",
        },

        {
          id: "events",

          name: "مجال الأيام والمناسبات",
        },
      ],

      regionName: DEFAULT_REGION,

      schoolName: DEFAULT_SCHOOL,

      teacherName: "",

      specialization: "",

      grade: "",
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c

      className: "",

      period: "",

<<<<<<< HEAD
        customFields:
          [],

        evidenceImages:
          [],
      },

      onSubmit: () => {},
    });

  /* =====================================
     Gender
  ====================================== */
=======
      day: "",

      gregorianDate: "",

      hijriDate: "",

      programName: "",
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c

      location: "",

      attendance: "",

      absence: "",

      objectives: "",

      impact: "",

      activityLeaderName: DEFAULT_ACTIVITY_LEADER,

      supervisorName: DEFAULT_SCHOOL_MANAGER,

      customFields: [],

      evidenceImages: [],
    },

    onSubmit: () => {},
  });

  /* =====================================
     Gender Labels
  ====================================== */

  const isFemale = formik.values.gender === "female";

  const labels = {
<<<<<<< HEAD
    teacherName:
      isFemale
        ? "اسم المعلمة"
        : "اسم المعلم",
=======
    teacherName: isFemale ? "اسم المعلمة" : "اسم المعلم",
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c

    supervisor: isFemale ? "مديرة المدرسة" : "مدير المدرسة",

<<<<<<< HEAD
    activityLeader:
      isFemale
        ? "رائدة النشاط"
        : "رائد النشاط",

    activityLeaderInput:
      isFemale
        ? "اسم رائدة النشاط"
        : "اسم رائد النشاط",
  };

  /* =====================================
     Change Gender

     Female:
     Clear all report fields.

     Male:
     Restore only fixed defaults.
  ====================================== */

  const handleGenderChange = (
    gender: Gender,
  ) => {
    if (
      gender ===
      formik.values.gender
    ) {
      return;
    }

    /*
      لو عندنا Blob URLs للصور،
      ننظفها قبل حذف الصور.
    */

    if (
      gender === "female"
    ) {
      formik.values.evidenceImages.forEach(
        (image) => {
          if (
            image.startsWith(
              "blob:",
            )
          ) {
            URL.revokeObjectURL(
              image,
            );
          }
        },
      );

      formik.setValues({
        ...formik.values,

        gender:
          "female",

        /*
          نخلي الـCategory موجود
          لأن ده اختيار منفصل عن
          بيانات التقرير.
        */

        regionName:
          "",

        schoolName:
          "",

        teacherName:
          "",

        specialization:
          "",

        grade:
          "",

        className:
          "",

        period:
          "",

        day:
          "",

        gregorianDate:
          "",

        hijriDate:
          "",

        programName:
          "",

        location:
          "",

        attendance:
          "",

        absence:
          "",

        objectives:
          "",

        impact:
          "",

        activityLeaderName:
          "",

        supervisorName:
          "",

        customFields:
          [],

        evidenceImages:
          [],
      });

      return;
    }

    /*
      الرجوع إلى معلم:
      نعيد القيم الثابتة فقط.
    */

    formik.setValues({
      ...formik.values,

      gender:
        "male",

      regionName:
        DEFAULT_REGION,

      schoolName:
        DEFAULT_SCHOOL,

      activityLeaderName:
        DEFAULT_ACTIVITY_LEADER,

      supervisorName:
        DEFAULT_SCHOOL_MANAGER,
    });
  };

  /* =====================================
=======
    activityLeader: isFemale ? "رائدة النشاط" : "رائد النشاط",

    activityLeaderInput: isFemale ? "اسم رائدة النشاط" : "اسم رائد النشاط",
  };

  /* =====================================
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
     Selected Category
  ====================================== */

  const selectedCategory = formik.values.categories.find(
    (category) => category.id === formik.values.selectedCategory,
  );

  /* =====================================
     Custom Fields
  ====================================== */

  const addCustomField = () => {
    const currentFields = formik.values.customFields;

<<<<<<< HEAD
    if (
      currentFields.length >= 4
    ) {
      toast.error(
        "الحد الأقصى للحقول الإضافية هو 4 حقول",
      );
=======
    if (currentFields.length >= 4) {
      toast.error("الحد الأقصى للحقول الإضافية هو 4 حقول");
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c

      return;
    }

    formik.setFieldValue("customFields", [
      ...currentFields,

      {
        id: crypto.randomUUID(),

        label: "",

        value: "",
      },
    ]);
  };

  const removeCustomField = (id: string) => {
    formik.setFieldValue(
      "customFields",

<<<<<<< HEAD
        {
          id:
            crypto.randomUUID(),

          label:
            "",

          value:
            "",
        },
      ],
=======
      formik.values.customFields.filter((field) => field.id !== id),
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
    );
  };

  /* =====================================
     Objectives / Impact
  ====================================== */

  const updateMultilineField = (
    fieldName: "objectives" | "impact",

    value: string,

    title: string,
  ) => {
    const filledLines = value
      .split("\n")
      .filter((line) => line.trim().length > 0);

    /*
      Enter مسموح طبيعي.

      المنع يحصل فقط عند كتابة
      أكثر من 4 عناصر فعلية.
    */

    if (filledLines.length > 4) {
      toast.error(`الحد الأقصى في ${title} هو 4 عناصر`);

      return;
    }

    /*
      نخزن القيمة RAW.
      مفيش trim أو filter.
    */

    formik.setFieldValue(fieldName, value);
  };

  /* =====================================
<<<<<<< HEAD
     Objectives / Impact
  ====================================== */

  const updateMultilineField = (
    fieldName:
      | "objectives"
      | "impact",

    value: string,

    title: string,
  ) => {
    const filledLines =
      value
        .split("\n")
        .filter(
          (line) =>
            line.trim()
              .length >
            0,
        );

    if (
      filledLines.length >
      4
    ) {
      toast.error(
        `الحد الأقصى في ${title} هو 4 عناصر`,
      );

      return;
    }

    /*
      نخزن النص بدون Trim
      عشان Enter يشتغل طبيعي.
    */

    formik.setFieldValue(
      fieldName,
      value,
    );
  };

  /* =====================================
     Images
  ====================================== */

  const handleImagesChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files =
      Array.from(
        event.target.files ||
          [],
      );
=======
     Evidence Images
  ====================================== */

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c

    if (
      !files.length
    ) {
      return;
    }

<<<<<<< HEAD
    const currentImages =
      formik.values
        .evidenceImages;
=======
    const currentImages = formik.values.evidenceImages;
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c

    const remaining = 4 - currentImages.length;

<<<<<<< HEAD
    if (
      remaining <= 0
    ) {
      toast.error(
        "الحد الأقصى للصور هو 4 صور",
      );
=======
    if (remaining <= 0) {
      toast.error("الحد الأقصى للصور هو 4 صور");
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c

      event.target.value =
        "";

      return;
    }

    const selectedFiles = files.slice(0, remaining);

    const newImages = selectedFiles.map((file) => URL.createObjectURL(file));

    formik.setFieldValue("evidenceImages", [...currentImages, ...newImages]);

    if (files.length > remaining) {
      toast.error("تم إضافة الحد الأقصى المسموح وهو 4 صور");
    }

    event.target.value =
      "";
  };

  const removeImage = (index: number) => {
    const images = [...formik.values.evidenceImages];

    const removedImage = images[index];

<<<<<<< HEAD
    if (
      removedImage?.startsWith(
        "blob:",
      )
    ) {
      URL.revokeObjectURL(
        removedImage,
      );
=======
    if (removedImage) {
      URL.revokeObjectURL(removedImage);
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
    }

    images.splice(index, 1);

    formik.setFieldValue("evidenceImages", images);
  };

  /* =====================================
     Print
  ====================================== */

  const printReport = () => {
<<<<<<< HEAD
    if (
      formik.values
        .evidenceImages
        .length <
      2
    ) {
      toast.error(
        "يجب إضافة صورتين على الأقل من الشواهد",
      );
=======
    if (formik.values.evidenceImages.length < 2) {
      toast.error("يجب إضافة صورتين على الأقل من الشواهد");
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c

      return;
    }

    setPreview(
      false,
    );

    setTimeout(
      () => {
        window.print();
      },
      150,
    );
  };

  return (
    <section
      id="report"
      className="
        bg-gray-50
        px-3
        py-6
        sm:px-6
        sm:py-12
        lg:px-8
      "
    >
      <div className="report-page-container mx-auto max-w-7xl">
        {/* =================================
            Categories
        ================================== */}

        <div className="no-print">
          <CategorySelector
<<<<<<< HEAD
            categories={
              formik.values
                .categories
            }
            selectedCategory={
              formik.values
                .selectedCategory
            }
            onSelect={(
              id,
            ) => {
              formik.setFieldValue(
                "selectedCategory",
                id,
              );
            }}
            onAdd={(
              category,
            ) => {
              formik.setFieldValue(
                "categories",
                [
                  ...formik.values
                    .categories,

                  category,
                ],
              );

              formik.setFieldValue(
                "selectedCategory",
                category.id,
              );
=======
            categories={formik.values.categories}
            selectedCategory={formik.values.selectedCategory}
            onSelect={(id) => {
              formik.setFieldValue("selectedCategory", id);
            }}
            onAdd={(category) => {
              formik.setFieldValue("categories", [
                ...formik.values.categories,

                category,
              ]);

              formik.setFieldValue("selectedCategory", category.id);
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
            }}
          />
        </div>

        {/* =================================
            Heading
        ================================== */}

        <div className="no-print mb-6 mt-8">
<<<<<<< HEAD
          <h2 className="text-2xl font-bold text-gray-900">
            إنشاء التقرير
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            أدخل بيانات التقرير ثم راجع
            المعاينة واحفظ التقرير بصيغة PDF.
=======
          <h2 className="text-2xl font-bold text-gray-900">إنشاء التقرير</h2>

          <p className="mt-2 text-sm text-gray-500">
            أدخل بيانات التقرير ثم راجع المعاينة واحفظ التقرير بصيغة PDF.
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
          </p>
        </div>

        {/* =================================
<<<<<<< HEAD
            Layout
=======
            Main Layout
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
        ================================== */}

        <div
          className="
            report-layout
            grid
            grid-cols-1
            items-start
            gap-8
            lg:grid-cols-2
          "
        >
          {/* =================================
              Form
          ================================== */}

          <form
            onSubmit={formik.handleSubmit}
            className="
              no-print
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-3
              shadow-sm
              sm:p-6
            "
          >
            <div className="space-y-5">
<<<<<<< HEAD
              {/* =============================
                  Gender
              ============================== */}
=======
              {/* Gender */}
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  النوع
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
<<<<<<< HEAD
                    onClick={() =>
                      handleGenderChange(
                        "male",
                      )
                    }
=======
                    onClick={() => formik.setFieldValue("gender", "male")}
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
                    className={`
                      rounded-xl
                      border
                      px-3
                      py-3
                      text-sm
                      font-semibold
                      transition
                      ${
<<<<<<< HEAD
                        formik
                          .values
                          .gender ===
                        "male"
=======
                        formik.values.gender === "male"
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
                          ? "border-black bg-black text-white"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                      }
                    `}
                  >
                    معلم
                  </button>

                  <button
                    type="button"
<<<<<<< HEAD
                    onClick={() =>
                      handleGenderChange(
                        "female",
                      )
                    }
=======
                    onClick={() => formik.setFieldValue("gender", "female")}
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
                    className={`
                      rounded-xl
                      border
                      px-3
                      py-3
                      text-sm
                      font-semibold
                      transition
                      ${
<<<<<<< HEAD
                        formik
                          .values
                          .gender ===
                        "female"
=======
                        formik.values.gender === "female"
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
                          ? "border-black bg-black text-white"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                      }
                    `}
                  >
                    معلمة
                  </button>
                </div>
              </div>

<<<<<<< HEAD
              {/* =============================
                  Region + School
              ============================== */}
=======
              {/* Region + School */}
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c

              <div className="mobile-form-grid">
                <InputField
                  label="المنطقة"
                  name="regionName"
                  value={formik.values.regionName}
                  onChange={formik.handleChange}
                  onFocus={() => {
<<<<<<< HEAD
                    if (
                      !isFemale &&
                      formik.values
                        .regionName ===
                        DEFAULT_REGION
                    ) {
                      formik.setFieldValue(
                        "regionName",
                        "",
                      );
                    }
                  }}
                  onBlur={() => {
                    if (
                      !isFemale &&
                      !formik.values.regionName.trim()
                    ) {
                      formik.setFieldValue(
                        "regionName",
                        DEFAULT_REGION,
                      );
=======
                    if (formik.values.regionName === DEFAULT_REGION) {
                      formik.setFieldValue("regionName", "");
                    }
                  }}
                  onBlur={() => {
                    if (!formik.values.regionName.trim()) {
                      formik.setFieldValue("regionName", DEFAULT_REGION);
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
                    }
                  }}
                />

                <InputField
                  label="اسم المدرسة"
                  name="schoolName"
                  value={formik.values.schoolName}
                  onChange={formik.handleChange}
                  onFocus={() => {
<<<<<<< HEAD
                    if (
                      !isFemale &&
                      formik.values
                        .schoolName ===
                        DEFAULT_SCHOOL
                    ) {
                      formik.setFieldValue(
                        "schoolName",
                        "",
                      );
                    }
                  }}
                  onBlur={() => {
                    if (
                      !isFemale &&
                      !formik.values.schoolName.trim()
                    ) {
                      formik.setFieldValue(
                        "schoolName",
                        DEFAULT_SCHOOL,
                      );
=======
                    if (formik.values.schoolName === DEFAULT_SCHOOL) {
                      formik.setFieldValue("schoolName", "");
                    }
                  }}
                  onBlur={() => {
                    if (!formik.values.schoolName.trim()) {
                      formik.setFieldValue("schoolName", DEFAULT_SCHOOL);
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
                    }
                  }}
                />
              </div>

<<<<<<< HEAD
              {/* =============================
                  Teacher
              ============================== */}
=======
              {/* Teacher */}
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c

              <div className="mobile-form-grid">
                <InputField
                  label={labels.teacherName}
                  name="teacherName"
                  value={formik.values.teacherName}
                  onChange={formik.handleChange}
                />

                <InputField
                  label="التخصص"
                  name="specialization"
                  value={formik.values.specialization}
                  onChange={formik.handleChange}
                />
              </div>

<<<<<<< HEAD
              {/* =============================
                  Grade
              ============================== */}
=======
              {/* Grade */}
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c

              <div className="mobile-form-grid">
                <InputField
                  label="الصف"
                  name="grade"
                  value={formik.values.grade}
                  onChange={formik.handleChange}
                />

                <InputField
                  label="الفصل الدراسي"
                  name="className"
                  value={formik.values.className}
                  onChange={formik.handleChange}
                />
              </div>

<<<<<<< HEAD
              {/* =============================
                  Period / Day
              ============================== */}
=======
              {/* Period */}
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c

              <div className="mobile-form-grid">
                <InputField
                  label="الحصة"
                  name="period"
                  value={formik.values.period}
                  onChange={formik.handleChange}
                />

                <InputField
                  label="اليوم"
                  name="day"
                  value={formik.values.day}
                  onChange={formik.handleChange}
                />
              </div>

<<<<<<< HEAD
              {/* =============================
                  Date
              ============================== */}
=======
              {/* Dates */}
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c

              <div className="mobile-form-grid">
                <InputField
                  label="التاريخ الميلادي"
                  name="gregorianDate"
                  type="date"
<<<<<<< HEAD
                  value={
                    formik.values
                      .gregorianDate
                  }
                  onChange={(
                    event,
                  ) => {
                    const value =
                      event.target
                        .value;
=======
                  value={formik.values.gregorianDate}
                  onChange={(event) => {
                    const value = event.target.value;
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c

                    formik.setFieldValue("gregorianDate", value);

                    formik.setFieldValue("hijriDate", convertToHijri(value));
                  }}
                />

                <InputField
                  label="التاريخ الهجري"
                  name="hijriDate"
<<<<<<< HEAD
                  value={
                    formik.values
                      .hijriDate
                  }
                  onChange={
                    formik.handleChange
                  }
                />
              </div>

              {/* =============================
                  Program
              ============================== */}
=======
                  value={formik.values.hijriDate}
                  onChange={formik.handleChange}
                />
              </div>

              {/* Program */}
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c

              <div className="mobile-form-grid">
                <InputField
                  label="اسم البرنامج"
                  name="programName"
                  value={formik.values.programName}
                  onChange={formik.handleChange}
                />

                <InputField
                  label="مكان التنفيذ"
                  name="location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                />
              </div>

<<<<<<< HEAD
              {/* =============================
                  Attendance
              ============================== */}
=======
              {/* Attendance */}
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c

              <div className="mobile-form-grid">
                <InputField
                  label="الحضور"
                  name="attendance"
                  value={formik.values.attendance}
                  onChange={formik.handleChange}
                />

                <InputField
                  label="الغياب"
                  name="absence"
                  value={formik.values.absence}
                  onChange={formik.handleChange}
                />
              </div>

<<<<<<< HEAD
              {/* =============================
                  Objectives
              ============================== */}

              <SingleListField
                title="أهداف البرنامج"
                description="كل سطر يمثل هدفًا مستقلًا — بحد أقصى 4 أهداف."
                value={
                  formik.values
                    .objectives
                }
=======
              {/* Objectives */}

              <SingleListField
                title="أهداف البرنامج"
                description="اكتب الهدف ثم اضغط Enter للهدف التالي. الحد الأقصى 4 أهداف."
                value={formik.values.objectives}
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
                placeholder={`تنمية روح التعاون
تعزيز الانتماء الوطني
تنمية مهارات التواصل
غرس القيم الإيجابية`}
<<<<<<< HEAD
                onChange={(
                  value,
                ) =>
                  updateMultilineField(
                    "objectives",
                    value,
                    "الأهداف",
                  )
                }
              />

              {/* =============================
                  Impact
              ============================== */}

              <SingleListField
                title="الأثر الإيجابي للبرنامج"
                description="كل سطر يمثل أثرًا مستقلًا — بحد أقصى 4 آثار."
                value={
                  formik.values
                    .impact
                }
=======
                onChange={(value) =>
                  updateMultilineField("objectives", value, "الأهداف")
                }
              />

              {/* Impact */}

              <SingleListField
                title="الأثر الإيجابي للبرنامج"
                description="اكتب الأثر ثم اضغط Enter للأثر التالي. الحد الأقصى 4 آثار."
                value={formik.values.impact}
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
                placeholder={`زيادة التفاعل
رفع مستوى الثقة بالنفس
تحسين التعاون
تنمية روح المبادرة`}
<<<<<<< HEAD
                onChange={(
                  value,
                ) =>
                  updateMultilineField(
                    "impact",
                    value,
                    "الأثر الإيجابي",
                  )
                }
              />

              {/* =============================
                  Custom Fields
              ============================== */}
=======
                onChange={(value) =>
                  updateMultilineField("impact", value, "الأثر الإيجابي")
                }
              />

              {/* Custom Fields */}
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      الحقول الإضافية
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
<<<<<<< HEAD
                      يمكنك إضافة حتى 4 حقول.
=======
                      يمكنك إضافة حتى 4 حقول فقط.
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
                    </p>
                  </div>

                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-gray-600 shadow-sm">
<<<<<<< HEAD
                    {
                      formik.values
                        .customFields
                        .length
                    }
=======
                    {formik.values.customFields.length}
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
                    /4
                  </span>
                </div>

<<<<<<< HEAD
                {formik.values
                  .customFields
                  .length >
                  0 && (
                  <div className="space-y-2">
                    {formik.values.customFields.map(
                      (
                        field,
                        index,
                      ) => (
                        <div
                          key={
                            field.id
                          }
                          className="rounded-xl border border-gray-200 bg-white p-3"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-500">
                              الحقل{" "}
                              {index +
                                1}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                removeCustomField(
                                  field.id,
                                )
                              }
                              className="text-xs font-semibold text-red-600"
                            >
                              حذف
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="اسم الحقل"
                              value={
                                field.label
                              }
                              onChange={(
                                event,
                              ) => {
                                const updated =
                                  [
                                    ...formik
                                      .values
                                      .customFields,
                                  ];

                                updated[
                                  index
                                ] = {
                                  ...updated[
                                    index
                                  ],

                                  label:
                                    event
                                      .target
                                      .value,
                                };

                                formik.setFieldValue(
                                  "customFields",
                                  updated,
                                );
                              }}
                              className="
                                min-w-0
                                rounded-lg
                                border
                                border-gray-200
                                px-3
                                py-2.5
                                text-sm
                                outline-none
                                transition
                                focus:border-gray-900
                              "
                            />

                            <input
                              type="text"
                              placeholder="القيمة"
                              value={
                                field.value
                              }
                              onChange={(
                                event,
                              ) => {
                                const updated =
                                  [
                                    ...formik
                                      .values
                                      .customFields,
                                  ];

                                updated[
                                  index
                                ] = {
                                  ...updated[
                                    index
                                  ],

                                  value:
                                    event
                                      .target
                                      .value,
                                };

                                formik.setFieldValue(
                                  "customFields",
                                  updated,
                                );
                              }}
                              className="
                                min-w-0
                                rounded-lg
                                border
                                border-gray-200
                                px-3
                                py-2.5
                                text-sm
                                outline-none
                                transition
                                focus:border-gray-900
                              "
                            />
                          </div>
                        </div>
                      ),
                    )}
=======
                {formik.values.customFields.length > 0 && (
                  <div className="space-y-2">
                    {formik.values.customFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="rounded-xl border border-gray-200 bg-white p-3"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-500">
                            الحقل {index + 1}
                          </span>

                          <button
                            type="button"
                            onClick={() => removeCustomField(field.id)}
                            className="text-xs font-semibold text-red-600"
                          >
                            حذف
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="اسم الحقل"
                            value={field.label}
                            onChange={(event) => {
                              const updated = [...formik.values.customFields];

                              updated[index] = {
                                ...updated[index],

                                label: event.target.value,
                              };

                              formik.setFieldValue("customFields", updated);
                            }}
                            className="
                                min-w-0
                                rounded-lg
                                border
                                border-gray-200
                                px-3
                                py-2.5
                                text-sm
                                outline-none
                                transition
                                focus:border-gray-900
                              "
                          />

                          <input
                            type="text"
                            placeholder="القيمة"
                            value={field.value}
                            onChange={(event) => {
                              const updated = [...formik.values.customFields];

                              updated[index] = {
                                ...updated[index],

                                value: event.target.value,
                              };

                              formik.setFieldValue("customFields", updated);
                            }}
                            className="
                                min-w-0
                                rounded-lg
                                border
                                border-gray-200
                                px-3
                                py-2.5
                                text-sm
                                outline-none
                                transition
                                focus:border-gray-900
                              "
                          />
                        </div>
                      </div>
                    ))}
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
                  </div>
                )}

                <button
                  type="button"
<<<<<<< HEAD
                  onClick={
                    addCustomField
                  }
                  disabled={
                    formik.values
                      .customFields
                      .length >=
                    4
                  }
=======
                  onClick={addCustomField}
                  disabled={formik.values.customFields.length >= 4}
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
                  className="
                    mt-3
                    w-full
                    rounded-xl
                    border
                    border-dashed
                    border-gray-300
                    bg-white
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-gray-700
                    transition
                    hover:border-gray-800
                    disabled:cursor-not-allowed
                    disabled:bg-gray-100
                    disabled:text-gray-400
                  "
                >
<<<<<<< HEAD
                  {formik.values
                    .customFields
                    .length >=
                  4
=======
                  {formik.values.customFields.length >= 4
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
                    ? "تم الوصول للحد الأقصى"
                    : "+ إضافة حقل"}
                </button>
              </div>

<<<<<<< HEAD
              {/* =============================
                  Leader + Manager
              ============================== */}

              <div className="mobile-form-grid">
                <InputField
                  label={
                    labels.activityLeaderInput
                  }
=======
              {/* Leader / Manager */}

              <div className="mobile-form-grid">
                <InputField
                  label={labels.activityLeaderInput}
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
                  name="activityLeaderName"
                  value={formik.values.activityLeaderName}
                  onChange={formik.handleChange}
                  onFocus={() => {
                    if (
<<<<<<< HEAD
                      !isFemale &&
                      formik.values
                        .activityLeaderName ===
                        DEFAULT_ACTIVITY_LEADER
=======
                      formik.values.activityLeaderName ===
                      DEFAULT_ACTIVITY_LEADER
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
                    ) {
                      formik.setFieldValue("activityLeaderName", "");
                    }
                  }}
                  onBlur={() => {
<<<<<<< HEAD
                    if (
                      !isFemale &&
                      !formik.values.activityLeaderName.trim()
                    ) {
=======
                    if (!formik.values.activityLeaderName.trim()) {
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
                      formik.setFieldValue(
                        "activityLeaderName",
                        DEFAULT_ACTIVITY_LEADER,
                      );
                    }
                  }}
                />

                <InputField
                  label={labels.supervisor}
                  name="supervisorName"
                  value={formik.values.supervisorName}
                  onChange={formik.handleChange}
                  onFocus={() => {
                    if (
<<<<<<< HEAD
                      !isFemale &&
                      formik.values
                        .supervisorName ===
                        DEFAULT_SCHOOL_MANAGER
=======
                      formik.values.supervisorName === DEFAULT_SCHOOL_MANAGER
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
                    ) {
                      formik.setFieldValue("supervisorName", "");
                    }
                  }}
                  onBlur={() => {
<<<<<<< HEAD
                    if (
                      !isFemale &&
                      !formik.values.supervisorName.trim()
                    ) {
=======
                    if (!formik.values.supervisorName.trim()) {
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
                      formik.setFieldValue(
                        "supervisorName",
                        DEFAULT_SCHOOL_MANAGER,
                      );
                    }
                  }}
                />
              </div>

<<<<<<< HEAD
              {/* =============================
                  Evidence
              ============================== */}
=======
              {/* Evidence */}
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800">
                      صور الشواهد
                    </label>

                    <p className="mt-1 text-xs text-gray-500">
                      أضف من صورتين إلى أربع صور.
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-gray-400">
<<<<<<< HEAD
                    {
                      formik.values
                        .evidenceImages
                        .length
                    }
=======
                    {formik.values.evidenceImages.length}
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
                    /4
                  </span>
                </div>

<<<<<<< HEAD
                {formik.values
                  .evidenceImages
                  .length <
                  4 && (
=======
                {formik.values.evidenceImages.length < 4 && (
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
                  <label
                    htmlFor="evidence-images"
                    className="
                      flex
                      cursor-pointer
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-dashed
                      border-gray-300
                      px-4
                      py-5
                      text-sm
                      font-medium
                      text-gray-600
                      transition
                      hover:border-gray-700
                      hover:text-gray-900
                    "
                  >
                    + إضافة صور الشواهد
<<<<<<< HEAD

                    <input
                      id="evidence-images"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      multiple
                      onChange={
                        handleImagesChange
                      }
                      className="hidden"
                    />
                  </label>
                )}

                {formik.values
                  .evidenceImages
                  .length >
                  0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {formik.values.evidenceImages.map(
                      (
                        image,
                        index,
                      ) => (
                        <div
                          key={`${image}-${index}`}
                          className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
                        >
                          <Image
                            src={
                              image
                            }
                            alt={`شاهد ${
                              index +
                              1
                            }`}
                            width={
                              500
                            }
                            height={
                              350
                            }
                            unoptimized
                            className="h-28 w-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeImage(
                                index,
                              )
                            }
                            className="
=======
                    <input
                      id="evidence-images"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      multiple
                      onChange={handleImagesChange}
                      className="hidden"
                    />
                  </label>
                )}

                {formik.values.evidenceImages.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {formik.values.evidenceImages.map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
                      >
                        <Image
                          src={image}
                          alt={`شاهد ${index + 1}`}
                          width={500}
                          height={350}
                          unoptimized
                          className="h-28 w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
                              absolute
                              left-2
                              top-2
                              flex
                              h-7
                              w-7
                              items-center
                              justify-center
                              rounded-full
                              bg-black/70
                              text-sm
                              font-bold
                              text-white
                            "
<<<<<<< HEAD
                          >
                            ×
                          </button>
                        </div>
                      ),
                    )}
=======
                        >
                          ×
                        </button>
                      </div>
                    ))}
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
                  </div>
                )}
              </div>

<<<<<<< HEAD
              {/* =============================
                  Actions
              ============================== */}
=======
              {/* Actions */}
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
<<<<<<< HEAD
                  onClick={
                    openPreview
                  }
=======
                  onClick={openPreview}
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
                  className="
                    rounded-xl
                    border
                    border-gray-300
                    bg-white
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-gray-700
                    transition
                    hover:border-gray-900
                  "
                >
                  معاينة
                </button>

                <button
                  type="button"
                  onClick={printReport}
                  className="
                    rounded-xl
                    bg-black
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-gray-800
                  "
                >
                  طباعة / PDF
                </button>
              </div>
            </div>
          </form>

          {/* =================================
              Desktop Preview
          ================================== */}

          <div
            className="
              report-print-area
              hidden
              min-w-0
              lg:sticky
              lg:top-6
              lg:block
              print:!block
            "
          >
            <div className="no-print mb-3">
<<<<<<< HEAD
              <p className="text-sm font-bold text-gray-900">
                معاينة التقرير
              </p>

              <p className="mt-1 text-xs text-gray-500">
                المعاينة تتناسب تلقائيًا مع المساحة المتاحة.
=======
              <p className="text-sm font-bold text-gray-900">معاينة التقرير</p>

              <p className="mt-1 text-xs text-gray-500">
                المعاينة تتناسب تلقائياً مع المساحة المتاحة.
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
              </p>
            </div>

            <ReportPreview
              previewId="report-preview"
<<<<<<< HEAD
              values={
                formik.values
              }
              labels={
                labels
              }
              categoryName={
                selectedCategory
                  ?.name ??
                ""
              }
=======
              values={formik.values}
              labels={labels}
              categoryName={selectedCategory?.name ?? ""}
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
            />
          </div>
        </div>

        {/* =================================
            Mobile Preview
        ================================== */}

        {preview && (
          <div className="no-print fixed inset-0 z-50 flex flex-col bg-black/70">
            <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
              <div>
<<<<<<< HEAD
                <strong className="block text-sm">
                  معاينة التقرير
                </strong>

                <span className="text-xs text-gray-500">
                  A4
                </span>
=======
                <strong className="block text-sm">معاينة التقرير</strong>

                <span className="text-xs text-gray-500">A4</span>
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
              </div>

              <button
                type="button"
<<<<<<< HEAD
                onClick={
                  closePreview
                }
=======
                onClick={closePreview}
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
              >
                إغلاق
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-gray-200 p-3">
              <ReportPreview
                previewId="mobile-report-preview"
<<<<<<< HEAD
                values={
                  formik.values
                }
                labels={
                  labels
                }
                categoryName={
                  selectedCategory
                    ?.name ??
                  ""
                }
=======
                values={formik.values}
                labels={labels}
                categoryName={selectedCategory?.name ?? ""}
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
              />
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-gray-200 bg-white p-3">
              <button
                type="button"
<<<<<<< HEAD
                onClick={
                  closePreview
                }
=======
                onClick={closePreview}
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
                className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700"
              >
                رجوع للتعديل
              </button>

              <button
                type="button"
<<<<<<< HEAD
                onClick={
                  printReport
                }
=======
                onClick={printReport}
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
                className="rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white"
              >
                طباعة التقرير
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReportForm;

/* =========================================
<<<<<<< HEAD
   Objectives / Impact Input

   أصغر من النسخة السابقة.
=======
   Multiline List Field
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
========================================= */

type SingleListFieldProps = {
  title: string;

  description: string;

  value: string;

  placeholder: string;

<<<<<<< HEAD
  onChange: (
    value: string,
  ) => void;
=======
  onChange: (value: string) => void;
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
};

const SingleListField = ({
  title,
  description,
  value,
  placeholder,
  onChange,
}: SingleListFieldProps) => {
<<<<<<< HEAD
  const count =
    value
      .split("\n")
      .filter(
        (line) =>
          line.trim()
            .length >
          0,
      ).length;

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            {title}
          </h3>

          <p className="mt-0.5 text-[11px] leading-5 text-gray-500">
            {description}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[11px] font-bold text-gray-600">
=======
  const count = value
    .split("\n")
    .filter((line) => line.trim().length > 0).length;

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>

          <p className="mt-1 text-xs leading-5 text-gray-500">{description}</p>
        </div>

        <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-600 shadow-sm">
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
          {count}/4
        </span>
      </div>

      <textarea
<<<<<<< HEAD
        value={
          value
        }
        onChange={(
          event,
        ) =>
          onChange(
            event.target
              .value,
          )
        }
        placeholder={
          placeholder
        }

        /*
          كانت 6
          دلوقتي 4 فقط.
        */

        rows={4}
        className="
          w-full
          resize-none
          rounded-lg
          border
          border-gray-200
          bg-white
          px-3
          py-2
          text-sm
          leading-6
=======
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={6}
        className="
          w-full
          resize-none
          rounded-xl
          border
          border-gray-200
          bg-white
          px-4
          py-3
          text-sm
          leading-7
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
          outline-none
          transition
          placeholder:text-gray-300
          focus:border-gray-900
        "
      />
    </div>
  );
};

/* =========================================
<<<<<<< HEAD
   Input Field
=======
   Input
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
========================================= */

type InputFieldProps = {
  label: string;

  name: string;

  value: string;

  type?: string;

  disabled?: boolean;

  onChange: React.ChangeEventHandler<HTMLInputElement>;

  onFocus?: React.FocusEventHandler<HTMLInputElement>;

  onBlur?: React.FocusEventHandler<HTMLInputElement>;
};

const InputField = ({
  label,
  name,
  value,
  type = "text",
  disabled = false,
  onChange,
  onFocus,
  onBlur,
}: InputFieldProps) => {
  return (
    <div className="min-w-0">
      <label
        htmlFor={
          name
        }
        className="
          mb-1.5
          block
          min-h-8
          text-xs
          font-semibold
          leading-4
          text-gray-800
          sm:mb-2
          sm:min-h-0
          sm:text-sm
          sm:leading-normal
        "
      >
        {label}
      </label>

      <input
<<<<<<< HEAD
        id={
          name
        }
        name={
          name
        }
        type={
          type
        }
        value={
          value
        }
        disabled={
          disabled
        }
        onChange={
          onChange
        }
        onFocus={
          onFocus
        }
        onBlur={
          onBlur
        }
=======
        id={name}
        name={name}
        type={type}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
>>>>>>> a11c11e86bb5c7a2facd6d7b045f020679082e2c
        className="
          w-full
          min-w-0
          rounded-lg
          border
          border-gray-200
          px-2.5
          py-2.5
          text-xs
          outline-none
          transition
          focus:border-gray-900
          disabled:cursor-not-allowed
          disabled:bg-gray-100
          disabled:text-gray-500
          sm:rounded-xl
          sm:px-4
          sm:py-3
          sm:text-sm
        "
      />
    </div>
  );
};
