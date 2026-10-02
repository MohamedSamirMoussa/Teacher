"use client";

import {
  useEffect,
  useState,
} from "react";

import { useFormik } from "formik";

import Image from "next/image";

import toast from "react-hot-toast";

import ReportPreview from "../ReportPreview/ReportPreview";

import CategorySelector from "../CategorySelector/CategorySelector";

import { ReportFormValues } from "@/app/types/reports";

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

  const [year, month, day] =
    gregorianDate
      .split("-")
      .map(Number);

  if (
    !year ||
    !month ||
    !day
  ) {
    return "";
  }

  const date = new Date(
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
  const [preview, setPreview] =
    useState(false);

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
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow =
        "";
    }

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
     Formik
  ====================================== */

  const formik =
    useFormik<ReportFormValues>({
      initialValues: {
        gender:
          "male",

        selectedCategory:
          "citizenship",

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

      onSubmit: () => {},
    });

  /* =====================================
     Gender Labels
  ====================================== */

  const isFemale =
    formik.values.gender ===
    "female";

  const labels = {
    teacherName:
      isFemale
        ? "اسم المعلمة"
        : "اسم المعلم",

    supervisor:
      "مدير المدرسة",

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
     Selected Category
  ====================================== */

  const selectedCategory =
    formik.values.categories.find(
      (category) =>
        category.id ===
        formik.values
          .selectedCategory,
    );

  /* =====================================
     Custom Fields
  ====================================== */

  const addCustomField = () => {
    const currentFields =
      formik.values.customFields;

    if (
      currentFields.length >= 4
    ) {
      toast.error(
        "الحد الأقصى للحقول الإضافية هو 4 حقول",
      );

      return;
    }

    formik.setFieldValue(
      "customFields",
      [
        ...currentFields,

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

      formik.values.customFields.filter(
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
    const filledLines =
      value
        .split("\n")
        .filter(
          (line) =>
            line.trim()
              .length >
            0,
        );

    /*
      Enter مسموح طبيعي.

      المنع يحصل فقط عند كتابة
      أكثر من 4 عناصر فعلية.
    */

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
      نخزن القيمة RAW.
      مفيش trim أو filter.
    */

    formik.setFieldValue(
      fieldName,
      value,
    );
  };

  /* =====================================
     Evidence Images
  ====================================== */

  const handleImagesChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files =
      Array.from(
        event.target.files ||
          [],
      );

    if (
      !files.length
    ) {
      return;
    }

    const currentImages =
      formik.values
        .evidenceImages;

    const remaining =
      4 -
      currentImages.length;

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

    const selectedFiles =
      files.slice(
        0,
        remaining,
      );

    const newImages =
      selectedFiles.map(
        (file) =>
          URL.createObjectURL(
            file,
          ),
      );

    formik.setFieldValue(
      "evidenceImages",
      [
        ...currentImages,

        ...newImages,
      ],
    );

    if (
      files.length >
      remaining
    ) {
      toast.error(
        "تم إضافة الحد الأقصى المسموح وهو 4 صور",
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

    const removedImage =
      images[index];

    if (
      removedImage
    ) {
      URL.revokeObjectURL(
        removedImage,
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

  const printReport = () => {
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
            أدخل بيانات التقرير ثم راجع
            المعاينة واحفظ التقرير بصيغة
            PDF.
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
              Form
          ================================== */}

          <form
            onSubmit={
              formik.handleSubmit
            }
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
              {/* Gender */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  النوع
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      formik.setFieldValue(
                        "gender",
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
                        formik
                          .values
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
                      formik.setFieldValue(
                        "gender",
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
                        formik
                          .values
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

              {/* Region + School */}

              <div className="mobile-form-grid">
                <InputField
                  label="المنطقة"
                  name="regionName"
                  value={
                    formik
                      .values
                      .regionName
                  }
                  onChange={
                    formik.handleChange
                  }
                  onFocus={() => {
                    if (
                      formik
                        .values
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
                      !formik.values.regionName.trim()
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
                    formik
                      .values
                      .schoolName
                  }
                  onChange={
                    formik.handleChange
                  }
                  onFocus={() => {
                    if (
                      formik
                        .values
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
                      !formik.values.schoolName.trim()
                    ) {
                      formik.setFieldValue(
                        "schoolName",
                        DEFAULT_SCHOOL,
                      );
                    }
                  }}
                />
              </div>

              {/* Teacher */}

              <div className="mobile-form-grid">
                <InputField
                  label={
                    labels.teacherName
                  }
                  name="teacherName"
                  value={
                    formik
                      .values
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
                    formik
                      .values
                      .specialization
                  }
                  onChange={
                    formik.handleChange
                  }
                />
              </div>

              {/* Grade */}

              <div className="mobile-form-grid">
                <InputField
                  label="الصف"
                  name="grade"
                  value={
                    formik
                      .values
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
                    formik
                      .values
                      .className
                  }
                  onChange={
                    formik.handleChange
                  }
                />
              </div>

              {/* Period */}

              <div className="mobile-form-grid">
                <InputField
                  label="الحصة"
                  name="period"
                  value={
                    formik
                      .values
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
                    formik
                      .values
                      .day
                  }
                  onChange={
                    formik.handleChange
                  }
                />
              </div>

              {/* Dates */}

              <div className="mobile-form-grid">
                <InputField
                  label="التاريخ الميلادي"
                  name="gregorianDate"
                  type="date"
                  value={
                    formik
                      .values
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
                    formik
                      .values
                      .hijriDate
                  }
                  onChange={
                    formik.handleChange
                  }
                />
              </div>

              {/* Program */}

              <div className="mobile-form-grid">
                <InputField
                  label="اسم البرنامج"
                  name="programName"
                  value={
                    formik
                      .values
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
                    formik
                      .values
                      .location
                  }
                  onChange={
                    formik.handleChange
                  }
                />
              </div>

              {/* Attendance */}

              <div className="mobile-form-grid">
                <InputField
                  label="الحضور"
                  name="attendance"
                  value={
                    formik
                      .values
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
                    formik
                      .values
                      .absence
                  }
                  onChange={
                    formik.handleChange
                  }
                />
              </div>

              {/* Objectives */}

              <SingleListField
                title="أهداف البرنامج"
                description="اكتب الهدف ثم اضغط Enter للهدف التالي. الحد الأقصى 4 أهداف."
                value={
                  formik
                    .values
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

              {/* Impact */}

              <SingleListField
                title="الأثر الإيجابي للبرنامج"
                description="اكتب الأثر ثم اضغط Enter للأثر التالي. الحد الأقصى 4 آثار."
                value={
                  formik
                    .values
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

              {/* Custom Fields */}

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      الحقول الإضافية
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      يمكنك إضافة حتى 4 حقول فقط.
                    </p>
                  </div>

                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-gray-600 shadow-sm">
                    {
                      formik
                        .values
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
                  </div>
                )}

                <button
                  type="button"
                  onClick={
                    addCustomField
                  }
                  disabled={
                    formik
                      .values
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
                  {formik
                    .values
                    .customFields
                    .length >=
                  4
                    ? "تم الوصول للحد الأقصى"
                    : "+ إضافة حقل"}
                </button>
              </div>

              {/* Leader / Manager */}

              <div className="mobile-form-grid">
                <InputField
                  label={
                    labels.activityLeaderInput
                  }
                  name="activityLeaderName"
                  value={
                    formik
                      .values
                      .activityLeaderName
                  }
                  onChange={
                    formik.handleChange
                  }
                  onFocus={() => {
                    if (
                      formik
                        .values
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
                      !formik.values.activityLeaderName.trim()
                    ) {
                      formik.setFieldValue(
                        "activityLeaderName",
                        DEFAULT_ACTIVITY_LEADER,
                      );
                    }
                  }}
                />

                <InputField
                  label="اسم مدير المدرسة"
                  name="supervisorName"
                  value={
                    formik
                      .values
                      .supervisorName
                  }
                  onChange={
                    formik.handleChange
                  }
                  onFocus={() => {
                    if (
                      formik
                        .values
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
                      !formik.values.supervisorName.trim()
                    ) {
                      formik.setFieldValue(
                        "supervisorName",
                        DEFAULT_SCHOOL_MANAGER,
                      );
                    }
                  }}
                />
              </div>

              {/* Evidence */}

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
                    {
                      formik
                        .values
                        .evidenceImages
                        .length
                    }
                    /4
                  </span>
                </div>

                {formik
                  .values
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
                      hover:text-gray-900
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

                {formik
                  .values
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
                          >
                            ×
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}

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
                  onClick={
                    printReport
                  }
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
              <p className="text-sm font-bold text-gray-900">
                معاينة التقرير
              </p>

              <p className="mt-1 text-xs text-gray-500">
                المعاينة تتناسب تلقائياً مع المساحة المتاحة.
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

            <div className="flex-1 overflow-auto bg-gray-200 p-3">
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
                className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700"
              >
                رجوع للتعديل
              </button>

              <button
                type="button"
                onClick={
                  printReport
                }
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
   Multiline List Field
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
          line.trim()
            .length >
          0,
      ).length;

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-gray-500">
            {description}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-600 shadow-sm">
          {count}/4
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
   Input
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