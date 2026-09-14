import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import JobDetail from "@/components/molecules/OpenRoles/JobDetail";
import CareerApply from "@/components/organisms/CareerApply";
import Footer from "@/components/organisms/Footer";
import { colors } from "@/constants/colors";
import { applyContent } from "@/content";
import { usePageTransition } from "@/context/PageTransition";
import { fetchJobs } from "@/store/actions/jobActions";
import { normalizeJob } from "@/utils/jobs";

export default function JobDetailPage() {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { revealPage, transitionToSection } = usePageTransition();
  const { items, status } = useSelector((s) => s.jobs);

  useEffect(() => {
    revealPage();
  }, [revealPage]);

  useEffect(() => {
    if (status === "idle") dispatch(fetchJobs());
  }, [status, dispatch]);

  const role = useMemo(() => {
    const job = items.find((j) => String(j.id) === roleId);
    return job ? normalizeJob(job) : null;
  }, [items, roleId]);

  useEffect(() => {
    if (!role && status === "succeeded") navigate("/careers", { replace: true });
  }, [role, status, navigate]);

  if (!role) return null;

  return (
    <>
      <section
        className="relative w-full"
        style={{ background: colors.bgPrimary, padding: "clamp(8rem, 12vw, 10rem) clamp(2rem, 6vw, 7rem) clamp(6rem, 10vw, 8rem)", minHeight: "70vh" }}
      >
        <JobDetail role={role} onBack={() => transitionToSection("roles", "/careers")} email={applyContent.email} />
      </section>
      <CareerApply />
      <Footer />
    </>
  );
}
