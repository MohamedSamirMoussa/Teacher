"use client";

import { useEffect, useState } from "react";

import type { ChangeEvent, ChangeEventHandler, FocusEventHandler } from "react";

import { useFormik } from "formik";

import Image from "next/image";

import toast from "react-hot-toast";

import ReportPreview from "../ReportPreview/ReportPreview";

import CategorySelector from "../CategorySelector/CategorySelector";

import { DEFAULT_REPORT_TEXT_COLORS } from "@/app/types/reports";

import type {

  Gender,

  ReportFormValues,

  ReportTextColorKey,

  ReportTextColors,

  ReportTheme,

} from "@/app/types/reports";

import { REPORT_THEMES } from "@/app/constants/reportThemes";

import {
  downloadPdfBlob,
  generateReportPdf,
  isAppleMobileDevice,
  sharePdfBlob,
} from "@/app/utils/generateReportPdf";

import type {
  GeneratedPdfFile,
} from "@/app/utils/generateReportPdf";

/* =========================================================

   DEFAULT VALUES

========================================================= */

const DEFAULT_ACTIVITY_LEADER = "أ.عمر سعيد الصاعدي";

const DEFAULT_SCHOOL_MANAGER = "أ.عبدالعزيز عوض العلوي";

const DEFAULT_SCHOOL = "مدرسة ابتدائية أبيار الماشي";

const DEFAULT_REGION = "المدينة المنورة";

/* =========================================================

   DATE

========================================================= */

const convertToHijri = (gregorianDate: string) => {

  if (!gregorianDate) {

    return "";

  }

  const [year, month, day] = gregorianDate.split("-").map(Number);

  if (!year || !month || !day) {

    return "";

  }

  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", {

    day: "2-digit",

    month: "2-digit",

    year: "numeric",

  }).format(date);

};

/* =========================================================

   REPORT FORM

========================================================= */

