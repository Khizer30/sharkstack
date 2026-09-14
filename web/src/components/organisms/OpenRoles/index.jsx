import { motion } from "motion/react";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SearchIcon, CloseIcon } from "@/assets/svgs";
import FilterDropdown from "@/components/atoms/FilterDropdown";
import Spinner from "@/components/atoms/Spinner";
import Text from "@/components/atoms/Text";
import RoleRow from "@/components/molecules/OpenRoles/RoleRow";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/typography";
import { openRolesContent, applyContent } from "@/content";
import { fetchJobs } from "@/store/actions/jobActions";
import { normalizeJob } from "@/utils/jobs";

const NoJobsAnimation = lazy(() => import("./NoJobsAnimation"));

const SEARCH_PATTERN = /^[a-zA-Z0-9\s&/-]*$/;
const LOCATION_TYPES = ["All", "Remote", "Onsite", "Hybrid"];
const JOB_TYPES = ["All", "Full Time", "Part Time", "Contract"];

export default function OpenRoles() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((s) => s.jobs);
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeDept, setActiveDept] = useState("All");
  const [locationType, setLocationType] = useState("All");
  const [jobType, setJobType] = useState("All");

  useEffect(() => {
    if (status === "idle") dispatch(fetchJobs());
  }, [status, dispatch]);

  const roles = useMemo(() => items.map(normalizeJob), [items]);

  const searchError = query && !SEARCH_PATTERN.test(query) ? openRolesContent.searchValidationError : null;

  const departments = useMemo(() => ["All", ...new Set(roles.map((r) => r.department))], [roles]);

  const filteredRoles = useMemo(() => {
    const q = searchError ? "" : query.trim().toLowerCase();
    return roles.filter((role) => {
      const matchesDept = activeDept === "All" || role.department === activeDept;
      const matchesLocation = locationType === "All" || role.location === locationType;
      const matchesType = jobType === "All" || role.type === jobType;
      const matchesQuery = !q || role.title.toLowerCase().includes(q) || role.department.toLowerCase().includes(q);
      return matchesDept && matchesLocation && matchesType && matchesQuery;
    });
  }, [roles, query, activeDept, locationType, jobType, searchError]);

  const grouped = useMemo(() => {
    const map = new Map();
    filteredRoles.forEach((role) => {
      if (!map.has(role.department)) map.set(role.department, []);
      map.get(role.department).push(role);
    });
    return [...map.entries()];
  }, [filteredRoles]);

  const noOpenings = status === "succeeded" && roles.length === 0;

  return (
    <section id="roles" className="relative w-full" style={{ background: colors.cream, padding: "clamp(6rem, 10vw, 8rem) clamp(2rem, 6vw, 7rem)" }}>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6" style={{ marginBottom: "clamp(2.5rem, 5vw, 3.5rem)" }}>
        <Text variant="h2" as="h2" style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)" }}>
          {openRolesContent.heading}
        </Text>
        <Text variant="subtitle" style={{ maxWidth: "20rem" }}>
          {openRolesContent.sub}
        </Text>
      </div>

      <div
        className="flex items-center"
        style={{
          gap: "0.75rem",
          background: colors.white,
          border: `1.5px solid ${searchFocused ? colors.primary : colors.borderLight}`,
          borderRadius: "0.85rem",
          padding: "0.9rem 1.25rem",
          boxShadow: searchFocused ? `0 8px 28px ${colors.primary}1F` : `0 4px 16px ${colors.black}08`,
          transition: "border-color 0.25s, box-shadow 0.25s"
        }}
      >
        <motion.span
          animate={{ scale: searchFocused ? 1.15 : 1, color: searchFocused ? colors.primary : colors.textMuted }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          style={{ display: "flex" }}
        >
          <SearchIcon size={18} />
        </motion.span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder={openRolesContent.searchPlaceholder}
          style={{
            ...fonts.montRegular,
            fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)",
            color: colors.textPrimary,
            background: "none",
            border: "none",
            outline: "none",
            width: "100%"
          }}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="flex items-center justify-center cursor-pointer shrink-0"
            style={{ color: colors.textMuted, background: "none", border: "none", padding: "0.25rem" }}
          >
            <CloseIcon size={16} />
          </button>
        )}
      </div>
      {searchError && (
        <span style={{ ...fonts.montRegular, fontSize: "0.75rem", color: colors.error, display: "block", marginTop: "0.5rem" }}>{searchError}</span>
      )}

      <div className="flex flex-wrap" style={{ gap: "0.6rem", marginTop: "1.5rem", marginBottom: "clamp(2.5rem, 5vw, 3.5rem)" }}>
        {departments.map((dept) => {
          const active = dept === activeDept;
          return (
            <button
              key={dept}
              type="button"
              onClick={() => setActiveDept(dept)}
              className="rounded-full cursor-pointer transition-all duration-250"
              style={{
                ...fonts.montMedium,
                fontSize: "0.85rem",
                padding: "0.55rem 1.25rem",
                border: `1px solid ${active ? colors.primary : colors.borderMedium}`,
                background: active ? colors.primary : colors.white,
                color: active ? colors.white : colors.textSecondary,
                boxShadow: active ? `0 4px 14px ${colors.primary}40` : "none"
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.borderColor = colors.primary;
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.borderColor = colors.borderMedium;
              }}
            >
              {dept}
            </button>
          );
        })}

        <FilterDropdown label="Any location type" options={LOCATION_TYPES} value={locationType} onChange={setLocationType} />

        <FilterDropdown label="Any job type" options={JOB_TYPES} value={jobType} onChange={setJobType} />
      </div>

      {status === "loading" ? (
        <div className="flex items-center justify-center" style={{ gap: "0.75rem", borderTop: `1px solid ${colors.borderLight}`, paddingTop: "2.5rem" }}>
          <Spinner size={18} />
          <Text variant="body" as="p" color={colors.textSecondary} style={{ margin: 0 }}>
            Loading roles…
          </Text>
        </div>
      ) : grouped.length > 0 ? (
        <div className="flex flex-col" style={{ gap: "clamp(2rem, 4vw, 3rem)" }}>
          {grouped.map(([department, deptRoles]) => (
            <div key={department}>
              <Text variant="label" as="h3" style={{ textTransform: "uppercase", letterSpacing: "0.08em", color: colors.textMuted, marginBottom: "0.25rem" }}>
                {department}
              </Text>
              <div>
                {deptRoles.map((role) => (
                  <RoleRow key={role.id} role={role} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            borderTop: `1px solid ${colors.borderLight}`,
            paddingTop: "2.5rem",
            textAlign: "center"
          }}
        >
          <div style={{ width: "min(18rem, 60vw)", margin: "0 auto" }}>
            <Suspense fallback={null}>
              <NoJobsAnimation />
            </Suspense>
          </div>
          <Text variant="body" as="p" color={colors.textSecondary} style={{ maxWidth: "30rem", margin: "0 auto 1.25rem" }}>
            {noOpenings ? openRolesContent.noOpeningsState : openRolesContent.emptyState}
          </Text>
          <a
            href={`mailto:${applyContent.email}`}
            style={{ ...fonts.montSemiBold, color: colors.primary, textDecoration: "underline", textUnderlineOffset: "4px" }}
          >
            {applyContent.email}
          </a>
        </motion.div>
      )}
    </section>
  );
}
