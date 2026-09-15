import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Button from "@/components/atoms/Button";
import SectionLabel from "@/components/atoms/SectionLabel";
import Footer from "@/components/organisms/Footer";
import { colors } from "@/constants/colors";
import { fonts, textVariants } from "@/constants/typography";
import { trainingContent, trainingPaymentResultContent } from "@/content";
import { usePageTransition } from "@/context/PageTransition";
import { fetchPaymentStatus } from "@/store/actions/interneeActions";

export default function TrainingPaymentResult() {
  const { revealPage, transitionTo } = usePageTransition();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const internee = searchParams.get("internee");

  // The Safepay webhook is the authoritative source of truth - the redirect's own
  // `status` query param is only used for a friendly first paint while we confirm.
  const [confirmedStatus, setConfirmedStatus] = useState(null);

  useEffect(() => {
    revealPage();
  }, [revealPage]);

  useEffect(() => {
    if (!internee) {
      setConfirmedStatus("FAILED");
      return;
    }
    dispatch(fetchPaymentStatus(internee))
      .unwrap()
      .then((result) => setConfirmedStatus(result.paymentStatus))
      .catch(() => setConfirmedStatus("FAILED"));
  }, [dispatch, internee]);

  const isPending = confirmedStatus === null;
  const isPaid = confirmedStatus === "PAID";

  const heading = isPending
    ? trainingPaymentResultContent.pendingHeading
    : isPaid
      ? trainingPaymentResultContent.successHeading
      : trainingPaymentResultContent.failureHeading;

  const message = isPending
    ? trainingPaymentResultContent.pendingMessage
    : isPaid
      ? trainingPaymentResultContent.successMessage
      : trainingPaymentResultContent.failureMessage;

  return (
    <>
      <section
        className="relative w-full"
        style={{
          background: colors.bgPrimary,
          padding: "clamp(8rem, 12vw, 10rem) clamp(1.5rem, 6vw, 7rem) clamp(6rem, 10vw, 8rem)",
          minHeight: "70vh"
        }}
      >
        <div style={{ maxWidth: "40rem", margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <SectionLabel label={trainingContent.label} />
          </div>

          <div
            style={{
              marginTop: "clamp(2rem, 4vw, 3rem)",
              background: colors.white,
              border: `1px solid ${colors.borderLight}`,
              borderRadius: "1rem",
              padding: "clamp(2rem, 4vw, 3rem)",
              boxShadow: `0 8px 30px ${colors.black}08`
            }}
          >
            <h1 style={{ ...textVariants.h1, fontSize: "clamp(1.75rem, 3.5vw, 2.25rem)" }}>{heading}</h1>
            <p style={{ ...fonts.montRegular, fontSize: "0.95rem", color: colors.textSecondary, margin: "0.75rem 0 0", lineHeight: 1.6 }}>{message}</p>

            {!isPending && !isPaid && (
              <div style={{ marginTop: "1.75rem" }}>
                <Button size="sm" onClick={() => transitionTo("/ai-training/form")}>
                  {trainingPaymentResultContent.retryLabel}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
