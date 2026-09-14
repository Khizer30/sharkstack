import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, BookIcon, CheckIcon, LaptopIcon, SparkleIcon, HeartIcon, HomeIcon, CalendarIcon, UsersIcon } from "@/assets/svgs";
import Button from "@/components/atoms/Button";
import TextInput from "@/components/atoms/TextInput";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { createApplicant } from "@/store/actions/applicantActions";
import { resetApplicantStatus } from "@/store/slices/applicantSlice";
import { applicantFormSchema, applicantFormInitialValues } from "@/validators/applicantForm";

const TABS = ["Overview", "Application"];
const META_ROWS = (role) => [
  { label: "Location", value: role.location, icon: HomeIcon },
  { label: "Employment Type", value: role.type, icon: CalendarIcon },
  { label: "Department", value: role.department, icon: UsersIcon }
];

const OVERVIEW_SECTIONS = [
  { key: "requirements", heading: "Requirements", icon: BookIcon },
  { key: "responsibilities", heading: "What you'll do", icon: CheckIcon },
  { key: "skills", heading: "Required Skills", icon: LaptopIcon },
  { key: "additionalSkills", heading: "Good To Have", icon: SparkleIcon },
  { key: "benefits", heading: "Benefits", icon: HeartIcon }
];

function ListSection({ heading, items, icon: Icon }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ marginTop: "clamp(1.5rem, 3vw, 2rem)" }}>
      <div className="flex items-center" style={{ gap: "0.5rem", marginBottom: "0.75rem" }}>
        {Icon && (
          <span style={{ color: colors.primary, display: "flex" }}>
            <Icon size={18} />
          </span>
        )}
        <p style={{ ...fonts.poppinsSemiBold, fontSize: "0.95rem", color: colors.textPrimary, margin: 0 }}>{heading}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {items.map((item) => (
          <p key={item} style={{ margin: 0, ...fonts.montRegular, fontSize: "0.95rem", color: colors.textSecondary, lineHeight: 1.6 }}>
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function ApplicationForm({ role, email }) {
  const dispatch = useDispatch();
  const status = useSelector((s) => s.applicants.status);

  const formik = useFormik({
    initialValues: applicantFormInitialValues,
    validationSchema: applicantFormSchema,
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("email", values.email);
      formData.append("city", values.city);
      formData.append("state", values.state);
      formData.append("phone", values.phone);
      formData.append("resume", values.resume);
      formData.append("jobId", role.id);

      try {
        await dispatch(createApplicant(formData)).unwrap();
        resetForm();
      } catch {
        // surfaced via redux `status`/`error` below
      }
    }
  });

  useEffect(() => () => dispatch(resetApplicantStatus()), [dispatch]);

  const fieldError = (name) => (formik.touched[name] && formik.errors[name] ? formik.errors[name] : undefined);
  const resumeError = (formik.touched.resume || formik.submitCount > 0) && formik.errors.resume;

  const handleResumeChange = (e) => {
    formik.setFieldValue("resume", e.currentTarget.files[0] ?? null);
    formik.setFieldTouched("resume", true, false);
  };

  if (status === "succeeded") {
    return (
      <div
        style={{
          maxWidth: "34rem",
          background: colors.white,
          border: `1px solid ${colors.borderLight}`,
          borderRadius: "1rem",
          padding: "clamp(2rem, 4vw, 3rem)",
          textAlign: "center",
          boxShadow: `0 8px 30px ${colors.black}08`
        }}
      >
        <p style={{ ...fonts.poppinsSemiBold, fontSize: "1.15rem", color: colors.textPrimary, margin: 0 }}>Application submitted</p>
        <p style={{ ...fonts.montRegular, fontSize: "0.9rem", color: colors.textSecondary, margin: "0.6rem 0 0" }}>
          Thanks for applying to {role.title} — we'll be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        maxWidth: "34rem",
        background: colors.white,
        border: `1px solid ${colors.borderLight}`,
        borderRadius: "1rem",
        padding: "clamp(1.5rem, 3vw, 2.25rem)",
        boxShadow: `0 8px 30px ${colors.black}08`
      }}
    >
      <div>
        <p style={{ ...fonts.poppinsSemiBold, fontSize: "1.1rem", color: colors.textPrimary, margin: 0 }}>Apply for {role.title}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "1.25rem" }}>
        <TextInput
          label="First Name*"
          name="firstName"
          placeholder="Jordan"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={fieldError("firstName")}
        />
        <TextInput
          label="Last Name*"
          name="lastName"
          placeholder="Blake"
          value={formik.values.lastName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={fieldError("lastName")}
        />
      </div>

      <TextInput
        label="Email*"
        type="email"
        name="email"
        placeholder="hello@example.com"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={fieldError("email")}
      />

      <TextInput
        label="Phone*"
        name="phone"
        placeholder="+1 312 340 0323"
        value={formik.values.phone}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={fieldError("phone")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "1.25rem" }}>
        <TextInput
          label="City*"
          name="city"
          placeholder="Lahore"
          value={formik.values.city}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={fieldError("city")}
        />
        <TextInput
          label="State*"
          name="state"
          placeholder="Punjab"
          value={formik.values.state}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={fieldError("state")}
        />
      </div>

      <div>
        <label style={{ ...fonts.montSemiBold, fontSize: "0.8rem", color: colors.textPrimary, display: "block", marginBottom: "0.5rem" }}>Resume*</label>
        <label
          htmlFor="resume-upload"
          className="flex items-center justify-between cursor-pointer"
          style={{
            ...fonts.montRegular,
            fontSize: "0.9rem",
            color: formik.values.resume ? colors.textPrimary : colors.textMuted,
            width: "100%",
            boxSizing: "border-box",
            gap: "0.75rem",
            padding: "0.85rem 1rem",
            borderRadius: "0.65rem",
            border: `1.5px dashed ${colors.borderMedium}`,
            background: colors.bgSecondary
          }}
        >
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {formik.values.resume ? formik.values.resume.name : "Click to upload your resume (PDF or DOC)"}
          </span>
          <span
            style={{ ...fonts.montSemiBold, fontSize: "0.75rem", color: colors.primary, textTransform: "uppercase", letterSpacing: "0.05em", flexShrink: 0 }}
          >
            Browse
          </span>
        </label>
        <input id="resume-upload" type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} onChange={handleResumeChange} />
        {resumeError && (
          <span style={{ ...fonts.montRegular, fontSize: "0.75rem", color: colors.error, display: "block", marginTop: "0.4rem" }}>{resumeError}</span>
        )}
      </div>

      {status === "failed" && (
        <p style={{ ...fonts.montMedium, fontSize: "0.85rem", color: colors.error, margin: 0 }}>
          Something went wrong sending your application. Please try again, or email us at {email}.
        </p>
      )}

      <div>
        <Button size="sm" type="submit" loading={status === "loading"}>
          {status === "loading" ? "Sending…" : "Send Application"}
        </Button>
      </div>
    </form>
  );
}

