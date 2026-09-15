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
  // `order_id` (our internee id) and `tracker` are appended by Safepay itself onto whatever bare
  // redirect/cancel URL we gave it - NOT query params we control. Safepay concatenates its own
  // `?order_id=...&tracker=...` onto the URL we provided, so that URL must have no query string of
  // its own, or you end up with a malformed URL with two `?`s (e.g. `...?internee=xyz?order_id=...`).
  const orderId = searchParams.get("order_id");

  // The Safepay webhook is the authoritative source of truth - the /success vs /failure path we
  // redirect to is only used for a friendly first paint while we confirm.
  const [confirmedStatus, setConfirmedStatus] = useState(null);

  useEffect(() => {
    revealPage();
  }, [revealPage]);

  useEffect(() => {
    if (!orderId) {
      setConfirmedStatus("FAILED");
      return;
    }

    let cancelled = false;
    let attempts = 0;
    // The webhook can land a few seconds after the redirect (or later, under load) - poll instead
    // of giving up on the first still-PENDING response, which would otherwise look like a failure.
    const maxAttempts = 15;
    const pollIntervalMs = 3000;

    const poll = () => {
      dispatch(fetchPaymentStatus(orderId))
        .unwrap()
        .then((result) => {
          if (cancelled) return;
          if (result.paymentStatus === "PENDING") {
            attempts += 1;
            if (attempts < maxAttempts) {
              setTimeout(poll, pollIntervalMs);
            } else {
              // Give up waiting, but don't claim failure - the webhook may still land later.
              setConfirmedStatus("PENDING");
            }
            return;
          }
          setConfirmedStatus(result.paymentStatus);
        })
        .catch(() => {
          if (!cancelled) setConfirmedStatus("FAILED");
        });
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [dispatch, orderId]);

  const isPending = confirmedStatus === null || confirmedStatus === "PENDING";
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
