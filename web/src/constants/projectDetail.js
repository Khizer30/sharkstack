import { colors } from "./colors";

// ─── Grid layout ────────────────────────────────────────────────────────────
export const COLS = 4;
export const ROWS = 3;
export const BW = 25;
export const BH = `calc(100vh / ${ROWS})`;

// ─── Mobile mosaic ──────────────────────────────────────────────────────────
export const MOB_TOP = 48;
export const MOB_H = 50;
export const MOB_L = 1;
export const MOB_CW = 24.5;
export const MOB_CH = MOB_H / ROWS;

// ─── Scroll phases (fraction of total scroll height) ────────────────────────
export const PHASE1 = 520 / 1450;
export const PHASE2 = 720 / 1450;
export const PHASE3 = 1350 / 1700;

// ─── Shared panel background ─────────────────────────────────────────────────
export const PANEL_BG = `linear-gradient(160deg, ${colors.bgBrand} 0%, ${colors.secondary} 55%, ${colors.bgBrand} 100%)`;

// ─── Tool icon map ───────────────────────────────────────────────────────────
const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

export const TOOL_ICONS = {
  React: `${DEVICON}/react/react-original.svg`,
  "React Native": `${DEVICON}/reactnative/reactnative-original.svg`,
  "Next.js": `${DEVICON}/nextjs/nextjs-original.svg`,
  TypeScript: `${DEVICON}/typescript/typescript-original.svg`,
  JavaScript: `${DEVICON}/javascript/javascript-original.svg`,
  Python: `${DEVICON}/python/python-original.svg`,
  "Node.js": `${DEVICON}/nodejs/nodejs-original.svg`,
  PostgreSQL: `${DEVICON}/postgresql/postgresql-original.svg`,
  MongoDB: `${DEVICON}/mongodb/mongodb-original.svg`,
  Redis: `${DEVICON}/redis/redis-original.svg`,
  Redux: `${DEVICON}/redux/redux-original.svg`,
  Docker: `${DEVICON}/docker/docker-original.svg`,
  Kubernetes: `${DEVICON}/kubernetes/kubernetes-plain.svg`,
  AWS: `${DEVICON}/amazonwebservices/amazonwebservices-original-wordmark.svg`,
  Firebase: `${DEVICON}/firebase/firebase-plain.svg`,
  Supabase: `${DEVICON}/supabase/supabase-original.svg`,
  GraphQL: `${DEVICON}/graphql/graphql-plain.svg`,
  TensorFlow: `${DEVICON}/tensorflow/tensorflow-original.svg`,
  PyTorch: `${DEVICON}/pytorch/pytorch-original.svg`,
  FastAPI: `${DEVICON}/fastapi/fastapi-original.svg`,
  Stripe: `${DEVICON}/stripe/stripe-original.svg`,
  "Three.js": `${DEVICON}/threejs/threejs-original.svg`,
  NestJS: `${DEVICON}/nestjs/nestjs-plain.svg`,
  "Express.js": `${DEVICON}/express/express-original.svg`,
  "Socket.IO": `${DEVICON}/socketio/socketio-original.svg`,
  Playwright: `${DEVICON}/playwright/playwright-original.svg`,
  Tailwind: `${DEVICON}/tailwindcss/tailwindcss-original.svg`,
  Vercel: `${DEVICON}/vercel/vercel-original.svg`,
  Kafka: `${DEVICON}/apachekafka/apachekafka-original.svg`
};

// A few tools come back from the API under a slightly different label
// than the devicon key above (e.g. "Tailwind CSS" vs "Tailwind").
const TOOL_ALIASES = {
  "Tailwind CSS": "Tailwind"
};

export const toolIconUrl = (name) => TOOL_ICONS[TOOL_ALIASES[name] ?? name] ?? null;