const ReportForm = () => {

  const [preview, setPreview] = useState(false);

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const [generatedPdf, setGeneratedPdf] = useState<GeneratedPdfFile | null>(null);

  const [isSharingPdf, setIsSharingPdf] = useState(false);

  /* =======================================================

     FORMIK

  ======================================================= */

  const formik = useFormik<ReportFormValues>({

    initialValues: {

      theme: "theme1",

      textColors: {

        ...DEFAULT_REPORT_TEXT_COLORS,

      },

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

      regionName: DEFAULT_REGION,

      schoolName: DEFAULT_SCHOOL,

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

      activityLeaderName: DEFAULT_ACTIVITY_LEADER,

      supervisorName: DEFAULT_SCHOOL_MANAGER,

      customFields: [],

      evidenceImages: [],

    },

    onSubmit: () => {},

  });

  /* =======================================================

     PREVIEW

  ======================================================= */

  const openPreview = () => {

    setPreview(true);

  };

  const closePreview = () => {

    setPreview(false);

  };

  useEffect(() => {

    document.body.style.overflow = preview ? "hidden" : "";

    return () => {

      document.body.style.overflow = "";

    };

  }, [preview]);

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

  /* =======================================================

     GENDER

  ======================================================= */

  const isFemale = formik.values.gender === "female";

  const labels = {

    teacherName: isFemale ? "اسم المعلمة" : "اسم المعلم",

    activityLeader: isFemale ? "رائدة النشاط" : "رائد النشاط",

    supervisor: isFemale ? "مديرة المدرسة" : "مدير المدرسة",

    activityLeaderInput: isFemale ? "اسم رائدة النشاط" : "اسم رائد النشاط",

    supervisorInput: isFemale ? "اسم مديرة المدرسة" : "اسم مدير المدرسة",

  };

  const handleGenderChange = (gender: Gender) => {

    if (gender === formik.values.gender) {

      return;

    }

    /*

      المعلمة:

      كل بيانات التقرير تصبح فارغة.

      Theme / Colors / Categories

      يفضلوا كما هم.

    */

    if (gender === "female") {

      formik.values.evidenceImages.forEach((image) => {

        if (image.startsWith("blob:")) {

          URL.revokeObjectURL(image);

        }

      });

      formik.setValues({

        ...formik.values,

        gender: "female",

        regionName: "",

        schoolName: "",

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

        activityLeaderName: "",

        supervisorName: "",

        customFields: [],

        evidenceImages: [],

      });

      return;

    }

    /*

      الرجوع لمعلم:

      القيم الثابتة ترجع.

    */

    formik.setValues({

      ...formik.values,

      gender: "male",

      regionName: DEFAULT_REGION,

      schoolName: DEFAULT_SCHOOL,

      activityLeaderName: DEFAULT_ACTIVITY_LEADER,

      supervisorName: DEFAULT_SCHOOL_MANAGER,

    });

  };

  /* =======================================================

     CATEGORY

  ======================================================= */

  const selectedCategory = formik.values.categories.find(

    (category) => category.id === formik.values.selectedCategory,

  );

  /* =======================================================

     THEME

  ======================================================= */

  const handleThemeChange = (theme: ReportTheme) => {

    formik.setFieldValue("theme", theme);

  };

  /* =======================================================

     TEXT COLORS

  ======================================================= */

  const handleTextColorChange = (

    key: ReportTextColorKey,

    color: string,

  ) => {

    formik.setFieldValue(`textColors.${key}`, color);

  };

  const resetTextColors = () => {

    formik.setFieldValue("textColors", {

      ...DEFAULT_REPORT_TEXT_COLORS,

    });

  };

  /* =======================================================

     CUSTOM FIELDS

  ======================================================= */

  const addCustomField = () => {

    if (formik.values.customFields.length >= 4) {

      toast.error("الحد الأقصى للحقول الإضافية هو 4 حقول");

      return;

    }

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

      formik.values.customFields.filter((field) => field.id !== id),

    );

  };

  /* =======================================================

     OBJECTIVES / IMPACT

  ======================================================= */

  const updateMultilineField = (

    fieldName: "objectives" | "impact",

    value: string,

    title: string,

  ) => {

    const items = value.split("\n").filter((line) => line.trim().length > 0);

    if (items.length > 4) {

      toast.error(`الحد الأقصى في ${title} هو 4 عناصر`);

      return;

    }

    formik.setFieldValue(fieldName, value);

  };

  /* =======================================================

     IMAGES

  ======================================================= */

  const handleImagesChange = (event: ChangeEvent<HTMLInputElement>) => {

    const files = Array.from(event.target.files ?? []);

    if (!files.length) {

      return;

    }

    const current = formik.values.evidenceImages;

    const remaining = 4 - current.length;

    if (remaining <= 0) {

      toast.error("الحد الأقصى للصور هو 4 صور");

      event.target.value = "";

      return;

    }

    const selectedFiles = files.slice(0, remaining);

    const urls = selectedFiles.map((file) => URL.createObjectURL(file));

    formik.setFieldValue("evidenceImages", [...current, ...urls]);

    if (files.length > remaining) {

      toast.error("تم الوصول إلى الحد الأقصى وهو 4 صور");

    }

    event.target.value = "";

  };

  const removeImage = (index: number) => {

    const images = [...formik.values.evidenceImages];

    const image = images[index];

    if (image?.startsWith("blob:")) {

      URL.revokeObjectURL(image);

    }

    images.splice(index, 1);

    formik.setFieldValue("evidenceImages", images);

  };

  /* =======================================================

     PDF

     مفيش window.print()

  ======================================================= */

  const downloadPdf = async () => {
    if (formik.values.evidenceImages.length < 2) {
      toast.error("يجب إضافة صورتين على الأقل من الشواهد");
      return;
    }

    if (isGeneratingPdf) {
      return;
    }

    try {
      setIsGeneratingPdf(true);
      setGeneratedPdf(null);

      const programName = formik.values.programName.trim();
      const fileName = programName
        ? `تقرير - ${programName}.pdf`
        : "تقرير-الأنشطة.pdf";

      /*
        لو معاينة الموبايل مفتوحة نستخدم نفس النسخة الظاهرة فعلًا.
        غير كده نستخدم معاينة الديسكتوب كـ source للـclone.
      */
      const sourceId = preview
        ? "mobile-report-preview"
        : "report-preview";

      const generated = await generateReportPdf(sourceId, fileName);

      /*
        iPhone / iPad:
        لا نستخدم anchor download تلقائيًا؛ Safari قد يفتح PDF Viewer
        بخلفية سوداء بدل حفظ الملف. نحفظ الـBlob في state ونطلب من
        المستخدم ضغطة ثانية لفتح Share Sheet داخل user gesture حقيقية.
      */
      if (isAppleMobileDevice()) {
        setPreview(false);
        setGeneratedPdf(generated);
        toast.success("تم تجهيز ملف PDF");
        return;
      }

      /* Android / Windows / macOS desktop */
      downloadPdfBlob(generated.blob, generated.fileName);
      toast.success("تم تحميل ملف PDF بنجاح");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("حدث خطأ أثناء إنشاء ملف PDF");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSharePdf = async () => {
    if (!generatedPdf || isSharingPdf) {
      return;
    }

    try {
      setIsSharingPdf(true);

      await sharePdfBlob(
        generatedPdf.blob,
        generatedPdf.fileName,
      );

      toast.success("تم فتح خيارات الحفظ والمشاركة");
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      console.error("PDF share error:", error);
      toast.error("تعذر فتح قائمة المشاركة على هذا الجهاز");
    } finally {
      setIsSharingPdf(false);
    }
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

        {/* =================================================

            CATEGORY

        ================================================== */}

        <div className="no-print">

          <CategorySelector

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

            }}

          />

        </div>

        {/* =================================================

            HEADING

        ================================================== */}

        <div className="no-print mb-6 mt-8">

          <h2 className="text-2xl font-bold text-gray-900">إنشاء التقرير</h2>

          <p className="mt-2 text-sm text-gray-500">

            أدخل البيانات ثم اختر التصميم والألوان المناسبة للتقرير.

          </p>

        </div>

        {/* =================================================

            LAYOUT

        ================================================== */}

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

          {/* ===============================================

              FORM

          ================================================ */}

          <form

            onSubmit={formik.handleSubmit}

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

              {/* Gender */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-800">

                  النوع

                </label>

                <div className="grid grid-cols-2 gap-2">

                  <button

                    type="button"

                    onClick={() => handleGenderChange("male")}

                    className={`

                      rounded-xl

                      border

                      px-3

                      py-3

                      text-sm

                      font-semibold

                      transition

                      ${

                        formik.values.gender === "male"

                          ? "border-black bg-black text-white"

                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"

                      }

                    `}

                  >

                    معلم

                  </button>

                  <button

                    type="button"

                    onClick={() => handleGenderChange("female")}

                    className={`

                      rounded-xl

                      border

                      px-3

                      py-3

                      text-sm

                      font-semibold

                      transition

                      ${

                        formik.values.gender === "female"

                          ? "border-black bg-black text-white"

                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"

                      }

                    `}

                  >

                    معلمة

                  </button>

                </div>

              </div>

              {/* Themes */}

              <ThemeSelector

                value={formik.values.theme}

                onChange={handleThemeChange}

              />

              {/* Color customization */}

              <ReportColorEditor

                colors={formik.values.textColors}

                onChange={handleTextColorChange}

                onResetAll={resetTextColors}

              />

              {/* Region / School */}

              <div className="mobile-form-grid">

                <InputField

                  label="المنطقة"

                  name="regionName"

                  value={formik.values.regionName}

                  onChange={formik.handleChange}

                  onFocus={() => {

                    if (

                      !isFemale &&

                      formik.values.regionName === DEFAULT_REGION

                    ) {

                      formik.setFieldValue("regionName", "");

                    }

                  }}

                  onBlur={() => {

                    if (!isFemale && !formik.values.regionName.trim()) {

                      formik.setFieldValue("regionName", DEFAULT_REGION);

                    }

                  }}

                />

                <InputField

                  label="اسم المدرسة"

                  name="schoolName"

                  value={formik.values.schoolName}

                  onChange={formik.handleChange}

                  onFocus={() => {

                    if (

                      !isFemale &&

                      formik.values.schoolName === DEFAULT_SCHOOL

                    ) {

                      formik.setFieldValue("schoolName", "");

                    }

                  }}

                  onBlur={() => {

                    if (!isFemale && !formik.values.schoolName.trim()) {

                      formik.setFieldValue("schoolName", DEFAULT_SCHOOL);

                    }

                  }}

                />

              </div>

              {/* Teacher */}

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

              {/* Grade */}

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

              {/* Period / Day */}

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

              {/* Date */}

              <div className="mobile-form-grid mobile-date-grid">

                <InputField

                  label="التاريخ الميلادي"

                  name="gregorianDate"

                  type="date"

                  value={formik.values.gregorianDate}

                  onChange={(event) => {

                    const value = event.target.value;

                    formik.setFieldValue("gregorianDate", value);

                    formik.setFieldValue("hijriDate", convertToHijri(value));

                  }}

                />

                <InputField

                  label="التاريخ الهجري"

                  name="hijriDate"

                  value={formik.values.hijriDate}

                  onChange={formik.handleChange}

                />

              </div>

              {/* Program */}

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

              {/* Attendance */}

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

              {/* Objectives */}

              <SingleListField

                title="أهداف البرنامج"

                description="كل سطر يمثل هدفًا مستقلًا — بحد أقصى 4 أهداف."

                value={formik.values.objectives}

                placeholder={`تنمية روح التعاون

تعزيز الانتماء الوطني

تنمية مهارات التواصل

غرس القيم الإيجابية`}

                onChange={(value) =>

                  updateMultilineField("objectives", value, "الأهداف")

                }

              />

              {/* Impact */}

              <SingleListField

                title="الأثر الإيجابي للبرنامج"

                description="كل سطر يمثل أثرًا مستقلًا — بحد أقصى 4 آثار."

                value={formik.values.impact}

                placeholder={`زيادة التفاعل

رفع مستوى الثقة بالنفس

تحسين التعاون

تنمية روح المبادرة`}

                onChange={(value) =>

                  updateMultilineField("impact", value, "الأثر الإيجابي")

                }

              />

              {/* Custom Fields */}

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

                    {formik.values.customFields.length}

                    /4

                  </span>

                </div>

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

                        <div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2">

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

                    ))}

                  </div>

                )}

                <button

                  type="button"

                  onClick={addCustomField}

                  disabled={formik.values.customFields.length >= 4}

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

                  {formik.values.customFields.length >= 4

                    ? "تم الوصول للحد الأقصى"

                    : "+ إضافة حقل"}

                </button>

              </div>

              {/* Activity Leader / Manager */}

              <div className="mobile-form-grid">

                <InputField

                  label={labels.activityLeaderInput}

                  name="activityLeaderName"

                  value={formik.values.activityLeaderName}

                  onChange={formik.handleChange}

                  onFocus={() => {

                    if (

                      !isFemale &&

                      formik.values.activityLeaderName ===

                        DEFAULT_ACTIVITY_LEADER

                    ) {

                      formik.setFieldValue("activityLeaderName", "");

                    }

                  }}

                  onBlur={() => {

                    if (!isFemale && !formik.values.activityLeaderName.trim()) {

                      formik.setFieldValue(

                        "activityLeaderName",

                        DEFAULT_ACTIVITY_LEADER,

                      );

                    }

                  }}

                />

                <InputField

                  label={labels.supervisorInput}

                  name="supervisorName"

                  value={formik.values.supervisorName}

                  onChange={formik.handleChange}

                  onFocus={() => {

                    if (

                      !isFemale &&

                      formik.values.supervisorName === DEFAULT_SCHOOL_MANAGER

                    ) {

                      formik.setFieldValue("supervisorName", "");

                    }

                  }}

                  onBlur={() => {

                    if (!isFemale && !formik.values.supervisorName.trim()) {

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

                    {formik.values.evidenceImages.length}

                    /4

                  </span>

                </div>

                {formik.values.evidenceImages.length < 4 && (

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

                        className="relative min-w-0 overflow-hidden rounded-xl border border-gray-200"

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

                    ))}

                  </div>

                )}

              </div>

              {/* Actions */}

              <div className="grid grid-cols-2 gap-2">

                <button

                  type="button"

                  onClick={openPreview}

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

                  onClick={downloadPdf}

                  disabled={isGeneratingPdf}

                  className="

                    rounded-xl

                    bg-black

                    px-3

                    py-3

                    text-sm

                    font-semibold

                    text-white

                    transition

                    hover:bg-gray-800

                    disabled:cursor-not-allowed

                    disabled:bg-gray-400

                  "

                >

                  {isGeneratingPdf ? "جاري إنشاء PDF..." : "تحميل PDF"}

                </button>

              </div>

            </div>

          </form>

          {/* ===============================================

              DESKTOP PREVIEW

          ================================================ */}

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

              <p className="text-sm font-bold text-gray-900">معاينة التقرير</p>

              <p className="mt-1 text-xs text-gray-500">

                التعديلات تظهر مباشرة في المعاينة.

              </p>

            </div>

            <ReportPreview

              previewId="report-preview"

              values={formik.values}

              labels={labels}

              categoryName={selectedCategory?.name ?? ""}

            />

          </div>

        </div>

        {/* =================================================
            MOBILE PREVIEW
        ================================================== */}

        {preview && (
          <div className="no-print fixed inset-0 z-50 flex flex-col bg-black/70">
            <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
              <div>
                <strong className="block text-sm">معاينة التقرير</strong>
                <span className="text-xs text-gray-500">A4</span>
              </div>

              <button
                type="button"
                onClick={closePreview}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
              >
                إغلاق
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-auto bg-gray-200 p-2 sm:p-3">
              <ReportPreview
                previewId="mobile-report-preview"
                values={formik.values}
                labels={labels}
                categoryName={selectedCategory?.name ?? ""}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-gray-200 bg-white p-3">
              <button
                type="button"
                onClick={closePreview}
                className="rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm font-semibold text-gray-700"
              >
                رجوع للتعديل
              </button>

              <button
                type="button"
                onClick={downloadPdf}
                disabled={isGeneratingPdf}
                className="rounded-xl bg-black px-3 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isGeneratingPdf ? "جاري الإنشاء..." : "تحميل PDF"}
              </button>
            </div>
          </div>
        )}

        {/* =================================================
            iPhone / iPad PDF READY
        ================================================== */}

        {generatedPdf && (
          <div className="no-print fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4 py-6">
            <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M7 3H14L19 8V21H7V3Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 3V8H19"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.5 13L11.3 14.8L15 11"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="mt-4 text-center">
                <h3 className="text-lg font-bold text-gray-900">
                  ملف PDF جاهز
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  على iPhone يتم الحفظ من قائمة المشاركة الخاصة بالنظام. اضغط
                  على زر حفظ / مشاركة PDF، ثم اختر &quot;حفظ في الملفات&quot;
                  للاحتفاظ بالملف أو &quot;طباعة&quot; للطباعة مباشرة.
                </p>

                <p
                  dir="ltr"
                  className="mt-3 truncate rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500"
                >
                  {generatedPdf.fileName}
                </p>
              </div>

              <button
                type="button"
                onClick={handleSharePdf}
                disabled={isSharingPdf}
                className="mt-5 w-full rounded-xl bg-black px-4 py-3 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isSharingPdf ? "جاري الفتح..." : "حفظ / مشاركة PDF"}
              </button>

              <button
                type="button"
                onClick={() => setGeneratedPdf(null)}
                className="mt-2 w-full px-4 py-2 text-sm font-semibold text-gray-400 transition hover:text-gray-700"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}

      </div>

    </section>

  );

};

