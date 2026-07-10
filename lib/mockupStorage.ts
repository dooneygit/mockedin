import type { MockupState } from "@/types/profile";

const STORAGE_KEY = "linkedin-mockup-data";
// localStorage caps around 5MB; leave headroom.
const MAX_BYTES = 4_500_000;

// localStorage stores UTF-16, so each char is ~2 bytes.
function byteSize(str: string) {
  return str.length * 2;
}

function isDataUrl(value?: string) {
  return typeof value === "string" && value.startsWith("data:");
}

// Drop uploaded (base64) images so text/layout can still be persisted.
function stripImages(state: MockupState): MockupState {
  const dropLogo = (entry: MockupState["experience"][number]) =>
    isDataUrl(entry.logo) ? { ...entry, logo: undefined } : entry;

  return {
    ...state,
    banner: isDataUrl(state.banner) ? undefined : state.banner,
    avatar: isDataUrl(state.avatar) ? undefined : state.avatar,
    experience: state.experience.map(dropLogo),
    education: state.education.map(dropLogo),
  };
}

export type SaveResult = { ok: true } | { ok: false; message: string };

export function saveMockup(state: MockupState): SaveResult {
  if (typeof window === "undefined") return { ok: true };
  try {
    const json = JSON.stringify(state);
    if (byteSize(json) <= MAX_BYTES) {
      window.localStorage.setItem(STORAGE_KEY, json);
      return { ok: true };
    }

    const stripped = JSON.stringify(stripImages(state));
    if (byteSize(stripped) > MAX_BYTES) {
      return {
        ok: false,
        message: "Mockup is too large to save locally; changes won't persist.",
      };
    }
    window.localStorage.setItem(STORAGE_KEY, stripped);
    return {
      ok: false,
      message:
        "Uploaded images are too large to save; only text and layout were persisted.",
    };
  } catch {
    return { ok: false, message: "Couldn't save your mockup locally." };
  }
}

export function loadMockup(): MockupState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as MockupState;
  } catch {
    return null;
  }
}

export function clearMockup() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
