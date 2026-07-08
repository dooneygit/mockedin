"use client";

import { useState } from "react";

import { EditableText } from "@/components/profile/EditableText";
import { EntryList } from "@/components/profile/EntryList";
import { EntryLogo } from "@/components/profile/EntryLogo";
import { ImageUpload } from "@/components/profile/ImageUpload";
import { LogoModal } from "@/components/profile/LogoModal";
import { SectionCard } from "@/components/profile/SectionCard";
import { useEntries } from "@/hooks/useEntries";
import { logoDevImageUrl, type LogoResult } from "@/hooks/useLogoSearch";
import type { Entry, LogoTarget } from "@/types/profile";

type CommentEntry = {
  id: string;
  when: string;
  body: string;
};

const defaultExperience: Entry[] = [
  {
    id: "exp-1",
    subtitle: "Company",
    title: "Role",
    dateRange: "Start to End",
    description: "Description",
    logo: "/images/default-logo.webp",
  }
];

const defaultEducation: Entry[] = [
  {
    id: "edu-1",
    title: "School",
    subtitle: "Field of Study",
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

  const {
    entries: experience,
    add: addExperienceEntry,
    update: updateExperience,
    remove: removeExperience,
  } = useEntries(defaultExperience);
  const {
    entries: education,
    add: addEducationEntry,
    update: updateEducation,
    remove: removeEducation,
  } = useEntries(defaultEducation);
  const [comments, setComments] =
    useState<CommentEntry[]>(defaultComments);

  const [logoModal, setLogoModal] = useState<LogoTarget | null>(null);

  const currentCompany = experience?.[0] ?? null;
  const currentSchool = education?.[0] ?? null;

  const logoModalSrc = logoModal
    ? logoModal.type === "experience"
      ? experience.find((e) => e.id === logoModal.id)?.logo
      : education.find((e) => e.id === logoModal.id)?.logo
    : undefined;

  function addExperience() {
    addExperienceEntry({
      id: `exp-${Date.now()}`,
      subtitle: "Company",
      title: "Role",
      dateRange: "Start - End",
      description: "Description",
      logo: "/images/default-logo.webp",
    });
  }

  function addEducation() {
    addEducationEntry({
      id: `edu-${Date.now()}`,
      title: "School",
      subtitle: "Field of study",
      dateRange: "Start - End",
      description: "Description",
      logo: "/images/default-logo.webp",
    });
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

  function openLogoModal(target: LogoTarget) {
    setLogoModal(target);
  }

  function handleLogoModalUpload(logo: string) {
    if (!logoModal) return;
    if (logoModal.type === "experience") {
      updateExperience(logoModal.id, { logo });
    } else {
      updateEducation(logoModal.id, { logo });
    }
  }

  function applyLogoResult(result: LogoResult) {
    if (!logoModal) return;
    const logo = logoDevImageUrl(result.domain, 200);

    if (logoModal.type === "experience") {
      updateExperience(logoModal.id, { logo, subtitle: result.name});
    } else {
      updateEducation(logoModal.id, {logo, title: result.name});
    }

    setLogoModal(null);
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
              <div className="flex mt-1 items-baseline gap-3">
                <div className="text-sm text-[var(--li-text-secondary)] whitespace-nowrap">
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
                <div className="flex gap-3 text-xs text-[var(--li-text-secondary)] shrink-0 whitespace-nowrap">
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
              </div>

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
                    aria-label={`View ${currentCompany.subtitle} logo`}
                    onClick={() => openLogoModal({ type: "experience", id: currentCompany.id })}
                    className="group relative h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded-sm"
                  >
                    <EntryLogo
                      src={currentCompany.logo}
                      fallbackBg="#1f2937"
                      letter={currentCompany.subtitle.charAt(0)}
                      size="sm"
                    />
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs opacity-0 transition-opacity group-hover:opacity-100">
                      Edit
                    </span>
                  </button>
                  <span className="font-semibold min-w-0 break-words">
                    {currentCompany.subtitle}
                  </span>
                </div>
              )}
              {currentSchool && (
                <div className="flex items-center gap-2 w-full">
                  <button
                    type="button"
                    aria-label={`View ${currentSchool.title} logo`}
                    onClick={() => openLogoModal({ type: "education", id: currentSchool.id })}
                    className="group relative h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded-sm"
                  >
                    <EntryLogo
                      src={currentSchool.logo}
                      fallbackBg="#facc15"
                      letter={currentSchool.title.charAt(0)}
                      size="sm"
                    />
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs opacity-0 transition-opacity group-hover:opacity-100">
                      Edit
                    </span>
                  </button>
                  <span className="font-semibold min-w-0 break-words">{currentSchool.title}</span>
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
        <EntryList
          entries={experience}
          fallbackBg="#1f2937"
          logoNameField="subtitle"
          titleLabel="Role"
          subtitleLabel="Company"
          removeLabel="Remove experience"
          targetType="experience"
          onLogoClick={openLogoModal}
          onUpdate={updateExperience}
          onRemove={removeExperience}
        />
      </SectionCard>

      {/* Education */}
      <SectionCard title="Education" onAdd={addEducation}>
        <EntryList
          entries={education}
          fallbackBg="#facc15"
          logoNameField="title"
          titleLabel="School"
          subtitleLabel="Field of study"
          removeLabel="Remove education"
          targetType="education"
          onLogoClick={openLogoModal}
          onUpdate={updateEducation}
          onRemove={removeEducation}
        />
      </SectionCard>

      {logoModal && (
        <LogoModal
          target={logoModal}
          src={logoModalSrc}
          onClose={() => setLogoModal(null)}
          onUpload={handleLogoModalUpload}
          onApply={applyLogoResult}
        />
      )}
    </main>
  );
}
