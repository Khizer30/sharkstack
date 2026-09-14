import { useFormik } from "formik";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "@/components/atoms/Button";
import FormField from "@/components/atoms/FormField";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { contactFormContent } from "@/content";
import { useIsMobile } from "@/hooks/useIsMobile";
import { createLead } from "@/store/actions/leadActions";
import { resetLeadStatus } from "@/store/slices/leadSlice";
import { leadFormSchema, leadFormInitialValues } from "@/validators/leadForm";

function ServiceChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...fonts.montMedium,
        fontSize: "0.75rem",
        letterSpacing: "0.03em",
        borderRadius: "9999px",
        padding: "0.55rem 1.1rem",
        border: `1px solid ${active ? colors.primary : colors.borderLight}`,
        color: active ? colors.primary : colors.textMuted,
        background: active ? `${colors.primary}12` : "transparent",
        cursor: "pointer",
        transition: "border-color 0.2s, color 0.2s, background-color 0.2s"
      }}
    >
      {label}
    </button>
  );
}

export default function ContactDrawer({ open, onClose }) {
  const dispatch = useDispatch();
  const status = useSelector((s) => s.leads.status);
  const isMobile = useIsMobile();

  const formik = useFormik({
    initialValues: leadFormInitialValues,
    validationSchema: leadFormSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await dispatch(createLead(values)).unwrap();
        resetForm();
      } catch {
        // surfaced via redux `status`/`error` below
      }
    }
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (open) return;
    formik.resetForm();
    dispatch(resetLeadStatus());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toggleService = (service) => {
    const current = formik.values.services;
    const next = current.includes(service) ? current.filter((s) => s !== service) : [...current, service];
    formik.setFieldValue("services", next);
    formik.setFieldTouched("services", true, false);
  };

  const servicesError = (formik.touched.services || formik.submitCount > 0) && formik.errors.services;

  const handleRegionChange = (e) => {
    const { value } = e.target;
    formik.setFieldValue("region", value.charAt(0).toUpperCase() + value.slice(1));
  };

  const fieldError = (name) => (formik.touched[name] && formik.errors[name] ? formik.errors[name] : undefined);

  return createPortal(
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: `${colors.black}80`,
          backdropFilter: "blur(4px)",
          zIndex: 9998,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "all" : "none",
          transition: "opacity 0.5s ease"
        }}
      />

      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "clamp(320px, 68vw, 900px)",
          height: "100vh",
          backgroundColor: colors.bgPrimary,
          zIndex: 9999,
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)",
          display: "flex",
          flexDirection: "column",
          padding: "clamp(4rem, 6vw, 5.5rem) clamp(1.5rem, 3.5vw, 3rem) clamp(1.5rem, 3.5vw, 3rem)",
          boxSizing: "border-box",
          overflowY: isMobile ? "auto" : "hidden"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "clamp(1.5rem, 3vw, 2.5rem)", flexShrink: 0 }}>
          <p
            style={{
              ...fonts.montSemiBold,
              fontSize: "clamp(0.75rem, 1.2vw, 0.9rem)",
              letterSpacing: "0.05em",
              color: colors.textPrimary,
              lineHeight: 1.5,
              margin: 0,
              whiteSpace: "pre-line"
            }}
          >
            {contactFormContent.drawerTitle}
          </p>

          <button
            onClick={onClose}
            style={{
              ...fonts.montSemiBold,
              fontSize: "0.7rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: colors.textMuted,
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: 0,
              transition: "color 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.textPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.textMuted;
            }}
          >
            CLOSE ×
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={formik.handleSubmit}
          style={isMobile ? { display: "flex", flexDirection: "column" } : { display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}
        >
          <div
            data-lenis-prevent={!isMobile}
            className="contact-drawer-scroll"
            style={
              isMobile
                ? {
                    display: "flex",
                    flexDirection: "column",
                    gap: "clamp(1rem, 2vw, 1.75rem)"
                  }
                : {
                    display: "flex",
                    flexDirection: "column",
                    gap: "clamp(1rem, 2vw, 1.75rem)",
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",
                    overscrollBehavior: "contain",
                    WebkitOverflowScrolling: "touch",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    paddingRight: "0.25rem"
                  }
            }
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(1rem, 2vw, 1.75rem)" }}>
              <FormField
                label={contactFormContent.fields.name.label}
                placeholder={contactFormContent.fields.name.placeholder}
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={fieldError("name")}
              />
              <FormField
                label={contactFormContent.fields.phone.label}
                placeholder={contactFormContent.fields.phone.placeholder}
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={fieldError("phone")}
              />
            </div>

            <FormField
              label={contactFormContent.fields.email.label}
              type="email"
              name="email"
              placeholder={contactFormContent.fields.email.placeholder}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={fieldError("email")}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(1rem, 2vw, 1.75rem)" }}>
              <FormField
                label={contactFormContent.fields.companyName.label}
                placeholder={contactFormContent.fields.companyName.placeholder}
                name="companyName"
                value={formik.values.companyName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={fieldError("companyName")}
              />
              <FormField
                label={contactFormContent.fields.companyLink.label}
                placeholder={contactFormContent.fields.companyLink.placeholder}
                name="companyLink"
                value={formik.values.companyLink}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={fieldError("companyLink")}
              />
            </div>

            <FormField
              label={contactFormContent.fields.region.label}
              placeholder={contactFormContent.fields.region.placeholder}
              name="region"
              value={formik.values.region}
              onChange={handleRegionChange}
              onBlur={formik.handleBlur}
              error={fieldError("region")}
            />

            <div>
              <span
                style={{
                  ...fonts.montRegular,
                  fontSize: "0.65rem",
                  letterSpacing: "0.08em",
                  color: colors.textMuted,
                  display: "block",
                  marginBottom: "0.6rem"
                }}
              >
                {contactFormContent.servicesLabel}
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
                {contactFormContent.services.map((service) => (
                  <ServiceChip key={service} label={service} active={formik.values.services.includes(service)} onClick={() => toggleService(service)} />
                ))}
              </div>
              {servicesError && (
                <span style={{ ...fonts.montRegular, fontSize: "0.7rem", color: colors.error, display: "block", marginTop: "0.5rem" }}>{servicesError}</span>
              )}
            </div>

            <FormField
              label={contactFormContent.fields.projectDetails.label}
              tag="textarea"
              rows={2}
              placeholder={contactFormContent.fields.projectDetails.placeholder}
              name="projectDetails"
              value={formik.values.projectDetails}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={fieldError("projectDetails")}
            />
          </div>

          {status === "succeeded" && (
            <p style={{ ...fonts.montMedium, fontSize: "0.8rem", color: colors.termSuccess, margin: "1rem 0 0" }}>{contactFormContent.successMessage}</p>
          )}
          {status === "failed" && (
            <p style={{ ...fonts.montMedium, fontSize: "0.8rem", color: colors.error, margin: "1rem 0 0" }}>{contactFormContent.errorMessage}</p>
          )}

          <div style={{ paddingTop: "1.25rem", flexShrink: 0 }}>
            <Button type="submit" loading={status === "loading"}>
              {status === "loading" ? contactFormContent.submittingLabel : contactFormContent.submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </>,
    document.body
  );
}
