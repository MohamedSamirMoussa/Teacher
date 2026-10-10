"use client";

import {
  useEffect,
  useState,
} from "react";

import type {
  ChangeEventHandler,
  FocusEventHandler,
} from "react";

import {
  useFormik,
} from "formik";

import Image from "next/image";

import toast from "react-hot-toast";

import ReportPreview from "../ReportPreview/ReportPreview";

import CategorySelector from "../CategorySelector/CategorySelector";

import {
  Gender,
  ReportFormValues,
  ReportTheme,
} from "@/app/types/reports";

import {
  REPORT_THEMES,
} from "@/app/constants/reportThemes";

/* =========================================
   Defaults
========================================= */

const DEFAULT_ACTIVITY_LEADER =
  "أ.عمر سعيد الصاعدي";

const DEFAULT_SCHOOL_MANAGER =
  "أ.عبدالعزيز عوض العلوي";

const DEFAULT_SCHOOL =
  "مدرسة ابتدائية أبيار الماشي";

const DEFAULT_REGION =
  "المدينة المنورة";

/* =========================================
   Gregorian -> Hijri
========================================= */

const convertToHijri = (
  gregorianDate: string,
) => {
  if (!gregorianDate) {
    return "";
  }

  const [
    year,
    month,
    day,
  ] = gregorianDate
    .split("-")
    .map(Number);

  if (
    !year ||
    !month ||
    !day
  ) {
    return "";
  }

  const date =
    new Date(
      year,
      month - 1,
      day,
    );

  return new Intl.DateTimeFormat(
    "ar-SA-u-ca-islamic-umalqura",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  ).format(date);
};

/* =========================================
   Component
========================================= */

