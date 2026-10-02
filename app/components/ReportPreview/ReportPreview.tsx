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
   Multiline Text -> Items
========================================= */

const parseListItems = (value: string) => {
  if (!value.trim()) {
    return [];
  }

  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);
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
     Responsive Preview Scale
  ====================================== */

  useEffect(() => {
    const container = containerRef.current;

    const page = pageRef.current;

    if (!container || !page) {
      return;
    }

    const updateScale = () => {
      const availableWidth = Math.max(container.clientWidth - 24, 1);

      const pageWidth = page.offsetWidth;

      const pageHeight = page.offsetHeight;

      if (!pageWidth) {
        return;
      }

      const nextScale = Math.min(1, availableWidth / pageWidth);

      setScale(nextScale);

      setScaledHeight(pageHeight * nextScale);
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  /* =====================================
     Objectives / Impact
  ====================================== */

  const objectiveItems = parseListItems(values.objectives);

  const impactItems = parseListItems(values.impact);

  /*
    لو التقرير مليان جدًا
    نقلل المساحات سنة بسيطة
    من غير ما نصغر الخط بشكل مزعج.
  */

  const contentWeight =
    values.customFields.length + objectiveItems.length + impactItems.length;

  const densityClass =
    contentWeight >= 10
      ? "report-density-tight"
      : contentWeight >= 6
        ? "report-density-medium"
        : "report-density-normal";

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
            <div
              ref={pageRef}
              id={previewId}
              className={`report-sheet ${densityClass}`}
            >
              {/* =================================
                  Header
              ================================== */}

              <Image
                src="/report-header.png"
                alt=""
                width={1491}
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
                width={1491}
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

                <ListSection title="أهداف البرنامج" items={objectiveItems} />

                {/* =================================
                    Impact
                ================================== */}

                <ListSection
                  title="الأثر الإيجابي للبرنامج"
                  items={impactItems}
                />

                {/* =================================
                    Flexible Evidence Area
                ================================== */}

                <div className="report-evidence-flex">
                  <div className="report-evidence-section">
                    <SectionHeading title="الشواهد" />

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
   Field Box
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
   Date Field
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
   Section Heading
========================================= */

const SectionHeading = ({ title }: { title: string }) => {
  return (
    <div className="report-section-heading">
      <span className="report-section-heading-line" />

      <h3 className="report-section-title">{title}</h3>

      <span className="report-section-heading-line" />
    </div>
  );
};

/* =========================================
   Objectives / Impact
========================================= */

const ListSection = ({ title, items }: { title: string; items: string[] }) => {
  return (
    <div className="report-section">
      <SectionHeading title={title} />

      {items.length > 0 ? (
        <div
          className={`report-list-boxes report-list-boxes-${Math.min(
            items.length,
            4,
          )}`}
        >
          {items.map((item, index) => (
            <div key={`${index}-${item}`} className="report-list-box">
              <span className="report-list-number">{index + 1}</span>

              <span className="report-list-text">{item}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="report-list-empty" />
      )}
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
