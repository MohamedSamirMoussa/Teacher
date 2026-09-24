import Image from "next/image";

import { ReportFormValues } from "@/app/types/reports";

type Props = {
  values: ReportFormValues;

  categoryName: string;

  previewId?: string;

  labels: {
    teacherName: string;
    supervisor: string;
    activityLeader: string;
  };
};

const ReportPreview = ({
  values,
  labels,
  categoryName,
  previewId = "report-preview",
}: Props) => {
  return (
    <div className="w-full min-w-0">
      <div
        id={previewId}
        className="report-preview-shell"
      >
        <div className="report-sheet">

          {/* =========================
              Header
          ========================= */}

          <div className="report-header-top">
            <div className="report-header-grid">

              {/* School */}

              <div className="report-header-block">
                <p className="report-header-main">
                  الإدارة العامة للتعليم
                </p>

                <p>
                  بمنطقة{" "}
                  {values.regionName}
                </p>

                <p className="report-school-name">
                  {values.schoolName}
                </p>
              </div>

              {/* Ministry */}

              <div
                className="
                  report-header-block
                  report-header-ministry
                "
              >
                <div className="report-header-logo-mark">
                  وزارة التعليم
                </div>

                <p>
                  Ministry of Education
                </p>
              </div>
            </div>
          </div>

          {/* =========================
              Main Title
          ========================= */}

          <div className="report-title-ribbon">
            برامج الأنشطة الطلابية
          </div>

          {/* =========================
              Body
          ========================= */}

          <div className="report-body">

            {/* Category */}

            <h2 className="report-category-title">
              {categoryName ||
                "مجال البرنامج"}
            </h2>

            {/* =========================
                Row 1
            ========================= */}

            <div
              className="
                report-fields-grid
                report-fields-grid-3
              "
            >
              <FieldBox
                label={
                  labels.teacherName
                }
                value={
                  values.teacherName
                }
              />

              <FieldBox
                label="التخصص"
                value={
                  values.specialization
                }
              />

              <FieldBox
                label="الفصل الدراسي"
                value={
                  values.className
                }
              />
            </div>

            {/* =========================
                Row 2
            ========================= */}

            <div
              className="
                report-fields-grid
                report-fields-grid-4
              "
            >
              <FieldBox
                label="الصف"
                value={values.grade}
              />

              <FieldBox
                label="الحصة"
                value=""
              />

              <FieldBox
                label="اليوم"
                value=""
              />

              <FieldBox
                label="التاريخ"
                value={values.date}
              />
            </div>

            {/* =========================
                Row 3
            ========================= */}

            <div
              className="
                report-fields-grid
                report-fields-grid-4
              "
            >
              <FieldBox
                label="اسم البرنامج"
                value={
                  values.programName
                }
              />

              <FieldBox
                label="مكان التنفيذ"
                value=""
              />

              <FieldBox
                label="الحضور"
                value=""
              />

              <FieldBox
                label="الغياب"
                value=""
              />

              {/* =========================
                Custom Fields
            ========================= */}

              {values.customFields.length >
                0 && (


                  <>
                    {values.customFields.map(
                      (field) => (
                        <FieldBox
                          key={
                            field.id
                          }
                          label={
                            field.label ||
                            "حقل إضافي"
                          }
                          value={
                            field.value
                          }
                        />
                      ),
                    )}

                  </>
                )}
            </div>



            {/* =========================
                Objectives
            ========================= */}

            <SectionBoxes
              title="أهداف البرنامج"
              values={splitTextToBoxes(
                values.objectives,
                4,
              )}
            />

            {/* =========================
                Impact
            ========================= */}

            <SectionBoxes
              title="الأثر الإيجابي للبرنامج"
              values={splitTextToBoxes(
                values.impact,
                4,
              )}
            />



            {/* =========================
                Evidence
            ========================= */}

            <div className="report-evidence-section">
              <h3 className="report-section-title">
                الشواهد
              </h3>

              {values.evidenceImages
                .length > 0 ? (
                <div
                  className={`report-images-grid ${values
                    .evidenceImages
                    .length === 2
                    ? "report-images-2"
                    : ""
                    }`}
                >
                  {values.evidenceImages.map(
                    (
                      image,
                      index,
                    ) => (
                      <div
                        key={
                          image
                        }
                        className="report-image-box"
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
                          alt={`شاهد ${index +
                            1
                            }`}
                          unoptimized
                          className="report-image"
                        />
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <div className="report-evidence-box" />
              )}
            </div>

            {/* =========================
                Signatures
            ========================= */}

            <div className="report-signatures">
              <SignatureBox
                title={
                  labels.activityLeader
                }
                name={
                  values.activityLeaderName
                }
              />

              <SignatureBox
                title={
                  labels.supervisor
                }
                name={
                  values.supervisorName
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;

/* =========================================
   Field Box
========================================= */

const FieldBox = ({
  label,
  value,
}: {
  label: string;

  value: string;
}) => {
  return (
    <div className="report-field">
      <div className="report-field-label">
        {label}
      </div>

      <div className="report-field-box">
        {value || ""}
      </div>
    </div>
  );
};

/* =========================================
   Sections
========================================= */

const SectionBoxes = ({
  title,
  values,
}: {
  title: string;

  values: string[];
}) => {
  return (
    <div className="report-section">
      <h3 className="report-section-title">
        {title}
      </h3>

      <div
        className="
          report-fields-grid
          report-fields-grid-2
        "
      >
        {values.map(
          (item, index) => (
            <div
              key={index}
              className="report-section-box"
            >
              {item}
            </div>
          ),
        )}
      </div>
    </div>
  );
};

/* =========================================
   Signature
========================================= */

const SignatureBox = ({
  title,
  name,
}: {
  title: string;

  name?: string;
}) => {
  return (
    <div className="report-signature-box">
      <p className="report-signature-title">
        {title}
      </p>

      <div className="report-signature-name">
        {name || ""}
      </div>
    </div>
  );
};

/* =========================================
   Split Text
========================================= */

const splitTextToBoxes = (
  text: string,
  count: number,
) => {
  if (!text.trim()) {
    return Array(count).fill("");
  }

  const lines = text
    .split("\n")
    .map((line) =>
      line.trim(),
    )
    .filter(Boolean);

  const result =
    Array(count).fill("");

  for (
    let i = 0;
    i < count;
    i++
  ) {
    result[i] =
      lines[i] || "";
  }

  return result;
};