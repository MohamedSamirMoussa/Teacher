"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  CSSProperties,
} from "react";

import Image from "next/image";

import type {
  ReportFormValues,
} from "@/app/types/reports";

import {
  getReportTheme,
} from "@/app/constants/reportThemes";

type Props = {
  values:
    ReportFormValues;

  categoryName:
    string;

  previewId?:
    string;

  labels: {
    teacherName:
      string;

    supervisor:
      string;

    activityLeader:
      string;
  };
};

/* =========================================
   Date
========================================= */

const formatGregorianDate = (
  value: string,
) => {
  if (!value) {
    return "";
  }

  const [
    year,
    month,
    day,
  ] = value.split("-");

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
   Text -> List
========================================= */

const parseListItems = (
  value: string,
) => {
  if (
    !value.trim()
  ) {
    return [];
  }

  return value
    .split("\n")
    .map(
      (item) =>
        item.trim(),
    )
    .filter(Boolean)
    .slice(
      0,
      4,
    );
};

/* =========================================
   Preview
========================================= */

const ReportPreview = ({
  values,
  labels,
  categoryName,
  previewId =
    "report-preview",
}: Props) => {
  const containerRef =
    useRef<HTMLDivElement>(
      null,
    );

  const pageRef =
    useRef<HTMLDivElement>(
      null,
    );

  const [
    scale,
    setScale,
  ] =
    useState(1);

  const [
    scaledHeight,
    setScaledHeight,
  ] =
    useState<
      number | undefined
    >();

  /* =====================================
     Responsive Preview
  ====================================== */

  useEffect(() => {
    const container =
      containerRef.current;

    const page =
      pageRef.current;

    if (
      !container ||
      !page
    ) {
      return;
    }

    const updateScale =
      () => {
        const availableWidth =
          Math.max(
            container.clientWidth -
              16,
            1,
          );

        const pageWidth =
          page.offsetWidth;

        const pageHeight =
          page.offsetHeight;

        if (!pageWidth) {
          return;
        }

        const nextScale =
          Math.min(
            1,
            availableWidth /
              pageWidth,
          );

        setScale(
          nextScale,
        );

        setScaledHeight(
          pageHeight *
            nextScale,
        );
      };

    updateScale();

    const observer =
      new ResizeObserver(
        updateScale,
      );

    observer.observe(
      container,
    );

    return () => {
      observer.disconnect();
    };
  }, []);

  /* =====================================
     Theme
  ====================================== */

  const theme =
    getReportTheme(
      values.theme,
    );

  /* =====================================
     Lists
  ====================================== */

  const objectiveItems =
    parseListItems(
      values.objectives,
    );

  const impactItems =
    parseListItems(
      values.impact,
    );

  /* =====================================
     Density
  ====================================== */

  const contentWeight =
    values.customFields
      .length +
    objectiveItems.length +
    impactItems.length;

  const densityClass =
    contentWeight >= 10
      ? "report-density-tight"
      : contentWeight >= 6
        ? "report-density-medium"
        : "report-density-normal";

  /* =====================================
     Individual Colors
  ====================================== */

  const reportStyle = {
    "--report-title-color":
      values.textColors
        .reportTitle,

    "--report-category-color":
      values.textColors
        .categoryTitle,

    "--report-field-label-color":
      values.textColors
        .fieldLabels,

    "--report-field-value-color":
      values.textColors
        .fieldValues,

    "--report-section-title-color":
      values.textColors
        .sectionTitles,

    "--report-list-text-color":
      values.textColors
        .listText,

    "--report-list-number-color":
      values.textColors
        .listNumbers,

    "--report-school-color":
      values.textColors
        .schoolHeader,

    "--report-signature-color":
      values.textColors
        .signatures,
  } as CSSProperties;

  return (
    <div
      ref={
        containerRef
      }
      className="report-preview-shell"
    >
      <div
        className="report-preview-stage"
        style={{
          height:
            scaledHeight
              ? `${scaledHeight}px`
              : undefined,
        }}
      >
        <div className="report-preview-positioner">
          <div
            className="report-preview-scale"
            style={{
              transform:
                `scale(${scale})`,
            }}
          >
            <div
              ref={
                pageRef
              }
              id={
                previewId
              }
              style={
                reportStyle
              }
              className={`
                report-sheet
                ${densityClass}
                report-${values.theme}
              `}
            >
              {/* Header */}

              <Image
                src={
                  theme.header
                }
                alt=""
                width={
                  theme.headerWidth
                }
                height={
                  theme.headerHeight
                }
                priority
                aria-hidden="true"
                className="report-frame-header"
              />

              {/* Footer */}

              <Image
                src={
                  theme.footer
                }
                alt=""
                width={
                  theme.footerWidth
                }
                height={
                  theme.footerHeight
                }
                priority
                aria-hidden="true"
                className="report-frame-footer"
              />

              {/* School */}

              <div className="report-school-header">
                <p className="report-header-main">
                  الإدارة العامة للتعليم
                </p>

                <p className="report-school-name">
                  {
                    values.schoolName
                  }
                </p>

                <p className="report-region-name">
                  {values.regionName
                    ? `بمنطقة ${values.regionName}`
                    : ""}
                </p>
              </div>

              {/* Content */}

              <div className="report-content">
                <div className="report-title-ribbon">
                  برامج الأنشطة الطلابية
                </div>

                <h2 className="report-category-title">
                  {categoryName ||
                    "مجال البرنامج"}
                </h2>

                {/* Row 1 */}

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

                {/* Row 2 */}

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

                {/* Row 3 */}

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

                {/* Custom Fields */}

                {values.customFields.length >
                  0 && (
                  <div className="report-custom-fields-row">
                    {values.customFields.map(
                      (
                        field,
                      ) => (
                        <div
                          key={
                            field.id
                          }
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
                      ),
                    )}
                  </div>
                )}

                {/* Objectives */}

                <ListSection
                  title="أهداف البرنامج"
                  items={
                    objectiveItems
                  }
                />

                {/* Impact */}

                <ListSection
                  title="الأثر الإيجابي للبرنامج"
                  items={
                    impactItems
                  }
                />

                {/* Evidence */}

                <div className="report-evidence-flex">
                  <div className="report-evidence-section">
                    <SectionHeading
                      title="الشواهد"
                    />

                    {values.evidenceImages.length >
                    0 ? (
                      <div
                        className="report-images-grid"
                        style={{
                          gridTemplateColumns:
                            `repeat(${values.evidenceImages.length}, minmax(0, 1fr))`,
                        }}
                      >
                        {values.evidenceImages.map(
                          (
                            image,
                            index,
                          ) => (
                            <div
                              key={`${image}-${index}`}
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
                </div>

                {/* Signatures */}

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
      </div>
    </div>
  );
};

export default ReportPreview;

/* =========================================
   Field
========================================= */

const FieldBox = ({
  label,
  value,
}: {
  label:
    string;

  value:
    string;
}) => {
  return (
    <div className="report-field">
      <div className="report-field-label">
        {
          label
        }
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
  gregorianDate:
    string;

  hijriDate:
    string;
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
   Heading
========================================= */

const SectionHeading = ({
  title,
}: {
  title:
    string;
}) => {
  return (
    <div className="report-section-heading">
      <span className="report-section-heading-line" />

      <h3 className="report-section-title">
        {
          title
        }
      </h3>

      <span className="report-section-heading-line" />
    </div>
  );
};

/* =========================================
   Objectives / Impact
========================================= */

const ListSection = ({
  title,
  items,
}: {
  title:
    string;

  items:
    string[];
}) => {
  return (
    <div className="report-section">
      <SectionHeading
        title={
          title
        }
      />

      {items.length > 0 ? (
        <div
          className={`
            report-list-boxes
            report-list-boxes-${Math.min(
              items.length,
              4,
            )}
          `}
        >
          {items.map(
            (
              item,
              index,
            ) => (
              <div
                key={`${index}-${item}`}
                className="report-list-box"
              >
                <span className="report-list-number">
                  {
                    index + 1
                  }
                </span>

                <span className="report-list-text">
                  {
                    item
                  }
                </span>
              </div>
            ),
          )}
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

const SignatureBox = ({
  title,
  name,
}: {
  title:
    string;

  name?:
    string;
}) => {
  return (
    <div className="report-signature-box">
      <p className="report-signature-title">
        {
          title
        }
      </p>

      <div className="report-signature-name">
        {name || ""}
      </div>
    </div>
  );
};