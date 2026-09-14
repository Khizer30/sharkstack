const humanize = (value = "") =>
  value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const toList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  return value
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
};

export function normalizeJob(job) {
  return {
    id: job.id,
    title: job.title,
    department: humanize(job.department),
    location: humanize(job.workNature),
    type: humanize(job.type),
    responsibilities: toList(job.responsibilities),
    requirements: toList(job.requirements),
    benefits: toList(job.benefits),
    skills: toList(job.skills),
    additionalSkills: toList(job.additionalSkills)
  };
}