export default function JobDetail({ role, onBack, email }) {
  const [tab, setTab] = useState("Overview");

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center cursor-pointer"
        style={{
          ...fonts.montSemiBold,
          fontSize: "0.85rem",
          color: colors.textMuted,
          background: "none",
          border: "none",
          padding: 0,
          gap: "0.5rem",
          marginBottom: "clamp(1.5rem, 3vw, 2rem)",
          transition: "color 0.2s"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = colors.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = colors.textMuted;
        }}
      >
        <ArrowLeft size={14} />
        All roles
      </button>

      <h2
        style={{
          ...fonts.poppinsBold,
          fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
          color: colors.textPrimary,
          margin: "0 0 clamp(2rem, 4vw, 3rem)",
          letterSpacing: "-0.01em"
        }}
      >
        {role.title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-[14rem_1fr]" style={{ columnGap: "clamp(2rem, 4vw, 3.5rem)" }}>
        <div className="flex flex-row md:flex-col flex-wrap" style={{ gap: "clamp(1.25rem, 2.5vw, 1.75rem)", marginBottom: "clamp(2rem, 4vw, 0rem)" }}>
          {META_ROWS(role).map((row) => (
            <div key={row.label} style={{ borderTop: `1px solid ${colors.borderLight}`, paddingTop: "0.85rem", minWidth: "8rem" }}>
              <div className="flex items-center" style={{ gap: "0.4rem", marginBottom: "0.3rem" }}>
                {row.icon && (
                  <span style={{ color: colors.primary, display: "flex" }}>
                    <row.icon size={14} />
                  </span>
                )}
                <span style={{ ...fonts.montRegular, fontSize: "0.8rem", color: colors.textMuted, display: "block" }}>{row.label}</span>
              </div>
              <span style={{ ...fonts.poppinsSemiBold, fontSize: "1rem", color: colors.textPrimary }}>{row.value}</span>
            </div>
          ))}
        </div>

        <div>
          <div style={{ display: "flex", gap: "1.75rem", borderBottom: `1px solid ${colors.borderLight}`, marginBottom: "clamp(1.5rem, 3vw, 2rem)" }}>
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className="cursor-pointer"
                style={{
                  ...fonts.montSemiBold,
                  fontSize: "0.9rem",
                  color: tab === t ? colors.textPrimary : colors.textMuted,
                  background: "none",
                  border: "none",
                  borderBottom: `2px solid ${tab === t ? colors.primary : "transparent"}`,
                  padding: "0 0 0.85rem",
                  transition: "color 0.2s"
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "Overview" ? (
            <div>
              {OVERVIEW_SECTIONS.map(({ key, heading, icon }) => (
                <ListSection key={key} heading={heading} items={role[key]} icon={icon} />
              ))}

              <div style={{ marginTop: "clamp(2rem, 4vw, 2.5rem)" }}>
                <Button size="sm" onClick={() => setTab("Application")}>
                  Apply for this role
                </Button>
              </div>
            </div>
          ) : (
            <ApplicationForm role={role} email={email} />
          )}
        </div>
      </div>
    </div>
  );
}
