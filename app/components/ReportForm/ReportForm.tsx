"use client";

import { useEffect, useState } from "react";
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
   Umm Al-Qura
========================================= */

const convertToHijri = (
  gregorianDate: string,
) => {
  if (!gregorianDate) return "";

  const [year, month, day] =
    gregorianDate
      .split("-")
      .map(Number);

  if (!year || !month || !day) {
    return "";
  }

  /*
    نستخدم constructor المحلي بدل:
    new Date("2026-09-27")

    عشان نتجنب مشاكل تغيير اليوم
    بسبب الـ timezone.
  */

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

const ReportForm = () => {
  /* =========================================
     Mobile Preview
  ========================================= */

  const [preview, setPreview] =
    useState(false);

  const openPreview = () => {
    setPreview(true);
  };

  const closePreview = () => {
    setPreview(false);
  };

  /* منع Scroll خلف الـ Modal */

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

  /* إغلاق Modal بـ Escape */

  useEffect(() => {
    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
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

  /* =========================================
     Formik
  ========================================= */

  const formik =
    useFormik<ReportFormValues>({
      initialValues: {
        gender: "male",

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

        teacherName: "",

        specialization: "",

        grade: "",

        className: "",

        period: "",

        day: "",

        gregorianDate: "",

        hijriDate: "",

        programName: "",

        location: "",

        attendance: "",

        absence: "",

        objectives: "",

        impact: "",

        activityLeaderName:
          DEFAULT_ACTIVITY_LEADER,

        supervisorName:
          DEFAULT_SCHOOL_MANAGER,

        customFields: [],

        evidenceImages: [],
      },

      onSubmit: (values) => {
        console.log(values);
      },
    });

  /* =========================================
     Labels
  ========================================= */

  const isFemale =
    formik.values.gender ===
    "female";

  const labels = {
    teacherName: isFemale
      ? "اسم المعلمة"
      : "اسم المعلم",

    supervisor:
      "مدير المدرسة",

    activityLeader:
      "رائد النشاط",
  };

  /* =========================================
     Selected Category
  ========================================= */

  const selectedCategory =
    formik.values.categories.find(
      (category) =>
        category.id ===
        formik.values
          .selectedCategory,
    );

  /* =========================================
     Custom Fields
  ========================================= */

  const addCustomField = () => {
    formik.setFieldValue(
      "customFields",
      [
        ...formik.values
          .customFields,

        {
          id: crypto.randomUUID(),
          label: "",
          value: "",
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

  /* =========================================
     Evidence Images
  ========================================= */

  const handleImagesChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(
      event.target.files || [],
    );

    if (!files.length) return;

    const currentImages =
      formik.values.evidenceImages;

    const remaining =
      4 -
      currentImages.length;

    if (remaining <= 0) {
      toast.error(
        "الحد الأقصى للصور هو 4 صور",
      );

      event.target.value = "";

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

    event.target.value = "";
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

    if (removedImage) {
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

  /* =========================================
     Print
  ========================================= */

  const printReport = () => {
    if (
      formik.values
        .evidenceImages.length <
      2
    ) {
      toast.error(
        "يجب إضافة صورتين على الأقل من الشواهد",
      );

      return;
    }

    setPreview(false);

    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <section
      id="report"
      className="
        bg-gray-50
        px-4
        py-8
        sm:px-6
        sm:py-12
        lg:px-8
      "
    >
      <div className="mx-auto max-w-7xl">
        {/* =========================================
            Category
        ========================================= */}

        <CategorySelector
          categories={
            formik.values.categories
          }
          selectedCategory={
            formik.values
              .selectedCategory
          }
          onSelect={(id) =>
            formik.setFieldValue(
              "selectedCategory",
              id,
            )
          }
          onAdd={(category) => {
            formik.setFieldValue(
              "categories",
              [
                ...formik.values
                  .categories,
                category,
              ],
            );
          }}
        />

        {/* =========================================
            Header
        ========================================= */}

        <div
          className="
            mb-8
            flex
            items-center
            justify-between
            gap-4
            sm:mb-10
          "
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-950 sm:text-3xl">
              إنشاء التقرير
            </h2>

            <p className="mt-2 hidden text-sm text-gray-500 sm:block">
              أدخل البيانات وشاهد
              التقرير مباشرة قبل
              الطباعة.
            </p>
          </div>

          {/* Mobile Preview */}

          <button
            type="button"
            onClick={openPreview}
            className="
              flex
              shrink-0
              items-center
              rounded-xl
              bg-black
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-gray-800
              lg:hidden
            "
          >
            معاينة التقرير
          </button>
        </div>

        {/* =========================================
            Layout
        ========================================= */}

        <div
          className="
            grid
            min-w-0
            gap-8
            lg:grid-cols-[420px_minmax(0,1fr)]
          "
        >
          {/* =========================================
              Form
          ========================================= */}

          <form
            onSubmit={
              formik.handleSubmit
            }
            className="
              no-print
              h-fit
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-4
              shadow-sm
              sm:p-6
            "
          >
            <div className="space-y-6">
              {/* =========================================
                  Gender
              ========================================= */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  النوع
                </label>

                <div className="grid grid-cols-2 gap-3">
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
                      px-4
                      py-3
                      text-sm
                      font-medium
                      transition
                      ${formik.values.gender ===
                        "male"
                        ? "border-black bg-black text-white"
                        : "border-gray-200 bg-white text-gray-700"
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
                      px-4
                      py-3
                      text-sm
                      font-medium
                      transition
                      ${formik.values.gender ===
                        "female"
                        ? "border-black bg-black text-white"
                        : "border-gray-200 bg-white text-gray-700"
                      }
                    `}
                  >
                    معلمة
                  </button>
                </div>
              </div>

              {/* =========================================
                  Region + School
              ========================================= */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                  label="اسم المنطقة"
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
                    formik.values
                      .schoolName
                  }
                  onChange={
                    formik.handleChange
                  }
                  onFocus={() => {
                    if (
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

              {/* =========================================
                  Teacher
              ========================================= */}

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

              {/* =========================================
                  Grade + Class
              ========================================= */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  label="الفصل"
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

              {/* =========================================
                  Period + Day
              ========================================= */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

              {/* =========================================
                  Gregorian + Hijri
              ========================================= */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                      event.target
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
                  disable={true}
                  value={
                    formik.values
                      .hijriDate
                  }
                  onChange={
                    formik.handleChange
                  }
                  placeholder="مثال: ١٥/٠٤/١٤٤٨ هـ"
                />
              </div>

              {/* =========================================
                  Program
              ========================================= */}

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

              {/* =========================================
                  Attendance
              ========================================= */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

              {/* =========================================
                  Leader + Manager
              ========================================= */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                  label="اسم رائد النشاط"
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
                    formik.values
                      .supervisorName
                  }
                  onChange={
                    formik.handleChange
                  }
                  onFocus={() => {
                    if (
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

              {/* =========================================
                  Objectives
              ========================================= */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  أهداف البرنامج
                </label>

                <textarea
                  name="objectives"
                  value={
                    formik.values
                      .objectives
                  }
                  onChange={
                    formik.handleChange
                  }
                  rows={4}
                  className="
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-gray-200
                    px-4
                    py-3
                    outline-none
                    transition
                    focus:border-gray-900
                  "
                />
              </div>

              {/* =========================================
                  Impact
              ========================================= */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  أثر البرنامج
                </label>

                <textarea
                  name="impact"
                  value={
                    formik.values
                      .impact
                  }
                  onChange={
                    formik.handleChange
                  }
                  rows={4}
                  className="
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-gray-200
                    px-4
                    py-3
                    outline-none
                    transition
                    focus:border-gray-900
                  "
                />
              </div>

              {/* =========================================
                  Custom Fields
              ========================================= */}

              {formik.values.customFields.map(
                (
                  field,
                  index,
                ) => (
                  <div
                    key={
                      field.id
                    }
                    className="
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      p-4
                    "
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">
                        حقل إضافي
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          removeCustomField(
                            field.id,
                          )
                        }
                        className="text-sm font-medium text-red-500 hover:text-red-700"
                      >
                        حذف
                      </button>
                    </div>

                    <div className="space-y-3">
                      <input
                        name={`customFields.${index}.label`}
                        value={
                          field.label
                        }
                        onChange={
                          formik.handleChange
                        }
                        placeholder="اسم الحقل"
                        className="
                          w-full
                          rounded-xl
                          border
                          border-gray-200
                          bg-white
                          px-4
                          py-3
                          outline-none
                          focus:border-gray-900
                        "
                      />

                      <input
                        name={`customFields.${index}.value`}
                        value={
                          field.value
                        }
                        onChange={
                          formik.handleChange
                        }
                        placeholder="القيمة"
                        className="
                          w-full
                          rounded-xl
                          border
                          border-gray-200
                          bg-white
                          px-4
                          py-3
                          outline-none
                          focus:border-gray-900
                        "
                      />
                    </div>
                  </div>
                ),
              )}

              {/* =========================================
                  Evidence Images
              ========================================= */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-800">
                    صور الشواهد
                  </label>

                  <span className="text-xs text-gray-500">
                    {
                      formik.values
                        .evidenceImages
                        .length
                    }
                    /4
                  </span>
                </div>

                <p className="mb-3 text-xs text-gray-500">
                  يجب إضافة صورتين
                  على الأقل، والحد
                  الأقصى 4 صور.
                </p>

                {formik.values
                  .evidenceImages
                  .length < 4 && (
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

                {formik.values
                  .evidenceImages
                  .length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {formik.values.evidenceImages.map(
                        (
                          image,
                          index,
                        ) => (
                          <div
                            key={
                              image
                            }
                            className="
                            relative
                            overflow-hidden
                            rounded-lg
                            border
                            border-gray-200
                          "
                          >
                            <Image
                              width={
                                600
                              }
                              height={
                                450
                              }
                              src={
                                image
                              }
                              alt={`الشاهد ${index +
                                1
                                }`}
                              unoptimized
                              className="
                              aspect-[4/3]
                              h-full
                              w-full
                              object-cover
                            "
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
                              rounded-md
                              bg-white/95
                              px-2
                              py-1
                              text-xs
                              font-semibold
                              text-red-600
                              shadow-sm
                            "
                            >
                              حذف
                            </button>
                          </div>
                        ),
                      )}
                    </div>
                  )}

                {formik.values
                  .evidenceImages
                  .length === 1 && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      أضف صورة أخرى على
                      الأقل حتى تتمكن
                      من طباعة التقرير.
                    </p>
                  )}
              </div>

              {/* =========================================
                  Add Custom
              ========================================= */}

              <button
                type="button"
                onClick={
                  addCustomField
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-dashed
                  border-gray-300
                  px-4
                  py-3
                  font-medium
                  text-gray-700
                  transition
                  hover:border-gray-900
                  hover:text-black
                "
              >
                + إضافة حقل
              </button>

              {/* =========================================
                  Print
              ========================================= */}

              <button
                type="button"
                onClick={
                  printReport
                }
                className="
                  w-full
                  rounded-xl
                  bg-black
                  px-4
                  py-3
                  font-semibold
                  text-white
                  transition
                  hover:bg-gray-800
                "
              >
                طباعة / حفظ PDF
              </button>
            </div>
          </form>

          {/* =========================================
              Desktop Preview
          ========================================= */}

          <div className="hidden min-w-0 lg:block print:block">
            <ReportPreview
              previewId="report-preview"
              values={
                formik.values
              }
              labels={labels}
              categoryName={
                selectedCategory
                  ?.name ?? ""
              }
            />
          </div>
        </div>
      </div>

      {/* =========================================
          Mobile Preview Modal
      ========================================= */}

      {preview && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            bg-black/60
            backdrop-blur-[2px]
            lg:hidden
          "
        >
          <div className="flex h-[100dvh] w-full flex-col bg-white">
            {/* Header */}

            <div
              className="
                flex
                shrink-0
                items-center
                justify-between
                border-b
                border-gray-200
                bg-white
                px-4
                py-3
              "
            >
              <div>
                <h3 className="font-bold text-gray-950">
                  معاينة التقرير
                </h3>

                <p className="mt-0.5 text-xs text-gray-500">
                  راجع التقرير قبل
                  الطباعة
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closePreview
                }
                aria-label="إغلاق المعاينة"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-gray-100
                  text-2xl
                  text-gray-700
                "
              >
                ×
              </button>
            </div>

            {/* Preview */}

            <div className="flex-1 overflow-auto bg-gray-100 p-3 sm:p-5">
              <ReportPreview
                previewId="report-preview-mobile"
                values={
                  formik.values
                }
                labels={labels}
                categoryName={
                  selectedCategory
                    ?.name ?? ""
                }
              />
            </div>

            {/* Buttons */}

            <div className="shrink-0 border-t border-gray-200 bg-white p-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={
                    closePreview
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
                  "
                >
                  رجوع للتعديل
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
                  "
                >
                  طباعة التقرير
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ReportForm;

/* =========================================
   Input Field
========================================= */

type InputFieldProps = {
  label: string;

  name: string;

  value: string;

  type?: string;

  placeholder?: string;

  disable?: boolean;

  onChange:
  React.ChangeEventHandler<HTMLInputElement>;

  onFocus?:
  React.FocusEventHandler<HTMLInputElement>;

  onBlur?:
  React.FocusEventHandler<HTMLInputElement>;
};

const InputField = ({
  label,
  name,
  value,
  type = "text",
  placeholder,
  onChange,
  onFocus,
  onBlur,
  disable = false
}: InputFieldProps) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-gray-800"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        disabled={disable}
        placeholder={
          placeholder
        }
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className="
          w-full
          rounded-xl
          border
          border-gray-200
          px-4
          py-3
          outline-none
          transition
          focus:border-gray-900
        "
      />
    </div>
  );
};