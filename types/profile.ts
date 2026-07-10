export type Entry = {
  id: string;
  title: string;
  subtitle: string;
  dateRange: string;
  description: string;
  logo?: string;
};

export type LogoTarget = { type: "experience" | "education"; id: string };

export type CommentEntry = {
  id: string;
  when: string;
  body: string;
};

export type MockupState = {
  banner?: string;
  avatar?: string;
  firstName: string;
  lastName: string;
  headline: string;
  location: string;
  connections: string;
  followers: string;
  showFollowers: boolean;
  showConnections: boolean;
  about: string;
  experience: Entry[];
  education: Entry[];
  comments: CommentEntry[];
};
