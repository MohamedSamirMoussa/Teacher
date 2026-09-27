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
   Gregorian Formatter
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
  return (
    <div className="w-full min-w-0">
      <div id={previewId} className="report-preview-shell">
        <div className="report-sheet">
          {/* Decorative Header */}

          <Image
            src="/report-header.png"
            alt=""
            width={1448}
            height={205}
            priority
            aria-hidden="true"
            className="report-frame-header"
          />

          {/* Decorative Footer */}

          <Image
            src="/report-footer.png"
            alt=""
            width={1448}
            height={150}
            priority
            aria-hidden="true"
            className="report-frame-footer"
          />

          {/* Dynamic School Data */}

          <div className="report-school-header">
            <p className="report-school-name">{values.schoolName}</p>

            <p className="report-header-main">الإدارة العامة للتعليم</p>

            <p>بمنطقة {values.regionName}</p>
          </div>

          {/* Report Content */}

          <div className="report-content">
            <div className="report-title-ribbon">برامج الأنشطة الطلابية</div>

            <h2 className="report-category-title">
              {categoryName || "مجال البرنامج"}
            </h2>

            {/* ROW 1 */}

            <div className="report-fields-grid report-fields-grid-3">
              <FieldBox label={labels.teacherName} value={values.teacherName} />

              <FieldBox label="التخصص" value={values.specialization} />

              <FieldBox label="الفصل الدراسي" value={values.className} />
            </div>

            {/* ROW 2 */}

            <div className="report-fields-grid report-fields-grid-4">
              <FieldBox label="الصف" value={values.grade} />

              <FieldBox label="الحصة" value={values.period} />

              <FieldBox label="اليوم" value={values.day} />

              <DateFieldBox
                gregorianDate={values.gregorianDate}
                hijriDate={values.hijriDate}
              />
            </div>

            {/* ROW 3 */}

            <div className="report-fields-grid report-fields-grid-4">
              <FieldBox label="اسم البرنامج" value={values.programName} />

              <FieldBox label="مكان التنفيذ" value={values.location} />

              <FieldBox label="الحضور" value={values.attendance} />

              <FieldBox label="الغياب" value={values.absence} />
            </div>

            {/* Custom Fields */}

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

            {/* Objectives */}

            <ReportTextSection
              title="أهداف البرنامج"
              value={values.objectives}
            />

            {/* Impact */}

            <ReportTextSection
              title="الأثر الإيجابي للبرنامج"
              value={values.impact}
            />

            {/* Evidence */}

            <div className="report-evidence-section">
              <h3 className="report-section-title">الشواهد</h3>

              {values.evidenceImages.length > 0 ? (
                <div
                  className="report-images-grid"
                  style={{
                    gridTemplateColumns: `repeat(${values.evidenceImages.length}, minmax(0, 1fr))`,
                  }}
                >
                  {values.evidenceImages.map((image, index) => (
                    <div key={image} className="report-image-box">
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

            {/* Signatures */}

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
   Objectives / Impact
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
      <h3 className="report-section-title">{title}</h3>

      <div className="report-textarea-box">{value || ""}</div>
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

      <div className="report-signature-line">التوقيع</div>
    </div>
  );
};
