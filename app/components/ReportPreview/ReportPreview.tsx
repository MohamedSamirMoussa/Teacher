"use client";

import { useEffect, useRef, useState } from "react";

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
   Gregorian Date
========================================= */

const formatGregorianDate = (value: string) => {
  if (!value) {
    return "";
  }

  const [year, month, day] = value.split("-");

  if (!year || !month || !day) {
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
  const containerRef = useRef<HTMLDivElement>(null);

  const pageRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);

  const [scaledHeight, setScaledHeight] = useState<number>();

  /* =====================================
     Auto Fit Preview

     الـ A4 تفضل بحجمها الحقيقي داخلياً،
     وإحنا بنعمل Scale للعرض فقط.

     الطباعة لا تتأثر.
  ====================================== */

  useEffect(() => {
    const container = containerRef.current;

    const page = pageRef.current;

    if (!container || !page) {
      return;
    }

    const updateScale = () => {
      /*
        مساحة بسيطة يمين وشمال
        داخل Preview panel.
      */

      const availableWidth = Math.max(container.clientWidth - 24, 1);

      const actualWidth = page.offsetWidth;

      const actualHeight = page.offsetHeight;

      if (!actualWidth) {
        return;
      }

      const nextScale = Math.min(1, availableWidth / actualWidth);

      setScale(nextScale);

      setScaledHeight(actualHeight * nextScale);
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="report-preview-shell">
      <div
        className="report-preview-stage"
        style={{
          height: scaledHeight ? `${scaledHeight}px` : undefined,
        }}
      >
        <div className="report-preview-positioner">
          <div
            className="report-preview-scale"
            style={{
              transform: `scale(${scale})`,
            }}
          >
            <div ref={pageRef} id={previewId} className="report-sheet">
              {/* =================================
                  Header
              ================================== */}

              <Image
                src="/report-header.png"
                alt=""
                width={1448}
                height={205}
                priority
                aria-hidden="true"
                className="report-frame-header"
              />

              {/* =================================
                  Footer
              ================================== */}

              <Image
                src="/report-footer.png"
                alt=""
                width={1448}
                height={150}
                priority
                aria-hidden="true"
                className="report-frame-footer"
              />

              {/* =================================
                  School
              ================================== */}

              <div className="report-school-header">
                <p className="report-header-main">الإدارة العامة للتعليم</p>

                <p className="report-region-name">بمنطقة {values.regionName}</p>
                <p className="report-school-name">{values.schoolName}</p>
              </div>

              {/* =================================
                  Content
              ================================== */}

              <div className="report-content">
                {/* Main title */}

                <div className="report-title-ribbon">
                  برامج الأنشطة الطلابية
                </div>

                {/* Category */}

                <h2 className="report-category-title">
                  {categoryName || "مجال البرنامج"}
                </h2>

                {/* =================================
                    Row 1
                ================================== */}

                <div className="report-fields-grid report-fields-grid-3">
                  <FieldBox
                    label={labels.teacherName}
                    value={values.teacherName}
                  />

                  <FieldBox label="التخصص" value={values.specialization} />

                  <FieldBox label="الفصل الدراسي" value={values.className} />
                </div>

                {/* =================================
                    Row 2
                ================================== */}

                <div className="report-fields-grid report-fields-grid-4">
                  <FieldBox label="الصف" value={values.grade} />

                  <FieldBox label="الحصة" value={values.period} />

                  <FieldBox label="اليوم" value={values.day} />

                  <DateFieldBox
                    gregorianDate={values.gregorianDate}
                    hijriDate={values.hijriDate}
                  />
                </div>

                {/* =================================
                    Row 3
                ================================== */}

                <div className="report-fields-grid report-fields-grid-4">
                  <FieldBox label="اسم البرنامج" value={values.programName} />

                  <FieldBox label="مكان التنفيذ" value={values.location} />

                  <FieldBox label="الحضور" value={values.attendance} />

                  <FieldBox label="الغياب" value={values.absence} />
                </div>

                {/* =================================
                    Custom Fields
                ================================== */}

                {values.customFields.length > 0 && (
                  <div className="report-custom-fields-row">
                    {values.customFields.map((field) => (
                      <div key={field.id} className="report-custom-field-item">
                        <FieldBox
                          label={field.label || "حقل إضافي"}
                          value={field.value}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* =================================
                    Objectives
                ================================== */}

                <FourBoxesSection
                  title="أهداف البرنامج"
                  type="objective"
                  itemTitle="الهدف"
                  values={values.objectives}
                />

                {/* =================================
                    Impact
                ================================== */}

                <FourBoxesSection
                  title="الأثر الإيجابي للبرنامج"
                  type="impact"
                  itemTitle="الأثر"
                  values={values.impact}
                />

                {/* =================================
                    Evidence
                ================================== */}

                <div className="report-evidence-section">
                  <div className="report-section-heading">
                    <span className="report-section-heading-line" />

                    <h3 className="report-section-title">الشواهد</h3>

                    <span className="report-section-heading-line" />
                  </div>

                  {values.evidenceImages.length > 0 ? (
                    <div
                      className="report-images-grid"
                      style={{
                        gridTemplateColumns: `repeat(${values.evidenceImages.length}, minmax(0, 1fr))`,
                      }}
                    >
                      {values.evidenceImages.map((image, index) => (
                        <div
                          key={`${image}-${index}`}
                          className="report-image-box"
                        >
                          <Image
                            width={600}
                            height={450}
                            src={image}
                            alt={`شاهد ${index + 1}`}
                            unoptimized
                            className="report-image"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="report-evidence-box" />
                  )}
                </div>

                {/* =================================
                    Signatures
                ================================== */}

                <div className="report-signatures">
                  <SignatureBox
                    title={labels.activityLeader}
                    name={values.activityLeaderName}
                  />

                  <SignatureBox
                    title={labels.supervisor}
                    name={values.supervisorName}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;

/* =========================================
   Field
========================================= */

const FieldBox = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="report-field">
      <div className="report-field-label">{label}</div>

      <div className="report-field-box">{value || ""}</div>
    </div>
  );
};

/* =========================================
   Date
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
      <div className="report-field-label">التاريخ</div>

      <div className="report-field-box report-date-box">
        <div className="report-date-row">
          <span className="report-date-label">م:</span>

          <span>{formatGregorianDate(gregorianDate)}</span>
        </div>

        <div className="report-date-row">
          <span className="report-date-label">هـ:</span>

          <span>{hijriDate || ""}</span>
        </div>
      </div>
    </div>
  );
};

/* =========================================
   4 Boxes
========================================= */

const FourBoxesSection = ({
  title,
  itemTitle,
  values,
  type,
}: {
  title: string;

  itemTitle: string;

  values: string[];

  type: "objective" | "impact";
}) => {
  const normalizedValues = [
    values[0] || "",
    values[1] || "",
    values[2] || "",
    values[3] || "",
  ];

  return (
    <div
      className={`report-section report-four-section report-four-section-${type}`}
    >
      <div className="report-section-heading">
        <span className="report-section-heading-line" />

        <h3 className="report-section-title">{title}</h3>

        <span className="report-section-heading-line" />
      </div>

      <div className="report-four-boxes">
        {normalizedValues.map((value, index) => (
          <div key={index} className="report-section-box">
            <div className="report-section-box-badge">{index + 1}</div>

            <div className="report-section-box-content">
              <div className="report-section-box-title">
                {itemTitle} {index + 1}
              </div>

              <div className="report-section-box-value">{value || "—"}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================
   Signature
========================================= */

const SignatureBox = ({ title, name }: { title: string; name?: string }) => {
  return (
    <div className="report-signature-box">
      <p className="report-signature-title">{title}</p>

      <div className="report-signature-name">{name || ""}</div>
    </div>
  );
};
