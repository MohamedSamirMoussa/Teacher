"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import Image from "next/image";
import toast from "react-hot-toast";

import ReportPreview from "../ReportPreview/ReportPreview";
import CategorySelector from "../CategorySelector/CategorySelector";

import { ReportFormValues } from "@/app/types/reports";

const DEFAULT_ACTIVITY_LEADER = "أ.عمر سعيد الصاعدي";
const DEFAULT_SCHOOL_MANAGER = "أ.عبدالعزيز عوض العلوي";


const ReportForm = () => {
  /* =========================================
     Mobile Preview Modal
  ========================================= */

  const [preview, setPreview] = useState(false);

  const openPreview = () => {
    setPreview(true);
  };

  const closePreview = () => {
    setPreview(false);
  };

  /* منع Scroll خلف الـ Modal */
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

  /* إغلاق الـ Modal بزر Escape */
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
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

  /* =========================================
     Formik
  ========================================= */

  const formik = useFormik<ReportFormValues>({
    initialValues: {
      gender: "male",

      selectedCategory: "citizenship",

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

      regionName: "المدينة المنورة",

      schoolName: "مدرسة ابتدائية أبيار الماشي",

      teacherName: "",

      specialization: "",

      grade: "",

      className: "",

      date: "",

      programName: "",

      objectives: "",

      impact: "",

      activityLeaderName: "أ.عمر سعيد الصاعدي",

      supervisorName: "أ.عبدالعزيز عوض العلوي",

      customFields: [],

      evidenceImages: [],
    },

    onSubmit: (values) => {
      console.log(values);
    },
  });

  /* =========================================
     Gender Labels
  ========================================= */

  const isFemale = formik.values.gender === "female";

  const labels = {
    teacherName: isFemale ? "اسم المعلمة" : "اسم المعلم",

    supervisor: isFemale ? "المديرة" : "المدير",

    activityLeader: isFemale ? "رائدة النشاط" : "رائد النشاط",
  };

  /* =========================================
     Selected Category
  ========================================= */

  const selectedCategory = formik.values.categories.find(
    (category) =>
      category.id === formik.values.selectedCategory,
  );

  /* =========================================
     Custom Fields
  ========================================= */

  const addCustomField = () => {
    formik.setFieldValue("customFields", [
      ...formik.values.customFields,

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

      formik.values.customFields.filter(
        (field) => field.id !== id,
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
      4 - currentImages.length;

    if (remaining <= 0) {
      toast.error(
        "الحد الأقصى للصور هو 4 صور",
      );

      event.target.value = "";

      return;
    }

    const selectedFiles = files.slice(
      0,
      remaining,
    );

    const newImages = selectedFiles.map(
      (file) => URL.createObjectURL(file),
    );

    formik.setFieldValue(
      "evidenceImages",

      [
        ...currentImages,
        ...newImages,
      ],
    );

    if (files.length > remaining) {
      toast.error(
        "تم إضافة الحد الأقصى المسموح وهو 4 صور",
      );
    }

    event.target.value = "";
  };

  const removeImage = (index: number) => {
    const images = [
      ...formik.values.evidenceImages,
    ];

    const removedImage =
      images[index];

    if (removedImage) {
      URL.revokeObjectURL(
        removedImage,
      );
    }

    images.splice(index, 1);

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
      formik.values.evidenceImages.length < 2
    ) {
      toast.error(
        "يجب إضافة صورتين على الأقل من الشواهد",
      );

      return;
    }

    /*
      لو الـ Modal مفتوح اقفله الأول
      ثم افتح الـ Print بعد تحديث الـ DOM
    */

    setPreview(false);

    setTimeout(() => {
      window.print();
    }, 100);
  };

  /* =========================================
     Render
  ========================================= */

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

        {/* =========================
            Category Selector
        ========================= */}

        <CategorySelector
          categories={
            formik.values.categories
          }
          selectedCategory={
            formik.values.selectedCategory
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
                ...formik.values.categories,
                category,
              ],
            );
          }}
        />

        {/* =========================
            Page Header
        ========================= */}

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
            <h2
              className="
                text-2xl
                font-bold
                text-gray-950
                sm:text-3xl
              "
            >
              إنشاء التقرير
            </h2>

            <p
              className="
                mt-2
                hidden
                text-sm
                text-gray-500
                sm:block
              "
            >
              أدخل البيانات وشاهد
              التقرير مباشرة قبل
              الطباعة.
            </p>
          </div>

          {/* Mobile Preview Button */}

          <button
            type="button"
            onClick={openPreview}
            className="
              flex
              shrink-0
              items-center
              gap-2
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
            <span>
              معاينة التقرير
            </span>
          </button>
        </div>

        {/* =========================
            Main Layout
        ========================= */}

        <div
          className="
            grid
            min-w-0
            gap-8
            lg:grid-cols-[420px_minmax(0,1fr)]
          "
        >
          {/* =========================
              FORM
          ========================= */}

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

              {/* Gender */}

              <div>
                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-gray-800
                  "
                >
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
                      px-4
                      py-3
                      text-sm
                      font-medium
                      transition

                      ${formik.values.gender ===
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

              <div
                className="
                  grid
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                "
              >
                <InputField
                  label="اسم المنطقة"
                  name="regionName"
                  value={
                    formik.values.regionName
                  }
                  onChange={
                    formik.handleChange
                  }
                />

                <InputField
                  label="اسم المدرسة"
                  name="schoolName"
                  value={
                    formik.values.schoolName
                  }
                  onChange={
                    formik.handleChange
                  }
                />
              </div>

              {/* Teacher */}

              <InputField
                label={
                  labels.teacherName
                }
                name="teacherName"
                value={
                  formik.values.teacherName
                }
                onChange={
                  formik.handleChange
                }
              />

              {/* Specialization */}

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

              {/* Grade */}

              <InputField
                label="الصف"
                name="grade"
                value={
                  formik.values.grade
                }
                onChange={
                  formik.handleChange
                }
              />

              {/* Class */}

              <InputField
                label="الفصل"
                name="className"
                value={
                  formik.values.className
                }
                onChange={
                  formik.handleChange
                }
              />

              {/* Date */}

              <InputField
                label="التاريخ"
                name="date"
                type="date"
                value={
                  formik.values.date
                }
                onChange={
                  formik.handleChange
                }
              />

              {/* Program */}

              <InputField
                label="اسم البرنامج"
                name="programName"
                value={
                  formik.values.programName
                }
                onChange={
                  formik.handleChange
                }
              />

              {/* Activity Leader + Supervisor */}

              <div
                className="
                  grid
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                "
              >
                <InputField
                  label="اسم رائد النشاط"
                  name="activityLeaderName"
                  value={formik.values.activityLeaderName}
                  onChange={formik.handleChange}
                  onFocus={() => {
                    if (
                      formik.values.activityLeaderName ===
                      DEFAULT_ACTIVITY_LEADER
                    ) {
                      formik.setFieldValue("activityLeaderName", "");
                    }
                  }}
                  onBlur={() => {
                    if (!formik.values.activityLeaderName.trim()) {
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
                  value={formik.values.supervisorName}
                  onChange={formik.handleChange}
                  onFocus={() => {
                    if (
                      formik.values.supervisorName ===
                      DEFAULT_SCHOOL_MANAGER
                    ) {
                      formik.setFieldValue("supervisorName", "");
                    }
                  }}
                  onBlur={() => {
                    if (!formik.values.supervisorName.trim()) {
                      formik.setFieldValue(
                        "supervisorName",
                        DEFAULT_SCHOOL_MANAGER,
                      );
                    }
                  }}
                />

              </div>

              {/* Objectives */}

              <div>
                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-gray-800
                  "
                >
                  أهداف البرنامج
                </label>

                <textarea
                  name="objectives"
                  value={
                    formik.values.objectives
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

              {/* Impact */}

              <div>
                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-gray-800
                  "
                >
                  أثر البرنامج
                </label>

                <textarea
                  name="impact"
                  value={
                    formik.values.impact
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

              {/* =========================
                  Dynamic Fields
              ========================= */}

              {formik.values.customFields.map(
                (field, index) => (
                  <div
                    key={field.id}
                    className="
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      p-4
                    "
                  >
                    <div
                      className="
                        mb-3
                        flex
                        items-center
                        justify-between
                      "
                    >
                      <span
                        className="
                          text-sm
                          font-semibold
                          text-gray-700
                        "
                      >
                        حقل إضافي
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          removeCustomField(
                            field.id,
                          )
                        }
                        className="
                          text-sm
                          font-medium
                          text-red-500
                          transition
                          hover:text-red-700
                        "
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

              {/* =========================
                  Evidence Images
              ========================= */}

              <div>
                <div
                  className="
                    mb-2
                    flex
                    items-center
                    justify-between
                  "
                >
                  <label
                    className="
                      text-sm
                      font-semibold
                      text-gray-800
                    "
                  >
                    صور الشواهد
                  </label>

                  <span
                    className="
                      text-xs
                      text-gray-500
                    "
                  >
                    {
                      formik.values
                        .evidenceImages
                        .length
                    }
                    /4
                  </span>
                </div>

                <p
                  className="
                    mb-3
                    text-xs
                    text-gray-500
                  "
                >
                  يجب إضافة صورتين على
                  الأقل، والحد الأقصى 4
                  صور.
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
                        accept="
                        image/png,
                        image/jpeg,
                        image/webp
                      "
                        multiple
                        onChange={
                          handleImagesChange
                        }
                        className="hidden"
                      />
                    </label>
                  )}

                {/* Selected Images */}

                {formik.values
                  .evidenceImages
                  .length > 0 && (
                    <div
                      className="
                      mt-4
                      grid
                      grid-cols-2
                      gap-3
                    "
                    >
                      {formik.values.evidenceImages.map(
                        (
                          image,
                          index,
                        ) => (
                          <div
                            key={image}
                            className="
                            relative
                            overflow-hidden
                            rounded-lg
                            border
                            border-gray-200
                          "
                          >
                            <Image
                              width={600}
                              height={450}
                              src={
                                image
                              }
                              alt={`الشاهد ${index + 1
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
                    <p
                      className="
                      mt-2
                      text-xs
                      font-medium
                      text-red-500
                    "
                    >
                      أضف صورة أخرى على الأقل
                      حتى تتمكن من طباعة
                      التقرير.
                    </p>
                  )}
              </div>

              {/* Add Field */}

              <button
                type="button"
                onClick={addCustomField}
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

              {/* Print */}

              <button
                type="button"
                onClick={printReport}
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

          {/* =========================
              Desktop Preview
          ========================= */}

          <div
            className="
              hidden
              min-w-0
              lg:block
              print:block
            "
          >
            <ReportPreview
              previewId="report-preview"
              values={formik.values}
              labels={labels}
              categoryName={
                selectedCategory?.name ??
                ""
              }
            />
          </div>
        </div>
      </div>

      {/* =========================================
          MOBILE PREVIEW MODAL
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
          <div
            className="
              flex
              h-[100dvh]
              w-full
              flex-col
              bg-white
            "
          >
            {/* Modal Header */}

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
                <h3
                  className="
                    font-bold
                    text-gray-950
                  "
                >
                  معاينة التقرير
                </h3>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-gray-500
                  "
                >
                  راجع التقرير قبل
                  الطباعة
                </p>
              </div>

              <button
                type="button"
                onClick={closePreview}
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
                  leading-none
                  text-gray-700
                  transition
                  hover:bg-gray-200
                "
              >
                ×
              </button>
            </div>

            {/* Modal Preview */}

            <div
              className="
                flex-1
                overflow-auto
                bg-gray-100
                p-3
                sm:p-5
              "
            >
              <ReportPreview
                previewId="report-preview-mobile"
                values={
                  formik.values
                }
                labels={labels}
                categoryName={
                  selectedCategory?.name ??
                  ""
                }
              />
            </div>

            {/* Modal Footer */}

            <div
              className="
                shrink-0
                border-t
                border-gray-200
                bg-white
                p-3
              "
            >
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
                    transition
                    hover:bg-gray-50
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
                    transition
                    hover:bg-gray-800
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
   InputField
========================================= */

type InputFieldProps = {
  label: string;
  name: string;
  value: string;
  type?: string;

  onChange: React.ChangeEventHandler<HTMLInputElement>;

  onFocus?: React.FocusEventHandler<HTMLInputElement>;

  onBlur?: React.FocusEventHandler<HTMLInputElement>;
};

const InputField = ({
  label,
  name,
  value,
  type = "text",
  onChange,
  onFocus,
  onBlur,
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