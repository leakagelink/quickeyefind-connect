// Shared client/server types for the live tracking feature.

export type Role = "admin" | "employee" | "user";

export type TrackedPerson = {
  id: string;
  name: string;
  phone: string;
  area: string;
  team: string;
  role: Role;
  photoUrl: string | null;
  initials: string;
  online: boolean;
  isSharing: boolean;
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  battery: number | null;
  updatedAt: string | null;
};

export type MovementPoint = {
  id: string;
  lat: number;
  lng: number;
  label: string | null;
  recordedAt: string;
};

export type AlertItem = {
  id: string;
  userId: string;
  name: string;
  initials: string;
  photoUrl: string | null;
  online: boolean;
  message: string;
  createdAt: string;
};

export type MyProfile = {
  id: string;
  name: string;
  phone: string;
  area: string;
  team: string;
  employeeCode: string | null;
  photoUrl: string | null;
  initials: string;
  role: Role;
};

export type AttendanceSummary = {
  id: string;
  checkIn: string | null;
  checkOut: string | null;
  hours: number;
  distanceKm: number;
  visits: number;
  status: string;
};

export type AttendanceRow = {
  id: string;
  userId: string;
  name: string;
  initials: string;
  photoUrl: string | null;
  team: string;
  checkIn: string;
  checkOut: string;
  hours: number;
  distanceKm: number;
  status: string;
};

export type TeamPerf = {
  team: string;
  members: number;
  online: number;
  visits: number;
  distanceKm: number;
  onTime: number;
};

export type Overview = {
  people: TrackedPerson[];
  me: MyProfile | null;
  alerts: AlertItem[];
};

export type EmployeeDetail = {
  person: TrackedPerson;
  history: MovementPoint[];
};

export type MyPanel = {
  profile: MyProfile;
  today: AttendanceSummary | null;
  month: { present: number; late: number; absent: number };
  history: MovementPoint[];
  sharing: boolean;
};

export type Reports = {
  attendance: AttendanceRow[];
  teams: TeamPerf[];
  weekly: { day: string; present: number }[];
  totalHours: number;
  totalKm: number;
};

export type AdminOverview = {
  stats: { total: number; online: number; offline: number; present: number };
  teams: { team: string; members: number; online: number }[];
  attendance: AttendanceRow[];
};

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

export function isOnline(updatedAt: string | null, sharing: boolean): boolean {
  if (!updatedAt || !sharing) return false;
  const t = new Date(updatedAt).getTime();
  if (Number.isNaN(t)) return false;
  return Date.now() - t < 5 * 60 * 1000;
}

export function timeAgo(updatedAt: string | null): string {
  if (!updatedAt) return "—";
  const t = new Date(updatedAt).getTime();
  if (Number.isNaN(t)) return "—";
  const s = Math.max(0, Math.round((Date.now() - t) / 1000));
  if (s < 60) return "Just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} hr ago`;
  return `${Math.floor(s / 86400)} d ago`;
}

export function fmtClock(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
