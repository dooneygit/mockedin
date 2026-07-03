"use client";

import { useRef, useState, useEffect, type ChangeEvent, type ReactNode } from "react";

type ExperienceEntry = {
  id: string;
  company: string;
  role: string;
  dateRange: string;
  description: string;
  logo?: string;
};

type EducationEntry = {
  id: string;
  school: string;
  field: string;
  dateRange: string;
  description: string;
  logo?: string;
};

type CommentEntry = {
  id: string;
  when: string;
  body: string;
};

function EditableText({
  value,
  onChange,
  className,
  multiline = false,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  multiline?: boolean;
  ariaLabel: string;
}) {
  return (
    <span
      role="textbox"
      aria-label={ariaLabel}
      contentEditable
      suppressContentEditableWarning
      className={`li-editable inline-block ${className ?? ""}`}
      onBlur={(e) => onChange(e.currentTarget.textContent ?? "")}
      onKeyDown={(e) => {
        if (!multiline && e.key === "Enter") {
          e.preventDefault();
          (e.target as HTMLElement).blur();
        }
      }}
    >
      {value}
    </span>
  );
}

function ImageUpload({
  src,
  onChange,
  children,
  className,
  ariaLabel,
}: {
  src?: string;
  onChange: (dataUrl: string) => void;
  children: (src: string | undefined) => ReactNode;
  className?: string;
  ariaLabel: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onChange(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={() => inputRef.current?.click()}
      className={`group relative cursor-pointer overflow-hidden ${className ?? ""}`}
    >
      {children(src)}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs opacity-0 transition-opacity group-hover:opacity-100">
        Click to upload
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </button>
  );
}

function SectionCard({
  title,
  onAdd,
  children,
}: {
  title: string;
  onAdd: () => void;
  children: ReactNode;
}) {
  return (
    <section className="li-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button
          type="button"
          aria-label={`Add ${title.toLowerCase()}`}
          onClick={onAdd}
          className="flex h-8 w-8 items-center justify-center rounded-full text-2xl text-[var(--li-text-primary)] hover:bg-black/5"
        >
          +
        </button>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function EntryLogo({
  src,
  fallbackBg,
  letter,
  size = "lg",
}: {
  src?: string;
  fallbackBg: string;
  letter: string;
  size?: "sm" | "lg";
}) {
  const dims = size === "sm" ? "h-8 w-8 text-sm" : "h-12 w-12";
  return (
    <div
      className={`flex ${dims} shrink-0 items-center justify-center rounded-sm text-white font-semibold overflow-hidden`}
      style={{ background: src ? "transparent" : fallbackBg }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        letter
      )}
    </div>
  );
}

const defaultExperience: ExperienceEntry[] = [
  {
    id: "exp-1",
    company: "Company",
    role: "Role",
    dateRange: "Start to End",
    description: "Description",
    logo: "/images/default-logo.webp",
  }
];

const defaultEducation: EducationEntry[] = [
  {
    id: "edu-1",
    school: "School",
    field: "Field of Study",
    dateRange: "Start to End",
    description: "Description",
    logo: "/images/default-logo.webp",
  }
];

const defaultComments: CommentEntry[] = [
  {
    id: "cmt-1",
    when: "1mo",
    body: "Comment",
  },
];

const LOGO_DEV_PK = process.env.NEXT_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY

function logoDevImageUrl(domain: string, size = 200): string {
  return `https://img.logo.dev/${domain}?token=${LOGO_DEV_PK}&size=${size}&format=png`
}

export default function Profile() {
  const [banner, setBanner] = useState<string | undefined>("/images/default-banner.webp");
  const [avatar, setAvatar] = useState<string | undefined>();

  const [firstName, setFirstName] = useState("First");
  const [lastName, setLastName] = useState("Last");
  const [headline, setHeadline] = useState(
    "Headline",
  );
  const [location, setLocation] = useState("Country");
  const [connections, setConnections] = useState("0");
  const [followers, setFollowers] = useState("0");
  const [showFollowers, setShowFollowers] = useState(true);
  const [showConnections, setShowConnections] = useState(true);

  const [about, setAbout] = useState("About");

  const [experience, setExperience] =
    useState<ExperienceEntry[]>(defaultExperience);
  const [education, setEducation] =
    useState<EducationEntry[]>(defaultEducation);
  const [comments, setComments] =
    useState<CommentEntry[]>(defaultComments);

  const [logoModal, setLogoModal] = useState<{ type: "experience" | "education"; id: string } | null>(null);
  const logoModalFileInputRef = useRef<HTMLInputElement>(null);

  const currentCompany = experience?.[0] ?? null;
  const currentSchool = education?.[0] ?? null;

  const logoModalSrc = logoModal
    ? logoModal.type === "experience"
      ? experience.find((e) => e.id === logoModal.id)?.logo
      : education.find((e) => e.id === logoModal.id)?.logo
    : undefined;

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ name: string; domain: string }[]>([]);
  const [searchStatus, setSearchStatus] = useState<"idle" | "loading" | "error">("idle");

  function openLogoModal(target: { type: "experience" | "education"; id: string }) {
    setSearchQuery("");
    setSearchResults([]);
    setSearchStatus("idle");
    setLogoModal(target);
  }

  function addExperience() {
    setExperience((prev) => [
      {
        id: `exp-${Date.now()}`,
        company: "Company",
        role: "Role",
        dateRange: "Start - End",
        description: "Description",
        logo: "/images/default-logo.webp",
      },
      ...prev,
    ]);
  }

  function addEducation() {
    setEducation((prev) => [
      {
        id: `edu-${Date.now()}`,
        school: "School",
        field: "Field of study",
        dateRange: "Start - End",
        description: "Description",
        logo: "/images/default-logo.webp",
      },
      ...prev,
    ]);
  }

  function updateExperience(id: string, patch: Partial<ExperienceEntry>) {
    setExperience((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    );
  }

  function updateEducation(id: string, patch: Partial<EducationEntry>) {
    setEducation((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    );
  }

  function removeExperience(id: string) {
    setExperience((prev) => prev.filter((e) => e.id !== id));
  }

  function removeEducation(id: string) {
    setEducation((prev) => prev.filter((e) => e.id !== id));
  }

  function addComment() {
    setComments((prev) => [
      {
        id: `cmt-${Date.now()}`,
        when: "1mo",
        body: "Comment",
      },
      ...prev,
    ]);
  }

  function updateComment(id: string, patch: Partial<CommentEntry>) {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    );
  }

  function removeComment(id: string) {
    setComments((prev) => prev.filter((c) => c.id !== id));
  }

  function handleLogoModalUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !logoModal) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      if (logoModal.type === "experience") {
        updateExperience(logoModal.id, { logo: reader.result });
      } else {
        updateEducation(logoModal.id, { logo: reader.result });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <main className="w-full max-w-4xl mx-auto py-6 px-4 space-y-2">
      {/* Profile header card */}
      <section className="li-card overflow-hidden">
        <ImageUpload
          src={banner}
          onChange={setBanner}
          ariaLabel="Upload banner image"
          className="block w-full aspect-[4/1]"
        >
          {(src) =>
            src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-sky-300 via-sky-400 to-blue-500" />
            )
          }
        </ImageUpload>

        <div className="px-6 pb-5 relative">
          <ImageUpload
            src={avatar}
            onChange={setAvatar}
            ariaLabel="Upload profile picture"
            className="absolute -top-[96px] left-1 h-[164px] w-[164px] rounded-full border-4 border-white bg-white"
          >
            {(src) =>
              src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt=""
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="h-full w-full rounded-full bg-zinc-200 flex items-center justify-center text-4xl text-zinc-500">
                  ?
                </div>
              )
            }
          </ImageUpload>

          <div className="flex justify-between gap-6 mt-[-67]">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-semibold leading-tight">
                <EditableText
                  ariaLabel="First name"
                  value={firstName}
                  onChange={setFirstName}
                />{" "}
                <EditableText
                  ariaLabel="Last name"
                  value={lastName}
                  onChange={setLastName}
                />
              </h1>
              <p className="mt-1 text-base text-[var(--li-text-primary)]">
                <EditableText
                  ariaLabel="Headline"
                  value={headline}
                  onChange={setHeadline}
                />
              </p>
              <p className="mt-1 text-sm text-[var(--li-text-secondary)]">
                <EditableText
                  ariaLabel="Location"
                  value={location}
                  onChange={setLocation}
                />
                <span className="mx-1">·</span>
                <a
                  href="#"
                  className="text-[var(--li-blue)] font-semibold hover:underline"
                  onClick={(e) => e.preventDefault()}
                >
                  Contact info
                </a>
              </p>
              <p className="flex mt-1">
                <div className="text-sm text-[var(--li-text-secondary)] w-48">
                  {showFollowers && (
                    <>
                      <EditableText
                        ariaLabel="Follower count"
                        value={followers}
                        onChange={setFollowers}
                        className="text-[var(--li-text-secondary)]"
                      />{" "}
                      followers
                    </>
                  )}
                  {showFollowers && showConnections && <span className="mx-1">·</span>}
                  {showConnections && (
                    <>
                      <EditableText
                        ariaLabel="Connection count"
                        value={connections}
                        onChange={setConnections}
                        className="font-semibold text-[var(--li-text-secondary)]"
                      />{" "}
                      connections
                    </>
                  )}
                </div>
                <div className="flex gap-3 text-xs text-[var(--li-text-secondary)] flex-1">
                  <button
                    type="button"
                    onClick={() => { if (showConnections) setShowFollowers((v) => !v); }}
                    className="hover:underline font-semibold text-[var(--li-text-secondary)]"
                  >
                    Toggle followers
                  </button>
                  <button
                    type="button"
                    onClick={() => { if (showFollowers) setShowConnections((v) => !v); }}
                    className="hover:underline font-semibold text-[var(--li-text-secondary)]"
                  >
                    Toggle connections
                  </button>
                </div>
              </p>

              <div className="mt-4 flex gap-2 flex-wrap">
                <button className="rounded-full bg-[var(--li-blue)] hover:bg-[var(--li-blue-hover)] text-white font-semibold text-sm px-4 py-1.5">
                  + Connect
                </button>
                <button className="rounded-full border border-[var(--li-blue)] text-[var(--li-blue)] font-semibold text-sm px-4 py-1.5 hover:bg-[var(--li-blue)]/10">
                  Message
                </button>
                <button className="rounded-full border border-[var(--li-text-primary)] text-[var(--li-text-primary)] font-semibold text-sm px-4 py-1.5 hover:bg-black/5">
                  More
                </button>
              </div>
            </div>

            <div className="hidden sm:flex w-[260px] shrink-0 flex-col gap-2 items-start text-sm">
              {currentCompany && (
                <div className="flex items-center gap-2 w-full">
                  <button
                    type="button"
                    aria-label={`View ${currentCompany.company} logo`}
                    onClick={() => openLogoModal({ type: "experience", id: currentCompany.id })}
                    className="group relative h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded-sm"
                  >
                    <EntryLogo
                      src={currentCompany.logo}
                      fallbackBg="#1f2937"
                      letter={currentCompany.company.charAt(0)}
                      size="sm"
                    />
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs opacity-0 transition-opacity group-hover:opacity-100">
                      Edit
                    </span>
                  </button>
                  <span className="font-semibold min-w-0 break-words">
                    {currentCompany.company}
                  </span>
                </div>
              )}
              {currentSchool && (
                <div className="flex items-center gap-2 w-full">
                  <button
                    type="button"
                    aria-label={`View ${currentSchool.school} logo`}
                    onClick={() => openLogoModal({ type: "education", id: currentSchool.id })}
                    className="group relative h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded-sm"
                  >
                    <EntryLogo
                      src={currentSchool.logo}
                      fallbackBg="#facc15"
                      letter={currentSchool.school.charAt(0)}
                      size="sm"
                    />
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs opacity-0 transition-opacity group-hover:opacity-100">
                      Edit
                    </span>
                  </button>
                  <span className="font-semibold min-w-0 break-words">{currentSchool.school}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="li-card p-6">
        <h2 className="text-xl font-semibold mb-2">About</h2>
        <p className="text-sm text-[var(--li-text-secondary)]">
          <EditableText ariaLabel="About" value={about} onChange={setAbout} />
        </p>
      </section>

      {/* Activity */}
      <section className="li-card p-6 flex flex-col">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Activity</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Add comment"
              onClick={addComment}
              className="flex h-8 w-8 items-center justify-center rounded-full text-2xl text-[var(--li-text-primary)] hover:bg-black/5"
            >
              +
            </button>
            <button
              type="button"
              className="rounded-full border border-[var(--li-blue)] text-[var(--li-blue)] font-semibold text-sm px-4 py-1 hover:bg-[var(--li-blue)]/10"
            >
              + Follow
            </button>
          </div>
        </div>
        <p className="mt-1 text-sm text-[var(--li-text-secondary)]">
          <EditableText
            ariaLabel="Follower count"
            value={followers}
            onChange={setFollowers}
          />{" "}
          followers
        </p>
        {comments.length === 0 ? (
          <>
            <h2 className="text-xl font-semibold">{firstName} has not made recent posts</h2>
            <p className="mb-4 text-sm">
              Recent posts {firstName} shares will be displayed here.
            </p>
          </>
        ) : (
          <div className="mt-5 space-y-5">
            {comments.map((cmt, i) => (
              <div key={cmt.id}>
                {i > 0 && (
                  <hr style={{ border: "none", borderTop: "1px solid #e9e5df" }} className="mb-6" />
                )}
                <div className="flex gap-3 mb-6">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs">
                      <span className="font-semibold text-[var(--li-semibold)]">{firstName} {lastName}</span>
                      <span className="text-[var(--li-text-secondary)]">{" commented on a post • "}</span>
                      <EditableText
                        ariaLabel="When"
                        className="text-[var(--li-text-secondary)]"
                        value={cmt.when}
                        onChange={(v) => updateComment(cmt.id, { when: v })}
                      />
                    </p>
                    <p className="text-sm mt-2">
                      <EditableText
                        ariaLabel="Comment body"
                        value={cmt.body}
                        onChange={(v) => updateComment(cmt.id, { body: v })}
                        multiline
                      />
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Remove comment"
                    onClick={() => removeComment(cmt.id)}
                    className="flex h-8 w-8 shrink-0 self-center items-center justify-center rounded-full text-2xl text-[var(--li-text-primary)] hover:bg-black/5"
                  >
                    −
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <button className="-mx-6 -mb-6 border-t border-[var(--li-border)] py-3 text-center text-sm font-semibold text-[var(--li-text-secondary)] hover:bg-black/5 rounded-b-lg">
          Show all →
        </button>
      </section>

      {/* Experience */}
      <SectionCard title="Experience" onAdd={addExperience}>
        {experience.map((exp, i) => (
          <div key={exp.id}>
            {i > 0 && (
              <hr style={{ border: "none", borderTop: "1px solid #e9e5df" }} className="mb-5" />
            )}
          <div className="flex gap-3">
            <button
              type="button"
              aria-label={`View ${exp.company} logo`}
              onClick={() => openLogoModal({ type: "experience", id: exp.id })}
              className="group relative h-12 w-12 shrink-0 cursor-pointer overflow-hidden rounded-md"
            >
              <EntryLogo
                src={exp.logo}
                fallbackBg="#1f2937"
                letter={exp.company.charAt(0)}
              />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs opacity-0 transition-opacity group-hover:opacity-100">
                Edit
              </span>
            </button>
            <div className="flex-1 min-w-0">
              <p className="font-semibold">
                <EditableText
                  ariaLabel="Role"
                  value={exp.role}
                  onChange={(v) => updateExperience(exp.id, { role: v })}
                />
              </p>
              <p className="text-sm">
                <EditableText
                  ariaLabel="Company"
                  value={exp.company}
                  onChange={(v) => updateExperience(exp.id, { company: v })}
                />
              </p>
              <p className="text-sm text-[var(--li-text-secondary)]">
                <EditableText
                  ariaLabel="Date range"
                  value={exp.dateRange}
                  onChange={(v) => updateExperience(exp.id, { dateRange: v })}
                />
              </p>
              <p className="text-sm mt-2">
                <EditableText
                  ariaLabel="Description"
                  value={exp.description}
                  onChange={(v) => updateExperience(exp.id, { description: v })}
                  multiline
                />
              </p>
            </div>
            <button
              type="button"
              aria-label="Remove experience"
              onClick={() => removeExperience(exp.id)}
              className="flex h-8 w-8 shrink-0 self-center items-center justify-center rounded-full text-2xl text-[var(--li-text-primary)] hover:bg-black/5"
            >
              −
            </button>
          </div>
          </div>
        ))}
      </SectionCard>

      {/* Education */}
      <SectionCard title="Education" onAdd={addEducation}>
        {education.map((edu, i) => (
          <div key={edu.id}>
            {i > 0 && (
              <hr style={{ border: "none", borderTop: "1px solid #e9e5df" }} className="mb-5" />
            )}
          <div className="flex gap-3">
            <button
              type="button"
              aria-label={`View ${edu.school} logo`}
              onClick={() => openLogoModal({ type: "education", id: edu.id })}
              className="group relative h-12 w-12 shrink-0 cursor-pointer overflow-hidden rounded-md"
            >
              <EntryLogo
                src={edu.logo}
                fallbackBg="#facc15"
                letter={edu.school.charAt(0)}
              />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs opacity-0 transition-opacity group-hover:opacity-100">
                Edit
              </span>
            </button>
            <div className="flex-1 min-w-0">
              <p className="font-semibold">
                <EditableText
                  ariaLabel="School"
                  value={edu.school}
                  onChange={(v) => updateEducation(edu.id, { school: v })}
                />
              </p>
              <p className="text-sm">
                <EditableText
                  ariaLabel="Field of study"
                  value={edu.field}
                  onChange={(v) => updateEducation(edu.id, { field: v })}
                />
              </p>
              <p className="text-sm text-[var(--li-text-secondary)]">
                <EditableText
                  ariaLabel="Date range"
                  value={edu.dateRange}
                  onChange={(v) => updateEducation(edu.id, { dateRange: v })}
                />
              </p>
              <p className="text-sm mt-2">
                <EditableText
                  ariaLabel="Description"
                  value={edu.description}
                  onChange={(v) => updateEducation(edu.id, { description: v })}
                  multiline
                />
              </p>
            </div>
            <button
              type="button"
              aria-label="Remove education"
              onClick={() => removeEducation(edu.id)}
              className="flex h-8 w-8 shrink-0 self-center items-center justify-center rounded-full text-2xl text-[var(--li-text-primary)] hover:bg-black/5"
            >
              −
            </button>
          </div>
          </div>
        ))}
      </SectionCard>

      {logoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={(e) => { if (e.target === e.currentTarget) setLogoModal(null); }}
        >
          <div className="li-card flex h-[460px] w-[720px] overflow-hidden">
            {/* Left pane */}
            <div className="relative flex flex-1 flex-col">
              <div className="px-6 pt-3 pb-3">
                <h2 className="text-xl font-semibold">
                  {logoModal?.type === "experience" ? "Company logo" : "Education logo"}
                </h2>
              </div>
              <hr className="border-[var(--li-border)]" />
              <div className="flex flex-1 items-center justify-center">
              {logoModalSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoModalSrc}
                  alt=""
                  className="max-h-75 max-w-75 object-contain"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-sm bg-zinc-200 text-4xl text-zinc-500">
                  ?
                </div>
              )}
              </div>
              <div className="px-6 pb-5">
                <button
                  type="button"
                  className="rounded-full bg-[var(--li-blue)] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[var(--li-blue-hover)]"
                  onClick={() => logoModalFileInputRef.current?.click()}
                >
                  Upload photo
                </button>
                <input
                  ref={logoModalFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoModalUpload}
                  className="hidden"
                />
              </div>
            </div>
            {/* Right pane */}
            <div className="w-82 border-l border-[var(--li-border)]" />
          </div>
        </div>
      )}
    </main>
  );
}
