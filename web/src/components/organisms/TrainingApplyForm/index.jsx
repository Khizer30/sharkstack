import { useFormik } from "formik";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft } from "@/assets/svgs";
import Button from "@/components/atoms/Button";
import SectionLabel from "@/components/atoms/SectionLabel";
import TextInput from "@/components/atoms/TextInput";
import { colors } from "@/constants/colors";
import { fonts, textVariants } from "@/constants/typography";
import { trainingFormContent } from "@/content";
import { usePageTransition } from "@/context/PageTransition";
import { createInternee } from "@/store/actions/interneeActions";
import { resetInterneeStatus } from "@/store/slices/interneeSlice";
import { interneeFormSchema, interneeFormInitialValues } from "@/validators/interneeForm";

export default function TrainingApplyForm() {
  const dispatch = useDispatch();
  const { transitionTo } = usePageTransition();
  const status = useSelector((s) => s.internees.status);
  const checkoutUrl = useSelector((s) => s.internees.checkoutUrl);

  const formik = useFormik({
    initialValues: interneeFormInitialValues,
    validationSchema: interneeFormSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const result = await dispatch(createInternee(values)).unwrap();
        resetForm();
        if (result.checkoutUrl) {
          window.location.href = result.checkoutUrl;
        }
      } catch {
        // surfaced via redux `status`/`error` below
      }
    }
  });

  useEffect(() => () => dispatch(resetInterneeStatus()), [dispatch]);

  const fieldError = (name) => (formik.touched[name] && formik.errors[name] ? formik.errors[name] : undefined);

  return (
    <section
      className="relative w-full"
      style={{ background: colors.bgPrimary, padding: "clamp(8rem, 12vw, 10rem) clamp(1.5rem, 6vw, 7rem) clamp(6rem, 10vw, 8rem)", minHeight: "80vh" }}
    >
      <div style={{ maxWidth: "40rem", margin: "0 auto" }}>
        <button
          type="button"
          onClick={() => transitionTo("/ai-training")}
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
          {trainingFormContent.backLabel}
        </button>

        <SectionLabel label={trainingFormContent.label} />

        <h1 style={{ ...textVariants.h1, fontSize: "clamp(2.25rem, 4.5vw, 3rem)", marginTop: "1.25rem" }}>{trainingFormContent.heading}</h1>

        <p style={{ ...textVariants.body, color: colors.textSecondary, marginTop: "1rem", maxWidth: "34rem" }}>{trainingFormContent.subtext}</p>

        <div
          style={{
            marginTop: "clamp(2rem, 4vw, 3rem)",
            padding: "clamp(2rem, 4vw, 2.75rem)",
            borderRadius: "1.25rem",
            border: `1px solid ${colors.borderLight}`,
            background: colors.white,
            boxShadow: `0 4px 20px ${colors.black}05`
          }}
        >
          <h3
            style={{
              ...fonts.poppinsSemiBold,
              fontSize: "clamp(1rem, 2vw, 1.15rem)",
              color: colors.textPrimary,
              margin: "0 0 1.75rem",
              letterSpacing: "-0.01em"
            }}
          >
            What happens after you apply?
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem"
            }}
          >
            {[
              "Submit your application form below",
              "You'll be redirected to our secure payment page",
              "Pay the $108 registration fee",
              "Your receipt and seat confirmation will be sent to your email",
              "Prepare to start the masterclass on October 1st!"
            ].map((step, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "flex-start"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "50%",
                    background: colors.primary,
                    color: colors.white,
                    flexShrink: 0,
                    ...fonts.poppinsSemiBold,
                    fontSize: "0.85rem"
                  }}
                >
                  {index + 1}
                </div>
                <p
                  style={{
                    ...fonts.montRegular,
                    fontSize: "0.95rem",
                    color: colors.textSecondary,
                    lineHeight: 1.6,
                    margin: "0.3rem 0 0",
                    flex: 1
                  }}
                >
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {status === "succeeded" ? (
          <div
            style={{
              marginTop: "clamp(2rem, 4vw, 3rem)",
              background: colors.white,
              border: `1px solid ${colors.borderLight}`,
              borderRadius: "1rem",
              padding: "clamp(2rem, 4vw, 3rem)",
              textAlign: "center",
              boxShadow: `0 8px 30px ${colors.black}08`
            }}
          >
            <p style={{ ...fonts.poppinsSemiBold, fontSize: "1.15rem", color: colors.textPrimary, margin: 0 }}>
              {checkoutUrl ? trainingFormContent.redirectingHeading : trainingFormContent.successHeading}
            </p>
            <p style={{ ...fonts.montRegular, fontSize: "0.9rem", color: colors.textSecondary, margin: "0.6rem 0 0", lineHeight: 1.6 }}>
              {checkoutUrl ? trainingFormContent.redirectingMessage : trainingFormContent.successMessage}
            </p>
          </div>
        ) : (
          <form
            onSubmit={formik.handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              marginTop: "clamp(2rem, 4vw, 3rem)",
              background: colors.white,
              border: `1px solid ${colors.borderLight}`,
              borderRadius: "1rem",
              padding: "clamp(1.5rem, 3vw, 2.25rem)",
              boxShadow: `0 8px 30px ${colors.black}08`
            }}
          >
            <TextInput
              label={trainingFormContent.fields.name.label}
              name="name"
              placeholder={trainingFormContent.fields.name.placeholder}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={fieldError("name")}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "1.25rem" }}>
              <TextInput
                label={trainingFormContent.fields.email.label}
                type="email"
                name="email"
                placeholder={trainingFormContent.fields.email.placeholder}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={fieldError("email")}
              />
              <TextInput
                label={trainingFormContent.fields.phone.label}
                name="phone"
                placeholder={trainingFormContent.fields.phone.placeholder}
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={fieldError("phone")}
              />
            </div>

            <TextInput
              label={trainingFormContent.fields.about.label}
              tag="textarea"
              rows={4}
              name="about"
              placeholder={trainingFormContent.fields.about.placeholder}
              value={formik.values.about}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={fieldError("about")}
            />

            <div>
              <label style={{ display: "block", ...fonts.montMedium, fontSize: "0.85rem", color: colors.textPrimary, marginBottom: "0.5rem" }}>
                Resume (PDF)
              </label>
              <input
                type="file"
                name="resume"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.currentTarget.files?.[0];
                  formik.setFieldValue("resume", file || null);
                }}
                onBlur={() => formik.setFieldTouched("resume", true)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "0.75rem",
                  border: `1px solid ${colors.borderLight}`,
                  borderRadius: "0.5rem",
                  fontSize: "0.9rem",
                  cursor: "pointer"
                }}
              />
              {fieldError("resume") && (
                <p style={{ ...fonts.montMedium, fontSize: "0.8rem", color: colors.error, margin: "0.25rem 0 0" }}>{fieldError("resume")}</p>
              )}
            </div>

            {status === "failed" && (
              <p style={{ ...fonts.montMedium, fontSize: "0.85rem", color: colors.error, margin: 0 }}>{trainingFormContent.errorMessage}</p>
            )}

            <div>
              <Button size="sm" type="submit" loading={status === "loading"}>
                {status === "loading" ? trainingFormContent.submittingLabel : trainingFormContent.submitLabel}
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