export default ReportForm;

/* =========================================================

   THEME SELECTOR

========================================================= */

type ThemeSelectorProps = {

  value: ReportTheme;

  onChange: (theme: ReportTheme) => void;

};

const ThemeSelector = ({ value, onChange }: ThemeSelectorProps) => {

  return (

    <div>

      <div className="mb-3">

        <h3 className="text-sm font-bold text-gray-900">تصميم التقرير</h3>

        <p className="mt-1 text-xs text-gray-500">اختر شكل الهيدر والفوتر.</p>

      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">

        {REPORT_THEMES.map((theme) => {

          const selected = value === theme.id;

          return (

            <button

              key={theme.id}

              type="button"

              onClick={() => onChange(theme.id)}

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

                  src={theme.header}

                  alt={theme.label}

                  width={theme.headerWidth}

                  height={theme.headerHeight}

                  className="h-full w-full object-fill"

                />

              </div>

              <div className="flex items-center justify-between gap-2 border-t border-gray-100 px-2.5 py-2 sm:px-3">

                <span className="truncate text-xs font-bold text-gray-800">

                  {theme.label}

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

                      ${selected ? "border-black bg-black" : "border-gray-300"}

                    `}

                >

                  {selected && (

                    <span className="h-1.5 w-1.5 rounded-full bg-white" />

                  )}

                </span>

              </div>

            </button>

          );

        })}

      </div>

    </div>

  );

};

/* =========================================================

   COLOR ACCORDION

========================================================= */

type ReportColorEditorProps = {

  colors: ReportTextColors;

  onChange: (

    key: ReportTextColorKey,

    color: string,

  ) => void;

  onResetAll: () => void;

};

const COLOR_TARGETS: {

  key: ReportTextColorKey;

  label: string;

  description: string;

}[] = [

  {

    key: "reportTitle",

    label: "عنوان التقرير",

    description: "برامج الأنشطة الطلابية",

  },

  {

    key: "categoryTitle",

    label: "اسم المجال",

    description: "مثل مجال المواطنة والحياة",

  },

  {

    key: "fieldLabels",

    label: "أسماء الحقول",

    description: "اسم المعلم، الصف، اليوم...",

  },

  {

    key: "fieldValues",

    label: "بيانات الحقول",

    description: "القيم التي يتم إدخالها في التقرير",

  },

  {

    key: "sectionTitles",

    label: "عناوين الأقسام",

    description: "الأهداف، الأثر الإيجابي، الشواهد",

  },

  {

    key: "listText",

    label: "الأهداف والأثر",

    description: "نص الأهداف ونص الأثر الإيجابي",

  },

  {

    key: "listNumbers",

    label: "أرقام العناصر",

    description: "الأرقام 1، 2، 3، 4",

  },

  {

    key: "schoolHeader",

    label: "بيانات المدرسة",

    description: "الإدارة العامة والمدرسة والمنطقة",

  },

  {

    key: "signatures",

    label: "التوقيعات",

    description: "رائد النشاط ومدير المدرسة والأسماء",

  },

];

const ReportColorEditor = ({

  colors,

  onChange,

  onResetAll,

}: ReportColorEditorProps) => {

  const [isOpen, setIsOpen] = useState(false);

  const [selectedTarget, setSelectedTarget] =

    useState<ReportTextColorKey>("reportTitle");

  const currentTarget = COLOR_TARGETS.find(

    (target) => target.key === selectedTarget,

  );

  const currentColor = colors[selectedTarget];

  const defaultColor = DEFAULT_REPORT_TEXT_COLORS[selectedTarget];

  const changedColorsCount = COLOR_TARGETS.filter(

    (target) => colors[target.key] !== DEFAULT_REPORT_TEXT_COLORS[target.key],

  ).length;

  return (

    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">

      {/* Accordion Header */}

      <button

        type="button"

        aria-expanded={isOpen}

        onClick={() => setIsOpen((current) => !current)}

        className="

          flex

          w-full

          items-center

          justify-between

          gap-3

          px-4

          py-4

          text-right

          transition

          hover:bg-gray-50

          sm:px-5

        "

      >

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">

            <svg

              width="21"

              height="21"

              viewBox="0 0 24 24"

              fill="none"

              aria-hidden="true"

            >

              <path

                d="M12 3C7.03 3 3 6.58 3 11C3 14.53 5.54 17.51 9 18.57V20C9 20.55 9.45 21 10 21H12C12.55 21 13 20.55 13 20V18H15C18.31 18 21 15.31 21 12C21 7.03 16.97 3 12 3Z"

                stroke="currentColor"

                strokeWidth="1.7"

                strokeLinecap="round"

                strokeLinejoin="round"

              />

              <circle cx="8" cy="10" r="1" fill="currentColor" />

              <circle cx="12" cy="7" r="1" fill="currentColor" />

              <circle cx="16" cy="10" r="1" fill="currentColor" />

            </svg>

          </div>

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2">

              <h3 className="text-sm font-bold text-gray-900">

                تخصيص ألوان النصوص

              </h3>

              {changedColorsCount > 0 && (

                <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-bold text-white">

                  {changedColorsCount} معدل

                </span>

              )}

            </div>

            <p className="mt-1 text-xs leading-5 text-gray-500">

              اختر كل جزء من التقرير وعدّل لونه بشكل منفصل.

            </p>

          </div>

        </div>

        <span

          className={`

            flex

            h-8

            w-8

            shrink-0

            items-center

            justify-center

            rounded-full

            border

            border-gray-200

            bg-white

            text-gray-500

            transition-transform

            duration-300

            ${isOpen ? "rotate-180" : ""}

          `}

        >

          <svg

            width="16"

            height="16"

            viewBox="0 0 24 24"

            fill="none"

            aria-hidden="true"

          >

            <path

              d="M6 9L12 15L18 9"

              stroke="currentColor"

              strokeWidth="2"

              strokeLinecap="round"

              strokeLinejoin="round"

            />

          </svg>

        </span>

      </button>

      {/* Content */}

      <div

        className={`

          grid

          transition-all

          duration-300

          ease-in-out

          ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}

        `}

      >

        <div className="overflow-hidden">

          <div className="border-t border-gray-100 bg-gray-50 p-3 sm:p-4">

            <div className="mb-4 flex items-center justify-between gap-3">

              <p className="text-xs font-semibold text-gray-700">

                اختر النص الذي تريد تغيير لونه

              </p>

              <button

                type="button"

                onClick={onResetAll}

                className="shrink-0 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-[11px] font-semibold text-gray-500 transition hover:border-gray-400 hover:text-gray-900"

              >

                إعادة الكل

              </button>

            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">

              {COLOR_TARGETS.map((target) => {

                const active = selectedTarget === target.key;

                return (

                  <button

                    key={target.key}

                    type="button"

                    onClick={() => setSelectedTarget(target.key)}

                    className={`

                        flex

                        min-w-0

                        items-center

                        gap-2

                        rounded-xl

                        border

                        px-2.5

                        py-2.5

                        text-right

                        transition

                        ${

                          active

                            ? "border-black bg-black text-white"

                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"

                        }

                      `}

                  >

                    <span

                      className="h-5 w-5 shrink-0 rounded-full border border-black/10 shadow-sm"

                      style={{

                        backgroundColor: colors[target.key],

                      }}

                    />

                    <span className="min-w-0 flex-1 truncate text-[11px] font-semibold sm:text-xs">

                      {target.label}

                    </span>

                  </button>

                );

              })}

            </div>

            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-3">

              <div className="mb-3">

                <div className="flex items-center gap-2">

                  <span

                    className="h-4 w-4 shrink-0 rounded-full border border-black/10"

                    style={{

                      backgroundColor: currentColor,

                    }}

                  />

                  <p className="text-sm font-bold text-gray-900">

                    {currentTarget?.label}

                  </p>

                </div>

                <p className="mt-1.5 text-xs leading-5 text-gray-500">

                  {currentTarget?.description}

                </p>

              </div>

              <div className="flex min-w-0 items-stretch gap-2">

                <label

                  htmlFor="selected-text-color"

                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-xl border border-gray-200 px-3 py-2 transition hover:border-gray-400"

                >

                  <span

                    className="h-8 w-8 shrink-0 rounded-full border border-gray-200"

                    style={{

                      backgroundColor: currentColor,

                    }}

                  />

                  <div className="min-w-0 flex-1">

                    <p className="text-xs font-semibold text-gray-700">

                      اللون الحالي

                    </p>

                    <p

                      dir="ltr"

                      className="mt-0.5 truncate text-xs text-gray-400"

                    >

                      {currentColor.toUpperCase()}

                    </p>

                  </div>

                  <input

                    id="selected-text-color"

                    type="color"

                    value={currentColor}

                    onChange={(event) =>

                      onChange(selectedTarget, event.target.value)

                    }

                    className="h-9 w-10 shrink-0 cursor-pointer border-0 bg-transparent p-0"

                  />

                </label>

                <button

                  type="button"

                  onClick={() => onChange(selectedTarget, defaultColor)}

                  className="shrink-0 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-600 transition hover:border-gray-400"

                >

                  افتراضي

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};

/* =========================================================

   OBJECTIVES / IMPACT

========================================================= */

type SingleListFieldProps = {

  title: string;

  description: string;

  value: string;

  placeholder: string;

  onChange: (value: string) => void;

};

const SingleListField = ({

  title,

  description,

  value,

  placeholder,

  onChange,

}: SingleListFieldProps) => {

  const count = value

    .split("\n")

    .filter((line) => line.trim().length > 0).length;

  return (

    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">

      <div className="mb-2 flex items-start justify-between gap-3">

        <div className="min-w-0">

          <h3 className="text-sm font-bold text-gray-900">{title}</h3>

          <p className="mt-0.5 text-[11px] leading-5 text-gray-500">

            {description}

          </p>

        </div>

        <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[11px] font-bold text-gray-600">

          {count}

          /4

        </span>

      </div>

      <textarea

        value={value}

        onChange={(event) => onChange(event.target.value)}

        placeholder={placeholder}

        rows={4}

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

          transition

          placeholder:text-gray-300

          focus:border-gray-900

          sm:text-sm

        "

      />

    </div>

  );

};

/* =========================================================

   INPUT

========================================================= */

type InputFieldProps = {

  label: string;

  name: string;

  value: string;

  type?: string;

  disabled?: boolean;

  onChange: ChangeEventHandler<HTMLInputElement>;

  onFocus?: FocusEventHandler<HTMLInputElement>;

  onBlur?: FocusEventHandler<HTMLInputElement>;

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

        htmlFor={name}

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

        {label}

      </label>

      <input

        id={name}

        name={name}

        type={type}

        value={value}

        disabled={disabled}

        onChange={onChange}

        onFocus={onFocus}

        onBlur={onBlur}

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
