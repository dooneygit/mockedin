"use client";

import { useRef, useState, type ChangeEvent, type ReactNode } from "react";

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
  }
];

const defaultEducation: EducationEntry[] = [
  {
    id: "edu-1",
    school: "School",
    field: "Field of Study",
    dateRange: "Start to End",
    description: "Description",
  }
];

const defaultComments: CommentEntry[] = [
  {
    id: "cmt-1",
    when: "1mo",
    body: "Comment",
  },
];

export default function Profile() {
  const [banner, setBanner] = useState<string | undefined>();
  const [avatar, setAvatar] = useState<string | undefined>();

  const [firstName, setFirstName] = useState("First");
  const [lastName, setLastName] = useState("Last");
  const [headline, setHeadline] = useState(
    "Headline",
  );
  const [location, setLocation] = useState("Country");
  const [connections, setConnections] = useState("0");
  const [followers, setFollowers] = useState("0");

  const [about, setAbout] = useState("About");

  const [experience, setExperience] =
    useState<ExperienceEntry[]>(defaultExperience);
  const [education, setEducation] =
    useState<EducationEntry[]>(defaultEducation);
  const [comments, setComments] =
    useState<CommentEntry[]>(defaultComments);

  const currentCompany = experience?.[0] ?? null;
  const currentSchool = education?.[0] ?? null;

  function addExperience() {
    setExperience((prev) => [
      {
        id: `exp-${Date.now()}`,
        company: "Company",
        role: "Role",
        dateRange: "Start - End",
        description: "Description",
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
              <p className="mt-1 text-sm font-semibold text-[var(--li-blue)]">
                <EditableText
                  ariaLabel="Connection count"
                  value={connections}
                  onChange={setConnections}
                  className="!text-[var(--li-blue)]"
                />{" "}
                connections
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
                  <EntryLogo
                    src={currentCompany.logo}
                    fallbackBg="#1f2937"
                    letter={currentCompany.company.charAt(0)}
                    size="sm"
                  />
                  <span className="font-semibold min-w-0 break-words">
                    {currentCompany.company}
                  </span>
                </div>
              )}
              {currentSchool && (
                <div className="flex items-center gap-2 w-full">
                  <EntryLogo
                    src={currentSchool.logo}
                    fallbackBg="#facc15"
                    letter={currentSchool.school.charAt(0)}
                    size="sm"
                  />
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
            <p className="mt-4 font-semibold">{firstName} has not made recent posts</p>
            <p className="mt-1 text-sm text-[var(--li-text-secondary)]">
              Recent posts {firstName} shares will be displayed here.
            </p>
          </>
        ) : (
          <div className="mt-4 space-y-5">
            {comments.map((cmt, i) => (
              <div key={cmt.id}>
                {i > 0 && (
                  <hr style={{ border: "none", borderTop: "1px solid #e9e5df" }} className="mb-5" />
                )}
                <div className="flex gap-3">
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
        <button className="mt-4 -mx-6 -mb-6 border-t border-[var(--li-border)] py-3 text-center text-sm font-semibold text-[var(--li-text-secondary)] hover:bg-black/5 rounded-b-lg">
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
            <ImageUpload
              src={exp.logo}
              onChange={(dataUrl) => updateExperience(exp.id, { logo: dataUrl })}
              ariaLabel={`Upload ${exp.company} logo`}
              className="h-12 w-12 shrink-0 rounded-md"
            >
              {(src) => (
                <EntryLogo
                  src={src}
                  fallbackBg="#1f2937"
                  letter={exp.company.charAt(0)}
                />
              )}
            </ImageUpload>
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
            <ImageUpload
              src={edu.logo}
              onChange={(dataUrl) => updateEducation(edu.id, { logo: dataUrl })}
              ariaLabel={`Upload ${edu.school} logo`}
              className="h-12 w-12 shrink-0 rounded-md"
            >
              {(src) => (
                <EntryLogo
                  src={src}
                  fallbackBg="#facc15"
                  letter={edu.school.charAt(0)}
                />
              )}
            </ImageUpload>
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
    </main>
  );
}
