"use client";

import { useFormik } from "formik";
import ReportPreview from "../ReportPreview/ReportPreview";
import { ReportFormValues } from "@/app/types/reports";
import CategorySelector from "../CategorySelector/CategorySelector";
import toast from "react-hot-toast";
import Image from "next/image";

const ReportForm = () => {
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

  const isFemale = formik.values.gender === "female";

  const labels = {
    teacherName: isFemale ? "اسم المعلمة" : "اسم المعلم",
    supervisor: isFemale ? "المشرفة" : "المشرف",
    activityLeader: isFemale ? "رائدة النشاط" : "رائد النشاط",
  };

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
      formik.values.customFields.filter((field) => field.id !== id),
    );
  };

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const currentImages = formik.values.evidenceImages;

    const remaining = 4 - currentImages.length;

    if (remaining <= 0) {
      toast.error("الحد الأقصى للصور هو 4 صور");
      event.target.value = "";
      return;
    }

    const selectedFiles = files.slice(0, remaining);

    const newImages = selectedFiles.map((file) => URL.createObjectURL(file));

    formik.setFieldValue("evidenceImages", [...currentImages, ...newImages]);

    event.target.value = "";
  };

  const removeImage = (index: number) => {
    const images = [...formik.values.evidenceImages];

    const removedImage = images[index];

    if (removedImage) {
      URL.revokeObjectURL(removedImage);
    }

    images.splice(index, 1);

    formik.setFieldValue("evidenceImages", images);
  };

  const selectedCategory = formik.values.categories.find(
    (category) => category.id === formik.values.selectedCategory,
  );

  const printReport = () => {
    if (formik.values.evidenceImages.length < 2) {
      toast.error("يجب إضافة صورتين على الأقل من الشواهد");
      return;
    }

    window.print();
  };

  return (
    <section id="report" className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <CategorySelector
          categories={formik.values.categories}
          selectedCategory={formik.values.selectedCategory}
          onSelect={(id) => formik.setFieldValue("selectedCategory", id)}
          onAdd={(category) => {
            formik.setFieldValue("categories", [
              ...formik.values.categories,
              category,
            ]);
          }}
        />

        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-950">إنشاء التقرير</h2>

          <p className="mt-2 text-gray-500">
            أدخل البيانات وشاهد التقرير مباشرة قبل الطباعة.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          {/* FORM */}
          <form
            onSubmit={formik.handleSubmit}
            className="no-print h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="space-y-6">
              {/* Gender */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  النوع
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => formik.setFieldValue("gender", "male")}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                      formik.values.gender === "male"
                        ? "border-black bg-black text-white"
                        : "border-gray-200 bg-white text-gray-700"
                    }`}
                  >
                    معلم
                  </button>

                  <button
                    type="button"
                    onClick={() => formik.setFieldValue("gender", "female")}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                      formik.values.gender === "female"
                        ? "border-black bg-black text-white"
                        : "border-gray-200 bg-white text-gray-700"
                    }`}
                  >
                    معلمة
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                  label="اسم المنطقة"
                  name="regionName"
                  value={formik.values.regionName}
                  onChange={formik.handleChange}
                />

                <InputField
                  label="اسم المدرسة"
                  name="schoolName"
                  value={formik.values.schoolName}
                  onChange={formik.handleChange}
                />
              </div>
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

              <InputField
                label="الصف"
                name="grade"
                value={formik.values.grade}
                onChange={formik.handleChange}
              />

              <InputField
                label="الفصل"
                name="className"
                value={formik.values.className}
                onChange={formik.handleChange}
              />

              <InputField
                label="التاريخ"
                name="date"
                type="date"
                value={formik.values.date}
                onChange={formik.handleChange}
              />

              <InputField
                label="اسم البرنامج"
                name="programName"
                value={formik.values.programName}
                onChange={formik.handleChange}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                  label={`اسم ${labels.activityLeader}`}
                  name="activityLeaderName"
                  value={
                    formik.values.activityLeaderName || "أ.عمر سعيد الصاعدي"
                  }
                  onChange={formik.handleChange}
                />

                <InputField
                  label={`اسم ${labels.supervisor}`}
                  name="supervisorName"
                  value={formik.values.supervisorName}
                  onChange={formik.handleChange}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  أهداف البرنامج
                </label>

                <textarea
                  name="objectives"
                  value={formik.values.objectives}
                  onChange={formik.handleChange}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-gray-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  أثر البرنامج
                </label>

                <textarea
                  name="impact"
                  value={formik.values.impact}
                  onChange={formik.handleChange}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-gray-900"
                />
              </div>

              {/* Dynamic fields */}
              {formik.values.customFields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">
                      حقل إضافي
                    </span>

                    <button
                      type="button"
                      onClick={() => removeCustomField(field.id)}
                      className="text-sm font-medium text-red-500 hover:text-red-700"
                    >
                      حذف
                    </button>
                  </div>

                  <div className="space-y-3">
                    <input
                      name={`customFields.${index}.label`}
                      value={field.label}
                      onChange={formik.handleChange}
                      placeholder="اسم الحقل"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-gray-900"
                    />

                    <input
                      name={`customFields.${index}.value`}
                      value={field.value}
                      onChange={formik.handleChange}
                      placeholder="القيمة"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-gray-900"
                    />
                  </div>
                </div>
              ))}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-800">
                    صور الشواهد
                  </label>

                  <span className="text-xs text-gray-500">
                    {formik.values.evidenceImages.length}/4
                  </span>
                </div>

                <p className="mb-3 text-xs text-gray-500">
                  يجب إضافة صورتين على الأقل، والحد الأقصى 4 صور.
                </p>

                {formik.values.evidenceImages.length < 4 && (
                  <label
                    htmlFor="evidence-images"
                    className="
        flex cursor-pointer items-center justify-center
        rounded-xl border border-dashed border-gray-300
        px-4 py-5 text-sm font-medium text-gray-600
        transition
        hover:border-gray-700 hover:text-gray-900
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
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {formik.values.evidenceImages.map((image, index) => (
                      <div
                        key={image}
                        className="relative overflow-hidden rounded-lg border border-gray-200"
                      >
                        <Image
                          width={600}
                          height={600}
                          src={image}
                          alt={`الشاهد ${index + 1}`}
                          className="aspect-[4/3] object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="
              absolute left-2 top-2
              rounded-md bg-white/90
              px-2 py-1
              text-xs font-semibold text-red-600
              shadow-sm
            "
                        >
                          حذف
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {formik.values.evidenceImages.length === 1 && (
                  <p className="mt-2 text-xs font-medium text-red-500">
                    أضف صورة أخرى على الأقل حتى تتمكن من طباعة التقرير.
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={addCustomField}
                className="w-full rounded-xl border border-dashed border-gray-300 px-4 py-3 font-medium text-gray-700 transition hover:border-gray-900 hover:text-black"
              >
                + إضافة حقل
              </button>

              <button
                type="button"
                onClick={printReport}
                className="w-full rounded-xl bg-black px-4 py-3 font-semibold text-white transition hover:bg-gray-800"
              >
                طباعة / حفظ PDF
              </button>
            </div>
          </form>
          {/* PREVIEW */}
          <ReportPreview
            values={formik.values}
            labels={labels}
            categoryName={selectedCategory?.name ?? ""}
          />
        </div>
      </div>
    </section>
  );
};

export default ReportForm;

type InputFieldProps = {
  label: string;
  name: string;
  value: string;
  type?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const InputField = ({
  label,
  name,
  value,
  type = "text",
  onChange,
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
        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-gray-900"
      />
    </div>
  );
};