const ReportForm = () => {
  const [
    preview,
    setPreview,
  ] = useState(false);

  /* =====================================
     Formik
  ====================================== */

  const formik =
    useFormik<ReportFormValues>({
      initialValues: {
        theme:
          "theme1",

        fontColor:
          "#111111",

        gender:
          "male",

        selectedCategory:
          "citizenship",

        categories: [
          {
            id:
              "citizenship",

            name:
              "مجال المواطنة والحياة",
          },

          {
            id:
              "sports",

            name:
              "مجال الرياضة والصحة",
          },

          {
            id:
              "scouting",

            name:
              "مجال النشاط الكشفي",
          },

          {
            id:
              "culture",

            name:
              "مجال الثقافة والفنون",
          },

          {
            id:
              "science",

            name:
              "مجال العلوم والتقنية",
          },

          {
            id:
              "events",

            name:
              "مجال الأيام والمناسبات",
          },
        ],

        /*
          Default values
          للمعلم فقط
        */

        regionName:
          DEFAULT_REGION,

        schoolName:
          DEFAULT_SCHOOL,

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
          DEFAULT_ACTIVITY_LEADER,

        supervisorName:
          DEFAULT_SCHOOL_MANAGER,

        customFields:
          [],

        evidenceImages:
          [],
      },

      onSubmit:
        () => {},
    });

  /* =====================================
     Mobile Preview
  ====================================== */

  const openPreview =
    () => {
      setPreview(
        true,
      );
    };

  const closePreview =
    () => {
      setPreview(
        false,
      );
    };

  useEffect(() => {
    document.body.style.overflow =
      preview
        ? "hidden"
        : "";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [preview]);

  useEffect(() => {
    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        closePreview();
      }
    };

    if (preview) {
      window.addEventListener(
        "keydown",
        handleEscape,
      );
    }

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [preview]);

  /* =====================================
     Gender
  ====================================== */

  const isFemale =
    formik.values.gender ===
    "female";

  const labels = {
    teacherName:
      isFemale
        ? "اسم المعلمة"
        : "اسم المعلم",

    activityLeader:
      isFemale
        ? "رائدة النشاط"
        : "رائد النشاط",

    supervisor:
      isFemale
        ? "مديرة المدرسة"
        : "مدير المدرسة",

    activityLeaderInput:
      isFemale
        ? "اسم رائدة النشاط"
        : "اسم رائد النشاط",

    supervisorInput:
      isFemale
        ? "اسم مديرة المدرسة"
        : "اسم مدير المدرسة",
  };

  /* =====================================
     Gender Change
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
      معلمة:
      كل حقول التقرير تصبح فارغة.

      نترك:
      - Theme
      - Font color
      - Categories

      لأنها إعدادات وليست بيانات التقرير.
    */

    if (
      gender ===
      "female"
    ) {
      formik.values
        .evidenceImages
        .forEach(
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
      الرجوع لمعلم:
      ترجع القيم الثابتة فقط.
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
     Theme
  ====================================== */

  const handleThemeChange = (
    theme: ReportTheme,
  ) => {
    formik.setFieldValue(
      "theme",
      theme,
    );
  };

  /* =====================================
     Selected Category
  ====================================== */

  const selectedCategory =
    formik.values
      .categories
      .find(
        (category) =>
          category.id ===
          formik.values
            .selectedCategory,
      );

  /* =====================================
     Custom Fields
  ====================================== */

  const addCustomField =
    () => {
      if (
        formik.values
          .customFields
          .length >=
        4
      ) {
        toast.error(
          "الحد الأقصى للحقول الإضافية هو 4 حقول",
        );

        return;
      }

      formik.setFieldValue(
        "customFields",
        [
          ...formik.values
            .customFields,

          {
            id:
              crypto.randomUUID(),

            label:
              "",

            value:
              "",
          },
        ],
      );
    };

  const removeCustomField = (
    id: string,
  ) => {
    formik.setFieldValue(
      "customFields",

      formik.values
        .customFields
        .filter(
          (field) =>
            field.id !== id,
        ),
    );
  };

  /* =====================================
     Objectives / Impact
  ====================================== */

  const updateMultilineField = (
    fieldName:
      | "objectives"
      | "impact",

    value: string,

    title: string,
  ) => {
    const items =
      value
        .split("\n")
        .filter(
          (line) =>
            line
              .trim()
              .length >
            0,
        );

    if (
      items.length >
      4
    ) {
      toast.error(
        `الحد الأقصى في ${title} هو 4 عناصر`,
      );

      return;
    }

    /*
      Raw value
      عشان Enter يشتغل طبيعي.
    */

    formik.setFieldValue(
      fieldName,
      value,
    );
  };

  /* =====================================
     Evidence
  ====================================== */

  const handleImagesChange = (
    event:
      React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files =
      Array.from(
        event.target.files ??
          [],
      );

    if (
      !files.length
    ) {
      return;
    }

    const current =
      formik.values
        .evidenceImages;

    const remaining =
      4 -
      current.length;

    if (
      remaining <= 0
    ) {
      toast.error(
        "الحد الأقصى للصور هو 4 صور",
      );

      event.target.value =
        "";

      return;
    }

    const selected =
      files.slice(
        0,
        remaining,
      );

    const urls =
      selected.map(
        (file) =>
          URL.createObjectURL(
            file,
          ),
      );

    formik.setFieldValue(
      "evidenceImages",
      [
        ...current,
        ...urls,
      ],
    );

    if (
      files.length >
      remaining
    ) {
      toast.error(
        "تم الوصول إلى الحد الأقصى وهو 4 صور",
      );
    }

    event.target.value =
      "";
  };

  const removeImage = (
    index: number,
  ) => {
    const images = [
      ...formik.values
        .evidenceImages,
    ];

    const image =
      images[index];

    if (
      image?.startsWith(
        "blob:",
      )
    ) {
      URL.revokeObjectURL(
        image,
      );
    }

    images.splice(
      index,
      1,
    );

    formik.setFieldValue(
      "evidenceImages",
      images,
    );
  };

  /* =====================================
     Print
  ====================================== */

  const printReport =
    () => {
      if (
        formik.values
          .evidenceImages
          .length <
        2
      ) {
        toast.error(
          "يجب إضافة صورتين على الأقل من الشواهد",
        );

        return;
      }

      /*
        نقفل Mobile Preview
        قبل الطباعة.
      */

      setPreview(
        false,
      );

      /*
        Safari iOS يحتاج وقت بسيط
        بعد تغيير الـDOM.
      */

      setTimeout(
        () => {
          window.print();
        },
        250,
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
            Category
        ================================== */}

        <div className="no-print">
          <CategorySelector
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
            }}
          />
        </div>

        {/* =================================
            Heading
        ================================== */}

        <div className="no-print mb-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-900">
            إنشاء التقرير
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            أدخل البيانات واختر تصميم التقرير ثم قم بمعاينته وطباعته.
          </p>
        </div>

        {/* =================================
            Main Layout
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
              FORM
          ================================== */}

          <form
            onSubmit={
              formik.handleSubmit
            }
            className="
              no-print

              min-w-0

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
              {/* =============================
                  Gender
              ============================== */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  النوع
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleGenderChange(
                        "male",
                      )
                    }
                    className={`
                      rounded-xl
                      border

                      px-3
                      py-3

                      text-sm
                      font-semibold

                      transition

                      ${
                        formik.values
                          .gender ===
                        "male"
                          ? "border-black bg-black text-white"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                      }
                    `}
                  >
                    معلم
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleGenderChange(
                        "female",
                      )
                    }
                    className={`
                      rounded-xl
                      border

                      px-3
                      py-3

                      text-sm
                      font-semibold

                      transition

                      ${
                        formik.values
                          .gender ===
                        "female"
                          ? "border-black bg-black text-white"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                      }
                    `}
                  >
                    معلمة
                  </button>
                </div>
              </div>

              {/* =============================
                  Themes
              ============================== */}

              <ThemeSelector
                value={
                  formik.values
                    .theme
                }
                onChange={
                  handleThemeChange
                }
              />

              {/* =============================
                  Font Color
              ============================== */}

              <ReportColorPicker
                value={
                  formik.values
                    .fontColor
                }
                onChange={(
                  value,
                ) =>
                  formik.setFieldValue(
                    "fontColor",
                    value,
                  )
                }
              />

              {/* =============================
                  Region + School
              ============================== */}

              <div className="mobile-form-grid">
                <InputField
                  label="المنطقة"
                  name="regionName"
                  value={
                    formik.values
                      .regionName
                  }
                  onChange={
                    formik.handleChange
                  }
                  onFocus={() => {
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
                      !formik.values
                        .regionName
                        .trim()
                    ) {
                      formik.setFieldValue(
                        "regionName",
                        DEFAULT_REGION,
                      );
                    }
                  }}
                />

                <InputField
                  label="اسم المدرسة"
                  name="schoolName"
                  value={
                    formik.values
                      .schoolName
                  }
                  onChange={
                    formik.handleChange
                  }
                  onFocus={() => {
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
                      !formik.values
                        .schoolName
                        .trim()
                    ) {
                      formik.setFieldValue(
                        "schoolName",
                        DEFAULT_SCHOOL,
                      );
                    }
                  }}
                />
              </div>

              {/* =============================
                  Teacher
              ============================== */}

              <div className="mobile-form-grid">
                <InputField
                  label={
                    labels.teacherName
                  }
                  name="teacherName"
                  value={
                    formik.values
                      .teacherName
                  }
                  onChange={
                    formik.handleChange
                  }
                />

                <InputField
                  label="التخصص"
                  name="specialization"
                  value={
                    formik.values
                      .specialization
                  }
                  onChange={
                    formik.handleChange
                  }
                />
              </div>

              {/* =============================
                  Grade
              ============================== */}

              <div className="mobile-form-grid">
                <InputField
                  label="الصف"
                  name="grade"
                  value={
                    formik.values
                      .grade
                  }
                  onChange={
                    formik.handleChange
                  }
                />

                <InputField
                  label="الفصل الدراسي"
                  name="className"
                  value={
                    formik.values
                      .className
                  }
                  onChange={
                    formik.handleChange
                  }
                />
              </div>

              {/* =============================
                  Period
              ============================== */}

              <div className="mobile-form-grid">
                <InputField
                  label="الحصة"
                  name="period"
                  value={
                    formik.values
                      .period
                  }
                  onChange={
                    formik.handleChange
                  }
                />

                <InputField
                  label="اليوم"
                  name="day"
                  value={
                    formik.values.day
                  }
                  onChange={
                    formik.handleChange
                  }
                />
              </div>

              {/* =============================
                  Date

                  iPhone X:
                  يتحول إلى عمود واحد.
              ============================== */}

              <div className="mobile-form-grid mobile-date-grid">
                <InputField
                  label="التاريخ الميلادي"
                  name="gregorianDate"
                  type="date"
                  value={
                    formik.values
                      .gregorianDate
                  }
                  onChange={(
                    event,
                  ) => {
                    const value =
                      event
                        .target
                        .value;

                    formik.setFieldValue(
                      "gregorianDate",
                      value,
                    );

                    formik.setFieldValue(
                      "hijriDate",
                      convertToHijri(
                        value,
                      ),
                    );
                  }}
                />

                <InputField
                  label="التاريخ الهجري"
                  name="hijriDate"
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

              <div className="mobile-form-grid">
                <InputField
                  label="اسم البرنامج"
                  name="programName"
                  value={
                    formik.values
                      .programName
                  }
                  onChange={
                    formik.handleChange
                  }
                />

                <InputField
                  label="مكان التنفيذ"
                  name="location"
                  value={
                    formik.values
                      .location
                  }
                  onChange={
                    formik.handleChange
                  }
                />
              </div>

              {/* =============================
                  Attendance
              ============================== */}

              <div className="mobile-form-grid">
                <InputField
                  label="الحضور"
                  name="attendance"
                  value={
                    formik.values
                      .attendance
                  }
                  onChange={
                    formik.handleChange
                  }
                />

                <InputField
                  label="الغياب"
                  name="absence"
                  value={
                    formik.values
                      .absence
                  }
                  onChange={
                    formik.handleChange
                  }
                />
              </div>

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
                placeholder={`تنمية روح التعاون
تعزيز الانتماء الوطني
تنمية مهارات التواصل
غرس القيم الإيجابية`}
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
                placeholder={`زيادة التفاعل
رفع مستوى الثقة بالنفس
تحسين التعاون
تنمية روح المبادرة`}
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

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      الحقول الإضافية
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      يمكنك إضافة حتى 4 حقول.
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-white px-2 py-1 text-xs font-bold text-gray-600">
                    {
                      formik.values
                        .customFields
                        .length
                    }
                    /4
                  </span>
                </div>

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

                          <div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2">
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
                                block
                                w-full
                                min-w-0
                                max-w-full

                                rounded-lg

                                border
                                border-gray-200

                                px-3
                                py-2.5

                                text-base

                                outline-none

                                focus:border-gray-900

                                sm:text-sm
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
                                block
                                w-full
                                min-w-0
                                max-w-full

                                rounded-lg

                                border
                                border-gray-200

                                px-3
                                py-2.5

                                text-base

                                outline-none

                                focus:border-gray-900

                                sm:text-sm
                              "
                            />
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={
                    addCustomField
                  }
                  disabled={
                    formik.values
                      .customFields
                      .length >=
                    4
                  }
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
                  {formik.values
                    .customFields
                    .length >=
                  4
                    ? "تم الوصول للحد الأقصى"
                    : "+ إضافة حقل"}
                </button>
              </div>

              {/* =============================
                  Leader / Manager
              ============================== */}

              <div className="mobile-form-grid">
                <InputField
                  label={
                    labels.activityLeaderInput
                  }
                  name="activityLeaderName"
                  value={
                    formik.values
                      .activityLeaderName
                  }
                  onChange={
                    formik.handleChange
                  }
                  onFocus={() => {
                    if (
                      !isFemale &&
                      formik.values
                        .activityLeaderName ===
                        DEFAULT_ACTIVITY_LEADER
                    ) {
                      formik.setFieldValue(
                        "activityLeaderName",
                        "",
                      );
                    }
                  }}
                  onBlur={() => {
                    if (
                      !isFemale &&
                      !formik.values
                        .activityLeaderName
                        .trim()
                    ) {
                      formik.setFieldValue(
                        "activityLeaderName",
                        DEFAULT_ACTIVITY_LEADER,
                      );
                    }
                  }}
                />

                <InputField
                  label={
                    labels.supervisorInput
                  }
                  name="supervisorName"
                  value={
                    formik.values
                      .supervisorName
                  }
                  onChange={
                    formik.handleChange
                  }
                  onFocus={() => {
                    if (
                      !isFemale &&
                      formik.values
                        .supervisorName ===
                        DEFAULT_SCHOOL_MANAGER
                    ) {
                      formik.setFieldValue(
                        "supervisorName",
                        "",
                      );
                    }
                  }}
                  onBlur={() => {
                    if (
                      !isFemale &&
                      !formik.values
                        .supervisorName
                        .trim()
                    ) {
                      formik.setFieldValue(
                        "supervisorName",
                        DEFAULT_SCHOOL_MANAGER,
                      );
                    }
                  }}
                />
              </div>

              {/* =============================
                  Images
              ============================== */}

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800">
                      صور الشواهد
                    </label>

                    <p className="mt-1 text-xs text-gray-500">
                      أضف من صورتين إلى أربع صور.
                    </p>
                  </div>

                  <span className="shrink-0 text-xs font-semibold text-gray-400">
                    {
                      formik.values
                        .evidenceImages
                        .length
                    }
                    /4
                  </span>
                </div>

                {formik.values
                  .evidenceImages
                  .length <
                  4 && (
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
                    "
                  >
                    + إضافة صور الشواهد

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
                          className="relative min-w-0 overflow-hidden rounded-xl border border-gray-200"
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

                              text-white
                            "
                          >
                            ×
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>

              {/* =============================
                  Actions
              ============================== */}

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={
                    openPreview
                  }
                  className="
                    rounded-xl

                    border
                    border-gray-300

                    bg-white

                    px-3
                    py-3

                    text-sm
                    font-semibold

                    text-gray-700
                  "
                >
                  معاينة
                </button>

                <button
                  type="button"
                  onClick={
                    printReport
                  }
                  className="
                    rounded-xl

                    bg-black

                    px-3
                    py-3

                    text-sm
                    font-semibold

                    text-white
                  "
                >
                  طباعة / PDF
                </button>
              </div>
            </div>
          </form>

          {/* =================================
              Desktop Preview

              لا يدخل في الطباعة.
          ================================== */}

          <div
            className="
              report-print-area

              hidden
              min-w-0

              lg:sticky
              lg:top-6
              lg:block
            "
          >
            <div className="no-print mb-3">
              <p className="text-sm font-bold text-gray-900">
                معاينة التقرير
              </p>

              <p className="mt-1 text-xs text-gray-500">
                المعاينة تتناسب تلقائيًا مع المساحة المتاحة.
              </p>
            </div>

            <ReportPreview
              previewId="report-preview"
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
                <strong className="block text-sm">
                  معاينة التقرير
                </strong>

                <span className="text-xs text-gray-500">
                  A4
                </span>
              </div>

              <button
                type="button"
                onClick={
                  closePreview
                }
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
              >
                إغلاق
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-auto bg-gray-200 p-2 sm:p-3">
              <ReportPreview
                previewId="mobile-report-preview"
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
              />
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-gray-200 bg-white p-3">
              <button
                type="button"
                onClick={
                  closePreview
                }
                className="rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm font-semibold text-gray-700"
              >
                رجوع للتعديل
              </button>

              <button
                type="button"
                onClick={
                  printReport
                }
                className="rounded-xl bg-black px-3 py-3 text-sm font-semibold text-white"
              >
                طباعة التقرير
              </button>
            </div>
          </div>
        )}

        {/* =================================
            PRINT ONLY

            دي النسخة الوحيدة
            اللي iOS / Desktop
            هيطبعها.
        ================================== */}

        <div className="print-only-report">
          <ReportPreview
            previewId="print-report-preview"
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
          />
        </div>
      </div>
    </section>
  );
};

