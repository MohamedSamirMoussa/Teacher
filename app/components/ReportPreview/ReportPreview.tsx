import type { ReactNode } from "react";
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

/* =========================================
   Gregorian Date Formatter
========================================= */

const formatGregorianDate = (
  value: string,
) => {
  if (!value) {
    return "";
  }

  const [year, month, day] =
    value.split("-");

  if (
    !year ||
    !month ||
    !day
  ) {
    return value;
  }

  return `${day}/${month}/${year}`;
};

/* =========================================
   Report Preview
========================================= */

const ReportPreview = ({
  values,
  labels,
  categoryName,
  previewId = "report-preview",
}: Props) => {
  const customFieldsCount =
    values.customFields.length;

  /*
    0 - 4 Fields
    = صفحة واحدة

    5 - 12 Fields
    = نقسمهم على صفحتين
  */

  const hasSecondPage =
    customFieldsCount > 4;

  const splitIndex =
    hasSecondPage
      ? Math.ceil(
          customFieldsCount / 2,
        )
      : customFieldsCount;

  const firstPageFields =
    values.customFields.slice(
      0,
      splitIndex,
    );

  const secondPageFields =
    hasSecondPage
      ? values.customFields.slice(
          splitIndex,
        )
      : [];

  return (
    <div className="w-full min-w-0">
      <div
        id={previewId}
        className="report-preview-shell"
      >
        <div className="report-pages">
          {/* =====================================
              PAGE 1
          ====================================== */}

          <ReportPage
            values={values}
          >
            <div className="report-content">
              {/* =========================
                  Heading
              ========================= */}

              <ReportHeading
                categoryName={
                  categoryName
                }
              />

              {/* =========================
                  Row 1
              ========================= */}

              <div className="report-fields-grid report-fields-grid-3">
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

              <div className="report-fields-grid report-fields-grid-4">
                <FieldBox
                  label="الصف"
                  value={
                    values.grade
                  }
                />

                <FieldBox
                  label="الحصة"
                  value={
                    values.period
                  }
                />

                <FieldBox
                  label="اليوم"
                  value={
                    values.day
                  }
                />

                <DateFieldBox
                  gregorianDate={
                    values.gregorianDate
                  }
                  hijriDate={
                    values.hijriDate
                  }
                />
              </div>

              {/* =========================
                  Row 3
              ========================= */}

              <div className="report-fields-grid report-fields-grid-4">
                <FieldBox
                  label="اسم البرنامج"
                  value={
                    values.programName
                  }
                />

                <FieldBox
                  label="مكان التنفيذ"
                  value={
                    values.location
                  }
                />

                <FieldBox
                  label="الحضور"
                  value={
                    values.attendance
                  }
                />

                <FieldBox
                  label="الغياب"
                  value={
                    values.absence
                  }
                />
              </div>

              {/* =========================
                  Custom Fields
                  Page 1
              ========================= */}

              <CustomFields
                fields={
                  firstPageFields
                }
              />

              {/* =========================
                  Objectives
              ========================= */}

              <ReportTextSection
                title="أهداف البرنامج"
                value={
                  values.objectives
                }
              />

              {/* =========================
                  Impact
              ========================= */}

              <ReportTextSection
                title="الأثر الإيجابي للبرنامج"
                value={
                  values.impact
                }
              />

              {/* =========================
                  Single Page
              ========================= */}

              {!hasSecondPage && (
                <>
                  <EvidenceSection
                    images={
                      values.evidenceImages
                    }
                  />

                  <Signatures
                    labels={labels}
                    values={values}
                  />
                </>
              )}
            </div>
          </ReportPage>

          {/* =====================================
              PAGE 2
          ====================================== */}

          {hasSecondPage && (
            <ReportPage
              values={values}
            >
              <div className="report-content report-second-page-content">
                {/* =========================
                    Heading
                ========================= */}

                <div className="report-title-ribbon">
                  برامج الأنشطة الطلابية
                </div>

                <h2 className="report-category-title">
                  {categoryName ||
                    "مجال البرنامج"}

                  <span className="report-continuation-text">
                    {" "}
                    - استكمال
                  </span>
                </h2>

                {/* =========================
                    Custom Fields
                    Page 2
                ========================= */}

                <CustomFields
                  fields={
                    secondPageFields
                  }
                />

                {/* =========================
                    Flexible Area
                ========================= */}

                <div className="report-second-page-flex-area">
                  <EvidenceSection
                    images={
                      values.evidenceImages
                    }
                  />
                </div>

                {/* =========================
                    Signatures
                ========================= */}

                <Signatures
                  labels={labels}
                  values={values}
                  secondPage
                />
              </div>
            </ReportPage>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;

/* =========================================
   A4 Page
========================================= */

const ReportPage = ({
  values,
  children,
}: {
  values: ReportFormValues;
  children: ReactNode;
}) => {
  return (
    <div className="report-sheet">
      {/* Header */}

      <Image
        src="/report-header.png"
        alt=""
        width={1448}
        height={205}
        priority
        aria-hidden="true"
        className="report-frame-header"
      />

      {/* Footer */}

      <Image
        src="/report-footer.png"
        alt=""
        width={1448}
        height={150}
        priority
        aria-hidden="true"
        className="report-frame-footer"
      />

      {/* School */}

      <div className="report-school-header">
        <p className="report-school-name">
          {values.schoolName}
        </p>

        <p className="report-header-main">
          الإدارة العامة للتعليم
        </p>

        <p className="report-region-name">
          بمنطقة {values.regionName}
        </p>
      </div>

      {children}
    </div>
  );
};

/* =========================================
   Heading
========================================= */

const ReportHeading = ({
  categoryName,
}: {
  categoryName: string;
}) => {
  return (
    <>
      <div className="report-title-ribbon">
        برامج الأنشطة الطلابية
      </div>

      <h2 className="report-category-title">
        {categoryName ||
          "مجال البرنامج"}
      </h2>
    </>
  );
};

/* =========================================
   Field
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
   Date
========================================= */

const DateFieldBox = ({
  gregorianDate,
  hijriDate,
}: {
  gregorianDate: string;
  hijriDate: string;
}) => {
  return (
    <div className="report-field">
      <div className="report-field-label">
        التاريخ
      </div>

      <div className="report-field-box report-date-box">
        <div className="report-date-row">
          <span className="report-date-label">
            م:
          </span>

          <span>
            {formatGregorianDate(
              gregorianDate,
            )}
          </span>
        </div>

        <div className="report-date-row">
          <span className="report-date-label">
            هـ:
          </span>

          <span>
            {hijriDate || ""}
          </span>
        </div>
      </div>
    </div>
  );
};

/* =========================================
   Custom Fields
========================================= */

const CustomFields = ({
  fields,
}: {
  fields: ReportFormValues["customFields"];
}) => {
  if (!fields.length) {
    return null;
  }

  return (
    <div className="report-custom-fields-row">
      {fields.map((field) => (
        <div
          key={field.id}
          className="report-custom-field-item"
        >
          <FieldBox
            label={
              field.label ||
              "حقل إضافي"
            }
            value={
              field.value
            }
          />
        </div>
      ))}
    </div>
  );
};

/* =========================================
   Text Section
========================================= */

const ReportTextSection = ({
  title,
  value,
}: {
  title: string;
  value: string;
}) => {
  return (
    <div className="report-section">
      <h3 className="report-section-title">
        {title}
      </h3>

      <div className="report-textarea-box">
        {value || ""}
      </div>
    </div>
  );
};

/* =========================================
   Evidence
========================================= */

const EvidenceSection = ({
  images,
}: {
  images: string[];
}) => {
  return (
    <div className="report-evidence-section">
      <h3 className="report-section-title">
        الشواهد
      </h3>

      {images.length > 0 ? (
        <div
          className="report-images-grid"
          style={{
            gridTemplateColumns:
              `repeat(${images.length}, minmax(0, 1fr))`,
          }}
        >
          {images.map(
            (
              image,
              index,
            ) => (
              <div
                key={`${image}-${index}`}
                className="report-image-box"
              >
                <Image
                  width={600}
                  height={450}
                  src={image}
                  alt={`شاهد ${
                    index + 1
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
  );
};

/* =========================================
   Signatures
========================================= */

const Signatures = ({
  labels,
  values,
  secondPage = false,
}: {
  labels: Props["labels"];
  values: ReportFormValues;
  secondPage?: boolean;
}) => {
  return (
    <div
      className={`report-signatures ${
        secondPage
          ? "report-second-page-signatures"
          : ""
      }`}
    >
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