export default ReportForm;

/* =========================================
   Theme Selector
========================================= */

type ThemeSelectorProps = {
  value: ReportTheme;

  onChange: (
    theme: ReportTheme,
  ) => void;
};

const ThemeSelector = ({
  value,
  onChange,
}: ThemeSelectorProps) => {
  return (
    <div>
      <div className="mb-3">
        <h3 className="text-sm font-bold text-gray-900">
          تصميم التقرير
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          اختر شكل الهيدر والفوتر.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {REPORT_THEMES.map(
          (theme) => {
            const selected =
              value ===
              theme.id;

            return (
              <button
                key={
                  theme.id
                }
                type="button"
                onClick={() =>
                  onChange(
                    theme.id,
                  )
                }
                className={`
                  min-w-0

                  overflow-hidden

                  rounded-xl

                  border

                  bg-white

                  text-right

                  transition

                  ${
                    selected
                      ? "border-black ring-2 ring-black/10"
                      : "border-gray-200 hover:border-gray-400"
                  }
                `}
              >
                <div className="relative h-16 overflow-hidden bg-white sm:h-20">
                  <Image
                    src={
                      theme.header
                    }
                    alt={
                      theme.label
                    }
                    width={
                      theme.headerWidth
                    }
                    height={
                      theme.headerHeight
                    }
                    className="h-full w-full object-fill"
                  />
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-gray-100 px-2.5 py-2 sm:px-3">
                  <span className="truncate text-xs font-bold text-gray-800">
                    {
                      theme.label
                    }
                  </span>

                  <span
                    className={`
                      flex
                      h-4
                      w-4

                      shrink-0

                      items-center
                      justify-center

                      rounded-full

                      border

                      ${
                        selected
                          ? "border-black bg-black"
                          : "border-gray-300"
                      }
                    `}
                  >
                    {selected && (
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </span>
                </div>
              </button>
            );
          },
        )}
      </div>
    </div>
  );
};

/* =========================================
   Color Picker
========================================= */

type ReportColorPickerProps = {
  value: string;

  onChange: (
    color: string,
  ) => void;
};

const ReportColorPicker = ({
  value,
  onChange,
}: ReportColorPickerProps) => {
  return (
    <div>
      <div className="mb-3">
        <h3 className="text-sm font-bold text-gray-900">
          لون خط التقرير
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          اختر لون النصوص داخل التقرير.
        </p>
      </div>

      <div className="flex min-w-0 items-center gap-2">
        <label
          htmlFor="report-font-color"
          className="
            flex
            h-12
            min-w-0
            flex-1

            cursor-pointer
            items-center
            gap-3

            rounded-xl

            border
            border-gray-200

            bg-white

            px-3
          "
        >
          <span
            className="h-7 w-7 shrink-0 rounded-full border border-gray-200"
            style={{
              backgroundColor:
                value,
            }}
          />

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-gray-700">
              اللون الحالي
            </p>

            <p
              dir="ltr"
              className="truncate text-xs text-gray-400"
            >
              {value.toUpperCase()}
            </p>
          </div>

          <input
            id="report-font-color"
            type="color"
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
            className="h-8 w-8 shrink-0 cursor-pointer border-0 bg-transparent p-0"
          />
        </label>

        <button
          type="button"
          onClick={() =>
            onChange(
              "#111111",
            )
          }
          className="
            h-12
            shrink-0

            rounded-xl

            border
            border-gray-200

            bg-white

            px-3

            text-xs
            font-semibold

            text-gray-600

            sm:px-4
          "
        >
          افتراضي
        </button>
      </div>
    </div>
  );
};

/* =========================================
   Objectives / Impact
========================================= */

type SingleListFieldProps = {
  title: string;

  description: string;

  value: string;

  placeholder: string;

  onChange: (
    value: string,
  ) => void;
};

const SingleListField = ({
  title,
  description,
  value,
  placeholder,
  onChange,
}: SingleListFieldProps) => {
  const count =
    value
      .split("\n")
      .filter(
        (line) =>
          line
            .trim()
            .length >
          0,
      ).length;

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-gray-900">
            {
              title
            }
          </h3>

          <p className="mt-0.5 text-[11px] leading-5 text-gray-500">
            {
              description
            }
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[11px] font-bold text-gray-600">
          {
            count
          }
          /4
        </span>
      </div>

      <textarea
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
        rows={
          4
        }
        className="
          block
          w-full
          min-w-0
          max-w-full

          resize-none

          rounded-lg

          border
          border-gray-200

          bg-white

          px-3
          py-2

          text-base
          leading-6

          outline-none

          focus:border-gray-900

          sm:text-sm
        "
      />
    </div>
  );
};

/* =========================================
   Input
========================================= */

type InputFieldProps = {
  label: string;

  name: string;

  value: string;

  type?: string;

  disabled?: boolean;

  onChange:
    ChangeEventHandler<HTMLInputElement>;

  onFocus?:
    FocusEventHandler<HTMLInputElement>;

  onBlur?:
    FocusEventHandler<HTMLInputElement>;
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
    <div className="min-w-0 max-w-full overflow-hidden">
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

          sm:min-h-0
          sm:text-sm
          sm:leading-normal
        "
      >
        {
          label
        }
      </label>

      <input
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
        className="
          block

          w-full
          min-w-0
          max-w-full

          rounded-xl

          border
          border-gray-200

          bg-white

          px-3
          py-2.5

          text-base

          outline-none

          transition

          focus:border-gray-900

          disabled:cursor-not-allowed
          disabled:bg-gray-100

          sm:text-sm
        "
      />
    </div>
  );
};